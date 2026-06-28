/**
 * Next.js Middleware for Authentication
 * Protects dashboard routes and validates session
 * 
 * Note: Simple cookie check - detailed JWT validation happens in API routes
 */

import { NextRequest, NextResponse } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/stackwise-dashboard',
  '/pulse-hub-dashboard',
  '/performance-audit',
  '/audit-results',
  '/abm-command',
  '/integrations'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Check for session cookie (basic check, full JWT validation in API)
    const sessionCookie = request.cookies.get('stackwise_session');
    
    if (!sessionCookie || !sessionCookie.value) {
      // No session cookie, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Basic format check (JWT has 3 parts separated by dots)
    const tokenParts = sessionCookie.value.split('.');
    if (tokenParts.length !== 3) {
      // Invalid token format
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('returnUrl', pathname);
      loginUrl.searchParams.set('error', 'invalid_session');
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/stackwise-dashboard/:path*',
    '/pulse-hub-dashboard/:path*',
    '/performance-audit/:path*',
    '/audit-results/:path*',
    '/abm-command/:path*',
    '/integrations/:path*'
  ]
};
