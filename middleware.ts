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
  
  // Check if the path is public
  if (publicPaths.includes(pathname)) {
    // Check if user is already authenticated
    const authToken = request.cookies.get('auth-token');
    if (authToken && verifyToken(authToken.value)) {
      // If authenticated, redirect to home
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Handle existing upload logic
  if (pathname === '/upload') {
    console.log('Base /upload path accessed');
    return NextResponse.redirect(new URL('/upload', request.url));
  }
  
  // Handle existing upload/token logic
  if (pathname.startsWith('/upload/')) {
    const token = pathname.split('/').pop();
    console.log('Token path accessed:', token);
    
    if (!token || !token.startsWith('pi_') || !token.includes('_')) {
      console.log('Invalid token:', token);
      return NextResponse.redirect(new URL('/upload', request.url));
    }
    
    console.log('Valid token, proceeding');
    return NextResponse.next();
  }

  // Check authentication for all other routes
  const authToken = request.cookies.get('auth-token');
  
  if (!authToken || !verifyToken(authToken.value)) {
    // Store the current URL to redirect back after login
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
