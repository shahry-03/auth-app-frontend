import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that REQUIRE authentication
const protectedRoutes = ["/dashboard", "/profile"];

// Routes that should NEVER be blocked (login, register, playground, etc.)
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/contact-support",
  "/playground",
  "/oauth",
];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Try multiple cookie names (SDK may use any of these)
  const accessToken =
    request.cookies.get("accessToken")?.value ??
    request.cookies.get("access_token")?.value ??
    request.cookies.get("token")?.value ??
    request.cookies.get("jwt")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Never block public routes — this prevents the redirect loop
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Only redirect protected routes if NO token at all
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};