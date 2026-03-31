import { SignalView } from "../../[tenantSlug]/signal/SignalView";
import { DEMO_GA4 } from "../demo-data";
import type { PageSpeedResult, UptimeResult } from "@/lib/site-health";
import { calculateSiteHealth } from "@/lib/site-scoring";

export const metadata = { title: "Performance Demo | Mission Control" };

const DEMO_PAGESPEED: PageSpeedResult = {
  performanceScore: 91,
  accessibilityScore: 97,
  seoScore: 100,
  bestPracticesScore: 92,
  vitals: {
    lcp: 1840,
    fid: 12,
    cls: 0.042,
    fcp: 920,
    ttfb: 380,
    si: 2100,
    tbt: 140,
  },
  strategy: "mobile",
  fetchedUrl: "https://atlasops.co",
  fetchedAt: new Date().toISOString(),
};

const DEMO_UPTIME: UptimeResult = {
  url: "https://atlasops.co",
  status: 200,
  ok: true,
  responseTimeMs: 245,
  checkedAt: new Date().toISOString(),
  error: null,
};

const DEMO_KEYWORDS = {
  keywords: [
    { query: "marketing strategy consultant", clicks: 42, impressions: 1200, ctr: 3.5, position: 8.2 },
    { query: "website audit service", clicks: 28, impressions: 890, ctr: 3.1, position: 11.4 },
    { query: "brand messaging strategy", clicks: 19, impressions: 650, ctr: 2.9, position: 14.1 },
    { query: "marketing consultant memphis", clicks: 15, impressions: 340, ctr: 4.4, position: 5.8 },
    { query: "small business marketing help", clicks: 12, impressions: 980, ctr: 1.2, position: 22.3 },
    { query: "website not converting", clicks: 9, impressions: 420, ctr: 2.1, position: 18.6 },
  ],
  totalClicks: 125,
  totalImpressions: 4480,
  avgCtr: 2.8,
  avgPosition: 13.4,
};

const DEMO_SCORES = calculateSiteHealth({
  pageSpeed: DEMO_PAGESPEED,
  uptime: DEMO_UPTIME,
  ga4: DEMO_GA4,
  keywords: DEMO_KEYWORDS,
  hasGA4: true,
  hasSearchConsole: true,
  submissionCount: 14,
});

export default function DemoSignalPage() {
  return (
    <SignalView
      tenantSlug="demo"
      data={{
        hasGA4: true,
        ga4Data: DEMO_GA4,
        keywordData: DEMO_KEYWORDS,
        connectedProviders: ["google_analytics"],
        pageSpeed: DEMO_PAGESPEED,
        uptime: DEMO_UPTIME,
        siteUrl: "https://atlasops.co",
        scores: DEMO_SCORES,
      }}
    />
  );
}
