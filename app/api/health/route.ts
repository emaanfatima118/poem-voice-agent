/**
 * Health Check API Endpoint
 * Used by Docker/Cloud Run to verify service health
 */

import { NextResponse } from 'next/server';
import { browserPool } from '@/lib/playwright/browser-pool';

export async function GET() {
  try {
    const stats = browserPool.getStats();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      playwright: {
        hasBrowser: stats.hasBrowser,
        isConnected: stats.isConnected,
        activePages: stats.activePages,
        idleTime: stats.idleTime,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
