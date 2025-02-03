// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // First, exclude API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Login is the only public path
  const publicPaths = ['/login'];
  
  // Get auth token and verify authentication status
  const authToken = request.cookies.get('auth-token');
  const isAuthenticated = authToken && verifyToken(authToken.value);
  
  // Handle login page
  if (pathname === '/login') {
    if (isAuthenticated) {
      // If already logged in, redirect to portal
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    return NextResponse.next();
  }

  // Everything else requires authentication
  if (!isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Special handling for upload paths with mock tokens
  if (pathname.startsWith('/upload')) {
    // Allow processing page access
    if (pathname === '/processing') {
      return NextResponse.next();
    }
    
    // Base upload path handling
    if (pathname === '/upload') {
      const mockToken = `pi_${Date.now()}_mock`;
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url));
    }
    
    // Token path handling
    if (pathname.startsWith('/upload/')) {
      const token = pathname.split('/').pop();
      if (token && (token.startsWith('pi_') && token.includes('_'))) {
        return NextResponse.next();
      }
      
      const mockToken = `pi_${Date.now()}_mock`;
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url));
    }
  }

  // Allow processing and portal access for authenticated users
  if (pathname === '/processing' || pathname === '/portal') {
    return NextResponse.next();
  }

  // Allow authenticated users to access all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/upload',
    '/upload/:path*',
    '/processing',
    '/portal'
  ]
};
