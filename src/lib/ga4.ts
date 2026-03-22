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
 */

export interface GA4DailyPoint {
  [key: string]: unknown;
  date: string;   /* YYYYMMDD from GA4, e.g. "20250310" */
  sessions: number;
  pageViews: number;
  bounceRate: number;     /* 0-100 */
  avgDuration: number;    /* seconds */
}

export interface GA4TopPage {
  page: string;
  views: number;
  sessions: number;
  bounceRate: number;      /* 0-100 */
  avgDuration: number;     /* seconds */
  engagementRate: number;  /* 0-100 */
}

/** Period comparison data for KPI cards */
export interface GA4PeriodComparison {
  current: number;
  previous: number;
  changePercent: number;   /* positive = up, negative = down */
}

export interface GA4Metrics {
  sessions30d: number;
  pageViews30d: number;
  bounceRate30d: number;        /* 0-100 */
  avgSessionDuration30d: number; /* seconds */
  newUsers30d: number;
  returningUsers30d: number;
  engagementRate30d: number;     /* 0-100 */
  topPages: GA4TopPage[];
  dailySessions: GA4DailyPoint[];
  /** Previous period daily data for overlay chart */
  previousDailySessions: GA4DailyPoint[];
  /** Top traffic sources */
  topSources: { source: string; sessions: number; percentage: number }[];
  /** Period-over-period comparison for each KPI */
  comparison: {
    sessions: GA4PeriodComparison;
    pageViews: GA4PeriodComparison;
    bounceRate: GA4PeriodComparison;
    avgDuration: GA4PeriodComparison;
    engagement: GA4PeriodComparison;
    newUsers: GA4PeriodComparison;
  };
  /** Traffic source breakdown over time (for multi-line chart) */
  sourceTimeline: { date: string; sources: Record<string, number> }[];
}

/* ─── OAuth2 token exchange ─── */

export interface GA4Credentials {
  propertyId: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
}

