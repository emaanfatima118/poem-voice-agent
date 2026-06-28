/**
 * Google OAuth - Authorization Endpoint
 * GET /api/auth/google/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { SSO_CONFIG } from '@/lib/auth/sso-config';
import { generateState } from '@/lib/auth/sso-helpers';

export async function GET(request: NextRequest) {
  try {
    // Generate CSRF protection state
    const state = generateState();
    
    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: SSO_CONFIG.google.clientId,
      redirect_uri: SSO_CONFIG.google.redirectUri,
      response_type: 'code',
      scope: SSO_CONFIG.google.scope,
      state: state,
      access_type: 'offline',
      prompt: 'consent',
    });

    const authUrl = `${SSO_CONFIG.google.authUrl}?${params.toString()}`;

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
    console.error('Google OAuth authorize error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    );
  }
}
