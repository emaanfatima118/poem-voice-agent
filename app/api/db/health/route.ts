/**
 * Database Health Check API
 * 
 * Provides database connectivity and status information
 */

import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';
import { healthCheck } from '@/lib/db/migrate';

/**
 * GET /api/db/health
 * Check database health and connectivity
 */
export async function GET() {
  try {
    // Test basic connectivity
    const connected = await testConnection();

    if (!connected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection failed'
        },
        { status: 503 }
      );
    }

    // Get detailed health check
    const health = await healthCheck();

    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        connected: health.connected,
        schema_initialized: health.schemaInitialized,
        migrations_applied: health.migrations.length,
        tables_created: health.tableCount,
        migrations: health.migrations.map(m => ({
          version: m.version,
          name: m.name,
          applied_at: m.applied_at
        }))
      }
    });

  } catch (error: any) {
    console.error('❌ Health check failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Health check failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}
