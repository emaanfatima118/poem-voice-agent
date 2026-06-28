/**
 * OAuth Token Refresh Service
 * Automatically refreshes expired access tokens for all connected platforms
 */

import { userConnectors } from '../db/queries';
import { getOAuthConfigById } from './config';

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
}

/**
 * Refresh HubSpot access token
 */
async function refreshHubSpotToken(refreshToken: string, clientId: string, clientSecret: string): Promise<TokenResponse> {
  const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error(`HubSpot token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refresh Salesforce access token
 * @param instanceUrl - The Salesforce instance URL (e.g., https://na123.salesforce.com)
 */
async function refreshSalesforceToken(refreshToken: string, clientId: string, clientSecret: string, instanceUrl?: string): Promise<TokenResponse> {
  // Use instance-specific URL if available, otherwise fall back to login.salesforce.com
  const tokenUrl = instanceUrl 
    ? `${instanceUrl}/services/oauth2/token`
    : 'https://login.salesforce.com/services/oauth2/token';
    
  console.log('🔄 Refreshing Salesforce token:', {
    tokenUrl,
    clientId: clientId ? `${clientId.substring(0, 10)}...` : 'missing',
    hasRefreshToken: !!refreshToken
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Salesforce refresh error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      tokenUrl,
      clientId: clientId ? `${clientId.substring(0, 10)}...` : 'missing',
      hasRefreshToken: !!refreshToken
    });
    throw new Error(`Salesforce token refresh failed: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

/**
 * Refresh Google Ads access token
 */
async function refreshGoogleAdsToken(refreshToken: string, clientId: string, clientSecret: string): Promise<TokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error(`Google Ads token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refresh LinkedIn access token
 */
async function refreshLinkedInToken(refreshToken: string, clientId: string, clientSecret: string): Promise<TokenResponse> {
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error(`LinkedIn token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refresh Meta access token (Exchange short-lived for long-lived)
 */
async function refreshMetaToken(accessToken: string, clientId: string, clientSecret: string): Promise<TokenResponse> {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${clientId}&` +
    `client_secret=${clientSecret}&` +
    `fb_exchange_token=${accessToken}`
  );

  if (!response.ok) {
    throw new Error(`Meta token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Refresh TikTok access token
 */
async function refreshTikTokToken(refreshToken: string, clientId: string, clientSecret: string): Promise<TokenResponse> {
  const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/oauth2/refresh_token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: clientId,
      secret: clientSecret,
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    throw new Error(`TikTok token refresh failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data; // TikTok wraps response in data object
}

/**
 * Refresh token for a specific connector
 */
export async function refreshToken(userConnector: any): Promise<void> {
  const config = getOAuthConfigById(userConnector.connector_id);
  
  if (!config) {
    throw new Error(`No OAuth config found for connector_id ${userConnector.connector_id}`);
  }

  if (!userConnector.refresh_token) {
    throw new Error(`No refresh token available for connector ${config.connector_name}`);
  }

  let tokenResponse: TokenResponse;

  try {
    switch (config.connector_name.toLowerCase()) {
      case 'hubspot':
        tokenResponse = await refreshHubSpotToken(
          userConnector.refresh_token,
          config.client_id,
          config.client_secret
        );
        break;
      
      case 'salesforce':
        // Check if custom credentials were used (stored in metadata)
        const salesforceClientId = userConnector.metadata?.custom_client_id || config.client_id;
        const salesforceClientSecret = userConnector.metadata?.custom_client_secret || config.client_secret;
        
        tokenResponse = await refreshSalesforceToken(
          userConnector.refresh_token,
          salesforceClientId,
          salesforceClientSecret,
          userConnector.instance_url // Pass the instance URL
        );
        break;
      
      case 'google ads':
        tokenResponse = await refreshGoogleAdsToken(
          userConnector.refresh_token,
          config.client_id,
          config.client_secret
        );
        break;
      
      case 'linkedin':
        tokenResponse = await refreshLinkedInToken(
          userConnector.refresh_token,
          config.client_id,
          config.client_secret
        );
        break;
      
      case 'meta':
        tokenResponse = await refreshMetaToken(
          userConnector.access_token,
          config.client_id,
          config.client_secret
        );
        break;
      
      case 'tiktok':
        tokenResponse = await refreshTikTokToken(
          userConnector.refresh_token,
          config.client_id,
          config.client_secret
        );
        break;
      
      default:
        throw new Error(`Token refresh not implemented for ${config.connector_name}`);
    }

    // Update tokens in database
    // Default to 2 hours (7200 seconds) if expires_in is not provided
    const expiresInSeconds = tokenResponse.expires_in || 7200;
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    
    const userId = userConnector.userid || userConnector.user_id;
    
    console.log('🔄 Updating tokens in database:', {
      userId,
      connector_id: userConnector.connector_id,
      expiry: expiresAt,
      expires_in_seconds: expiresInSeconds,
      has_new_refresh_token: !!tokenResponse.refresh_token
    });
    
    await userConnectors.upsert({
      user_id: userId,
      connector_id: userConnector.connector_id,
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token || userConnector.refresh_token,
      token_type: tokenResponse.token_type || 'Bearer',
      expiry: expiresAt,
      scope: tokenResponse.scope || userConnector.scope,
      instance_url: userConnector.instance_url,
      account_id: userConnector.account_id,
      account_name: userConnector.account_name,
      account_email: userConnector.account_email,
      metadata: userConnector.metadata
    });

    console.log(`✅ Refreshed token for ${config.connector_name} - User ${userId}`);
  } catch (error) {
    console.error(`❌ Failed to refresh token for ${config.connector_name}:`, error);
    throw error;
  }
}

/**
 * Refresh all expiring tokens (to be called by cron job)
 */
export async function refreshExpiringTokens(hoursAhead: number = 1): Promise<{ success: number; failed: number }> {
  const expiringConnectors = await userConnectors.findExpiring(hoursAhead);
  
  let success = 0;
  let failed = 0;

  console.log(`🔄 Found ${expiringConnectors.length} tokens expiring in ${hoursAhead} hour(s)`);

  for (const connector of expiringConnectors) {
    try {
      await refreshToken(connector);
      success++;
    } catch (error) {
      failed++;
      console.error(`Failed to refresh token for connector ${connector.id}:`, error);
      
      // Update sync status to show error
      await userConnectors.updateSyncStatus(
        connector.id,
        'failed',
        `Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  console.log(`✅ Token refresh complete: ${success} succeeded, ${failed} failed`);
  
  return { success, failed };
}
