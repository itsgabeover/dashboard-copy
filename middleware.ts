import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Handle both /upload and /upload/[token]
  if (pathname === '/upload' || pathname.startsWith('/upload/')) {
    const token = request.nextUrl.searchParams.get('token') || 
                 pathname.split('/').pop() // Get token from path if it exists
    
    if (!token) {
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
    if (!token.match(/^[A-Za-z0-9-_]+$/)) {
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/upload', '/upload/:path*']  // Match both /upload and /upload/[token]
}
