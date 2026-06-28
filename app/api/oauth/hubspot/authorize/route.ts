/**
 * HubSpot OAuth - Authorization Initiation
 * Route: GET /api/oauth/hubspot/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthConfig, generateAuthUrl } from '@/lib/oauth/config';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const config = getOAuthConfig('hubspot');
    
    if (!config) {
      return NextResponse.json(
        { error: 'HubSpot OAuth configuration not found' },
        { status: 500 }
      );
    }

    if (!config.client_id || !config.client_secret) {
      return NextResponse.json(
        { error: 'HubSpot OAuth credentials not configured. Please set HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET in environment variables.' },
        { status: 500 }
      );
    }

    // Generate state parameter for CSRF protection
    const state = Buffer.from(
      JSON.stringify({
        user_id: userId,
        connector: 'hubspot',
        nonce: randomBytes(16).toString('hex'),
        timestamp: Date.now()
      })
    ).toString('base64url');

    // Generate authorization URL
    const authUrl = generateAuthUrl(config, state);

    // Return authorization URL as JSON for client-side redirect
    return NextResponse.json({
      success: true,
      authorization_url: authUrl,
      connector: 'hubspot',
      user_id: userId
    });
  } catch (error) {
    console.error('HubSpot OAuth authorization error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate HubSpot authorization' },
      { status: 500 }
    );
  }
}
