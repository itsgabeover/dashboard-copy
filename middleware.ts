import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log('Middleware checking path:', pathname)
  
  // Handle base /upload path
  if (pathname === '/upload') {
    console.log('Redirecting base upload path to pre-payment')
    return NextResponse.redirect(new URL('/pre-payment-info', request.url))
  }
  
  // For /upload/[token] paths
  if (pathname.startsWith('/upload/')) {
    const token = pathname.split('/').pop()
    console.log('Checking token:', token)
    
    // Simpler token validation - just check if it starts with 'm' and has an underscore
    if (!token || !token.startsWith('m') || !token.includes('_')) {
      console.log('Invalid token format')
      return NextResponse.redirect(new URL('/pre-payment-info', request.url))
    }
    
    console.log('Token validated, proceeding')
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/upload', '/upload/:path*']
}
