/**
 * Google OAuth - Callback Endpoint
 * GET /api/auth/google/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { SSO_CONFIG, APP_URL } from '@/lib/auth/sso-config';
import { findOrCreateSSOUser, verifyState, createSessionToken } from '@/lib/auth/sso-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

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

    // Exchange code for tokens
    const tokenResponse = await fetch(SSO_CONFIG.google.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: SSO_CONFIG.google.clientId,
        client_secret: SSO_CONFIG.google.clientSecret,
        redirect_uri: SSO_CONFIG.google.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange failed:', errorData);
      return NextResponse.redirect(`${APP_URL}/login?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch(SSO_CONFIG.google.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch Google user info');
      return NextResponse.redirect(`${APP_URL}/login?error=user_info_failed`);
    }

    const userInfo = await userInfoResponse.json();

    // Create or find user in database
    const user = await findOrCreateSSOUser({
      provider: 'google',
      providerId: userInfo.id,
      email: userInfo.email,
      firstName: userInfo.given_name,
      lastName: userInfo.family_name,
      name: userInfo.name,
      avatarUrl: userInfo.picture,
      emailVerified: userInfo.verified_email,
    });

    // Create session
    const sessionToken = createSessionToken(user);

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
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=authentication_failed`);
  }
}
