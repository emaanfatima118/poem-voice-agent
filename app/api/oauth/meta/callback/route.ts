/**
 * Meta (Facebook) OAuth - Callback Handler
 * Route: GET /api/oauth/meta/callback
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
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('❌ Meta OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/integrations?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
      console.error('❌ Missing code or state parameter');
      return NextResponse.redirect(
        new URL('/integrations?error=missing_parameters', request.url)
      );
    }

    // Decode state
    let stateData: any;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
    } catch {
      console.error('❌ Invalid state parameter');
      return NextResponse.redirect(
        new URL('/integrations?error=invalid_state', request.url)
      );
    }

    const { user_id } = stateData;

    console.log('📋 State decoded:', { user_id, connector: stateData.connector });

    const config = getOAuthConfig('meta');
    if (!config) throw new Error('Meta OAuth configuration not found');

    console.log('🔄 Exchanging code for Meta access token...', { connector_id: config.connector_id });

    // Exchange code for token (Meta uses GET request)
    const tokenUrl = `${config.token_url}?${new URLSearchParams({
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: config.redirect_uri,
      code
    })}`;

    const tokenResponse = await fetch(tokenUrl, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Meta token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/integrations?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    console.log('✅ Meta token received');

    // Get user profile info
    let profileInfo: any = {};
    try {
      const profileResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${tokenData.access_token}`
      );
      if (profileResponse.ok) {
        profileInfo = await profileResponse.json();
        console.log('✅ Meta profile fetched:', profileInfo.name);
      }
    } catch (error) {
      console.error('❌ Failed to fetch Meta profile:', error);
    }

    // Get long-lived token (60 days)
    let longLivedToken = tokenData.access_token;
    let expiresIn = tokenData.expires_in || 5184000; // 60 days default

    try {
      const longLivedResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.client_id}&client_secret=${config.client_secret}&fb_exchange_token=${tokenData.access_token}`
      );
      if (longLivedResponse.ok) {
        const longLivedData = await longLivedResponse.json();
        longLivedToken = longLivedData.access_token;
        expiresIn = longLivedData.expires_in || 5184000;
        console.log('✅ Long-lived Meta token obtained');
      }
    } catch (error) {
      console.error('⚠️ Failed to get long-lived token, using short-lived:', error);
    }

    const expiresAt = calculateExpiry(expiresIn);

    console.log('📝 Attempting to save connector details:', {
      user_id: parseInt(user_id),
      connector_id: config.connector_id,
      account_id: profileInfo.id || 'meta_account',
      account_name: profileInfo.name || 'Meta Account',
      has_access_token: !!longLivedToken
    });

    try {
      await connectorDetails.upsert({
        user_id: parseInt(user_id),
        connector_id: config.connector_id,
        access_token: longLivedToken,
        refresh_token: undefined, // Meta doesn't use refresh tokens
        token_type: tokenData.token_type || 'Bearer',
        expires_at: expiresAt,
        scope: tokenData.scope || config.scopes.join(','),
        account_id: profileInfo.id || 'meta_account',
        account_name: profileInfo.name || 'Meta Account',
        account_email: profileInfo.email || null,
        metadata: {
          user_id: profileInfo.id,
          name: profileInfo.name,
          email: profileInfo.email,
          token_type: 'long_lived'
        }
      });

      console.log('✅ Meta connector details saved successfully');
    } catch (dbError: any) {
      console.error('❌ Database save error:', {
        message: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
        constraint: dbError.constraint
      });
      throw dbError;
    }

    // Return HTML that closes popup and notifies parent window
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 1rem;
              backdrop-filter: blur(10px);
            }
            .success-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Authorization Successful!</h1>
            <p>Meta (Facebook) has been connected to your Stackwise account.</p>
            <p id="status">Closing window...</p>
          </div>
          <script>
            console.log('Meta OAuth callback - attempting to notify parent window');
            
            const closeWindow = () => {
              console.log('Attempting to close window...');
              try {
                window.close();
                // If window.close() didn't work (some browsers prevent it), redirect
                setTimeout(() => {
                  if (!window.closed) {
                    console.log('Could not close window, redirecting...');
                    document.getElementById('status').textContent = 'Redirecting...';
                    window.location.href = '/integrations?success=meta_connected';
                  }
                }, 1000);
              } catch (e) {
                console.error('Error closing window:', e);
                window.location.href = '/integrations?success=meta_connected';
              }
            };
            
            if (window.opener && !window.opener.closed) {
              console.log('Parent window detected, sending message...');
              try {
                // Send message to parent
                window.opener.postMessage({ 
                  type: 'oauth_success', 
                  platform: 'meta',
                  timestamp: Date.now()
                }, window.location.origin);
                console.log('Message sent to parent window');
                
                // Wait a bit for message to be received, then close
                setTimeout(closeWindow, 500);
              } catch (e) {
                console.error('Error sending message to parent:', e);
                closeWindow();
              }
            } else {
              console.log('No parent window detected (window.opener is', window.opener, '), redirecting...');
              // If opened in same tab (no popup), redirect directly
              setTimeout(() => {
                window.location.href = '/integrations?success=meta_connected';
              }, 2000);
            }
          </script>
        </body>
      </html>
    `;
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error: any) {
    console.error('❌ Meta OAuth callback error:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      detail: error.detail
    });
    
    // Return error HTML for popup
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Failed</title>
        </head>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'oauth_error', 
                platform: 'meta', 
                error: '${error.message || 'callback_failed'}' 
              }, '*');
              window.close();
            } else {
              window.location.href = '/integrations?error=callback_failed';
            }
          </script>
          <p>Authorization failed. This window will close automatically...</p>
          <p>Error: ${error.message || 'Unknown error'}</p>
        </body>
      </html>
    `;
    
    return new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