async function getAccessToken(creds?: Partial<GA4Credentials>): Promise<string | null> {
  const clientId     = creds?.clientId || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = creds?.clientSecret || process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = creds?.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;

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

export async function getGA4Data(creds?: GA4Credentials): Promise<GA4Metrics | null> {
  const propertyId = creds?.propertyId || process.env.GA4_PROPERTY_ID;
  if (!propertyId) return null;

  try {
    const token = await getAccessToken(creds);
    if (!token) return null;

    const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    const headers = {
      Authorization:  `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // Two date ranges: current 30d + previous 30d (for comparison)
    const dateRanges = [
      { startDate: "30daysAgo", endDate: "today" },
      { startDate: "60daysAgo", endDate: "31daysAgo" },
    ];

    const [dailyRes, prevDailyRes, pagesRes, sourcesRes, sourceTimelineRes] = await Promise.all([
      /* Daily metrics — current period */
      fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [dateRanges[0]],
          metrics: [
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
            { name: "newUsers" },
            { name: "totalUsers" },
            { name: "engagementRate" },
          ],
          dimensions: [{ name: "date" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
      }),
      /* Daily metrics — previous period (for overlay chart) */
      fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [dateRanges[1]],
          metrics: [
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
          ],
          dimensions: [{ name: "date" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
        }),
      }),
      /* Top pages with detailed metrics */
      fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [dateRanges[0]],
          metrics: [
            { name: "screenPageViews" },
            { name: "sessions" },
            { name: "bounceRate" },
            { name: "averageSessionDuration" },
            { name: "engagementRate" },
          ],
          dimensions: [{ name: "pagePath" }],
          orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
          limit: 15,
        }),
      }),
      /* Traffic sources (aggregate) */
      fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [dateRanges[0]],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "sessionSource" }],
          orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
          limit: 10,
        }),
      }),
      /* Traffic sources over time (for multi-line chart) */
      fetch(baseUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({
          dateRanges: [dateRanges[0]],
          metrics: [{ name: "sessions" }],
          dimensions: [{ name: "date" }, { name: "sessionSource" }],
          orderBys: [{ dimension: { dimensionName: "date" } }],
          limit: 500,
        }),
      }),
    ]);

    if (!dailyRes.ok || !pagesRes.ok || !sourcesRes.ok) {
      const failedRes = !dailyRes.ok ? dailyRes : !pagesRes.ok ? pagesRes : sourcesRes;
      const errText = await failedRes.text().catch(() => "");
      console.error("GA4 Data API error:", errText);
      return null;
    }

    type GA4Row = { dimensionValues: { value: string }[]; metricValues: { value: string }[] };
    const dailyData = (await dailyRes.json()) as { rows?: GA4Row[] };
    const prevDailyData = prevDailyRes.ok ? (await prevDailyRes.json()) as { rows?: GA4Row[] } : { rows: [] };
    const pagesData = (await pagesRes.json()) as { rows?: GA4Row[] };
    const sourcesData = (await sourcesRes.json()) as { rows?: GA4Row[] };
    const sourceTimelineData = sourceTimelineRes.ok
      ? (await sourceTimelineRes.json()) as { rows?: GA4Row[] }
      : { rows: [] };

    // Parse daily data (current period)
    let totalSessions = 0;
    let totalPageViews = 0;
    let totalBounceRateSum = 0;
    let totalDurationSum = 0;
    let totalNewUsers = 0;
    let totalUsers = 0;
    let totalEngagementSum = 0;
    const dailySessions: GA4DailyPoint[] = [];

    for (const row of dailyData.rows ?? []) {
      const date = row.dimensionValues[0].value;
      const sessions = parseInt(row.metricValues[0].value, 10);
      const views = parseInt(row.metricValues[1].value, 10);
      const bounceRate = parseFloat(row.metricValues[2].value);
      const avgDuration = parseFloat(row.metricValues[3].value);
      const newUsers = parseInt(row.metricValues[4].value, 10);
      const users = parseInt(row.metricValues[5].value, 10);
      const engagement = parseFloat(row.metricValues[6].value);

      totalSessions += sessions;
      totalPageViews += views;
      totalBounceRateSum += bounceRate * sessions;
      totalDurationSum += avgDuration * sessions;
      totalNewUsers += newUsers;
      totalUsers += users;
      totalEngagementSum += engagement * sessions;

      dailySessions.push({
        date,
        sessions,
        pageViews: views,
        bounceRate: bounceRate * 100,
        avgDuration,
      });
    }

    const avgBounceRate = totalSessions > 0 ? (totalBounceRateSum / totalSessions) * 100 : 0;
    const avgDuration = totalSessions > 0 ? totalDurationSum / totalSessions : 0;
    const avgEngagement = totalSessions > 0 ? (totalEngagementSum / totalSessions) * 100 : 0;

    // Parse previous period daily data
    let prevTotalSessions = 0;
    let prevTotalPageViews = 0;
    let prevBounceSum = 0;
    let prevDurationSum = 0;
    const prevNewUsers = 0;
    // prevEngagement not available in prev query — kept at 0
    const previousDailySessions: GA4DailyPoint[] = [];

    for (const row of prevDailyData.rows ?? []) {
      const date = row.dimensionValues[0].value;
      const sessions = parseInt(row.metricValues[0].value, 10);
      const views = parseInt(row.metricValues[1].value, 10);
      const bounceRate = parseFloat(row.metricValues[2].value);
      const dur = parseFloat(row.metricValues[3].value);

      prevTotalSessions += sessions;
      prevTotalPageViews += views;
      prevBounceSum += bounceRate * sessions;
      prevDurationSum += dur * sessions;

      previousDailySessions.push({
        date,
        sessions,
        pageViews: views,
        bounceRate: bounceRate * 100,
        avgDuration: dur,
      });
    }

    // For previous period, we don't have newUsers/engagement in the prev query — estimate
    // We do have it if we wanted, but to keep API calls minimal, compute from available data
    const prevAvgBounce = prevTotalSessions > 0 ? (prevBounceSum / prevTotalSessions) * 100 : 0;
    const prevAvgDuration = prevTotalSessions > 0 ? prevDurationSum / prevTotalSessions : 0;

    const pctChange = (curr: number, prev: number) =>
      prev > 0 ? ((curr - prev) / prev) * 100 : curr > 0 ? 100 : 0;

    const comparison = {
      sessions: { current: totalSessions, previous: prevTotalSessions, changePercent: pctChange(totalSessions, prevTotalSessions) },
      pageViews: { current: totalPageViews, previous: prevTotalPageViews, changePercent: pctChange(totalPageViews, prevTotalPageViews) },
      bounceRate: { current: avgBounceRate, previous: prevAvgBounce, changePercent: pctChange(avgBounceRate, prevAvgBounce) },
      avgDuration: { current: avgDuration, previous: prevAvgDuration, changePercent: pctChange(avgDuration, prevAvgDuration) },
      engagement: { current: avgEngagement, previous: 0, changePercent: 0 },
      newUsers: { current: totalNewUsers, previous: prevNewUsers, changePercent: pctChange(totalNewUsers, prevNewUsers) },
    };

    // Parse top pages
    const topPages: GA4TopPage[] = (pagesData.rows ?? []).map((row) => ({
      page: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value, 10),
      sessions: parseInt(row.metricValues[1].value, 10),
      bounceRate: parseFloat(row.metricValues[2].value) * 100,
      avgDuration: parseFloat(row.metricValues[3].value),
      engagementRate: parseFloat(row.metricValues[4].value) * 100,
    }));

    // Parse traffic sources (aggregate)
    const sourceRows = sourcesData.rows ?? [];
    const totalSourceSessions = sourceRows.reduce((sum, r) => sum + parseInt(r.metricValues[0].value, 10), 0);
    const topSources = sourceRows.map((row) => {
      const sessions = parseInt(row.metricValues[0].value, 10);
      return {
        source: row.dimensionValues[0].value || "(direct)",
        sessions,
        percentage: totalSourceSessions > 0 ? (sessions / totalSourceSessions) * 100 : 0,
      };
    });

    // Parse source timeline (for multi-line performance dynamics chart)
    const sourceTimelineMap = new Map<string, Record<string, number>>();
    for (const row of sourceTimelineData.rows ?? []) {
      const date = row.dimensionValues[0].value;
      const source = row.dimensionValues[1].value || "(direct)";
      const sessions = parseInt(row.metricValues[0].value, 10);
      if (!sourceTimelineMap.has(date)) sourceTimelineMap.set(date, {});
      const entry = sourceTimelineMap.get(date)!;
      entry[source] = (entry[source] || 0) + sessions;
    }
    const sourceTimeline = Array.from(sourceTimelineMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, sources]) => ({ date, sources }));

    return {
      sessions30d: totalSessions,
      pageViews30d: totalPageViews,
      bounceRate30d: avgBounceRate,
      avgSessionDuration30d: avgDuration,
      newUsers30d: totalNewUsers,
      returningUsers30d: Math.max(0, totalUsers - totalNewUsers),
      engagementRate30d: avgEngagement,
      topPages,
      dailySessions,
      previousDailySessions,
      topSources,
      comparison,
      sourceTimeline,
    };
  } catch (err) {
    console.error("GA4 data fetch error:", err instanceof Error ? err.message : err);
    return null;
  }
}
