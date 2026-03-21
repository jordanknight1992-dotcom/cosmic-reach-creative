/**
 * GA4 Data API v1 — server-side, using the same OAuth2 refresh token
 * as Google Calendar (no service account key needed).
 *
 * Required Vercel env vars:
 *   GA4_PROPERTY_ID        — numeric property ID (Admin → Property Settings)
 *   GOOGLE_CLIENT_ID       — OAuth2 client ID (already set for Calendar)
 *   GOOGLE_CLIENT_SECRET   — OAuth2 client secret (already set for Calendar)
 *   GOOGLE_REFRESH_TOKEN   — OAuth2 refresh token (already set for Calendar)
 *
 * The refresh token must have been generated with the scope:
 *   https://www.googleapis.com/auth/analytics.readonly
 *
 * If you need to regenerate, visit /api/auth/google and include the
 * analytics.readonly scope in the consent flow.
 *
 * When GA4_PROPERTY_ID is missing, returns null and the admin dashboard
 * renders a "Connect GA4" setup card instead.
 */

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

/* ─── OAuth2 token exchange ─── */

async function getAccessToken(): Promise<string | null> {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "unknown");
    console.error("GA4 OAuth token refresh failed:", err);
    return null;
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

/* ─── Public function ─── */

export async function getGA4Data(): Promise<GA4Metrics | null> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) return null;

  try {
    const token = await getAccessToken();
    if (!token) return null;

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

    if (!sessionsRes.ok || !pagesRes.ok) {
      const errText = !sessionsRes.ok
        ? await sessionsRes.text().catch(() => "")
        : await pagesRes.text().catch(() => "");
      console.error("GA4 Data API error:", errText);
      return null;
    }

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
  } catch (err) {
    console.error("GA4 data fetch error:", err instanceof Error ? err.message : err);
    return null;
  }
}
