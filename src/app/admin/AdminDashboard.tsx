"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { setStatus, setNotes } from "./actions";
import type { GA4Metrics, GA4DailyPoint } from "@/lib/ga4";
import { CrmTab } from "./CrmTab";

/* ─────────────────────────── Types ─────────────────────────── */

export interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  status: string;
  notes: string;
  created_at: string;
  type: "contact" | "audit";
  /* contact */
  message?: string;
  /* audit */
  website?: string;
  business_description?: string;
  what_is_stuck?: string;
  primary_goal?: string;
  key_offers?: string;
  ideal_customer?: string;
  anything_else?: string;
  supporting_links?: string;
}

export interface CtaStat {
  label: string;
  clicks: number;
  clicks_30d: number;
}

export interface StripeTransaction {
  id: string;
  amount: string;
  currency: string;
  description: string;
  email: string;
  date: string;
  paid: boolean;
}

export interface StripeData {
  mtdRevenue: number;
  allTimeRevenue: number;
  recent: StripeTransaction[];
}

export interface TimelinePoint {
  [key: string]: unknown;
  date: string;
  clicks?: number;
  contacts?: number;
  audits?: number;
}

export interface AdminDashboardProps {
  submissions: Submission[];
  ctaStats: CtaStat[];
  stripe: StripeData | null;
  ctaTimeline: TimelinePoint[];
  submissionTimeline: TimelinePoint[];
  ga4: GA4Metrics | null;
}

/* ─────────────────────────── Constants ─────────────────────── */

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
type Status = typeof STATUSES[number];

const STATUS_META: Record<Status, { label: string; bg: string; text: string }> = {
  new:       { label: "New",       bg: "#12263f", text: "#60a5fa" },
  contacted: { label: "Contacted", bg: "#2e2109", text: "#d4a230" },
  qualified: { label: "Qualified", bg: "#1e1250", text: "#a78bfa" },
  proposal:  { label: "Proposal",  bg: "#2d1f0e", text: "#d4a574" },
  won:       { label: "Won",       bg: "#0d2a1a", text: "#4db871" },
  lost:      { label: "Lost",      bg: "#1a1a1a", text: "#5e5e62" },
};

/* ─────────────────────────── Utilities ─────────────────────── */

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtShortDate(raw: string): string {
  /* GA4 format: YYYYMMDD; DB format: YYYY-MM-DD */
  const s = raw.length === 8
    ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    : raw;
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function downloadCSV(submissions: Submission[], filename: string) {
  const headers = [
    "Name", "Email", "Company", "Type", "Status", "Date", "Notes",
    "Message", "Website", "Business Description", "What's Stuck",
    "Primary Goal", "Key Offers", "Ideal Customer", "Anything Else", "Supporting Links",
  ];
  const esc = (v: string | null | undefined) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = submissions.map((s) => [
    s.name, s.email, s.company, s.type, s.status,
    fmtDate(s.created_at), s.notes,
    s.message, s.website, s.business_description, s.what_is_stuck,
    s.primary_goal, s.key_offers, s.ideal_customer, s.anything_else, s.supporting_links,
  ].map(esc).join(","));
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────── Design tokens ─────────────────── */
const T = {
  page:        "#0B1120",
  card:        "#101726",
  border:      "#202431",
  copper:      "#D4A574",
  starlight:   "#E8DFCF",
  bodyText:    "#BCB6AC",
  muted:       "#5E5E62",
  faint:       "#343841",
  green:       "#4DB871",
  red:         "#E04747",
};

const FONT_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk)",
};

/* ─────────────────────────── Sub-components ─────────────────── */

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.muted }}>
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: T.copper }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1" style={{ color: T.faint }}>{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as Status] ?? STATUS_META.new;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.text, fontFamily: "var(--font-space-grotesk)" }}
    >
      {meta.label}
    </span>
  );
}

