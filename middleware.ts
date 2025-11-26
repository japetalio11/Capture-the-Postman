import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("auth_token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/");

  // If the user is not authenticated and is not on the auth page, redirect to /
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the user is authenticated and is on the auth page, redirect to /
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/test", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - color.png (public asset)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|color.png).*)",
  ],
};
