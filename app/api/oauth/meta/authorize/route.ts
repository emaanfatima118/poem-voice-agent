/**
 * Meta (Facebook) OAuth - Authorization Handler
 * Route: GET /api/oauth/meta/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAuthUrl, getOAuthConfig } from '@/lib/oauth/config';

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

    const config = getOAuthConfig('meta');
    if (!config) {
      return NextResponse.json(
        { error: 'Meta OAuth configuration not found' },
        { status: 500 }
      );
    }

    // Create state parameter with user context
    const state = Buffer.from(
      JSON.stringify({
        user_id: userId,
        connector: 'meta',
        timestamp: Date.now()
      })
    ).toString('base64url');

    // Generate authorization URL
    const authUrl = generateAuthUrl(config, state);

    console.log('🔗 Meta authorization URL generated:', authUrl);

    return NextResponse.json({
      authorization_url: authUrl,
      connector: 'meta',
      user_id: userId
    });
  } catch (error) {
    console.error('❌ Meta OAuth authorization error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Authorization failed'
      },
      { status: 500 }
    );
  }
}
