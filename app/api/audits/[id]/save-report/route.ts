/**
 * Save Audit Report to Google Storage
 * Generates a PDF report and saves it to Google Cloud Storage bucket
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits } from '@/lib/db/queries';
import { Storage } from '@google-cloud/storage';
import { exportPdf } from '@/lib/audit/exports';
import { AuditResult } from '@/lib/audit/utils';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: process.env.GOOGLE_CLOUD_CREDENTIALS 
    ? JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
    : undefined,
});

const bucketName = process.env.GOOGLE_STORAGE_BUCKET || 'stackwise-audit-reports';

/**
 * POST /api/audits/[id]/save-report
 * Save audit report to Google Cloud Storage
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: auditIdStr } = await params;
    const auditId = parseInt(auditIdStr);

    if (isNaN(auditId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid audit ID' },
        { status: 400 }
      );
    }

    // Get audit from pulse_hub_audits table
    const audit = await pulseHubAudits.findById(auditId);

    if (!audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Convert database audit to AuditResult format
    const auditResult: AuditResult = {
      url: audit.website_url,
      overall_score: audit.overall_score || 0,
      overall_grade: audit.grade || 'N/A',
      performance_level: audit.performance_level || 'Unknown',
      executive_summary: (audit.audit_data as any)?.executive_summary || '',
      sections: (audit.audit_data as any)?.sections || {},
      summary_cards: (audit.audit_data as any)?.summary_cards || {},
      plan_30_60_90: (audit.audit_data as any)?.plan_30_60_90 || {},
      competitor_snapshot: (audit.audit_data as any)?.competitor_snapshot || {},
      insights_tab: (audit.audit_data as any)?.insights_tab || [],
      trendline: [],
      audit_meta: {
        url: audit.website_url,
        timestamp: Math.floor(new Date(audit.created_at).getTime() / 1000),
        render_mode: 'full',
        baseline_confidence: 'high',
        runtime_sec: 0,
        selected_topics: audit.topics_audited || [],
      },
    };

    // Generate filename using audit name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedName = (audit.audit_name || 'Audit').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50);
    const base = `${sanitizedName}-${auditId}-${timestamp}`;
    const filename = `${base}.pdf`;

    // Generate PDF report using exportPdf which returns a GCS URL
    console.log(`[SaveReport] Generating PDF for audit ${auditId}`);
    const pdfUrl = await exportPdf(auditResult, base, audit.user_id);

    console.log(`[SaveReport] PDF saved successfully to: ${pdfUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Audit report saved to storage',
      filename,
      url: pdfUrl,
      auditId,
    });
  } catch (error: any) {
    console.error('[SaveReport] Error saving audit report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save audit report',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
