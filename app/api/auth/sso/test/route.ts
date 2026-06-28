/**
 * SSO Test Endpoint
 * GET /api/auth/sso/test
 * Tests SSO configuration without needing OAuth apps set up
 */

import { NextResponse } from 'next/server';
import { SSO_CONFIG } from '@/lib/auth/sso-config';

export async function GET() {
  const config = {
    app_url: process.env.NEXT_PUBLIC_APP_URL || 'NOT_SET',
    session_secret: process.env.SESSION_SECRET ? 'SET' : 'NOT_SET',
    
    google: {
      client_id: SSO_CONFIG.google.clientId ? 'SET' : 'NOT_SET',
      client_secret: SSO_CONFIG.google.clientSecret ? 'SET' : 'NOT_SET',
      redirect_uri: SSO_CONFIG.google.redirectUri,
    },
    
    microsoft: {
      client_id: SSO_CONFIG.microsoft.clientId ? 'SET' : 'NOT_SET',
      client_secret: SSO_CONFIG.microsoft.clientSecret ? 'SET' : 'NOT_SET',
      tenant_id: SSO_CONFIG.microsoft.tenantId,
      redirect_uri: SSO_CONFIG.microsoft.redirectUri,
    },
    
    apple: {
      client_id: SSO_CONFIG.apple.clientId ? 'SET' : 'NOT_SET',
      team_id: SSO_CONFIG.apple.teamId ? 'SET' : 'NOT_SET',
      key_id: SSO_CONFIG.apple.keyId ? 'SET' : 'NOT_SET',
      private_key: SSO_CONFIG.apple.privateKey ? 'SET' : 'NOT_SET',
      redirect_uri: SSO_CONFIG.apple.redirectUri,
    },
  };

  const missingConfigs = [];
  
  if (config.app_url === 'NOT_SET') missingConfigs.push('NEXT_PUBLIC_APP_URL');
  if (config.session_secret === 'NOT_SET') missingConfigs.push('SESSION_SECRET');
  
  if (config.google.client_id === 'NOT_SET') missingConfigs.push('GOOGLE_CLIENT_ID');
  if (config.google.client_secret === 'NOT_SET') missingConfigs.push('GOOGLE_CLIENT_SECRET');
  
  if (config.microsoft.client_id === 'NOT_SET') missingConfigs.push('MICROSOFT_CLIENT_ID');
  if (config.microsoft.client_secret === 'NOT_SET') missingConfigs.push('MICROSOFT_CLIENT_SECRET');

  const status = missingConfigs.length === 0 ? 'ready' : 'incomplete';
  
  return NextResponse.json({
    status,
    message: status === 'ready' 
      ? '✅ SSO configuration complete! Google and Microsoft OAuth are ready to use.' 
      : '⚠️ SSO configuration incomplete. Please set the missing environment variables.',
    config,
    missing: missingConfigs,
    endpoints: {
      google: {
        authorize: '/api/auth/google/authorize',
        callback: '/api/auth/google/callback',
      },
      microsoft: {
        authorize: '/api/auth/microsoft/authorize',
        callback: '/api/auth/microsoft/callback',
      },
      apple: {
        authorize: '/api/auth/apple/authorize',
        callback: '/api/auth/apple/callback (POST)',
      },
    },
    test_links: {
      google: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/authorize`,
      microsoft: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/microsoft/authorize`,
      apple: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/apple/authorize`,
    },
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
