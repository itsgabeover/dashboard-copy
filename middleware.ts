import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Only handle /upload paths
  if (pathname === '/upload') {
    // Redirect base upload path to pre-payment
    return NextResponse.redirect(new URL('/pre-payment-info', request.url))
  }
  
  // For /upload/[token] paths, validate the token
  if (pathname.startsWith('/upload/')) {
    const token = pathname.split('/').pop()
    // Validate token format
    if (!token || !token.match(/^m[0-9a-z]+_[a-f0-9]+$/)) {
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/upload', '/upload/:path*']
}
