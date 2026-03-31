/**
 * Site Health Scoring Engine
 *
 * Scores a website across four areas that map to the framework:
 *   Signal   → Messaging — Is your message reaching the right people?
 *   Gravity  → Offer     — Is your offer converting visitors into leads?
 *   Orbit    → Path      — Is your site guiding visitors toward action?
 *   Thrust   → Visibility — Can you see what is working?
 *
 * Each area is scored 0–10. The overall score is a weighted average.
 */

import type { PageSpeedResult, UptimeResult } from "./site-health";
import type { GA4Metrics, SearchConsoleMetrics } from "./ga4";

/* ─── Types ─── */

export interface LayerScore {
  score: number;          /* 0–10 */
  label: string;          /* e.g. "Signal" */
  area: string;           /* e.g. "Messaging" */
  question: string;       /* e.g. "Is your message reaching the right people?" */
  factors: ScoreFactor[];
}

export interface ScoreFactor {
  name: string;
  value: string;
  contribution: number;   /* 0–10 how this factor scored */
  weight: number;         /* 0–1 weight within the layer */
}

export interface SiteHealthScores {
  overall: number;        /* 0–10 weighted average */
  signal: LayerScore;
  gravity: LayerScore;
  orbit: LayerScore;
  thrust: LayerScore;
  generatedAt: string;
}

/* ─── Input ─── */

export interface ScoringInput {
  pageSpeed?: PageSpeedResult | null;
  uptime?: UptimeResult | null;
  ga4?: GA4Metrics | null;
  keywords?: SearchConsoleMetrics | null;
  hasGA4?: boolean;
  hasSearchConsole?: boolean;
  /** Number of form submissions in last 30 days */
  submissionCount?: number;
}

/* ─── Helpers ─── */

/** Clamp a number between 0 and 10 */
function clamp(n: number): number {
  return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10;
}

/** Weighted average of factors */
function weightedAvg(factors: ScoreFactor[]): number {
  const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
  if (totalWeight === 0) return 0;
  const raw = factors.reduce((s, f) => s + f.contribution * f.weight, 0) / totalWeight;
  return clamp(raw);
}

/* ─── Scoring Functions ─── */

/**
 * Signal (Messaging)
 * Is your message reaching the right people?
 *
 * Factors:
 * - SEO score from PageSpeed (is content structured for search?)
 * - Search Console avg position (are you ranking for relevant terms?)
 * - Search Console impressions (is Google showing your pages?)
 * - Organic traffic share (are people finding you through search?)
 */
function scoreSignal(input: ScoringInput): LayerScore {
  const factors: ScoreFactor[] = [];

  // SEO score (0–100 → 0–10)
  if (input.pageSpeed) {
    const seoScore = input.pageSpeed.seoScore / 10;
    factors.push({
      name: "SEO Structure",
      value: `${input.pageSpeed.seoScore}/100`,
      contribution: clamp(seoScore),
      weight: 0.3,
    });
  }

  // Search position (1 = perfect, 50+ = bad)
  if (input.keywords && input.keywords.avgPosition > 0) {
    const posScore = input.keywords.avgPosition <= 5 ? 10
      : input.keywords.avgPosition <= 10 ? 8
      : input.keywords.avgPosition <= 20 ? 6
      : input.keywords.avgPosition <= 30 ? 4
      : input.keywords.avgPosition <= 50 ? 2
      : 1;
    factors.push({
      name: "Search Position",
      value: `Avg #${input.keywords.avgPosition.toFixed(1)}`,
      contribution: posScore,
      weight: 0.3,
    });
  }

  // Search impressions (more = more reach)
  if (input.keywords) {
    const impScore = input.keywords.totalImpressions >= 10000 ? 10
      : input.keywords.totalImpressions >= 5000 ? 8
      : input.keywords.totalImpressions >= 1000 ? 6
      : input.keywords.totalImpressions >= 500 ? 4
      : input.keywords.totalImpressions >= 100 ? 2
      : 1;
    factors.push({
      name: "Search Impressions",
      value: `${input.keywords.totalImpressions.toLocaleString()}/mo`,
      contribution: impScore,
      weight: 0.2,
    });
  }

  // Organic traffic share
  if (input.ga4 && input.ga4.topSources.length > 0) {
    const organicSource = input.ga4.topSources.find(s =>
      s.source.toLowerCase().includes("google") || s.source.toLowerCase().includes("bing")
    );
    const organicPct = organicSource?.percentage ?? 0;
    const orgScore = organicPct >= 50 ? 10
      : organicPct >= 35 ? 8
      : organicPct >= 20 ? 6
      : organicPct >= 10 ? 4
      : organicPct > 0 ? 2
      : 0;
    factors.push({
      name: "Organic Traffic",
      value: `${organicPct}%`,
      contribution: orgScore,
      weight: 0.2,
    });
  }

  // If no data at all, give a baseline factor
  if (factors.length === 0) {
    factors.push({
      name: "No Data",
      value: "Connect analytics",
      contribution: 0,
      weight: 1,
    });
  }

  return {
    score: weightedAvg(factors),
    label: "Signal",
    area: "Messaging",
    question: "Is your message reaching the right people?",
    factors,
  };
}

