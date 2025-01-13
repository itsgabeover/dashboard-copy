import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // For base /upload path, generate a mock token and redirect
  if (pathname === '/upload') {
    console.log('Base /upload path accessed')
    const mockToken = `pi_${Date.now()}_mock`
    return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url))
  }
  
  // For /upload/[token] paths
  if (pathname.startsWith('/upload/')) {
    const token = pathname.split('/').pop()
    console.log('Token path accessed:', token)
    
    // Allow any token format since we're bypassing payment
    if (!token) {
      console.log('No token provided')
      const mockToken = `pi_${Date.now()}_mock`
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url))
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
