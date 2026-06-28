/**
 * Session Management Utilities
 * Handles JWT tokens and session cookies
 */

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.SESSION_SECRET || 'stackwise_sso_secret_key_2025_secure_random_32chars';
const SESSION_COOKIE_NAME = 'stackwise_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionData {
  userId: number;
  email: string;
  name: string;
  photo?: string;
  authProvider?: string;
  iat?: number;
  exp?: number;
}

/**
 * Create a new session token
 */
export function createSession(data: Omit<SessionData, 'iat' | 'exp'>): string {
  return jwt.sign(data, JWT_SECRET, {
    expiresIn: '7d'
  });
}

/**
 * Verify and decode session token
 */
export function verifySession(token: string): SessionData | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionData;
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
}

/**
 * Get current session from cookies (server-side only)
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie) {
    return null;
  }
  
  return verifySession(sessionCookie.value);
}

/**
 * Set session cookie options
 */
export function getSessionCookieOptions(rememberMe: boolean = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: rememberMe ? SESSION_DURATION / 1000 : undefined, // Convert to seconds
    path: '/'
  };
}

export { SESSION_COOKIE_NAME };
