/**
 * Sign Up API Route
 * POST /api/auth/signup
 */

import { NextRequest, NextResponse } from 'next/server';
import { users, userDetails, auditLogs } from '@/lib/db/queries';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required'
        },
        { status: 400 }
      );
    }

    // Validate password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Passwords do not match'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid email address'
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must be at least 8 characters'
        },
        { status: 400 }
      );
    }

    if (!/(?=.*[a-z])/.test(password) || !/(?=.*[A-Z])/.test(password) || !/(?=.*\d)/.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must contain uppercase, lowercase, and number'
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await users.findByEmail(email.toLowerCase().trim());

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email already exists. Please sign in instead.'
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await users.create({
      username: `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      email: email.toLowerCase().trim(),
      password_hash: hashedPassword,
      user_type: 'standard',
      email_verified: false
    });

    // Create user details
    await userDetails.create({
      userid: newUser.userid,
      first_name: firstName.trim(),
      last_name: lastName.trim()
    });

    // Log signup activity
    await auditLogs.log({
      user_id: newUser.userid,
      action: 'signup',
      module: 'auth',
      audit_data: {
        email: newUser.email,
        username: newUser.username
      },
      ip_address: request.headers.get('x-forwarded-for') || undefined,
      user_agent: request.headers.get('user-agent') || undefined
    });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('[POST /api/auth/signup] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during sign up. Please try again.',
        message: error.message
      },
      { status: 500 }
    );
  }
}