function MiniBarChart({
  data,
  color = T.copper,
  labelKey,
  valueKey,
}: {
  data: Record<string, unknown>[];
  color?: string;
  labelKey: string;
  valueKey: string;
}) {
  const max = Math.max(...data.map((d) => (d[valueKey] as number) || 0), 1);
  return (
    <div className="flex items-end gap-px" style={{ height: 64 }}>
      {data.map((d, i) => {
        const val = (d[valueKey] as number) || 0;
        const pct = (val / max) * 100;
        return (
          <div
            key={i}
            className="flex-1 group relative flex items-end"
            title={`${fmtShortDate(String(d[labelKey]))}: ${val}`}
            style={{ height: "100%" }}
          >
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: pct > 0 ? `${pct}%` : "1px",
                backgroundColor: pct > 0 ? color : T.border,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── GA4 Dashboard ─────────────────── */

// SiteChecker-inspired source colors for multi-line chart
const SOURCE_COLORS = [
  "#3b82f6", "#d4a574", "#22c55e", "#ef4444", "#a78bfa",
  "#f59e0b", "#06b6d4", "#ec4899", "#84cc16", "#6366f1",
];

function GA4Dashboard({ ga4 }: { ga4: GA4Metrics }) {
  const [chartMetric, setChartMetric] = useState<"sessions" | "pageViews">("sessions");
  const [showPrevious, setShowPrevious] = useState(true);
  const [activeKPI, setActiveKPI] = useState<string | null>(null);

  const fmtDuration = (s: number) => {
    if (s < 60) return `${Math.round(s)}s`;
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return sec > 0 ? `${m}m ${sec}s` : `${m}m`;
  };

  const fmtDurationLong = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // Clean white container style
  const P = {
    bg: "#ffffff",
    bgAlt: "#f8f9fb",
    border: "#e5e7eb",
    borderLight: "#f0f1f3",
    header: "#111827",
    sub: "#6b7280",
    value: "#111827",
    accent: "#d4a574",
    blue: "#3b82f6",
    green: "#22c55e",
    red: "#ef4444",
    orange: "#f59e0b",
  };

  const panelStyle: React.CSSProperties = {
    backgroundColor: P.bg,
    borderRadius: 12,
    border: `1px solid ${P.border}`,
  };

  const comp = ga4.comparison;

  // KPI card definitions — SiteChecker style with current + previous values
  const kpiCards = [
    {
      key: "sessions",
      label: "Sessions",
      current: ga4.sessions30d.toLocaleString(),
      previous: comp.sessions.previous.toLocaleString(),
      change: comp.sessions.changePercent,
      color: P.blue,
      invert: false,
    },
    {
      key: "pageViews",
      label: "Page Views",
      current: ga4.pageViews30d.toLocaleString(),
      previous: comp.pageViews.previous.toLocaleString(),
      change: comp.pageViews.changePercent,
      color: P.green,
      invert: false,
    },
    {
      key: "bounceRate",
      label: "Bounce Rate",
      current: `${ga4.bounceRate30d.toFixed(1)}%`,
      previous: `${comp.bounceRate.previous.toFixed(1)}%`,
      change: comp.bounceRate.changePercent,
      color: P.orange,
      invert: true, // lower is better
    },
    {
      key: "avgDuration",
      label: "Av. Sess. Duration",
      current: fmtDurationLong(ga4.avgSessionDuration30d),
      previous: fmtDurationLong(comp.avgDuration.previous),
      change: comp.avgDuration.changePercent,
      color: "#8b5cf6",
      invert: false,
    },
    {
      key: "engagement",
      label: "Engagement Rate",
      current: `${ga4.engagementRate30d.toFixed(1)}%`,
      previous: comp.engagement.previous > 0 ? `${comp.engagement.previous.toFixed(1)}%` : "—",
      change: comp.engagement.changePercent,
      color: "#06b6d4",
      invert: false,
    },
    {
      key: "newUsers",
      label: "New Users",
      current: ga4.newUsers30d.toLocaleString(),
      previous: comp.newUsers.previous.toLocaleString(),
      change: comp.newUsers.changePercent,
      color: P.accent,
      invert: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* ─── KPI Cards Row (SiteChecker style) ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpiCards.map((kpi) => {
          const isUp = kpi.change > 0;
          const isGood = kpi.invert ? !isUp : isUp;
          const isActive = activeKPI === kpi.key;
          return (
            <button
              key={kpi.key}
              onClick={() => setActiveKPI(isActive ? null : kpi.key)}
              className="text-left rounded-xl p-4 transition-all"
              style={{
                backgroundColor: P.bg,
                border: `${isActive ? 2 : 1}px solid ${isActive ? kpi.color : P.border}`,
                borderRadius: 12,
              }}
            >
              {/* Color indicator + label */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: kpi.color }} />
                <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: P.sub }}>
                  {kpi.label}
                </span>
              </div>
              {/* Current value + change */}
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold" style={{ ...FONT_HEADING, color: P.value }}>
                  {kpi.current}
                </span>
                {Math.abs(kpi.change) >= 0.5 && (
                  <span className="text-[11px] font-semibold" style={{ color: isGood ? P.green : P.red }}>
                    {isUp ? "+" : ""}{kpi.change.toFixed(1)}%
                  </span>
                )}
              </div>
              {/* Previous period value */}
              <div className="mt-1">
                <span className="text-[10px]" style={{ color: P.sub }}>
                  prev: {kpi.previous}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── Main Chart: Current vs Previous Period (SiteChecker dual-line) ─── */}
      {ga4.dailySessions.length > 0 && (
        <div className="rounded-xl p-5" style={panelStyle}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-4">
              <p className="text-sm font-semibold" style={{ ...FONT_HEADING, color: P.header }}>
                Traffic Overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Previous period toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPrevious}
                  onChange={(e) => setShowPrevious(e.target.checked)}
                  className="w-3 h-3 rounded accent-blue-500"
                />
                <span className="text-[10px]" style={{ color: P.sub }}>Compare previous</span>
              </label>
              {/* Metric toggle */}
              <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${P.border}` }}>
                {(["sessions", "pageViews"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setChartMetric(m)}
                    className="px-3 py-1 text-[11px] font-medium transition-all"
                    style={{
                      backgroundColor: chartMetric === m ? P.header : P.bg,
                      color: chartMetric === m ? "#fff" : P.sub,
                    }}
                  >
                    {m === "sessions" ? "Sessions" : "Page Views"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart legend */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 rounded" style={{ backgroundColor: P.blue }} />
              <span className="text-[10px]" style={{ color: P.sub }}>Last 30 days</span>
            </div>
            {showPrevious && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 rounded" style={{ backgroundColor: P.sub, opacity: 0.4 }} />
                <span className="text-[10px]" style={{ color: P.sub }}>Previous 30 days</span>
              </div>
            )}
          </div>

          {/* Dual-line area chart */}
          <div className="relative" style={{ height: 180 }}>
            <DualLineChart
              current={ga4.dailySessions}
              previous={showPrevious ? ga4.previousDailySessions : []}
              metricKey={chartMetric}
              currentColor={P.blue}
              previousColor={P.sub}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px]" style={{ color: P.sub }}>
              {fmtShortDate(ga4.dailySessions[0].date)}
            </span>
            <span className="text-[10px]" style={{ color: P.sub }}>
              {fmtShortDate(ga4.dailySessions[ga4.dailySessions.length - 1].date)}
            </span>
          </div>
        </div>
      )}

      {/* ─── Two-column: Traffic Sources + Performance Dynamics ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic Sources (bar breakdown) */}
        {ga4.topSources.length > 0 && (
          <div className="rounded-xl p-5" style={panelStyle}>
            <p className="text-sm font-semibold mb-4" style={{ ...FONT_HEADING, color: P.header }}>Traffic Sources</p>
            <div className="space-y-3">
              {ga4.topSources.map((src, i) => (
                <div key={src.source}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                      <span className="text-xs font-medium" style={{ color: P.value }}>
                        {src.source}
                      </span>
                    </div>
                    <span className="text-xs tabular-nums font-medium" style={{ color: P.sub }}>
                      {src.sessions.toLocaleString()} <span className="text-[10px]">({src.percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="w-full rounded-full" style={{ height: 4, backgroundColor: P.borderLight }}>
                    <div
                      className="rounded-full transition-all"
                      style={{
                        height: 4,
                        width: `${Math.max(src.percentage, 1)}%`,
                        backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Dynamics — multi-line source chart (like SiteChecker screenshot 4) */}
        {ga4.sourceTimeline.length > 0 && (
          <div className="rounded-xl p-5" style={panelStyle}>
            <p className="text-sm font-semibold mb-3" style={{ ...FONT_HEADING, color: P.header }}>Performance Dynamics</p>
            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
              {ga4.topSources.slice(0, 6).map((src, i) => (
                <div key={src.source} className="flex items-center gap-1">
                  <div className="w-2.5 h-0.5 rounded" style={{ backgroundColor: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                  <span className="text-[9px]" style={{ color: P.sub }}>{src.source}</span>
                </div>
              ))}
            </div>
            <div style={{ height: 160 }}>
              <MultiLineChart
                data={ga4.sourceTimeline}
                sources={ga4.topSources.slice(0, 6).map((s) => s.source)}
                colors={SOURCE_COLORS}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px]" style={{ color: P.sub }}>
                {ga4.sourceTimeline.length > 0 ? fmtShortDate(ga4.sourceTimeline[0].date) : ""}
              </span>
              <span className="text-[10px]" style={{ color: P.sub }}>
                {ga4.sourceTimeline.length > 0 ? fmtShortDate(ga4.sourceTimeline[ga4.sourceTimeline.length - 1].date) : ""}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ─── Top Pages Table (full-width, SiteChecker style) ─── */}
      {ga4.topPages.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={panelStyle}>
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <p className="text-sm font-semibold" style={{ ...FONT_HEADING, color: P.header }}>Top Pages</p>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ backgroundColor: P.bgAlt, color: P.sub }}>
              {ga4.topPages.length} pages
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: P.bgAlt, borderBottom: `1px solid ${P.border}`, borderTop: `1px solid ${P.border}` }}>
                  {["Page", "Views", "Sessions", "Bounce Rate", "Avg Duration", "Engagement"].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 font-semibold tracking-wider uppercase whitespace-nowrap ${h === "Page" ? "text-left" : "text-right"}`}
                      style={{ color: P.sub, fontSize: 10 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ga4.topPages.map((p, i) => (
                  <tr
                    key={p.page}
                    style={{
                      borderBottom: `1px solid ${P.borderLight}`,
                      backgroundColor: i % 2 === 0 ? P.bg : P.bgAlt,
                    }}
                  >
                    <td className="px-4 py-3 font-mono truncate max-w-[260px]" style={{ color: P.blue, fontSize: 11 }}>
                      {p.page}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums" style={{ color: P.value }}>
                      {p.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: P.value }}>
                      {p.sessions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span
                        className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: p.bounceRate > 70 ? "#fef2f2" : p.bounceRate > 50 ? "#fffbeb" : "#f0fdf4",
                          color: p.bounceRate > 70 ? P.red : p.bounceRate > 50 ? P.orange : P.green,
                        }}
                      >
                        {p.bounceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums" style={{ color: P.value }}>
                      {fmtDuration(p.avgDuration)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span
                        className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: p.engagementRate > 60 ? "#f0fdf4" : p.engagementRate > 40 ? "#fffbeb" : "#fef2f2",
                          color: p.engagementRate > 60 ? P.green : p.engagementRate > 40 ? P.orange : P.red,
                        }}
                      >
                        {p.engagementRate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={panelStyle}>
          <p className="text-sm font-semibold mb-3" style={{ ...FONT_HEADING, color: P.header }}>User Breakdown</p>
          <div className="flex items-center gap-4">
            {/* Mini donut via SVG */}
            <svg width={80} height={80} viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={P.borderLight} strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={P.blue} strokeWidth="3"
                strokeDasharray={`${(ga4.newUsers30d / Math.max(ga4.newUsers30d + ga4.returningUsers30d, 1)) * 100} ${100 - (ga4.newUsers30d / Math.max(ga4.newUsers30d + ga4.returningUsers30d, 1)) * 100}`}
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: P.blue }} />
                <span className="text-xs" style={{ color: P.sub }}>New Users</span>
                <span className="text-xs font-bold" style={{ color: P.value }}>{ga4.newUsers30d.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: P.borderLight }} />
                <span className="text-xs" style={{ color: P.sub }}>Returning</span>
                <span className="text-xs font-bold" style={{ color: P.value }}>{ga4.returningUsers30d.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Quick stats card */}
        <div className="rounded-xl p-5" style={panelStyle}>
          <p className="text-sm font-semibold mb-3" style={{ ...FONT_HEADING, color: P.header }}>30-Day Summary</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Sessions/Day", value: (ga4.sessions30d / 30).toFixed(1) },
              { label: "Views/Session", value: ga4.sessions30d > 0 ? (ga4.pageViews30d / ga4.sessions30d).toFixed(1) : "0" },
              { label: "Total Users", value: (ga4.newUsers30d + ga4.returningUsers30d).toLocaleString() },
              { label: "Pages Tracked", value: ga4.topPages.length.toString() },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[10px] font-medium uppercase" style={{ color: P.sub }}>{s.label}</p>
                <p className="text-base font-bold" style={{ ...FONT_HEADING, color: P.value }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Dual Line Chart (SVG) ─────────────────── */

function DualLineChart({
  current,
  previous,
  metricKey,
  currentColor,
  previousColor,
}: {
  current: GA4DailyPoint[];
  previous: GA4DailyPoint[];
  metricKey: "sessions" | "pageViews";
  currentColor: string;
  previousColor: string;
}) {
  const curValues = current.map((d) => d[metricKey] as number);
  const prevValues = previous.map((d) => d[metricKey] as number);
  const allValues = [...curValues, ...prevValues];
  const max = Math.max(...allValues, 1);
  const w = 200;
  const h = 100;
  const pad = 3;

  const toPoints = (values: number[]) =>
    values.map((v, i) => ({
      x: pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2),
      y: h - pad - ((v / max) * (h - pad * 2)),
    }));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const curPts = toPoints(curValues);
  const prevPts = toPoints(prevValues);
  const curPath = toPath(curPts);
  const curArea = `${curPath} L${curPts[curPts.length - 1].x.toFixed(1)},${h} L${curPts[0].x.toFixed(1)},${h} Z`;

  // Grid lines
  const gridLines = [0.25, 0.5, 0.75].map((pct) => h - pad - pct * (h - pad * 2));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id="ga4-dual-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={currentColor} stopOpacity={0.15} />
          <stop offset="100%" stopColor={currentColor} stopOpacity={0.01} />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {gridLines.map((y, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={0.2} />
      ))}
      {/* Current period area fill */}
      <path d={curArea} fill="url(#ga4-dual-grad)" />
      {/* Previous period dashed line */}
      {prevPts.length > 0 && (
        <path
          d={toPath(prevPts)}
          fill="none"
          stroke={previousColor}
          strokeWidth={0.5}
          strokeDasharray="2,1.5"
          strokeOpacity={0.35}
          strokeLinejoin="round"
        />
      )}
      {/* Current period solid line */}
      <path d={curPath} fill="none" stroke={currentColor} strokeWidth={0.7} strokeLinejoin="round" />
      {/* Data points */}
      {curPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={0.5} fill={currentColor}>
          <title>{fmtShortDate(current[i].date)}: {curValues[i]}</title>
        </circle>
      ))}
    </svg>
  );
}

/* ─────────────────────────── Multi-Line Chart (SVG) ─────────────────── */

function MultiLineChart({
  data,
  sources,
  colors,
}: {
  data: { date: string; sources: Record<string, number> }[];
  sources: string[];
  colors: string[];
}) {
  const w = 200;
  const h = 100;
  const pad = 3;

  // Get max across all sources
  let maxVal = 1;
  for (const d of data) {
    for (const src of sources) {
      const v = d.sources[src] || 0;
      if (v > maxVal) maxVal = v;
    }
  }

  const toPoints = (src: string) =>
    data.map((d, i) => ({
      x: pad + (i / Math.max(data.length - 1, 1)) * (w - pad * 2),
      y: h - pad - (((d.sources[src] || 0) / maxVal) * (h - pad * 2)),
    }));

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const gridLines = [0.25, 0.5, 0.75].map((pct) => h - pad - pct * (h - pad * 2));

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full">
      {gridLines.map((y, i) => (
        <line key={i} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#e5e7eb" strokeWidth={0.2} />
      ))}
      {sources.map((src, si) => {
        const pts = toPoints(src);
        return (
          <path
            key={src}
            d={toPath(pts)}
            fill="none"
            stroke={colors[si % colors.length]}
            strokeWidth={0.5}
            strokeLinejoin="round"
            strokeOpacity={0.8}
          />
        );
      })}
    </svg>
  );
}

/* ─────────────────────────── CRM Row ────────────────────────── */

function SubmissionRow({
  sub,
  onStatusChange,
  onNotesSave,
}: {
  sub: Submission;
  onStatusChange: (table: "contact" | "audit", id: number, status: string) => void;
  onNotesSave: (table: "contact" | "audit", id: number, notes: string) => void;
}) {
  const [open, setOpen]           = useState(false);
  const [localNotes, setLocalNotes] = useState(sub.notes ?? "");
  const [saving, startSaving]     = useTransition();
  const [statusSaving, startStatusSaving] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStatusChange = (newStatus: string) => {
    startStatusSaving(() => onStatusChange(sub.type, sub.id, newStatus));
  };

  const handleNotesChange = (val: string) => {
    setLocalNotes(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startSaving(() => onNotesSave(sub.type, sub.id, val));
    }, 800);
  };

  const auditFields = [
    { key: "website",              label: "Website" },
    { key: "business_description", label: "Business Description" },
    { key: "what_is_stuck",        label: "What's Stuck" },
    { key: "primary_goal",         label: "Primary Goal" },
    { key: "key_offers",           label: "Key Offers" },
    { key: "ideal_customer",       label: "Ideal Customer" },
    { key: "anything_else",        label: "Anything Else" },
    { key: "supporting_links",     label: "Supporting Links" },
  ] as const;

  return (
    <div
      className="rounded-lg mb-2 overflow-hidden"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      {/* Row summary */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        style={{ color: T.starlight }}
      >
        <StatusBadge status={sub.status} />
        <span className="text-sm font-semibold truncate flex-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {sub.name}
        </span>
        <span className="text-xs truncate hidden sm:block" style={{ color: T.muted }}>{sub.email}</span>
        {sub.company && (
          <span className="text-xs truncate hidden md:block" style={{ color: T.muted }}>· {sub.company}</span>
        )}
        <span
          className="text-xs px-2 py-0.5 rounded shrink-0"
          style={{ backgroundColor: T.border, color: T.muted, fontFamily: "var(--font-space-grotesk)" }}
        >
          {sub.type === "audit" ? "Audit" : "Contact"}
        </span>
        <span className="text-xs shrink-0" style={{ color: T.faint }}>{fmtDate(sub.created_at)}</span>
        <span className="text-xs shrink-0" style={{ color: T.muted }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-5 pt-1 space-y-4" style={{ borderTop: `1px solid ${T.border}` }}>
          {/* Status selector */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>
              Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const meta = STATUS_META[s];
                const active = sub.status === s;
                return (
                  <button
                    key={s}
                    disabled={statusSaving}
                    onClick={() => handleStatusChange(s)}
                    className="px-2.5 py-0.5 rounded text-xs font-semibold transition-opacity"
                    style={{
                      backgroundColor: active ? meta.bg : "transparent",
                      color: active ? meta.text : T.faint,
                      border: `1px solid ${active ? meta.text + "40" : T.border}`,
                      fontFamily: "var(--font-space-grotesk)",
                      opacity: statusSaving ? 0.5 : 1,
                    }}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
            <a
              href={`mailto:${sub.email}`}
              className="ml-auto text-xs px-2.5 py-0.5 rounded transition-colors"
              style={{ color: T.copper, border: `1px solid ${T.border}` }}
            >
              ✉ Email
            </a>
          </div>

          {/* Submission fields */}
          {sub.type === "contact" && sub.message && (
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: T.muted }}>Message</p>
              <p className="text-sm whitespace-pre-wrap" style={{ color: T.bodyText }}>{sub.message}</p>
            </div>
          )}
          {sub.type === "audit" && auditFields.map(({ key, label }) =>
            sub[key] ? (
              <div key={key}>
                <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: T.muted }}>{label}</p>
                <p className="text-sm whitespace-pre-wrap" style={{ color: T.bodyText }}>{sub[key]}</p>
              </div>
            ) : null
          )}

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>Notes</p>
              {saving && <span className="text-xs" style={{ color: T.faint }}>saving…</span>}
            </div>
            <textarea
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add notes about this lead…"
              rows={3}
              className="w-full rounded-lg text-sm resize-y px-3 py-2 outline-none focus:ring-1"
              style={{
                backgroundColor: "#0B1120",
                border: `1px solid ${T.border}`,
                color: T.bodyText,
                caretColor: T.copper,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Panels ─────────────────────────── */

function SectionHeader({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ fontFamily: "var(--font-space-grotesk)", color: T.muted }}
      >
        {title}
      </h2>
      {count !== undefined && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: T.border, color: T.muted }}
        >
          {count}
        </span>
      )}
      <div className="flex-1 h-px" style={{ backgroundColor: T.border }} />
      {children}
    </div>
  );
}

/* ─── Bookings Tab ─── */
function BookingsTab() {
  const [bookings, setBookings] = useState<Array<{
    id: string; type: string; name: string; email: string; start_time: string;
    end_time: string; notes: string | null; google_meet_url: string | null;
  }>>([]);
  const [blackoutDates, setBlackoutDates] = useState<Array<{ id: number; start_date: string; end_date: string; label: string | null }>>([]);
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [bRes, dRes] = await Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/blackout-dates").then((r) => r.json()),
    ]);
    setBookings(bRes.bookings || []);
    setBlackoutDates(dRes.dates || []);
    setLoading(false);
  }, []);

  useState(() => { fetchData(); });

  const addBlackout = async () => {
    if (!newStartDate) return;
    const endDate = newEndDate || newStartDate;
    await fetch("/api/admin/blackout-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: newStartDate, endDate, label: newLabel || null }),
    });
    setNewStartDate("");
    setNewEndDate("");
    setNewLabel("");
    fetchData();
  };

  const removeBlackout = async (id: number) => {
    await fetch("/api/admin/blackout-dates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  if (loading) return <p style={{ color: T.muted }}>Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title="Upcoming Bookings" count={bookings.length} />
        {bookings.length === 0 ? (
          <p style={{ color: T.muted }} className="text-sm">No upcoming bookings.</p>
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: T.card }}>
                  {["Date & Time", "Session", "Contact", "Email", "Meet Link", "Notes"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted, ...FONT_HEADING }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const startDate = new Date(b.start_time);
                  const endDate = new Date(b.end_time);
                  const dateStr = startDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                  const timeStr = `${startDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} – ${endDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
                  return (
                    <tr key={b.id} style={{ borderTop: `1px solid ${T.border}` }}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-sm" style={{ color: T.starlight, ...FONT_HEADING }}>{dateStr}</div>
                        <div className="text-xs" style={{ color: T.muted }}>{timeStr}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: T.copper + "22", color: T.copper, ...FONT_HEADING }}>{b.type}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-sm" style={{ color: T.starlight }}>{b.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${b.email}`} className="text-xs hover:underline" style={{ color: T.copper }}>{b.email}</a>
                      </td>
                      <td className="px-4 py-3">
                        {b.google_meet_url ? (
                          <a href={b.google_meet_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded font-semibold" style={{ backgroundColor: T.green + "18", color: T.green, ...FONT_HEADING }}>
                            ● Join Meet
                          </a>
                        ) : (
                          <span className="text-xs" style={{ color: T.faint }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs" style={{ color: T.muted }}>{b.notes || "—"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="PTO / Blackout Dates" />
        <div className="flex gap-2 mb-4 flex-wrap items-end">
          <div>
            <label className="block text-xs mb-1" style={{ color: T.muted }}>Start Date</label>
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => {
                setNewStartDate(e.target.value);
                if (!newEndDate || e.target.value > newEndDate) setNewEndDate(e.target.value);
              }}
              className="rounded px-3 py-1.5 text-sm"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.starlight }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: T.muted }}>End Date</label>
            <input
              type="date"
              value={newEndDate}
              min={newStartDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="rounded px-3 py-1.5 text-sm"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.starlight }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: T.muted }}>Label</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Vacation"
              className="rounded px-3 py-1.5 text-sm"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.starlight }}
            />
          </div>
          <button
            onClick={addBlackout}
            className="rounded px-4 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: T.copper, color: T.page }}
          >
            Add
          </button>
        </div>
        {blackoutDates.length === 0 ? (
          <p style={{ color: T.muted }} className="text-sm">No blackout dates set.</p>
        ) : (
          <div className="space-y-2">
            {blackoutDates.map((d) => {
              const dateDisplay = d.start_date === d.end_date
                ? d.start_date
                : `${d.start_date} → ${d.end_date}`;
              return (
                <div key={d.id} className="flex items-center justify-between rounded-lg px-4 py-2" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                  <span className="text-sm" style={{ color: T.starlight }}>
                    {dateDisplay}{d.label ? ` — ${d.label}` : ""}
                  </span>
                  <button onClick={() => removeBlackout(d.id)} className="text-xs" style={{ color: T.red }}>Remove</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab({
  stripe,
  ctaStats,
  ctaTimeline,
  submissionTimeline,
  ga4,
  totalSubmissions,
  auditCount,
  contactCount,
  convRate,
  totalCtaClicks,
}: {
  stripe: StripeData | null;
  ctaStats: CtaStat[];
  ctaTimeline: TimelinePoint[];
  submissionTimeline: TimelinePoint[];
  ga4: GA4Metrics | null;
  totalSubmissions: number;
  auditCount: number;
  contactCount: number;
  convRate: string;
  totalCtaClicks: number;
}) {
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Revenue MTD"
          value={stripe ? `$${stripe.mtdRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}` : "—"}
          sub="This calendar month"
        />
        <StatCard
          label="All-Time Revenue"
          value={stripe ? `$${stripe.allTimeRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}` : "—"}
          sub="Recent transactions"
        />
        <StatCard
          label="Total Submissions"
          value={String(totalSubmissions)}
          sub={`${auditCount} audits · ${contactCount} contacts`}
        />
        <StatCard
          label="CTA → Conversion"
          value={convRate}
          sub={`${totalCtaClicks} total clicks tracked`}
        />
      </div>

      {/* Activity Charts */}
      {(ctaTimeline.length > 0 || submissionTimeline.length > 0) && (
        <div className="mb-10">
          <SectionHeader title="Activity — Last 30 Days" />
          <div className="grid sm:grid-cols-2 gap-4">
            {ctaTimeline.length > 0 && (
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: T.muted }}>
                  CTA Clicks
                </p>
                <MiniBarChart data={ctaTimeline} labelKey="date" valueKey="clicks" color={T.copper} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: T.faint }}>
                    {ctaTimeline.length > 0 ? fmtShortDate(String(ctaTimeline[0].date)) : ""}
                  </span>
                  <span className="text-xs" style={{ color: T.faint }}>
                    {ctaTimeline.length > 0 ? fmtShortDate(String(ctaTimeline[ctaTimeline.length - 1].date)) : ""}
                  </span>
                </div>
              </div>
            )}
            {submissionTimeline.length > 0 && (
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: T.muted }}>
                  Submissions
                </p>
                <div className="flex gap-3 mb-2">
                  <span className="flex items-center gap-1 text-xs" style={{ color: T.faint }}>
                    <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: T.copper }} /> Audits
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: T.faint }}>
                    <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: "#60a5fa" }} /> Contacts
                  </span>
                </div>
                {/* Stacked audit + contact bars */}
                <div className="flex items-end gap-px" style={{ height: 64 }}>
                  {submissionTimeline.map((d, i) => {
                    const audits   = (d.audits as number) || 0;
                    const contacts = (d.contacts as number) || 0;
                    const total    = audits + contacts;
                    const maxTotal = Math.max(
                      ...submissionTimeline.map((p) => ((p.audits as number) || 0) + ((p.contacts as number) || 0)),
                      1
                    );
                    const totalPct = (total / maxTotal) * 100;
                    const auditPct = total > 0 ? (audits / total) * 100 : 0;
                    return (
                      <div
                        key={i}
                        title={`${fmtShortDate(String(d.date))}: ${audits} audits, ${contacts} contacts`}
                        className="flex-1 flex flex-col justify-end"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="w-full rounded-t-sm overflow-hidden"
                          style={{ height: totalPct > 0 ? `${totalPct}%` : "1px" }}
                        >
                          <div style={{ height: `${auditPct}%`, backgroundColor: T.copper }} />
                          <div style={{ height: `${100 - auditPct}%`, backgroundColor: "#60a5fa" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: T.faint }}>
                    {submissionTimeline.length > 0 ? fmtShortDate(String(submissionTimeline[0].date)) : ""}
                  </span>
                  <span className="text-xs" style={{ color: T.faint }}>
                    {submissionTimeline.length > 0 ? fmtShortDate(String(submissionTimeline[submissionTimeline.length - 1].date)) : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GA4 Section */}
      <div className="mb-10">
        <SectionHeader title="Site Analytics" />
        {ga4 ? (
          <GA4Dashboard ga4={ga4} />
        ) : (
          <div
            className="rounded-xl p-7 text-center"
            style={{ backgroundColor: T.card, border: `1px dashed ${T.border}` }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: T.muted }}>Connect GA4 for Site Analytics</p>
            <p className="text-xs mb-4 max-w-md mx-auto leading-relaxed" style={{ color: T.faint }}>
              Uses your existing Google OAuth credentials. Just two steps:
            </p>
            <div className="text-left max-w-sm mx-auto space-y-3 mb-4">
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "#0B1120", border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: T.copper }}>1. Add GA4 Property ID</p>
                <p className="text-xs" style={{ color: T.faint }}>
                  Add <span className="font-mono" style={{ color: T.muted }}>GA4_PROPERTY_ID</span> to Vercel env vars.
                  Find it in GA4 → Admin → Property Settings.
                </p>
              </div>
              <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "#0B1120", border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold mb-1" style={{ color: T.copper }}>2. Re-authorize Google OAuth</p>
                <p className="text-xs" style={{ color: T.faint }}>
                  Visit <span className="font-mono" style={{ color: T.muted }}>/api/auth/google</span> to
                  regenerate your refresh token with the analytics scope included.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA click table */}
      {ctaStats.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="CTA Click Tracking" count={ctaStats.length} />
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: T.card }}>
                  {["CTA Label", "All-Time", "Last 30 Days"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ctaStats.map((r) => (
                  <tr key={r.label} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td className="px-4 py-3" style={{ color: T.starlight }}>{r.label}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: T.copper }}>{r.clicks}</td>
                    <td className="px-4 py-3" style={{ color: T.bodyText }}>{r.clicks_30d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stripe transactions */}
      {stripe ? (
        <div className="mb-10">
          <SectionHeader title="Recent Stripe Transactions" count={stripe.recent.length} />
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: T.card }}>
                  {["Date", "Amount", "Description", "Email"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stripe.recent.map((t) => (
                  <tr key={t.id} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td className="px-4 py-3 text-xs" style={{ color: T.muted }}>{t.date}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: t.paid ? T.green : T.red }}>${t.amount}</td>
                    <td className="px-4 py-3" style={{ color: T.bodyText }}>{t.description}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: T.muted }}>{t.email}</td>
                  </tr>
                ))}
                {stripe.recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-xs" style={{ color: T.faint }}>No transactions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-5 mb-10 text-sm text-center"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.muted }}
        >
          Add{" "}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: T.border }}>
            STRIPE_SECRET_KEY
          </code>{" "}
          to Vercel env vars to see revenue.
        </div>
      )}
    </div>
  );
}

