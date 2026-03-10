import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedPaths = ["/proyectos", "/configuracion"];

// Routes only for unauthenticated users
const authPaths = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("__session");

  // Redirect unauthenticated users away from protected routes
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const isAuthPage = authPaths.some((path) => pathname === path);

  if (isAuthPage && hasSession) {
    const projectsUrl = new URL("/proyectos", request.url);
    return NextResponse.redirect(projectsUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/proyectos/:path*", "/configuracion/:path*", "/login", "/register"],
};
