/**
 * Get Current User Session
 * GET /api/auth/me
 * Returns current authenticated user info
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { users, userDetails } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: 'Not authenticated'
        },
        { status: 401 }
      );
    }

    console.log('[/api/auth/me] Session userId:', session.userId);

    // Fetch fresh user data from database
    const user = await users.findById(session.userId);
    
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      );
    }

    // Fetch user details (name, photo, etc.)
    const details = await userDetails.findByUserId(session.userId);

    // Return user data (excluding password) combined with details
    const { password: _, ...userWithoutPassword } = user;
    
    // Construct full name from user details
    const name = details?.first_name && details?.last_name 
      ? `${details.first_name} ${details.last_name}`
      : details?.first_name || details?.last_name || user.username || user.email;
    
    const photo = details?.profile_picture_url || null;

    return NextResponse.json(
      {
        success: true,
        user: {
          ...userWithoutPassword,
          name,
          photo,
          auth_provider: user.connector_id ? 'SSO' : 'email'
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[GET /api/auth/me] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred fetching user data',
        message: error.message
      },
      { status: 500 }
    );
  }
}
