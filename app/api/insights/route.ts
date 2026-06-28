/**
 * Example API Route: AI Insights Operations
 * 
 * Demonstrates AI insights retrieval and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { flightDeckOperations as insights, auditLogs as activityLogs } from '@/lib/db/queries';
import type { CreateInsightInput } from '@/lib/db/types';

/**
 * GET /api/insights
 * Get insights for a user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const unreadOnly = searchParams.get('unread_only') === 'true';

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      );
    }

    let results;

    if (unreadOnly) {
      results = await insights.getUnread(userId);
    } else {
      // For now, we'll just get unread insights
      // In a real implementation, you'd have a separate query for all insights
      results = await insights.getUnread(userId);
    }

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error: any) {
    console.error('❌ GET /api/insights failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch insights',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insights
 * Create a new insight
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.source_module) {
      return NextResponse.json(
        { success: false, error: 'source_module is required' },
        { status: 400 }
      );
    }

    const insightData: CreateInsightInput = {
      user_id: body.user_id,
      source_module: body.source_module,
      source_id: body.source_id,
      insight_type: body.insight_type,
      title: body.title,
      description: body.description,
      priority: body.priority || 'medium',
      action_items: body.action_items || [],
      context_data: body.context_data || {},
      expires_at: body.expires_at
    };

    const insight = await insights.create(insightData);

    // Log activity
    if (insight.user_id) {
      await activityLogs.log({
        user_id: insight.user_id,
        action: 'insight_created',
        resource_type: 'insight',
        resource_id: insight.id,
        description: insight.title || 'New insight created',
        metadata: { priority: insight.priority, type: insight.insight_type }
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: insight,
        message: 'Insight created successfully'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ POST /api/insights failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create insight',
        message: error.message
      },
      { status: 500 }
    );
  }
}
