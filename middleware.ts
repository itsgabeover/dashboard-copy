import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log(`DEBUG: Accessing ${pathname}`) // Add detailed logging
  
  // Only handle authentication
  if (pathname === "/portal") {
    console.log("DEBUG: Portal route hit in middleware")
    const authToken = request.cookies.get("auth-token")
    if (!authToken) {
      console.log("DEBUG: No auth token found")
      return NextResponse.redirect(new URL("/login", request.url))
    }
    console.log("DEBUG: Auth token found, allowing access")
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/portal"]
}