/* ─── Pipeline Tab ─── */
function PipelineTab({
  submissions,
  onStatusChange,
  onNotesSave,
}: {
  submissions: Submission[];
  onStatusChange: (table: "contact" | "audit", id: number, status: string) => void;
  onNotesSave: (table: "contact" | "audit", id: number, notes: string) => void;
}) {
  const [typeFilter,   setTypeFilter]   = useState<"all" | "audit" | "contact">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const filtered = submissions.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const handleExport = () => {
    const filename = `cosmic-reach-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filtered, filename);
  };

  const pipeCounts: Record<string, number> = {};
  for (const s of submissions) pipeCounts[s.status] = (pipeCounts[s.status] || 0) + 1;

  return (
    <div>
      {/* Pipeline status summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => {
          const meta  = STATUS_META[s];
          const count = pipeCounts[s] || 0;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: statusFilter === s ? meta.bg : "transparent",
                color: statusFilter === s ? meta.text : T.muted,
                border: `1px solid ${statusFilter === s ? meta.text + "40" : T.border}`,
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {meta.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: T.border, color: T.faint }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          {(["all", "audit", "contact"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: typeFilter === t ? T.border : "transparent",
                color: typeFilter === t ? T.starlight : T.muted,
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {t === "all" ? "All" : t === "audit" ? "Audits" : "Contacts"}
            </button>
          ))}
        </div>

        <span className="text-xs" style={{ color: T.faint }}>
          {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
        </span>

        <div className="ml-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "transparent",
              color: T.copper,
              border: `1px solid ${T.border}`,
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Submission list */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl py-12 text-center"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <p className="text-sm" style={{ color: T.faint }}>No submissions match the current filters.</p>
        </div>
      ) : (
        <div>
          {filtered.map((sub) => (
            <SubmissionRow
              key={`${sub.type}-${sub.id}`}
              sub={sub}
              onStatusChange={onStatusChange}
              onNotesSave={onNotesSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Main component ─────────────────── */

export function AdminDashboard({
  submissions: initialSubmissions,
  ctaStats,
  stripe,
  ctaTimeline,
  submissionTimeline,
  ga4,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<"crm" | "signals" | "meetings">("crm");
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [, startTransition] = useTransition();

  /* Derived stats */
  const auditCount   = submissions.filter((s) => s.type === "audit").length;
  const contactCount = submissions.filter((s) => s.type === "contact").length;
  const totalSubmissions = submissions.length;
  const totalCtaClicks = ctaStats.reduce((s, r) => s + r.clicks, 0);
  const clicks30d  = ctaStats.reduce((s, r) => s + r.clicks_30d, 0);
  const convRate   = clicks30d > 0
    ? ((totalSubmissions / clicks30d) * 100).toFixed(1) + "%"
    : "—";

  const handleStatusChange = useCallback(
    (table: "contact" | "audit", id: number, status: string) => {
      /* Optimistic update */
      setSubmissions((prev) =>
        prev.map((s) => s.type === table && s.id === id ? { ...s, status } : s)
      );
      startTransition(() => setStatus(table, id, status));
    },
    []
  );

  const handleNotesSave = useCallback(
    (table: "contact" | "audit", id: number, notes: string) => {
      /* Optimistic update */
      setSubmissions((prev) =>
        prev.map((s) => s.type === table && s.id === id ? { ...s, notes } : s)
      );
      startTransition(() => setNotes(table, id, notes));
    },
    []
  );

  const navItems: { key: typeof tab; label: string; icon: string }[] = [
    { key: "crm",      label: "Mission Control", icon: "◈" },
    { key: "signals",  label: "Digital Signals",  icon: "◇" },
    { key: "meetings", label: "Meetings",         icon: "◆" },
  ];

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: T.page, color: T.starlight }}>
      {/* ── Mobile Top Bar ── */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
        style={{ backgroundColor: T.card, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-mark-light.svg" alt="" className="w-5 h-5" />
          <span className="font-bold text-sm" style={{ ...FONT_HEADING, color: T.starlight }}>
            Mission Control
          </span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="w-8 h-8 flex items-center justify-center rounded"
          style={{ color: T.muted }}
        >
          {mobileNavOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile Nav Dropdown ── */}
      {mobileNavOpen && (
        <div
          className="md:hidden flex flex-col gap-1 px-3 py-3 z-20"
          style={{ backgroundColor: T.card, borderBottom: `1px solid ${T.border}` }}
        >
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setMobileNavOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold"
              style={{
                backgroundColor: tab === item.key ? T.border : "transparent",
                color: tab === item.key ? T.starlight : T.muted,
                ...FONT_HEADING,
              }}
            >
              <span style={{ color: tab === item.key ? T.copper : T.faint }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="pt-2 mt-1" style={{ borderTop: `1px solid ${T.border}` }}>
            <LogoutButtonInline />
          </div>
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden md:flex sticky top-0 h-screen w-56 shrink-0 flex-col overflow-y-auto"
        style={{ backgroundColor: T.card, borderRight: `1px solid ${T.border}` }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-mark-light.svg" alt="" className="w-6 h-6" />
          <span
            className="font-bold text-sm tracking-wide"
            style={{ ...FONT_HEADING, color: T.starlight }}
          >
            Mission Control
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1" role="tablist">
          {navItems.map((item) => (
            <button
              key={item.key}
              role="tab"
              aria-selected={tab === item.key}
              onClick={() => setTab(item.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: tab === item.key ? T.border : "transparent",
                color:           tab === item.key ? T.starlight : T.muted,
                ...FONT_HEADING,
              }}
            >
              <span className="text-sm" style={{ color: tab === item.key ? T.copper : T.faint }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="px-3 py-4 mt-auto" style={{ borderTop: `1px solid ${T.border}` }}>
          <LogoutButtonInline />
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
          {tab === "crm" ? (
            <CrmTab />
          ) : tab === "signals" ? (
            <div className="space-y-10">
              <DashboardTab
                stripe={stripe}
                ctaStats={ctaStats}
                ctaTimeline={ctaTimeline}
                submissionTimeline={submissionTimeline}
                ga4={ga4}
                totalSubmissions={totalSubmissions}
                auditCount={auditCount}
                contactCount={contactCount}
                convRate={convRate}
                totalCtaClicks={totalCtaClicks}
              />
              <PipelineTab
                submissions={submissions}
                onStatusChange={handleStatusChange}
                onNotesSave={handleNotesSave}
              />
            </div>
          ) : (
            <BookingsTab />
          )}
        </div>
      </main>
    </div>
  );
}

/* Inline logout button — avoids importing from LogoutButton.tsx inside a "use client" file
   that already has its own transition state */
function LogoutButtonInline() {
  const [, start] = useTransition();
  const handleLogout = () =>
    start(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    });
  return (
    <button
      onClick={handleLogout}
      className="w-full text-xs font-semibold tracking-wider uppercase px-3 py-2 rounded-lg transition-colors text-center"
      style={{ color: T.muted, border: `1px solid ${T.border}`, fontFamily: "var(--font-space-grotesk)" }}
    >
      Log out
    </button>
  );
}
