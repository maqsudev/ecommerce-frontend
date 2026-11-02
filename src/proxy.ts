import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies (if stored)
  const token = request.cookies.get("ecommerce_access_token")?.value;

  // Protected customer account routes
  const isAccountRoute = pathname.startsWith("/account");
  // Protected backoffice admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  if ((isAccountRoute || isAdminRoute) && !token) {
    // Handled client-side gracefully by auth guard components
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
  ],
};
