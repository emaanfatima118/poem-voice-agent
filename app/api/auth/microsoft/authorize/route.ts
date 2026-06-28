/**
 * Microsoft OAuth - Authorization Endpoint
 * GET /api/auth/microsoft/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { SSO_CONFIG } from '@/lib/auth/sso-config';
import { generateState } from '@/lib/auth/sso-helpers';

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF protection state
    const state = generateState();
    
    // Build Microsoft OAuth URL
    const authUrl = SSO_CONFIG.microsoft.authUrl.replace('{tenant}', SSO_CONFIG.microsoft.tenantId);
    
    const params = new URLSearchParams({
      client_id: SSO_CONFIG.microsoft.clientId,
      redirect_uri: SSO_CONFIG.microsoft.redirectUri,
      response_type: 'code',
      scope: SSO_CONFIG.microsoft.scope,
      state: state,
      response_mode: 'query',
    });

    const fullAuthUrl = `${authUrl}?${params.toString()}`;

    // Store state in cookie for verification in callback
    const response = NextResponse.redirect(fullAuthUrl);
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Microsoft OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Microsoft OAuth' },
      { status: 500 }
    );
  }
}