/**
 * Gravity (Offer)
 * Is your offer converting visitors into leads?
 *
 * Factors:
 * - Engagement rate (are people engaging with the site?)
 * - Bounce rate (inverse — are people leaving immediately?)
 * - CTR from search (are listings compelling enough to click?)
 * - Form submissions relative to sessions
 */
function scoreGravity(input: ScoringInput): LayerScore {
  const factors: ScoreFactor[] = [];

  // Engagement rate
  if (input.ga4) {
    const engScore = input.ga4.engagementRate30d >= 65 ? 10
      : input.ga4.engagementRate30d >= 55 ? 8
      : input.ga4.engagementRate30d >= 45 ? 6
      : input.ga4.engagementRate30d >= 35 ? 4
      : input.ga4.engagementRate30d >= 20 ? 2
      : 1;
    factors.push({
      name: "Engagement Rate",
      value: `${input.ga4.engagementRate30d.toFixed(0)}%`,
      contribution: engScore,
      weight: 0.3,
    });
  }

  // Bounce rate (lower is better)
  if (input.ga4) {
    const bounceScore = input.ga4.bounceRate30d <= 30 ? 10
      : input.ga4.bounceRate30d <= 40 ? 8
      : input.ga4.bounceRate30d <= 50 ? 6
      : input.ga4.bounceRate30d <= 60 ? 4
      : input.ga4.bounceRate30d <= 75 ? 2
      : 1;
    factors.push({
      name: "Bounce Rate",
      value: `${input.ga4.bounceRate30d.toFixed(0)}%`,
      contribution: bounceScore,
      weight: 0.25,
    });
  }

  // Search CTR
  if (input.keywords && input.keywords.avgCtr > 0) {
    const ctrScore = input.keywords.avgCtr >= 5 ? 10
      : input.keywords.avgCtr >= 3.5 ? 8
      : input.keywords.avgCtr >= 2 ? 6
      : input.keywords.avgCtr >= 1 ? 4
      : input.keywords.avgCtr > 0 ? 2
      : 0;
    factors.push({
      name: "Search CTR",
      value: `${input.keywords.avgCtr.toFixed(1)}%`,
      contribution: ctrScore,
      weight: 0.2,
    });
  }

  // Conversion (submissions / sessions)
  if (input.ga4 && input.ga4.sessions30d > 0 && input.submissionCount != null) {
    const convRate = (input.submissionCount / input.ga4.sessions30d) * 100;
    const convScore = convRate >= 5 ? 10
      : convRate >= 3 ? 8
      : convRate >= 1.5 ? 6
      : convRate >= 0.5 ? 4
      : convRate > 0 ? 2
      : 0;
    factors.push({
      name: "Conversion Rate",
      value: `${convRate.toFixed(1)}%`,
      contribution: convScore,
      weight: 0.25,
    });
  }

  if (factors.length === 0) {
    factors.push({
      name: "No Data",
      value: "Connect analytics",
      contribution: 0,
      weight: 1,
    });
  }

  return {
    score: weightedAvg(factors),
    label: "Gravity",
    area: "Offer",
    question: "Is your offer converting visitors into leads?",
    factors,
  };
}

/**
 * Orbit (Path to Action)
 * Is your site guiding visitors toward action?
 *
 * Factors:
 * - Accessibility score (can everyone use the site?)
 * - Best practices score (is the site built well?)
 * - CLS (is the layout stable?)
 * - LCP (does the page load quickly?)
 * - TBT (is the page responsive?)
 */
