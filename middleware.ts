import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/upload') {
    const token = request.nextUrl.searchParams.get('token')
    
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
  matcher: '/upload'
} 