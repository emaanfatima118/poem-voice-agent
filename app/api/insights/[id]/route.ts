/**
 * Example API Route: Single Insight Operations
 * 
 * Handles operations on individual insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { flightDeckOperations as insights, auditLogs as activityLogs } from '@/lib/db/queries';

/**
 * PATCH /api/insights/[id]
 * Update insight (mark as read or archive)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const insightId = params.id;
    const body = await request.json();

    if (!insightId) {
      return NextResponse.json(
        { success: false, error: 'Insight ID is required' },
        { status: 400 }
      );
    }

    // Handle mark as read
    if (body.action === 'mark_read') {
      await insights.markAsRead(insightId);
      
      return NextResponse.json({
        success: true,
        message: 'Insight marked as read'
      });
    }

    // Handle archive
    if (body.action === 'archive') {
      await insights.archive(insightId);
      
      return NextResponse.json({
        success: true,
        message: 'Insight archived'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use "mark_read" or "archive"' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error(`❌ PATCH /api/insights/${params.id} failed:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update insight',
        message: error.message
      },
      { status: 500 }
    );
  }
}
