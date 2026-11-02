import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies (if stored) or guest session
  const token = request.cookies.get("ecommerce_access_token")?.value;

  // Protected customer account routes
  const isAccountRoute = pathname.startsWith("/account");
  // Protected backoffice admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isAccountRoute || isAdminRoute) && !token) {
    // If not authenticated via cookie, check if running in browser client (Zustand client guard also handles this)
    // For SSR protection:
    // const loginUrl = new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url);
    // return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
  ],
};
