import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  if (pathname === '/upload') {
    // Base /upload path - check for token in query
    const token = request.nextUrl.searchParams.get('token')
    
    if (!token) {
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
    if (!token.match(/^[A-Za-z0-9-_]+$/)) {
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
    
    // If valid token in query, redirect to token path
    return NextResponse.redirect(new URL(`/upload/${token}`, request.url))
  }
  
  // For /upload/[token] paths, just validate the token
  if (pathname.startsWith('/upload/')) {
    const token = pathname.split('/').pop()
    if (!token || !token.match(/^[A-Za-z0-9-_]+$/)) {
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/upload', '/upload/:path*']
}
