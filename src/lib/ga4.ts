/**
 * GA4 Data API v1 — server-side only, zero extra npm packages.
 *
 * Required Vercel env vars:
 *   GA4_PROPERTY_ID      — numeric property ID (Admin → Property Settings)
 *   GOOGLE_CLIENT_EMAIL  — service account email from GCP JSON key
 *   GOOGLE_PRIVATE_KEY   — PEM private key (GCP stores \\n — we normalise it)
 *
 * When any var is missing the function returns null and the admin dashboard
 * renders a "Connect GA4" setup card instead.
 */

import crypto from "crypto";

export interface GA4DailyPoint {
  [key: string]: unknown;
  date: string;   /* YYYYMMDD from GA4, e.g. "20250310" */
  sessions: number;
}

export interface GA4TopPage {
  page: string;
  views: number;
}

export interface GA4Metrics {
  sessions30d: number;
  pageViews30d: number;
  topPages: GA4TopPage[];
  dailySessions: GA4DailyPoint[];
}

/* ─── Internal helpers ─── */

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf) : buf;
  return b.toString("base64url");
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header  = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss:   email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud:   "https://oauth2.googleapis.com/token",
      iat:   now,
      exp:   now + 3600,
    })
  );

  const signInput = `${header}.${payload}`;
  const signer    = crypto.createSign("RSA-SHA256");
  signer.update(signInput);
  const signature = signer.sign(privateKey, "base64url");

  const jwt = `${signInput}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "unknown");
    throw new Error(`GA4 token exchange failed: ${err}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

/* ─── Public function ─── */

export async function getGA4Data(): Promise<GA4Metrics | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  const email      = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey     = process.env.GOOGLE_PRIVATE_KEY;

  if (!propertyId || !email || !rawKey) return null;

  /* GCP JSON keys store the PEM with literal \\n — normalise */
  const privateKey = rawKey.replace(/\\n/g, "\n");

  try {
    const token   = await getAccessToken(email, privateKey);
    const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    const headers = {
      Authorization:  `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const [sessionsRes, pagesRes] = await Promise.all([
      /* Daily sessions + page views */
      fetch(baseUrl, {
        method:  "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          metrics:    [{ name: "sessions" }, { name: "screenPageViews" }],
          dimensions: [{ name: "date" }],
          orderBys:   [{ dimension: { dimensionName: "date" } }],
        }),
      }),
      /* Top pages */
      fetch(baseUrl, {
        method:  "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
          metrics:    [{ name: "screenPageViews" }],
          dimensions: [{ name: "pagePath" }],
          orderBys:   [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit:      10,
        }),
      }),
    ]);

    if (!sessionsRes.ok || !pagesRes.ok) return null;

    const sessionsData = (await sessionsRes.json()) as {
      rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
    };
    const pagesData = (await pagesRes.json()) as {
      rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
    };

    let totalSessions  = 0;
    let totalPageViews = 0;
    const dailySessions: GA4DailyPoint[] = [];

    for (const row of sessionsData.rows ?? []) {
      const date     = row.dimensionValues[0].value;
      const sessions = parseInt(row.metricValues[0].value, 10);
      const views    = parseInt(row.metricValues[1].value, 10);
      totalSessions  += sessions;
      totalPageViews += views;
      dailySessions.push({ date, sessions });
    }

    const topPages: GA4TopPage[] = (pagesData.rows ?? []).map((row) => ({
      page:  row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value, 10),
    }));

    return { sessions30d: totalSessions, pageViews30d: totalPageViews, topPages, dailySessions };
  } catch {
    return null;
  }
}
