/**
 * GET /api/pulsehub/audits/queue
 * Get current audit queue status
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Import queue manager
    const { auditQueue } = await import('@/lib/audit/audit-queue');

    const status = auditQueue.getStatus();

    return NextResponse.json(
      {
        success: true,
        queue: status
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[GET /api/pulsehub/audits/queue] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get queue status',
        message: error.message
      },
      { status: 500 }
    );
  }
}
