import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Role slugs for mapping URL paths to roles.
 */
const ROLE_SLUGS = [
  "administrator",
  "patron",
  "chairperson",
  "secretary",
  "treasurer",
  "membership-coordinator",
  "public-relations-officer",
  "member",
];

/**
 * Proxy (Next.js 16 replacement for middleware).
 *
 * Guards:
 * 1. `/initialize` — only accessible BEFORE initialization is complete.
 *    If already initialized, redirect to `/login`.
 *
 * 2. `/login` — only accessible AFTER initialization is complete.
 *    If not initialized, redirect to `/initialize`.
 *
 * 3. `/dashboard*` — requires authentication.
 *    If not authenticated, redirect to `/login`.
 *    If accessing a role-specific dashboard that doesn't match their role,
 *    redirect to their own dashboard.
 */

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes through immediately
  if (
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/Images/") ||
    pathname === "/favicon.ico" ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Guard /initialize — only before initialization
  if (pathname === "/initialize") {
    try {
      const initRes = await fetch(
        `${request.nextUrl.origin}/api/auth/check-init`
      );
      const initData = await initRes.json();
      if (initData.isInitialized) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      // Allow through on error
    }
    return NextResponse.next();
  }

  // Guard /login — only after initialization; redirect if already logged in
  if (pathname === "/login") {
    try {
      const initRes = await fetch(
        `${request.nextUrl.origin}/api/auth/check-init`
      );
      const initData = await initRes.json();
      if (!initData.isInitialized) {
        return NextResponse.redirect(new URL("/initialize", request.url));
      }

      // Already authenticated? Skip the login page — go straight to dashboard
      const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: { cookie: request.headers.get("cookie") || "" },
      });
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        const role: string | undefined = sessionData.user?.role;
        if (role) {
          const slug = role.toLowerCase().replace(/_/g, "-");
          return NextResponse.redirect(
            new URL(`/dashboard/${slug}`, request.url)
          );
        }
      }
    } catch {
      // Allow through on error
    }
    return NextResponse.next();
  }

  // Guard /dashboard* — requires authentication + role enforcement
  if (pathname.startsWith("/dashboard")) {
    try {
      const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: { cookie: request.headers.get("cookie") || "" },
      });
      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const sessionData = await sessionRes.json();
      const userRole = sessionData.user?.role as string | undefined;

      if (userRole && pathname !== "/dashboard") {
        for (const slug of ROLE_SLUGS) {
          if (pathname.startsWith(`/dashboard/${slug}`)) {
            const expectedRole = slug
              .toUpperCase()
              .replace(/-/g, "_") as string;

            if (expectedRole !== userRole) {
              const ownSlug = userRole.toLowerCase().replace(/_/g, "-");
              return NextResponse.redirect(
                new URL(`/dashboard/${ownSlug}`, request.url)
              );
            }
            break;
          }
        }
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
