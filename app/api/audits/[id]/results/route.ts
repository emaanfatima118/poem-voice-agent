/**
 * Example API Route: Audit Results Operations
 * 
 * Handles saving and retrieving audit results
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits as audits, auditLogs as activityLogs, flightDeckOperations as insights } from '@/lib/db/queries';
import type { AuditResult } from '@/lib/db/types';

/**
 * POST /api/audits/[id]/results
 * Save audit results
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auditId = params.id;
    const body = await request.json();

    if (!auditId) {
      return NextResponse.json(
        { success: false, error: 'Audit ID is required' },
        { status: 400 }
      );
    }

    // Verify audit exists
    const audit = await audits.findById(auditId);
    if (!audit) {
      return NextResponse.json(
        { success: false, error: 'Audit not found' },
        { status: 404 }
      );
    }

    // Prepare results data
    const resultsData: Omit<AuditResult, 'id' | 'audit_id' | 'created_at' | 'updated_at'> = {
      overall_score: body.overall_score,
      overall_grade: body.overall_grade,
      performance_level: body.performance_level,
      executive_summary: body.executive_summary,
      summary_cards: body.summary_cards || {},
      findings: body.findings || [],
      insights: body.insights || [],
      action_plans: body.action_plans || {},
      seo_data: body.seo_data || {},
      performance_data: body.performance_data || {},
      content_data: body.content_data || {},
      social_data: body.social_data || {}
    };

    // Save results
    const results = await audits.saveResults(auditId, resultsData);

    // Update audit status to completed
    await audits.updateStatus(auditId, 'completed');

    // Create AI insights from the audit results
    if (audit.user_id && body.insights && Array.isArray(body.insights)) {
      for (const insight of body.insights.slice(0, 5)) { // Limit to top 5 insights
        try {
          await insights.create({
            user_id: audit.user_id,
            source_module: 'pulsehub',
            source_id: auditId,
            insight_type: insight.type || 'recommendation',
            title: insight.title,
            description: insight.description,
            priority: insight.priority || 'medium',
            action_items: insight.action_items || [],
            context_data: { audit_name: audit.audit_name }
          });
        } catch (insightError) {
          console.error('Failed to create insight:', insightError);
        }
      }
    }

    // Log activity
    if (audit.user_id) {
      await activityLogs.log({
        user_id: audit.user_id,
        action: 'audit_completed',
        resource_type: 'audit',
        resource_id: auditId,
        description: `Audit completed: ${audit.audit_name}`,
        metadata: {
          overall_score: results.overall_score,
          overall_grade: results.overall_grade
        }
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        message: 'Audit results saved successfully'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error(`❌ POST /api/audits/${params.id}/results failed:`, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save audit results',
        message: error.message
      },
      { status: 500 }
    );
  }
}
