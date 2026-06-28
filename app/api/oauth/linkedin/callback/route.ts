/**
 * LinkedIn OAuth - Callback Handler
 * Route: GET /api/oauth/linkedin/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthConfig, calculateExpiry } from '@/lib/oauth/config';
import { connectorDetails } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/integrations?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
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

    const config = getOAuthConfig('linkedin');
    if (!config) throw new Error('LinkedIn OAuth configuration not found');

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
      console.error('LinkedIn token exchange failed');
      return NextResponse.redirect(
        new URL('/integrations?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    // Get LinkedIn profile info
    let profileInfo: any = {};
    try {
      const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
        headers: { 
          Authorization: `Bearer ${tokenData.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      if (profileResponse.ok) {
        profileInfo = await profileResponse.json();
      }
    } catch (error) {
      console.error('Failed to fetch LinkedIn profile:', error);
    }

    const expiresAt = calculateExpiry(tokenData.expires_in || 5184000); // 60 days default

    // Get email address
    let emailInfo: any = {};
    try {
      const emailResponse = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        headers: { 
          Authorization: `Bearer ${tokenData.access_token}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      if (emailResponse.ok) {
        emailInfo = await emailResponse.json();
      }
    } catch (error) {
      console.error('Failed to fetch LinkedIn email:', error);
    }

    const email = emailInfo?.elements?.[0]?.['handle~']?.emailAddress || null;

    await connectorDetails.upsert({
      user_id: parseInt(user_id),
      connector_id: config.connector_id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type || 'Bearer',
      expires_at: expiresAt,
      scope: tokenData.scope,
      account_id: profileInfo.id || 'linkedin_account',
      account_name: profileInfo.localizedFirstName && profileInfo.localizedLastName 
        ? `${profileInfo.localizedFirstName} ${profileInfo.localizedLastName}`
        : 'LinkedIn Account',
      account_email: email,
      metadata: {
        profile_id: profileInfo.id,
        first_name: profileInfo.localizedFirstName,
        last_name: profileInfo.localizedLastName,
        email: email
      }
    });

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
              window.opener.postMessage({ type: 'oauth_success', platform: 'linkedin' }, '*');
              // Close popup
              window.close();
            } else {
              // Fallback: redirect to integrations page
              window.location.href = '/integrations?success=linkedin_connected';
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
    console.error('LinkedIn OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=callback_failed', request.url)
    );
  }
}
