import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/webmasters.readonly",
].join(" ");

const REDIRECT_URI_PATH = "/api/mc/oauth-refresh";

function getRedirectUri() {
  const base = process.env.NEXTAUTH_URL || "https://www.cosmicreachcreative.com";
  return `${base}${REDIRECT_URI_PATH}`;
}

// Step 1: GET without ?code → redirect to Google consent
// Step 2: GET with ?code → exchange for tokens and show refresh_token
export async function GET(req: NextRequest) {
  // Auth check - super admin only
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(getSessionCookieName())?.value;
  if (!sessionId) {
    return new Response("Unauthorized - login to Mission Control first", { status: 401 });
  }
  const session = await validateSession(sessionId);
  if (!session || session.user.email !== "jordan@cosmicreachcreative.com") {
    return new Response("Unauthorized - super admin only", { status: 401 });
  }

  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.json({ error, description: req.nextUrl.searchParams.get("error_description") });
  }

  if (!code) {
    // Step 1: Redirect to Google consent screen
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return NextResponse.json({ error: "GOOGLE_CLIENT_ID not set" }, { status: 500 });

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", getRedirectUri());
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", SCOPES);
    authUrl.searchParams.set("access_type", "offline");
    authUrl.searchParams.set("prompt", "consent");

    return NextResponse.redirect(authUrl.toString());
  }

  // Step 2: Exchange code for tokens
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.refresh_token) {
    const masked = tokenData.refresh_token.substring(0, 8) + "..." + tokenData.refresh_token.slice(-8);
    // Show the token in a safe page (super admin only, already verified)
    return new Response(
      `<!DOCTYPE html>
<html><head><title>OAuth Token</title><style>
  body { background: #0B1120; color: #E8DFCF; font-family: monospace; padding: 40px; }
  .token { background: #111827; border: 1px solid rgba(212,165,116,0.3); border-radius: 8px; padding: 16px; word-break: break-all; margin: 16px 0; position: relative; }
  .token.masked { filter: blur(4px); user-select: none; }
  h1 { color: #D4A574; }
  .label { color: rgba(232,223,207,0.5); font-size: 13px; margin-top: 20px; }
  .warn { color: #ef4444; margin-top: 24px; }
  button { background: #D4A574; color: #0B1120; border: none; border-radius: 6px; padding: 8px 16px; cursor: pointer; font-weight: 600; font-size: 13px; margin-top: 8px; }
  button:hover { opacity: 0.9; }
</style></head><body>
  <h1>New Refresh Token Generated</h1>
  <p>Scopes: analytics.readonly, calendar, webmasters.readonly</p>
  <div class="label">GOOGLE_REFRESH_TOKEN (copy this to Vercel env vars):</div>
  <div class="label">Preview: ${masked}</div>
  <div class="token masked" id="rt">${tokenData.refresh_token}</div>
  <button onclick="navigator.clipboard.writeText(document.getElementById('rt').textContent);this.textContent='Copied!'">Copy Token</button>
  <button onclick="document.getElementById('rt').classList.toggle('masked')">Reveal / Hide</button>
  <div class="label">Scopes granted:</div>
  <div class="token">${tokenData.scope || "unknown"}</div>
  <p class="warn">Copy the token, then close this page. Do not share or bookmark it.</p>
</body></html>`,
      { headers: { "Content-Type": "text/html", "Cache-Control": "no-store, no-cache, must-revalidate", "Pragma": "no-cache" } }
    );
  }

  return NextResponse.json({ error: "No refresh_token returned", tokenData });
}
