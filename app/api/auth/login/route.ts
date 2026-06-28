/**
 * Login API Route
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { users, auditLogs } from '@/lib/db/queries';
import bcrypt from 'bcryptjs';
import { createSession, getSessionCookieOptions, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required'
        },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await users.findByEmail(email.toLowerCase().trim());

    if (!user) {
      // Log failed login attempt
      await auditLogs.log({
        action: 'login_failed',
        module: 'auth',
        audit_data: {
          email,
          reason: 'User not found'
        },
        ip_address: request.headers.get('x-forwarded-for') || undefined,
        user_agent: request.headers.get('user-agent') || undefined
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password. Please check your credentials and try again.'
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Log failed login attempt
      await auditLogs.log({
        user_id: user.userid,
        action: 'login_failed',
        module: 'auth',
        audit_data: {
          email,
          reason: 'Invalid password'
        },
        ip_address: request.headers.get('x-forwarded-for') || undefined,
        user_agent: request.headers.get('user-agent') || undefined
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password. Please check your credentials and try again.'
        },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await users.updateLastLogin(user.userid);

    // Log successful login
    await auditLogs.log({
      user_id: user.userid,
      action: 'login',
      module: 'auth',
      audit_data: {
        email,
        remember_me: rememberMe
      },
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined
    });

    // Create session token
    const sessionToken = createSession({
      userId: user.userid,
      email: user.email,
      name: user.name,
      photo: user.photo || undefined,
      authProvider: user.auth_provider || 'email'
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        redirectUrl: '/stackwise-dashboard'
      },
      { status: 200 }
    );

    // Set session cookie
    response.cookies.set(
      SESSION_COOKIE_NAME,
      sessionToken,
      getSessionCookieOptions(rememberMe)
    );

    return response;

  } catch (error: any) {
    console.error('[POST /api/auth/login] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during login. Please try again.',
        message: error.message
      },
      { status: 500 }
    );
  }
}
