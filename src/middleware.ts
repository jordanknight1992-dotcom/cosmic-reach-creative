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

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  /* Always allow login + setup endpoints through */
  const publicPaths = ["/admin/login", "/api/admin/login", "/api/admin/setup"];
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;
  const secret = process.env.SESSION_SECRET;

  if (!secret || !session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  /* Session token = sha256(SESSION_SECRET) */
  const expected = await sha256(secret);
  if (session !== expected) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
