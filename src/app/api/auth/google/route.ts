import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/**
 * GET /api/auth/google
 *
 * One-time OAuth consent flow to get a refresh token for
 * Google Calendar + GA4 Analytics.
 *
 * After authorizing, copy the refresh token from the callback response
 * and add it to your .env.local as GOOGLE_REFRESH_TOKEN.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });

  return NextResponse.redirect(authUrl);
}
