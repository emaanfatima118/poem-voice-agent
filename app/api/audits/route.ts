/**
 * Example API Route: Audit Operations
 * 
 * This demonstrates secure database usage in Next.js API routes
 * All database operations happen server-side, safely away from the browser
 */

import { NextRequest, NextResponse } from 'next/server';
import { pulseHubAudits as audits, auditLogs as activityLogs } from '@/lib/db/queries';
import type { CreateAuditInput } from '@/lib/db/types';
import { getSession } from '@/lib/auth/session';
import { query } from '@/lib/db';

/**
 * GET /api/audits
 * List all audits with pagination (supports both session and query params)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('user_id');
    const websiteUrl = searchParams.get('website_url');

    // Check for session-based auth (preferred for View Audits page)
    const session = await getSession();
    const effectiveUserId = session?.userId || (userId ? parseInt(userId) : null);

    // If no user ID from either source, return error
    if (!effectiveUserId && !websiteUrl) {
      return NextResponse.json(
        { error: 'Unauthorized - user_id required' },
        { status: 401 }
      );
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    let results;
    let total = 0;

    if (effectiveUserId) {
      // Get paginated audits for user with total count
      const countResult = await query(
        'SELECT COUNT(*) as total FROM pulse_hub_audits WHERE user_id = $1',
        [effectiveUserId]
      );
      total = parseInt(countResult.rows[0]?.total || '0');

      const auditsResult = await query(
        `SELECT 
          audit_id,
          audit_name,
          website_url,
          status,
          overall_score,
          performance_level,
          grade,
          topics_audited,
          created_at,
          completed_at
        FROM pulse_hub_audits 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3`,
        [effectiveUserId, limit, offset]
      );
      results = auditsResult.rows;
    } else if (websiteUrl) {
      // Get audits for specific website (legacy support)
      results = await audits.findByUrl(websiteUrl);
      total = results.length;
    }

    return NextResponse.json({
      success: true,
      audits: results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + limit < total
      }
    });

  } catch (error: any) {
    console.error('❌ GET /api/audits failed:', error);
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
 * POST /api/audits
 * Create a new audit
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.audit_name || !body.website_url || !body.topics) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: audit_name, website_url, topics'
        },
        { status: 400 }
      );
    }

    // Validate website URL format
    try {
      new URL(body.website_url.startsWith('http') ? body.website_url : `https://${body.website_url}`);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid website URL format'
        },
        { status: 400 }
      );
    }

    // Create audit data
    const auditData: CreateAuditInput = {
      user_id: body.user_id,
      audit_name: body.audit_name,
      website_url: body.website_url,
      topics: Array.isArray(body.topics) ? body.topics : [],
      module: body.module || 'pulsehub',
      metadata: body.metadata || {}
    };

    // Create audit in database
    const audit = await audits.create(auditData);

    // Log activity
    if (audit.user_id) {
      await activityLogs.log({
        user_id: audit.user_id,
        action: 'audit_created',
        resource_type: 'audit',
        resource_id: audit.id,
        description: `Created audit: ${audit.audit_name}`,
        metadata: { website_url: audit.website_url },
        ip_address: request.headers.get('x-forwarded-for') || undefined,
        user_agent: request.headers.get('user-agent') || undefined
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: audit,
        message: 'Audit created successfully'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('❌ POST /api/audits failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create audit',
        message: error.message
      },
      { status: 500 }
    );
  }
}
