/**
 * PulseHub Audit Detail API Routes
 * GET /api/pulsehub/audits/[id] - Get audit by ID
 * DELETE /api/pulsehub/audits/[id] - Delete audit
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits, auditLogs } from '@/lib/db/queries';

/**
 * GET /api/pulsehub/audits/[id]
 * Get specific audit by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = parseInt(params.id);

    if (isNaN(auditId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid audit ID' },
        { status: 400 }
      );
    }

    const audit = await pulseHubAudits.findById(auditId);

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
    console.error(`[GET /api/pulsehub/audits/${params.id}] Error:`, error);
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
 * DELETE /api/pulsehub/audits/[id]
 * Delete an audit
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = parseInt(params.id);

    if (isNaN(auditId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid audit ID' },
        { status: 400 }
      );
    }

    // Get audit first to log deletion
    const audit = await pulseHubAudits.findById(auditId);
    
    if (!audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Delete the audit
    await pulseHubAudits.delete(auditId);

    // Log deletion activity
    await auditLogs.log({
      user_id: audit.user_id,
      action: 'delete_audit',
      module: 'pulsehub',
      resource_type: 'audit',
      resource_id: auditId.toString(),
      audit_data: {
        audit_name: audit.audit_name,
        website_url: audit.website_url
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Audit deleted successfully'
    });

  } catch (error: any) {
    console.error(`[DELETE /api/pulsehub/audits/${params.id}] Error:`, error);
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
