import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware to redirect bare domain → www.
 *
 * Without this, Cloudflare's 307 redirect from cosmicreachcreative.com to
 * www.cosmicreachcreative.com happens per-request. Font files loaded via
 * <link rel="preload" crossorigin=""> fail because the 307 response lacks
 * CORS headers, and browsers refuse to follow the redirect for CORS requests.
 *
 * By redirecting at the edge, the browser lands on www before any assets load,
 * so all font requests go directly to www with proper CORS headers.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect bare domain to www
  if (host === "cosmicreachcreative.com") {
    const url = request.nextUrl.clone();
    url.host = "www.cosmicreachcreative.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and images
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
