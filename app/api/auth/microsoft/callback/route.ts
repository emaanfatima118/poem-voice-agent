/**
 * Microsoft OAuth - Callback Endpoint
 * GET /api/auth/microsoft/callback
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
    const tokenUrl = SSO_CONFIG.microsoft.tokenUrl.replace('{tenant}', SSO_CONFIG.microsoft.tenantId);
    
    // Validate required config
    if (!SSO_CONFIG.microsoft.clientId || !SSO_CONFIG.microsoft.clientSecret) {
      console.error('Microsoft SSO config missing:', {
        hasClientId: !!SSO_CONFIG.microsoft.clientId,
        hasClientSecret: !!SSO_CONFIG.microsoft.clientSecret
      });
      return NextResponse.redirect(`${APP_URL}/login?error=microsoft_config_missing`);
    }

    const tokenBody = new URLSearchParams({
      code,
      client_id: SSO_CONFIG.microsoft.clientId,
      client_secret: SSO_CONFIG.microsoft.clientSecret,
      redirect_uri: SSO_CONFIG.microsoft.redirectUri,
      grant_type: 'authorization_code',
    });

    console.log('Microsoft token exchange URL:', tokenUrl);
    console.log('Microsoft redirect_uri:', SSO_CONFIG.microsoft.redirectUri);
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenBody.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Microsoft token exchange failed:', errorData);
      return NextResponse.redirect(`${APP_URL}/login?error=token_exchange_failed`);
    }

    const tokens = await tokenResponse.json();

    // Get user info from Microsoft Graph
    const userInfoResponse = await fetch(SSO_CONFIG.microsoft.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      console.error('Failed to fetch Microsoft user info');
      return NextResponse.redirect(`${APP_URL}/login?error=user_info_failed`);
    }

    const userInfo = await userInfoResponse.json();

    // Try to get profile photo from Microsoft Graph
    let avatarUrl: string | undefined;
    try {
      const photoResponse = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      
      if (photoResponse.ok) {
        // Convert blob to data URL
        const photoBlob = await photoResponse.blob();
        const photoBuffer = await photoBlob.arrayBuffer();
        const photoBase64 = Buffer.from(photoBuffer).toString('base64');
        avatarUrl = `data:${photoBlob.type};base64,${photoBase64}`;
      }
    } catch (photoError) {
      console.log('Could not fetch Microsoft profile photo:', photoError);
      // Continue without photo
    }

    // Create or find user in database
    const user = await findOrCreateSSOUser({
      provider: 'microsoft',
      providerId: userInfo.id,
      email: userInfo.mail || userInfo.userPrincipalName,
      firstName: userInfo.givenName,
      lastName: userInfo.surname,
      name: userInfo.displayName,
      avatarUrl: avatarUrl,
      emailVerified: true, // Microsoft accounts are verified
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
    console.error('Microsoft OAuth callback error:', error);
    return NextResponse.redirect(`${APP_URL}/login?error=authentication_failed`);
  }
}
