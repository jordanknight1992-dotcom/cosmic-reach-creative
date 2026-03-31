import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ── Legacy /admin routes (still works for backward compat) ── */
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const publicPaths = ["/admin/login", "/api/admin/login", "/api/admin/setup"];
    if (publicPaths.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }

    const session = request.cookies.get("admin_session")?.value;
    const secret = process.env.SESSION_SECRET;

    if (!secret || !session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const expected = await sha256(secret);
    if (session !== expected) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  /* ── Mission Control auth routes (public) ── */
  if (pathname === "/mission-control") {
    return NextResponse.next();
  }
  const mcPublicPaths = [
    "/mission-control/login",
    "/mission-control/register",
    "/mission-control/reset-password",
    "/mission-control/demo",
    "/api/mc/auth",
    "/api/mc/auth/callback",
    "/api/mc/debug-session",
    "/api/mc/test-emails",
  ];
  if (mcPublicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  /* ── Mission Control protected routes ── */
  if (
    pathname.startsWith("/mission-control") ||
    pathname.startsWith("/api/mc")
  ) {
    const sessionId = request.cookies.get("mc_session")?.value;

    if (!sessionId) {
      if (pathname.startsWith("/api/mc")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(
        new URL("/mission-control/login", request.url)
      );
    }

    // Session validation happens in the API/page layer (DB access not available in edge middleware)
    // We just check the cookie exists here — full validation in server components / route handlers
    const response = NextResponse.next();

    // Pass session ID in header for server components
    response.headers.set("x-mc-session", sessionId);

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/mission-control/:path*",
    "/api/mc/:path*",
  ],
};
