/**
 * Apple OAuth - Callback Endpoint
 * POST /api/auth/apple/callback
 * Note: Apple uses POST for callback, not GET
 */

import { NextRequest, NextResponse } from 'next/server';
import { SSO_CONFIG, APP_URL } from '@/lib/auth/sso-config';
import { findOrCreateSSOUser, verifyState, createSessionToken } from '@/lib/auth/sso-helpers';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const code = formData.get('code') as string;
    const state = formData.get('state') as string;
    const error = formData.get('error') as string;
    const user = formData.get('user') as string; // Apple sends user data only on first login

    // Handle OAuth error
    if (error) {
      return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent(error)}`);
    }

    // Verify code and state
    if (!code || !state) {
      return NextResponse.redirect(`${APP_URL}/login?error=missing_parameters`);
    }

    // Verify CSRF state
    const savedState = request.cookies.get('oauth_state')?.value;
    if (!savedState || !verifyState(state, savedState)) {
      return NextResponse.redirect(`${APP_URL}/login?error=invalid_state`);
    }

    // Generate client secret (Apple requires JWT)
    const clientSecret = generateAppleClientSecret();

    // Exchange code for tokens
    const tokenResponse = await fetch(SSO_CONFIG.apple.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: SSO_CONFIG.apple.clientId,
        client_secret: clientSecret,
        redirect_uri: SSO_CONFIG.apple.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Apple token exchange failed:', errorData);
      return NextResponse.redirect(`${APP_URL}/login?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();

    // Decode id_token to get user info
    const idTokenPayload = jwt.decode(tokens.id_token) as any;

    if (!idTokenPayload) {
      console.error('Failed to decode Apple ID token');
      return NextResponse.redirect(`${APP_URL}/login?error=invalid_token`);
    }

    // Parse user data if provided (first login only)
    let firstName, lastName;
    if (user) {
      try {
        const userData = JSON.parse(user);
        firstName = userData.name?.firstName;
        lastName = userData.name?.lastName;
      } catch (e) {
        console.error('Failed to parse Apple user data:', e);
      }
    }

    // Create or find user in database
    const dbUser = await findOrCreateSSOUser({
      provider: 'apple',
      providerId: idTokenPayload.sub,
      email: idTokenPayload.email,
      firstName,
      lastName,
      name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
      avatarUrl: undefined, // Apple doesn't provide profile pictures
      emailVerified: idTokenPayload.email_verified === 'true',
    });

    // Create session
    const sessionToken = createSessionToken(dbUser);

    // Redirect to dashboard with session
    const response = NextResponse.redirect(`${APP_URL}/stackwise-dashboard`);
    response.cookies.set('stackwise_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    // Clear OAuth state
    response.cookies.delete('oauth_state');

    return response;
  } catch (error) {
    console.error('Apple OAuth callback error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=authentication_failed`);
  }
}

/**
 * Generate Apple Client Secret JWT
 * Apple requires a JWT signed with your private key
 */
function generateAppleClientSecret(): string {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    iss: SSO_CONFIG.apple.teamId,
    iat: now,
    exp: now + 15777000, // 6 months (max allowed)
    aud: 'https://appleid.apple.com',
    sub: SSO_CONFIG.apple.clientId,
  };

  const privateKey = SSO_CONFIG.apple.privateKey.replace(/\\n/g, '\n');

  return jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    keyid: SSO_CONFIG.apple.keyId,
  });
}
