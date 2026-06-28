/**
 * User Connectors API
 * Route: GET /api/connectors
 * Returns all connectors and their connection status for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectorDetails, connectors } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id parameter is required' }, { status: 400 });
    }

    // Get all available connectors
    const allConnectors = await connectors.list();

    // Get user's connected connectors
    const userConnected = await connectorDetails.findByUser(parseInt(userId));

    // Map connection status
    const connectorsWithStatus = allConnectors.map((connector: any) => {
      const connection = userConnected.find(uc => uc.connector_id === connector.connector_id);
      
      // Map connector_name to URL-friendly path (replace underscores with hyphens)
      const urlPath = connector.connector_name.replace(/_/g, '-');
      
      return {
        connector_id: connector.connector_id,
        connector_name: urlPath, // URL-friendly path for API calls
        display_name: connector.display_name || connector.connector_name,
        description: connector.description,
        is_available: connector.is_active,
        is_connected: connection ? connection.is_active : false,
        connection_status: connection ? {
          id: connection.id,
          is_active: connection.is_active,
          account_name: connection.account_name,
          account_id: connection.account_id,
          account_email: connection.account_email,
          expires_at: connection.expires_at,
          last_sync_at: connection.last_sync_at,
          sync_status: connection.sync_status,
          error_message: connection.error_message,
          connected_at: connection.created_at
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      connectors: connectorsWithStatus
    });
  } catch (error) {
    console.error('Get connectors error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Disconnect a connector
 * Route: DELETE /api/connectors
 */
export async function DELETE(request: NextRequest) {
  try {
    const { connection_id } = await request.json();

    if (!connection_id) {
      return NextResponse.json({ error: 'connection_id is required' }, { status: 400 });
    }

    await connectorDetails.disconnect(connection_id);

    return NextResponse.json({
      success: true,
      message: 'Connector disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect connector error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
