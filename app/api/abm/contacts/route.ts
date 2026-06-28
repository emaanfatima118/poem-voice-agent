/**
 * ABM Read API - Contacts
 * Route: GET /api/abm/contacts?connector_id=...
 */

import { NextRequest, NextResponse } from 'next/server';
import { crmContacts } from '@/lib/db/queries';
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

    // Get contacts and filter by active connectors only
    const query = connector_id
      ? `SELECT c.* FROM crm_contacts c
         INNER JOIN connector_details cd ON c.user_id = cd.userid AND c.connector_id = cd.connector_id
         WHERE c.user_id = $1 AND c.connector_id = $2 AND c.is_deleted = false
         AND cd.is_active = true
         ORDER BY c.created_at DESC`
      : `SELECT c.* FROM crm_contacts c
         INNER JOIN connector_details cd ON c.user_id = cd.userid AND c.connector_id = cd.connector_id
         WHERE c.user_id = $1 AND c.is_deleted = false
         AND cd.is_active = true
         ORDER BY c.created_at DESC`;
    
    const params = connector_id ? [user_id, connector_id] : [user_id];
    const rows = await db.select(query, params);

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('ABM contacts read error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
