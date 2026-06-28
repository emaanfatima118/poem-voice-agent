/**
 * ABM Read API - Accounts
 * Route: GET /api/abm/accounts?connector_id=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { crmAccounts } from '@/lib/db/queries';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectorIdParam = searchParams.get('connector_id');

    const user_id = session.userId;

    const connector_id = connectorIdParam ? parseInt(connectorIdParam, 10) : undefined;
    if (connectorIdParam && Number.isNaN(Number(connector_id))) {
      return NextResponse.json({ error: 'connector_id must be a number' }, { status: 400 });
    }

    // Get accounts and filter by active connectors only
    const query = connector_id
      ? `SELECT a.* FROM crm_accounts a
         INNER JOIN connector_details cd ON a.user_id = cd.userid AND a.connector_id = cd.connector_id
         WHERE a.user_id = $1 AND a.connector_id = $2 AND a.is_deleted = false
         AND cd.is_active = true
         ORDER BY a.created_at DESC`
      : `SELECT a.* FROM crm_accounts a
         INNER JOIN connector_details cd ON a.user_id = cd.userid AND a.connector_id = cd.connector_id
         WHERE a.user_id = $1 AND a.is_deleted = false
         AND cd.is_active = true
         ORDER BY a.created_at DESC`;
    
    const params = connector_id ? [user_id, connector_id] : [user_id];
    const rows = await db.select(query, params);

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('ABM accounts read error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
