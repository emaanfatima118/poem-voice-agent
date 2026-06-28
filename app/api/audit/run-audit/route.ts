import { NextRequest, NextResponse } from 'next/server';
import { runAudit } from '@/lib/audit/audit-manager';
import { exportAudit } from '@/lib/audit/exports';
import { loadAuditLog } from '@/lib/audit/audit-log';
import { getLatestAuditResult } from '@/lib/audit/utils';
import { DEFAULT_TOPICS } from '@/lib/audit/constants';

// Force dynamic rendering - don't evaluate during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('[run-audit API] 🎯 ========== NEW AUDIT REQUEST ==========');
    const body = await request.json();
    const { url, audit_name, render, debug: userDebug = false, model = 'gpt-4o', selected_topics, user_id } = body;
    
    // Force debug mode to see baseline signals
    const debug = true;

    // Get userId from request or default to 1 for development
    const userId = user_id || 1;

    console.log('[run-audit API] Request params:', { 
      url, 
      audit_name, 
      render, 
      debug, 
      model,
      user_id: userId,
      selected_topics_count: selected_topics?.length 
    });

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required',
        },
        { status: 400 }
      );
    }

    const selectedTopics = selected_topics || DEFAULT_TOPICS;
    console.log('[run-audit API] Selected topics:', selectedTopics);
    console.log('[run-audit API] Environment check - OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);

    // Load audit log for previous results (user-specific)
    const auditLog = await loadAuditLog(userId);
    const prev = getLatestAuditResult(url, auditLog, selectedTopics);

    // Run the audit
    const result = await runAudit({
      url,
      userId,
      previousAudit: prev,
      render: render ?? null,
      debug,
      model,
      selectedTopics,
    });

    // Export files with userId for trendline from performance_audit_log
    const exportResult = await exportAudit({
      url,
      auditName: audit_name,
      exportFormat: 'all',
      includePlots: true,
      result,
      userId,
    });

    console.log('[run-audit API] Audit completed successfully');
    console.log('[run-audit API] Result summary:', {
      overall_score: result.overall_score,
      sections: Object.keys(result.sections || {}),
      insights_count: result.insights_tab?.length || 0,
      files: exportResult.files
    });

    return NextResponse.json(
      {
        success: true,
        result,
        files: exportResult.files || {},
        message: 'Audit completed successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[run-audit API] Error:', error);
    console.error('[run-audit API] Error stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
