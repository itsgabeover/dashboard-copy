import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Only handle /upload paths
  if (pathname === '/upload') {
    console.log('Base /upload path accessed')
    return NextResponse.redirect(new URL('/pre-payment-info', request.url))
  }
  
  // For /upload/[token] paths
  if (pathname.startsWith('/upload/')) {
    const token = pathname.split('/').pop()
    console.log('Token path accessed:', token)
    
    // Validate token exists and has basic format
    if (!token || !token.startsWith('m')) {
      console.log('Invalid token:', token)
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
    
    // Valid token, proceed
    console.log('Valid token, proceeding')
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/upload', '/upload/:path*']
}
