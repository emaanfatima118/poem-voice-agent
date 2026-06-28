/**
 * Example API Route: Single Audit Operations
 * 
 * Handles operations on individual audit records
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits as audits, auditLogs as activityLogs } from '@/lib/db/queries';
import { getSession } from '@/lib/auth/session';

/**
 * GET /api/audits/[id]
 * Get a specific audit with its results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auditId = parseInt(id, 10);

    if (!auditId || isNaN(auditId)) {
      return NextResponse.json(
        { success: false, error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Get audit with results
    const audit = await audits.findById(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: audit
    });

  } catch (error: any) {
    const { id } = await params;
    console.error(`❌ GET /api/audits/${id} failed:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/audits/[id]
 * Delete a specific audit
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const auditId = parseInt(id, 10);

    if (!auditId || isNaN(auditId)) {
      return NextResponse.json(
        { success: false, error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Get audit first to verify ownership
    const audit = await audits.findById(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Verify user owns this audit
    if (audit.user_id !== session.userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You do not own this audit' },
        { status: 403 }
      );
    }

    // Delete the audit
    await audits.delete(auditId);

    // Log activity
    await activityLogs.log({
      user_id: session.userId,
      action: 'audit_deleted',
      resource_type: 'audit',
      resource_id: auditId,
      audit_data: { audit_name: audit.audit_name, website_url: audit.website_url }
    });

    return NextResponse.json({
      success: true,
      message: 'Audit deleted successfully'
    });

  } catch (error: any) {
    const { id } = await params;
    console.error(`❌ DELETE /api/audits/${id} failed:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/audits/[id]
 * Update audit status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auditId = parseInt(id, 10);
    const body = await request.json();

    if (!auditId) {
      return NextResponse.json(
        { success: false, error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Update audit status
    const updatedAudit = await audits.updateStatus(auditId, body.status);

    if (!updatedAudit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Log activity
    if (updatedAudit.user_id) {
      await activityLogs.log({
        user_id: updatedAudit.user_id,
        action: 'audit_status_updated',
        resource_type: 'audit',
        resource_id: updatedAudit.audit_id,
        audit_data: { status: body.status }
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedAudit,
      message: 'Audit status updated successfully'
    });

  } catch (error: any) {
    const { id } = await params;
    console.error(`❌ PATCH /api/audits/${id} failed:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}
