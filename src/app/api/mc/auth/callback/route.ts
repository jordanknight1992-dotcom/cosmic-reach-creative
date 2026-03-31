import { NextResponse } from "next/server";
import { getSessionCookieName, getSessionCookieOptions, validateSession } from "@/lib/mc-auth";
import { getUserTenants } from "@/lib/mc-db";

/**
 * GET /api/mc/auth/callback?session_id=xxx
 *
 * Sets the session cookie via a full-page redirect response.
 * This avoids the browser's unreliable handling of Set-Cookie
 * headers from fetch() JSON responses.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(
      new URL("/mission-control/login?error=missing_session", request.url)
    );
  }

  // Validate the session is real before setting the cookie
  const session = await validateSession(sessionId);
  if (!session) {
    return NextResponse.redirect(
      new URL("/mission-control/login?error=invalid_session", request.url)
    );
  }

  // Determine redirect destination
  const tenants = await getUserTenants(session.user.id);
  let redirect = "/mission-control/select-workspace";
  if (tenants.length === 1) {
    redirect = `/mission-control/${tenants[0].slug}`;
  } else if (tenants.length === 0 && session.user.is_super_admin) {
    redirect = "/mission-control/super";
  }

  // Redirect response — browser will store the cookie from this response
  const response = NextResponse.redirect(new URL(redirect, request.url));

  const cookieName = getSessionCookieName();
  const cookieOpts = getSessionCookieOptions();
  response.cookies.set(cookieName, sessionId, cookieOpts);

  return response;
}
