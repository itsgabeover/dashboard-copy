export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  console.log(`DEBUG: Accessing ${pathname}`) // Add detailed logging
  
  // Only handle authentication, no redirects
  if (pathname === "/portal") {
    const authToken = request.cookies.get("auth-token")
    const isAuthenticated = authToken && verifyToken(authToken.value)
    return isAuthenticated ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url))
  }
  
  return NextResponse.next()
}
