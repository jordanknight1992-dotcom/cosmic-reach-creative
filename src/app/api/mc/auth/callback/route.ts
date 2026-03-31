import { validateSession } from "@/lib/mc-auth";
import { getUserTenants } from "@/lib/mc-db";

export const dynamic = "force-dynamic";

/**
 * GET /api/mc/auth/callback?session_id=xxx
 *
 * Returns a small HTML page that sets the cookie and then navigates.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return Response.redirect(new URL("/mission-control/login?error=missing_session", request.url).toString());
  }

  // Validate the session is real before setting the cookie
  let session;
  let validationError = "";
  try {
    session = await validateSession(sessionId);
  } catch (err) {
    validationError = String(err);
  }

  if (!session) {
    // Try to look up the raw session to diagnose why validation failed
    let diagnostic = "";
    try {
      const { getSession: getRawSession } = await import("@/lib/mc-db");
      const rawSession = await getRawSession(sessionId);
      if (rawSession) {
        diagnostic = `raw_session_found=true&user_id=${rawSession.user_id}&expires=${rawSession.expires_at}`;
      } else {
        diagnostic = "raw_session_found=false";
      }
    } catch (e) {
      diagnostic = `diagnostic_error=${encodeURIComponent(String(e))}`;
    }
    return Response.redirect(
      new URL(`/mission-control/login?error=invalid_session&${diagnostic}&validation_error=${encodeURIComponent(validationError)}&sid_prefix=${sessionId.slice(0, 8)}`, request.url).toString()
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

  // Build Set-Cookie header
  const maxAge = 30 * 24 * 60 * 60;
  const cookieParts = [
    `mc_session=${sessionId}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=${maxAge}`,
  ];

  // Return an HTML page — browser stores cookie from 200 response, then navigates
  const html = `<!DOCTYPE html>
<html><head>
<meta http-equiv="refresh" content="0;url=${redirect}">
<script>window.location.href="${redirect}";</script>
</head><body></body></html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
      "Set-Cookie": cookieParts.join("; "),
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
