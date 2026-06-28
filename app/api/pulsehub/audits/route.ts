/**
 * PulseHub Audits API Routes
 * GET /api/pulsehub/audits - List audits
 * POST /api/pulsehub/audits - Run new audit
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits, auditLogs } from '@/lib/db/queries';
import { runAudit } from '@/lib/audit/audit-manager';

/**
 * GET /api/pulsehub/audits
 * List all audits for a user or website
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('user_id') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const websiteUrl = searchParams.get('website_url');

    let audits;
    
    if (websiteUrl) {
      // Get audits for specific website
      audits = await pulseHubAudits.findByWebsite(websiteUrl, limit);
    } else {
      // Get audits for user
      audits = await pulseHubAudits.findByUser(userId, limit);
    }

    return NextResponse.json({
      success: true,
      data: audits,
      count: audits.length
    });

  } catch (error: any) {
    console.error('[GET /api/pulsehub/audits] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audits',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pulsehub/audits
 * Run a new PulseHub audit and save to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.url) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: url'
        },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const testUrl = body.url.startsWith('http') ? body.url : `https://${body.url}`;
      new URL(testUrl);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format'
        },
        { status: 400 }
      );
    }

    const userId = body.user_id || 1;  // TODO: Get from session/auth
    const selectedTopics = body.topics || body.selectedTopics;
    const debug = body.debug || false;
    const auditName = body.audit_name;

    console.log('[POST /api/pulsehub/audits] Queueing audit for:', body.url);
    console.log('[POST /api/pulsehub/audits] Audit name from body:', auditName);

    // Import queue manager
    const { auditQueue } = await import('@/lib/audit/audit-queue');

    // Add audit to queue (creates DB entry immediately with status)
    const auditId = await auditQueue.enqueueAudit({
      url: body.url,
      userId,
      selectedTopics,
      debug,
      model: body.model || 'gpt-4o',
      auditName
    });

    const queueStatus = auditQueue.getStatus();

    console.log('[POST /api/pulsehub/audits] Audit queued:', {
      audit_id: auditId,
      queue_position: queueStatus.queueLength,
      is_processing: queueStatus.isProcessing
    });

    return NextResponse.json(
      {
        success: true,
        audit_id: auditId,
        status: queueStatus.queueLength === 0 ? 'processing' : 'pending',
        queue_position: queueStatus.queueLength,
        message: queueStatus.queueLength === 0 
          ? 'Audit started and is now processing' 
          : `Audit queued. Position in queue: ${queueStatus.queueLength}`
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[POST /api/pulsehub/audits] Error:', error);

    // Log error to database
    try {
      await auditLogs.log({
        user_id: 1,
        action: 'audit_error',
        module: 'pulsehub',
        audit_data: {
          error: error.message,
          url: request.body
        }
      });
    } catch (logError) {
      console.error('[POST /api/pulsehub/audits] Failed to log error:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to run audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}
