/**
 * Salesforce OAuth - Callback Handler
 * Route: GET /api/oauth/salesforce/callback
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

    // Handle OAuth errors from Salesforce
    if (error) {
      console.error('Salesforce OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(`/integrations?error=${error}`, request.url)
      );
    }

    if (!code || !state) {
      console.error('Missing parameters in Salesforce callback:', { code: !!code, state: !!state });
      return NextResponse.redirect(new URL('/integrations?error=missing_parameters', request.url));
    }

    let stateData: any;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
    } catch (err) {
      console.error('Failed to parse state:', err);
      return NextResponse.redirect(new URL('/integrations?error=invalid_state', request.url));
    }

    const { user_id, code_verifier, client_id: customClientId, client_secret: customClientSecret } = stateData;

    console.log('🔍 Salesforce OAuth callback - extracted state:', {
      user_id,
      has_code_verifier: !!code_verifier,
      has_custom_client_id: !!customClientId,
      has_custom_client_secret: !!customClientSecret,
      custom_client_id_preview: customClientId ? `${customClientId.substring(0, 15)}...` : 'none'
    });

    if (!code_verifier) {
      console.error('Missing code_verifier in state');
      return NextResponse.redirect(new URL('/integrations?error=missing_code_verifier', request.url));
    }

    const config = getOAuthConfig('salesforce');
    
    // Use custom credentials from state if provided, otherwise fall back to config
    const clientId = customClientId || config?.client_id;
    const clientSecret = customClientSecret || config?.client_secret;
    
    console.log('🔑 Using credentials:', {
      using_custom: !!customClientId,
      has_client_id: !!clientId,
      has_client_secret: !!clientSecret
    });
    const redirectUri = config?.redirect_uri || process.env.NEXT_PUBLIC_SALESFORCE_REDIRECT_URI || '';
    const tokenUrl = config?.token_url || 'https://login.salesforce.com/services/oauth2/token';

    if (!clientId || !clientSecret) {
      console.error('Missing Salesforce credentials');
      return NextResponse.redirect(new URL('/integrations?error=missing_credentials', request.url));
    }

    // Exchange code for token with PKCE code_verifier
    const tokenParams: any = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
      code_verifier // PKCE verification
    };

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(tokenParams)
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Salesforce token exchange failed:', errorText);
      return NextResponse.redirect(new URL('/integrations?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    
    console.log('Salesforce token data received:', {
      has_access_token: !!tokenData.access_token,
      has_refresh_token: !!tokenData.refresh_token,
      has_instance_url: !!tokenData.instance_url,
      instance_url: tokenData.instance_url
    });

    // Validate required fields
    if (!tokenData.instance_url) {
      console.error('Missing instance_url in Salesforce token response');
      return NextResponse.redirect(new URL('/integrations?error=missing_instance_url', request.url));
    }

    // Get Salesforce user info
    let userInfo: any = {};
    try {
      const userResponse = await fetch(`${tokenData.instance_url}/services/oauth2/userinfo`, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      if (userResponse.ok) {
        userInfo = await userResponse.json();
        console.log('Salesforce user info:', { email: userInfo.email, org_id: userInfo.organization_id });
      }
    } catch (error) {
      console.error('Failed to fetch Salesforce user info:', error);
    }

    const expiry = calculateExpiry(tokenData.expires_in || 7200); // Default 2 hours

    const metadataToSave = {
      user_id: userInfo.user_id,
      username: userInfo.preferred_username,
      email: userInfo.email,
      issued_at: tokenData.issued_at,
      signature: tokenData.signature,
      custom_credentials: !!customClientId, // Track if custom credentials were used
      custom_client_id: customClientId || undefined, // Store custom client_id
      custom_client_secret: customClientSecret || undefined // Store custom client_secret
    };

    console.log('💾 Saving Salesforce connection with metadata:', {
      connector_id: config?.connector_id || 12,
      has_instance_url: !!tokenData.instance_url,
      has_refresh_token: !!tokenData.refresh_token,
      custom_credentials: metadataToSave.custom_credentials,
      has_custom_client_id: !!metadataToSave.custom_client_id,
      has_custom_client_secret: !!metadataToSave.custom_client_secret
    });

    // Store connection with instance_url from Salesforce response (automatically obtained)
    await connectorDetails.upsert({
      user_id: parseInt(user_id),
      connector_id: config?.connector_id || 12, // Salesforce connector_id is 12
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type || 'Bearer',
      expiry: expiry,
      scope: tokenData.scope,
      instance_url: tokenData.instance_url,
      account_id: userInfo.organization_id || 'salesforce_account',
      account_name: userInfo.organization_name || 'Salesforce Account',
      account_email: userInfo.email || userInfo.preferred_username,
      metadata: metadataToSave
    });

    // Return HTML that closes popup and notifies parent window
    const { getOAuthSuccessHTML } = await import('@/lib/oauth/popup-success');
    const html = getOAuthSuccessHTML('salesforce');
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('Salesforce OAuth callback error:', error);
    return NextResponse.redirect(new URL('/integrations?error=callback_failed', request.url));
  }
}
