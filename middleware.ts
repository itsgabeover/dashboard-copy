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

  // Handle upload flow
  if (pathname.startsWith('/upload')) {
    // Allow access to success and processing pages
    if (pathname === '/upload/success' || pathname === '/processing') {
      return NextResponse.next();
    }
    
    // Base upload path
    if (pathname === '/upload') {
      const mockToken = `pi_${Date.now()}_mock`;
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url));
    }
    
    // Token paths
    if (pathname.startsWith('/upload/')) {
      const token = pathname.split('/').pop();
      if (token && token.startsWith('pi_') && token.includes('_')) {
        return NextResponse.next();
      }
      
      const mockToken = `pi_${Date.now()}_mock`;
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url));
    }
  }

  // Allow access to processing and portal for authenticated users
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
