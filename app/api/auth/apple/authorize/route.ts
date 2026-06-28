/**
 * Apple OAuth - Authorization Endpoint
 * GET /api/auth/apple/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { SSO_CONFIG } from '@/lib/auth/sso-config';
import { generateState } from '@/lib/auth/sso-helpers';

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF protection state
    const state = generateState();
    
    // Build Apple OAuth URL
    const params = new URLSearchParams({
      client_id: SSO_CONFIG.apple.clientId,
      redirect_uri: SSO_CONFIG.apple.redirectUri,
      response_type: 'code',
      response_mode: 'form_post', // Apple uses POST for callback
      scope: SSO_CONFIG.apple.scope,
      state: state,
    });

    const authUrl = `${SSO_CONFIG.apple.authUrl}?${params.toString()}`;

    // Store state in cookie for verification in callback
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error('Apple OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Apple OAuth' },
      { status: 500 }
    );
  }
}
