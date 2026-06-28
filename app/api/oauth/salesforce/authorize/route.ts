/**
 * Salesforce OAuth - Authorization Initiation with PKCE
 * Route: GET /api/oauth/salesforce/authorize
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthConfig } from '@/lib/oauth/config';
import { randomBytes, createHash } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const customClientId = searchParams.get('client_id');
    const customClientSecret = searchParams.get('client_secret');

    if (!userId) {
      return NextResponse.json({ error: 'user_id parameter is required' }, { status: 400 });
    }

    const config = getOAuthConfig('salesforce');
    
    // Use custom credentials if provided, otherwise fall back to env
    const clientId = customClientId || config?.client_id;
    const clientSecret = customClientSecret || config?.client_secret;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Salesforce OAuth credentials not provided. Please enter your Connected App credentials.' },
        { status: 400 }
      );
    }

    // Generate PKCE code verifier and challenge
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const state = Buffer.from(
      JSON.stringify({
        user_id: userId,
        connector: 'salesforce',
        nonce: randomBytes(16).toString('hex'),
        timestamp: Date.now(),
        code_verifier: codeVerifier, // Store for token exchange
        client_id: clientId, // Store custom credentials
        client_secret: clientSecret
      })
    ).toString('base64url');

    // Build authorization URL with PKCE
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: config?.redirect_uri || process.env.NEXT_PUBLIC_SALESFORCE_REDIRECT_URI || '',
      scope: config?.scopes.join(' ') || 'api refresh_token',
      response_type: 'code',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'login' // Force fresh login
    });

    const authUrl = `${config?.authorization_url || 'https://login.salesforce.com/services/oauth2/authorize'}?${params.toString()}`;
    
    // Return authorization URL as JSON for client-side redirect
    return NextResponse.json({
      success: true,
      authorization_url: authUrl,
      connector: 'salesforce',
      user_id: userId
    });
  } catch (error) {
    console.error('Salesforce OAuth authorization error:', error);
    return NextResponse.json({ error: 'Failed to initiate Salesforce authorization' }, { status: 500 });
  }
}
