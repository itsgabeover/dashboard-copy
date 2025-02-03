import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth/config"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Log the current domain and path for debugging
  console.log(`Processing request for ${request.nextUrl.hostname}${pathname}`)

  // First, exclude API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // Login is the only public path
  const publicPaths = ["/login"]

  // Get auth token and verify authentication status
  const authToken = request.cookies.get("auth-token")
  const isAuthenticated = authToken && verifyToken(authToken.value)

  console.log(`Auth status: ${isAuthenticated ? 'authenticated' : 'not authenticated'}`)

  // Handle login page
  if (pathname === "/login") {
    if (isAuthenticated) {
      console.log("Redirecting authenticated user from login to portal")
      return NextResponse.redirect(new URL("/portal", request.url))
    }
    return NextResponse.next()
  }

  // Everything else requires authentication
  if (!isAuthenticated) {
    console.log("Unauthenticated user, redirecting to login")
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Explicitly handle /portal and /processing routes
  if (pathname === "/portal" || pathname === "/processing") {
    console.log(`Allowing access to ${pathname}`)
    return NextResponse.next()
  }

  // Handle upload flow
  if (pathname.startsWith("/upload")) {
    // Allow access to success and processing pages
    if (pathname === "/upload/success" || pathname === "/processing") {
      return NextResponse.next()
    }

    // Base upload path
    if (pathname === "/upload") {
      const mockToken = `pi_${Date.now()}_mock`
      console.log(`Redirecting from /upload to /upload/${mockToken}`)
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url))
    }

    // Token paths
    if (pathname.startsWith("/upload/")) {
      const token = pathname.split("/").pop()
      if (token && token.startsWith("pi_") && token.includes("_")) {
        return NextResponse.next()
      }

      const mockToken = `pi_${Date.now()}_mock`
      console.log(`Invalid token, redirecting to /upload/${mockToken}`)
      return NextResponse.redirect(new URL(`/upload/${mockToken}`, request.url))
    }
  }

  // Allow access to all other routes for authenticated users
  console.log(`Allowing access to ${pathname} for authenticated user`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/upload",
    "/upload/:path*",
    "/processing",
    "/portal"
  ],
}
