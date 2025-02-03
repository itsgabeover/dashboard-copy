import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth/config"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Log the current domain and path for debugging
  console.log(`Processing request for ${request.nextUrl.hostname}${pathname}`)

  // First, exclude API routes and static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/", "/about", "/resources"]
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Get auth token and verify authentication status
  const authToken = request.cookies.get("auth-token")
  const isAuthenticated = authToken && verifyToken(authToken.value)

  console.log(`Auth status: ${isAuthenticated ? "authenticated" : "not authenticated"}`)

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    console.log("Unauthenticated user, redirecting to login")
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow access to authenticated routes
  if (pathname.startsWith("/portal2")) {
    return NextResponse.next()
  }

  // Redirect authenticated users to portal2 if they try to access login
  if (pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/portal2", request.url))
  }

  // For any other routes, allow access for authenticated users
  console.log(`Allowing access to ${pathname} for authenticated user`)
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

