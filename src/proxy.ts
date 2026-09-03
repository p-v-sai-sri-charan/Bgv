import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserRole } from "@/generated/prisma/client";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

const ROLE_PREFIX: Record<UserRole, string> = {
  SUPER_ADMIN: "/admin",
  EMPLOYER_ADMIN: "/employer",
  EMPLOYEE: "/employee",
  AGENT: "/agent",
};

const PROTECTED_PREFIXES = ["/admin", "/employer", "/employee", "/agent"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const allowedPrefix = ROLE_PREFIX[session.role];
    if (!pathname.startsWith(allowedPrefix)) {
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  }

  if (pathname.startsWith("/login") && session) {
    return NextResponse.redirect(
      new URL(ROLE_PREFIX[session.role], request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/employer/:path*",
    "/employee/:path*",
    "/agent/:path*",
    "/login/:path*",
    "/login",
  ],
};
