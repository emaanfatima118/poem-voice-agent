/**
 * Token Refresh Cron Job
 * Route: POST /api/oauth/refresh-tokens
 * Should be called by a cron service (e.g., Vercel Cron, GitHub Actions)
 */

import { NextRequest, NextResponse } from 'next/server';
import { refreshExpiringTokens } from '@/lib/oauth/refresh';

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting token refresh job...');

    // Refresh tokens expiring in the next 1 hour
    const result = await refreshExpiringTokens(1);

    return NextResponse.json({
      message: `Token refresh completed: ${result.success} succeeded, ${result.failed} failed`,
      ...result,
      success: true
    });
  } catch (error) {
    console.error('Token refresh job error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow GET for manual testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await refreshExpiringTokens(1);
  
  return NextResponse.json({
    message: `Token refresh completed: ${result.success} succeeded, ${result.failed} failed`,
    ...result,
    success: true
  });
}
