import { NextRequest, NextResponse } from 'next/server';
import { loadAuditLog } from '@/lib/audit/audit-log';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL parameter is required',
        },
        { status: 400 }
      );
    }

    const auditLog = await loadAuditLog();
    const entries = auditLog[url] || [];

    return NextResponse.json(
      {
        success: true,
        url,
        audits: Array.isArray(entries) ? entries : [entries],
        count: Array.isArray(entries) ? entries.length : 1,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[audit-history API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