function scoreOrbit(input: ScoringInput): LayerScore {
  const factors: ScoreFactor[] = [];

  if (input.pageSpeed) {
    // Accessibility
    const accScore = input.pageSpeed.accessibilityScore / 10;
    factors.push({
      name: "Accessibility",
      value: `${input.pageSpeed.accessibilityScore}/100`,
      contribution: clamp(accScore),
      weight: 0.2,
    });

    // Best Practices
    const bpScore = input.pageSpeed.bestPracticesScore / 10;
    factors.push({
      name: "Best Practices",
      value: `${input.pageSpeed.bestPracticesScore}/100`,
      contribution: clamp(bpScore),
      weight: 0.15,
    });

    // CLS (lower is better: ≤0.1 good, ≤0.25 needs work, >0.25 poor)
    if (input.pageSpeed.vitals.cls != null) {
      const clsScore = input.pageSpeed.vitals.cls <= 0.05 ? 10
        : input.pageSpeed.vitals.cls <= 0.1 ? 8
        : input.pageSpeed.vitals.cls <= 0.15 ? 6
        : input.pageSpeed.vitals.cls <= 0.25 ? 4
        : 2;
      factors.push({
        name: "Layout Stability",
        value: input.pageSpeed.vitals.cls.toFixed(3),
        contribution: clsScore,
        weight: 0.25,
      });
    }

    // LCP (lower is better: ≤2.5s good, ≤4s needs work, >4s poor)
    if (input.pageSpeed.vitals.lcp != null) {
      const lcpMs = input.pageSpeed.vitals.lcp;
      const lcpScore = lcpMs <= 1500 ? 10
        : lcpMs <= 2500 ? 8
        : lcpMs <= 3500 ? 6
        : lcpMs <= 4000 ? 4
        : 2;
      factors.push({
        name: "Page Load (LCP)",
        value: `${(lcpMs / 1000).toFixed(1)}s`,
        contribution: lcpScore,
        weight: 0.2,
      });
    }

    // TBT (lower is better: ≤200ms good, ≤600ms needs work, >600ms poor)
    if (input.pageSpeed.vitals.tbt != null) {
      const tbtScore = input.pageSpeed.vitals.tbt <= 100 ? 10
        : input.pageSpeed.vitals.tbt <= 200 ? 8
        : input.pageSpeed.vitals.tbt <= 400 ? 6
        : input.pageSpeed.vitals.tbt <= 600 ? 4
        : 2;
      factors.push({
        name: "Responsiveness",
        value: `${input.pageSpeed.vitals.tbt}ms`,
        contribution: tbtScore,
        weight: 0.2,
      });
    }
  }

  if (factors.length === 0) {
    factors.push({
      name: "No Data",
      value: "Add your website domain",
      contribution: 0,
      weight: 1,
    });
  }

  return {
    score: weightedAvg(factors),
    label: "Orbit",
    area: "Path to Action",
    question: "Is your site guiding visitors toward action?",
    factors,
  };
}

/**
 * Thrust (Visibility)
 * Can you see what is working?
 *
 * Factors:
 * - Performance score (overall technical health)
 * - Uptime & response time
 * - GA4 connected (do you have traffic data?)
 * - Search Console connected (do you have keyword data?)
 * - Session trend (is traffic growing?)
 */
function scoreThrust(input: ScoringInput): LayerScore {
  const factors: ScoreFactor[] = [];

  // Performance score
  if (input.pageSpeed) {
    const perfScore = input.pageSpeed.performanceScore / 10;
    factors.push({
      name: "Performance",
      value: `${input.pageSpeed.performanceScore}/100`,
      contribution: clamp(perfScore),
      weight: 0.25,
    });
  }

  // Uptime + response time
  if (input.uptime) {
    const uptimeScore = input.uptime.ok ? (input.uptime.responseTimeMs <= 300 ? 10 : input.uptime.responseTimeMs <= 600 ? 8 : input.uptime.responseTimeMs <= 1000 ? 6 : 4) : 0;
    factors.push({
      name: "Uptime",
      value: input.uptime.ok ? `${input.uptime.responseTimeMs}ms` : "Down",
      contribution: uptimeScore,
      weight: 0.2,
    });
  }

  // GA4 connected
  factors.push({
    name: "Analytics",
    value: input.hasGA4 ? "Connected" : "Not connected",
    contribution: input.hasGA4 ? 10 : 0,
    weight: 0.2,
  });

  // Search Console connected
  factors.push({
    name: "Search Data",
    value: input.hasSearchConsole ? "Connected" : "Not connected",
    contribution: input.hasSearchConsole ? 10 : 0,
    weight: 0.15,
  });

  // Traffic trend (sessions current vs previous)
  if (input.ga4 && input.ga4.comparison.sessions.previous > 0) {
    const changePct = input.ga4.comparison.sessions.changePercent;
    const trendScore = changePct >= 20 ? 10
      : changePct >= 10 ? 8
      : changePct >= 0 ? 6
      : changePct >= -10 ? 4
      : changePct >= -25 ? 2
      : 1;
    factors.push({
      name: "Traffic Trend",
      value: `${changePct > 0 ? "+" : ""}${changePct.toFixed(0)}%`,
      contribution: trendScore,
      weight: 0.2,
    });
  }

  return {
    score: weightedAvg(factors),
    label: "Thrust",
    area: "Visibility",
    question: "Can you see what is working?",
    factors,
  };
}

/* ─── Main Scoring Function ─── */

export function calculateSiteHealth(input: ScoringInput): SiteHealthScores {
  const signal = scoreSignal(input);
  const gravity = scoreGravity(input);
  const orbit = scoreOrbit(input);
  const thrust = scoreThrust(input);

  // Weighted overall: Signal & Gravity weigh more (business impact)
  const overall = clamp(
    (signal.score * 0.3 + gravity.score * 0.3 + orbit.score * 0.2 + thrust.score * 0.2)
  );

  return {
    overall,
    signal,
    gravity,
    orbit,
    thrust,
    generatedAt: new Date().toISOString(),
  };
}

/* ─── Score Status Helpers ─── */

export function getScoreStatus(score: number): "good" | "warning" | "poor" {
  if (score >= 8) return "good";
  if (score >= 5) return "warning";
  return "poor";
}

export function getScoreColor(score: number): string {
  if (score >= 8) return "#22c55e";
  if (score >= 5) return "#eab308";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 8) return "Good";
  if (score >= 5) return "Be Aware";
  return "Warning";
}
