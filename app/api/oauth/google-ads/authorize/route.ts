/**
 * Google Ads OAuth - Authorization Handler
 * Route: GET /api/oauth/google-ads/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl, getOAuthConfig } from '@/lib/oauth/config';

export async function GET(request: NextRequest) {
  console.log('🟢 Google Ads OAuth authorize requested');
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    console.log('Google Ads authorize params:', { userId });

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const config = getOAuthConfig('google_ads');
    if (!config) {
      console.error('❌ Google Ads OAuth configuration not found');
      return NextResponse.json(
        { error: 'Google Ads OAuth configuration not found' },
        { status: 500 }
      );
    }

    console.log('Google Ads OAuth config:', {
      client_id: config.client_id ? '***' + config.client_id.slice(-4) : 'missing',
      redirect_uri: config.redirect_uri,
      scopes: config.scopes
    });

    // Create state parameter with user context
    const state = Buffer.from(
      JSON.stringify({
        user_id: userId,
        connector: 'google_ads',
        timestamp: Date.now()
      })
    ).toString('base64url');

    // Generate authorization URL
    const authUrl = generateAuthUrl(config, state);

    console.log('✅ Google Ads authorization URL generated');
    console.log('Redirect URI:', config.redirect_uri);

    return NextResponse.json({
      authorization_url: authUrl,
      connector: 'google_ads',
      user_id: userId
    });
  } catch (error) {
    console.error('❌ Google Ads OAuth authorization error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Authorization failed'
      },
      { status: 500 }
    );
  }
}
