/**
 * PulseHub Audit Download API
 * GET /api/pulsehub/audits/[id]/download - Download audit result as JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits } from '@/lib/db/queries';

/**
 * GET /api/pulsehub/audits/[id]/download
 * Download full audit result as JSON
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = parseInt(params.id);

    if (isNaN(auditId)) {
      return NextResponse.json(
        { error: 'Invalid audit ID' },
        { status: 400 }
      );
    }

    const audit = await pulseHubAudits.findById(auditId);

    if (!audit) {
      return NextResponse.json(
        { error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Return the full audit data as downloadable JSON
    const filename = `audit_${audit.audit_id}_${audit.audit_name.replace(/[^a-z0-9]/gi, '_')}.json`;
    
    return new NextResponse(JSON.stringify(audit.audit_data, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error(`[GET /api/pulsehub/audits/${params.id}/download] Error:`, error);
    return NextResponse.json(
      {
        error: 'Failed to download audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}
