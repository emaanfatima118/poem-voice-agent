/**
 * Export Audit API Route
 * Re-exports a saved audit from pulse_hub_audits table with trendline from performance_audit_log
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits } from '@/lib/db/queries';
import { generatePdfBuffer, generateMarkdownContent } from '@/lib/audit/exports';
import { AuditResult } from '@/lib/audit/utils';

/**
 * GET /api/audits/[id]/export?format=pdf|json|md
 * Download audit in specified format directly to local PC
 */
export async function GET(
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

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';

    if (!['pdf', 'json', 'md'].includes(format)) {
      return NextResponse.json(
        { success: false, error: 'Invalid format. Use pdf, json, or md' },
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
      competitor_snapshot: (audit.audit_data as any)?.competitor_snapshot || {},
      insights_tab: (audit.audit_data as any)?.insights_tab || [],
      plan_30_60_90: (audit.audit_data as any)?.plan_30_60_90 || {},
      short_next_steps: (audit.audit_data as any)?.short_next_steps || [],
      notes: (audit.audit_data as any)?.notes || '',
      trendline: (audit.audit_data as any)?.trendline || [],
      baseline: (audit.audit_data as any)?.baseline || {},
      audit_meta: {
        url: audit.website_url,
        timestamp: Math.floor(new Date(audit.created_at).getTime() / 1000),
        render_mode: (audit.audit_data as any)?.render_mode || 'Unknown',
        baseline_confidence: (audit.audit_data as any)?.confidence || 'High',
        runtime_sec: 0,
        selected_topics: audit.topics_audited || []
      }
    };

    const sanitizedName = (audit.audit_name || 'Audit').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').substring(0, 50);
    const base = `${sanitizedName}-${auditId}`;
    const timestamp = new Date().toISOString().split('T')[0];

    let fileBuffer: Buffer | undefined;
    let contentType: string = 'application/octet-stream';
    let filename: string = `audit-${auditId}.bin`;

    if (format === 'pdf') {
      console.log(`[Export] Generating PDF for audit ${auditId} - direct generation without GCS`);
      
      // Generate PDF in memory without saving to GCS
      fileBuffer = await generatePdfBuffer(auditResult, audit.user_id);
      
      contentType = 'application/pdf';
      filename = `${base}-${timestamp}.pdf`;
      
    } else if (format === 'json') {
      console.log(`[Export] Generating JSON for audit ${auditId}`);
      
      // Create JSON export directly from audit data
      const jsonData = {
        audit_id: auditId,
        website_url: audit.website_url,
        audit_name: audit.audit_name,
        created_at: audit.created_at,
        overall_score: audit.overall_score,
        grade: audit.grade,
        performance_level: audit.performance_level,
        topics_audited: audit.topics_audited,
        audit_data: audit.audit_data,
      };
      
      fileBuffer = Buffer.from(JSON.stringify(jsonData, null, 2), 'utf-8');
      contentType = 'application/json';
      filename = `${base}-${timestamp}.json`;
      
    } else if (format === 'md') {
      console.log(`[Export] Generating Markdown for audit ${auditId} - direct generation without GCS`);
      
      // Generate Markdown in memory without saving to GCS
      const markdownContent = await generateMarkdownContent(auditResult, audit.user_id);
      fileBuffer = Buffer.from(markdownContent, 'utf-8');
      
      contentType = 'text/markdown';
      filename = `${base}-${timestamp}.md`;
    }

    // Ensure fileBuffer is set
    if (!fileBuffer) {
      throw new Error('File buffer is empty');
    }

    // Return file as download
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error(`[export audit API] Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}