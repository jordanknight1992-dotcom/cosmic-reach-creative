/**
 * Free website health checks — no API keys or accounts required.
 *
 * 1. Google PageSpeed Insights (free, no key needed for moderate usage)
 * 2. Simple uptime / response time check (built-in HEAD request)
 */

/* ─── PageSpeed Insights ─── */

export interface CoreWebVitals {
  lcp: number | null;        /* Largest Contentful Paint (ms) */
  fid: number | null;        /* First Input Delay (ms) */
  cls: number | null;        /* Cumulative Layout Shift (unitless) */
  fcp: number | null;        /* First Contentful Paint (ms) */
  ttfb: number | null;       /* Time to First Byte (ms) */
  si: number | null;         /* Speed Index (ms) */
  tbt: number | null;        /* Total Blocking Time (ms) */
}

export interface PageSpeedResult {
  performanceScore: number;   /* 0-100 */
  accessibilityScore: number; /* 0-100 */
  seoScore: number;           /* 0-100 */
  bestPracticesScore: number; /* 0-100 */
  vitals: CoreWebVitals;
  strategy: "mobile" | "desktop";
  fetchedUrl: string;
  fetchedAt: string;
}

export async function getPageSpeedData(
  url: string,
  strategy: "mobile" | "desktop" = "mobile"
): Promise<PageSpeedResult | null> {
  if (!url) return null;

  // Ensure URL has protocol
  const targetUrl = url.startsWith("http") ? url : `https://${url}`;

  try {
    const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    apiUrl.searchParams.set("url", targetUrl);
    apiUrl.searchParams.set("strategy", strategy.toUpperCase());
    apiUrl.searchParams.set("category", "PERFORMANCE");
    apiUrl.searchParams.set("category", "ACCESSIBILITY");
    apiUrl.searchParams.set("category", "SEO");
    apiUrl.searchParams.set("category", "BEST_PRACTICES");

    // Note: URL.searchParams.set overwrites, need to use append for multiple categories
    const apiKey = process.env.PAGESPEED_API_KEY;
    const keyParam = apiKey ? `&key=${apiKey}` : "";
    const fullUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${strategy.toUpperCase()}&category=PERFORMANCE&category=ACCESSIBILITY&category=SEO&category=BEST_PRACTICES${keyParam}`;

    console.log("PageSpeed: fetching", targetUrl, strategy);
    const res = await fetch(fullUrl, {
      signal: AbortSignal.timeout(60000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error("PageSpeed API error:", res.status, errText);
      return null;
    }

    const data = await res.json();

    const categories = data.lighthouseResult?.categories ?? {};
    const audits = data.lighthouseResult?.audits ?? {};

    const getMetricMs = (id: string): number | null => {
      const val = audits[id]?.numericValue;
      return typeof val === "number" ? Math.round(val) : null;
    };

    return {
      performanceScore: Math.round((categories.performance?.score ?? 0) * 100),
      accessibilityScore: Math.round((categories.accessibility?.score ?? 0) * 100),
      seoScore: Math.round((categories.seo?.score ?? 0) * 100),
      bestPracticesScore: Math.round((categories["best-practices"]?.score ?? 0) * 100),
      vitals: {
        lcp: getMetricMs("largest-contentful-paint"),
        fid: getMetricMs("max-potential-fid"),
        cls: audits["cumulative-layout-shift"]?.numericValue != null
          ? Math.round(audits["cumulative-layout-shift"].numericValue * 1000) / 1000
          : null,
        fcp: getMetricMs("first-contentful-paint"),
        ttfb: getMetricMs("server-response-time"),
        si: getMetricMs("speed-index"),
        tbt: getMetricMs("total-blocking-time"),
      },
      strategy,
      fetchedUrl: targetUrl,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("PageSpeed fetch error:", err instanceof Error ? err.message : err);
    return null;
  }
}

/* ─── Uptime / Response Time Check ─── */

export interface UptimeResult {
  url: string;
  status: number | null;
  ok: boolean;
  responseTimeMs: number;
  checkedAt: string;
  error: string | null;
}

export async function checkUptime(url: string): Promise<UptimeResult> {
  const targetUrl = url.startsWith("http") ? url : `https://${url}`;
  const start = Date.now();

  try {
    const res = await fetch(targetUrl, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    return {
      url: targetUrl,
      status: res.status,
      ok: res.ok,
      responseTimeMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: null,
    };
  } catch (err) {
    return {
      url: targetUrl,
      status: null,
      ok: false,
      responseTimeMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : "Request failed",
    };
  }
}
