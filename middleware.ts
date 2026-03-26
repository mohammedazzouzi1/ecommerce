import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected admin routes
const PROTECTED_ROUTES = [
  "/dashboard-azzouzi-secure",
  "/dashboard-azzouzi-secure/",
  "/admin",
];

// Public routes that should not be accessed when logged in
const AUTH_ROUTES = [
  "/dashboard-azzouzi-secure/login",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const proto = request.headers.get("x-forwarded-proto");

  if (process.env.NODE_ENV === "production" && proto === "http") {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl);
  }

  if (pathname.startsWith("/admin")) {
    let target = "/dashboard-azzouzi-secure";
    if (pathname === "/admin/new") target = "/dashboard-azzouzi-secure/products/new";
    if (pathname.startsWith("/admin/edit/")) {
      const id = pathname.split("/admin/edit/")[1];
      target = `/dashboard-azzouzi-secure/products/${id}/edit`;
    }
    return NextResponse.redirect(new URL(target, request.url));
  }
  
  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route)
  );
  
  // Get token from cookie
  const token = request.cookies.get("admin_token")?.value;
  const hasToken = Boolean(token);
  
  // Redirect to login if accessing protected route without valid token
  if (isProtectedRoute && !isAuthRoute && !hasToken) {
    const loginUrl = new URL("/dashboard-azzouzi-secure/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect to dashboard if accessing auth route with valid token
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL("/dashboard-azzouzi-secure", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard-azzouzi-secure/:path*",
    "/admin/:path*",
  ],
};
