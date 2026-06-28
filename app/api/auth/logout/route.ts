/**
 * Logout API Route
 * POST /api/auth/logout
 * Clears session cookies and logs out user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auditLogs } from '@/lib/db/queries';
import { getSession, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await getSession();
    
    if (session) {
      // Log logout action
      await auditLogs.log({
        user_id: session.userId,
        action: 'logout',
        module: 'auth',
        audit_data: {
          email: session.email,
          auth_provider: session.authProvider
        },
        ip_address: request.headers.get('x-forwarded-for') || undefined,
        user_agent: request.headers.get('user-agent') || undefined
      });
    }

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    );

    // Clear session cookie
    response.cookies.set(SESSION_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error: any) {
    console.error('[POST /api/auth/logout] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during logout',
        message: error.message
      },
      { status: 500 }
    );
  }
}
