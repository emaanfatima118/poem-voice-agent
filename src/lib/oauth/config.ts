/**
 * OAuth Configuration for External Platform Integrations
 * Supports: HubSpot, Salesforce, Google Ads, LinkedIn, Meta, TikTok
 */

export interface OAuthConfig {
  connector_id: number;
  connector_name: string;
  client_id: string;
  client_secret: string;
  authorization_url: string;
  token_url: string;
  scopes: string[];
  redirect_uri: string;
  token_expiry_hours?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  hubspot: {
    connector_id: 11,
    connector_name: 'HubSpot',
    client_id: process.env.HUBSPOT_CLIENT_ID || '',
    client_secret: process.env.HUBSPOT_CLIENT_SECRET || '',
    authorization_url: 'https://app.hubspot.com/oauth/authorize',
    token_url: 'https://api.hubapi.com/oauth/v1/token',
    scopes: [
      'crm.objects.contacts.read',
      'crm.objects.companies.read',
      'crm.objects.deals.read',
      'crm.lists.read',
      'oauth'
    ],
    redirect_uri: `${BASE_URL}/api/oauth/hubspot/callback`,
    token_expiry_hours: 6
  },
  
  salesforce: {
    connector_id: 12,
    connector_name: 'Salesforce',
    client_id: process.env.SALESFORCE_CLIENT_ID || '',
    client_secret: process.env.SALESFORCE_CLIENT_SECRET || '',
    authorization_url: 'https://login.salesforce.com/services/oauth2/authorize',
    token_url: 'https://login.salesforce.com/services/oauth2/token',
    scopes: [
      'api',
      'refresh_token',
      'offline_access'
    ],
    redirect_uri: `${BASE_URL}/api/oauth/salesforce/callback`,
    token_expiry_hours: 2
  },
  
  google_ads: {
    connector_id: 13,
    connector_name: 'Google Ads',
    client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
    authorization_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_url: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/adwords'
    ],
    redirect_uri: `${BASE_URL}/api/oauth/google-ads/callback`,
    token_expiry_hours: 1
  },
  
  linkedin: {
    connector_id: 14,
    connector_name: 'LinkedIn',
    client_id: process.env.LINKEDIN_CLIENT_ID || '',
    client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
    authorization_url: 'https://www.linkedin.com/oauth/v2/authorization',
    token_url: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: [
      'r_ads',
      'r_organization_social',
      'r_ads_reporting',
      'rw_ads'
    ],
    redirect_uri: `${BASE_URL}/api/oauth/linkedin/callback`,
    token_expiry_hours: 2
  },
  
  meta: {
    connector_id: 15,
    connector_name: 'Meta',
    client_id: process.env.META_APP_ID || '',
    client_secret: process.env.META_APP_SECRET || '',
    authorization_url: 'https://www.facebook.com/v18.0/dialog/oauth',
    token_url: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: [
      'ads_read',
      'ads_management',
      'business_management',
      'pages_read_engagement'
    ],
    redirect_uri: `${BASE_URL}/api/oauth/meta/callback`,
    token_expiry_hours: 24 * 60 // 60 days for long-lived tokens
  },
  
  tiktok: {
    connector_id: 16,
    connector_name: 'TikTok',
    client_id: process.env.TIKTOK_APP_ID || '',
    client_secret: process.env.TIKTOK_APP_SECRET || '',
    authorization_url: 'https://business-api.tiktok.com/portal/auth',
    token_url: 'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
    scopes: [
      'ad_account.read',
      'campaign.read',
      'ad_group.read',
      'creative.read'
    ],
    redirect_uri: `${BASE_URL}/api/oauth/tiktok/callback`,
    token_expiry_hours: 24
  }
};

/**
 * Get OAuth config by connector name
 */
export function getOAuthConfig(connectorName: string): OAuthConfig | undefined {
  return OAUTH_CONFIGS[connectorName.toLowerCase().replace(/\s+/g, '_')];
}

/**
 * Get OAuth config by connector ID
 */
export function getOAuthConfigById(connectorId: number): OAuthConfig | undefined {
  return Object.values(OAUTH_CONFIGS).find(config => config.connector_id === connectorId);
}

/**
 * Generate authorization URL with state parameter
 */
export function generateAuthUrl(config: OAuthConfig, state: string): string {
  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    scope: config.scopes.join(' '),
    response_type: 'code',
    state
  });

  // Add prompt=login for Salesforce to ensure fresh auth
  if (config.connector_name === 'Salesforce') {
    params.append('prompt', 'login');
  }

  // Add access_type=offline for Google to get refresh token
  if (config.connector_name === 'Google Ads') {
    params.append('access_type', 'offline');
    params.append('prompt', 'consent');
    console.log('✅ Added access_type=offline and prompt=consent for Google Ads');
  }

  console.log(`🔗 Generated auth URL for ${config.connector_name}:`, params.toString());

  return `${config.authorization_url}?${params.toString()}`;
}

/**
 * Calculate token expiry date
 */
export function calculateExpiry(expiresIn: number): Date {
  return new Date(Date.now() + expiresIn * 1000);
}
