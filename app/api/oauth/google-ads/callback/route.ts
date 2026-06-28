/**
 * Google Ads OAuth - Callback Handler
 * Route: GET /api/oauth/google-ads/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthConfig, calculateExpiry } from '@/lib/oauth/config';
import { connectorDetails } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  console.log('🔵 Google Ads OAuth callback received');
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    console.log('Google Ads callback params:', { 
      hasCode: !!code, 
      hasState: !!state, 
      error,
      url: request.url 
    });

    if (error) {
      console.error('❌ Google Ads OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/integrations?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
      console.error('❌ Missing parameters in Google Ads callback');
      return NextResponse.redirect(
        new URL('/integrations?error=missing_parameters', request.url)
      );
    }

    // Decode state
    let stateData: any;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
    } catch {
      return NextResponse.redirect(
        new URL('/integrations?error=invalid_state', request.url)
      );
    }

    const { user_id } = stateData;

    const config = getOAuthConfig('google_ads');
    if (!config) throw new Error('Google Ads OAuth configuration not found');

    // Exchange code for token
    const tokenResponse = await fetch(config.token_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.client_id,
        client_secret: config.client_secret,
        redirect_uri: config.redirect_uri,
        code
      })
    });

    if (!tokenResponse.ok) {
      console.error('Google Ads token exchange failed');
      return NextResponse.redirect(
        new URL('/integrations?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    console.log('📦 Google Ads token response:', {
      access_token: tokenData.access_token ? '***' + tokenData.access_token.slice(-8) : 'missing',
      refresh_token: tokenData.refresh_token ? '***' + tokenData.refresh_token.slice(-8) : 'MISSING - NO REFRESH TOKEN',
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      token_type: tokenData.token_type
    });

    if (!tokenData.refresh_token) {
      console.warn('⚠️ WARNING: Google did not return a refresh token. User may need to revoke access and re-authenticate.');
    }

    // Get user profile info
    let userInfo: any = {};
    try {
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      if (profileResponse.ok) {
        userInfo = await profileResponse.json();
        console.log('Google Ads user info:', { email: userInfo.email, id: userInfo.id });
      }
    } catch (error) {
      console.error('Failed to fetch Google user info:', error);
    }

    const expiresAt = calculateExpiry(tokenData.expires_in || 3600);

    console.log('Google Ads token data received:', {
      has_access_token: !!tokenData.access_token,
      has_refresh_token: !!tokenData.refresh_token,
      user_id: user_id,
      account_id: userInfo.id
    });

    // Store connector details in database (matching HubSpot pattern)
    await connectorDetails.upsert({
      user_id: parseInt(user_id),
      connector_id: config.connector_id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type || 'Bearer',
      expires_at: expiresAt,
      scope: tokenData.scope,
      account_id: userInfo.id || userInfo.email || 'google_ads_account',
      account_name: userInfo.name || userInfo.email || 'Google Ads Account',
      account_email: userInfo.email,
      metadata: {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
        locale: userInfo.locale,
        verified_email: userInfo.verified_email
      }
    });

    console.log('Google Ads connection saved successfully for user:', user_id);

    // Return HTML that closes popup and notifies parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
        </head>
        <body>
          <script>
            if (window.opener) {
              // Notify parent window
              window.opener.postMessage({ type: 'oauth_success', platform: 'google-ads' }, '*');
              // Close popup
              window.close();
            } else {
              // Fallback: redirect to integrations page
              window.location.href = '/integrations?success=google_ads_connected';
            }
          </script>
          <p>Authorization successful! This window will close automatically...</p>
        </body>
      </html>
    `;
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('Google Ads OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=callback_failed', request.url)
    );
  }
}
