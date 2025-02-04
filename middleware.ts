// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // First, exclude API routes completely
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Public paths that don't need authentication
  const publicPaths = ['/login'];
  
  // Get auth token and verify authentication status
  const authToken = request.cookies.get('auth-token');
  const isAuthenticated = authToken && verifyToken(authToken.value);
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    if (isAuthenticated) {
      // If authenticated, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Require authentication for all upload-related paths
  if (pathname.startsWith('/upload')) {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Handle base upload path - only for authenticated users
    if (pathname === '/upload') {
      console.log('Base /upload path accessed');
      const mockToken = `pi_${Date.now()}_mock`;
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url));
    }

    // Handle success page - only for authenticated users
    if (pathname === '/upload/success') {
      console.log('Success page accessed');
      return NextResponse.next();
    }

    // Handle token paths - only for authenticated users
    if (pathname.startsWith('/upload/')) {
      const token = pathname.split('/').pop();
      console.log('Token path accessed:', token);
      
      if (token && (token.startsWith('pi_') && token.includes('_'))) {
        console.log('Valid token, proceeding');
        return NextResponse.next();
      }
      
      console.log('Invalid token, redirecting to new mock token');
      const mockToken = `pi_${Date.now()}_mock`;
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url));
    }
  }

  // Check authentication for all other routes
  if (!isAuthenticated) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all routes except public ones and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/upload',
    '/upload/:path*'
  ]
}
