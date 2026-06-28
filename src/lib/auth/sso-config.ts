/**
 * SSO Configuration
 * Environment variables for OAuth providers
 */

export const SSO_CONFIG = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
    tenantId: process.env.MICROSOFT_TENANT_ID || 'common', // 'common' for multi-tenant
    redirectUri: process.env.MICROSOFT_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/microsoft/callback`,
    authUrl: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    scope: 'openid email profile User.Read',
  },
  apple: {
    clientId: process.env.APPLE_CLIENT_ID || '', // Service ID
    teamId: process.env.APPLE_TEAM_ID || '',
    keyId: process.env.APPLE_KEY_ID || '',
    privateKey: process.env.APPLE_PRIVATE_KEY || '', // .p8 file content
    redirectUri: process.env.APPLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/apple/callback`,
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scope: 'name email',
  },
};

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';
