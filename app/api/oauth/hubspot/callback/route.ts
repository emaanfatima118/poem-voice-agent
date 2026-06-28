/**
 * HubSpot OAuth - Callback Handler
 * Route: GET /api/oauth/hubspot/callback
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthConfig, calculateExpiry } from '@/lib/oauth/config';
import { connectorDetails } from '@/lib/db/queries';
import { getOAuthSuccessHTML } from '@/lib/oauth/popup-success';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle authorization errors
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

    // Decode and validate state
    let stateData: any;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
    } catch {
      return NextResponse.redirect(
        new URL('/integrations?error=invalid_state', request.url)
      );
    }

    const { user_id, connector, timestamp } = stateData;

    // Validate state timestamp (must be within 10 minutes)
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      return NextResponse.redirect(
        new URL('/integrations?error=state_expired', request.url)
      );
    }

    if (connector !== 'hubspot') {
      return NextResponse.redirect(
        new URL('/integrations?error=invalid_connector', request.url)
      );
    }

    const config = getOAuthConfig('hubspot');
    if (!config) {
      throw new Error('HubSpot OAuth configuration not found');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(config.token_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.client_id,
        client_secret: config.client_secret,
        redirect_uri: config.redirect_uri,
        code
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('HubSpot token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/integrations?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();

    // Get HubSpot account info
    let accountInfo: any = {};
    try {
      const accountResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + tokenData.access_token);
      if (accountResponse.ok) {
        accountInfo = await accountResponse.json();
      }
    } catch (error) {
      console.error('Failed to fetch HubSpot account info:', error);
    }

    // Calculate token expiry
    const expiresAt = calculateExpiry(tokenData.expires_in);

    // Store connector details in database
    await connectorDetails.upsert({
      user_id: parseInt(user_id),
      connector_id: config.connector_id,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      token_type: tokenData.token_type || 'Bearer',
      expiry: expiresAt,
      scope: tokenData.scope,
      account_id: accountInfo.hub_id?.toString() || 'hubspot_account',
      account_name: accountInfo.hub_domain || 'HubSpot Account',
      account_email: accountInfo.user || accountInfo.hub_domain,
      metadata: {
        user: accountInfo.user,
        hub_domain: accountInfo.hub_domain,
        scopes: accountInfo.scopes || [],
        app_id: accountInfo.app_id
      }
    });

    // Trigger initial sync in background (don't await to avoid timeout)
    // Sync contacts
    fetch(`${request.nextUrl.origin}/api/sync/hubspot/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: parseInt(user_id), 
        connector_id: config.connector_id 
      })
    }).catch(err => console.error('Background contacts sync failed:', err));
    
    // Sync accounts/companies
    fetch(`${request.nextUrl.origin}/api/sync/hubspot/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: parseInt(user_id), 
        connector_id: config.connector_id 
      })
    }).catch(err => console.error('Background accounts sync failed:', err));

    // Return HTML that closes popup and notifies parent window
    return new NextResponse(getOAuthSuccessHTML('hubspot'), {
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error('HubSpot OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=callback_failed', request.url)
    );
  }
}
