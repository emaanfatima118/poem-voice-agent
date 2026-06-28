/**
 * Debug endpoint to check HubSpot connector status
 * Route: GET /api/debug/hubspot-connector?user_id=X
 */

import { NextRequest, NextResponse } from 'next/server';
import { userConnectors } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Find HubSpot connector (connector_id 11)
    const connector = await userConnectors.findOne(parseInt(userId), 11);

    if (!connector) {
      return NextResponse.json({
        found: false,
        message: 'No HubSpot connector found for this user'
      });
    }

    // Return connector info (without sensitive token data)
    return NextResponse.json({
      found: true,
      connector: {
        id: connector.id,
        connector_id: connector.connector_id,
        userid: connector.userid,
        account_id: connector.account_id,
        account_name: connector.account_name,
        account_email: connector.account_email,
        token_type: connector.token_type,
        expiry: connector.expiry,
        is_active: connector.is_active,
        last_sync_at: connector.last_sync_at,
        sync_status: connector.sync_status,
        has_access_token: !!connector.access_token,
        access_token_length: connector.access_token?.length || 0,
        has_refresh_token: !!connector.refresh_token,
        scope: connector.scope
      }
    });
  } catch (error) {
    console.error('Debug connector check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
