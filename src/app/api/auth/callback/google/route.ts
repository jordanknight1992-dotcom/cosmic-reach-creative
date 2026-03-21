import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * GET /api/auth/callback/google
 *
 * Handles the OAuth callback from Google. Displays the refresh token
 * so you can copy it into your .env.local file.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const { tokens } = await oauth2.getToken(code);

  return NextResponse.json({
    message: "Add this refresh token to your .env.local as GOOGLE_REFRESH_TOKEN",
    refresh_token: tokens.refresh_token,
    note: "This page is only used during initial setup. Once you have the token, this endpoint is no longer needed.",
  });
}
