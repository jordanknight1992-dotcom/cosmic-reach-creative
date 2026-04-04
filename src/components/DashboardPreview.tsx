"use client";

/**
 * Static preview of the Mission Control dashboard for the landing page.
 * Visuals are copied directly from OverviewView + SignalView with demo data.
 * No router or tenant dependencies — purely presentational.
 */

/* ── Demo data ──────────────────────────────────────────────────── */

const stats = [
  { label: "Total Leads", value: 24 },
  { label: "New", value: 5, accent: "#60a5fa" },
  { label: "Audits", value: 14, accent: "#d4a574" },
  { label: "Contacts", value: 10 },
  { label: "Meetings", value: 3, accent: "#22c55e" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  contacted: { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  closed: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
};

const recentLeads = [
  { type: "audit", name: "Marcus Chen", company: "Relay Health", msg: "Our website gets traffic but almost no inquiries.", status: "new", time: "2d ago" },
  { type: "contact", name: "Rachel Torres", company: "Stackline Analytics", msg: "Interested in a full rebuild.", status: "contacted", time: "4d ago" },
  { type: "audit", name: "David Park", company: "Green Roof Design", msg: "We just launched a new service tier.", status: "new", time: "6d ago" },
  { type: "contact", name: "Amira Johnson", company: "Brightwell", msg: "Looking for ongoing monthly support.", status: "closed", time: "11d ago" },
  { type: "audit", name: "Tom Keating", company: "Blue Crest", msg: "Bounce rate feels high.", status: "new", time: "18d ago" },
];

const topSources = [
  { source: "google", sessions: 520, pct: 41.7 },
  { source: "(direct)", sessions: 340, pct: 27.3 },
  { source: "linkedin", sessions: 185, pct: 14.8 },
  { source: "referral", sessions: 120, pct: 9.6 },
  { source: "email", sessions: 82, pct: 6.6 },
];

const topPages = [
  { page: "/", views: 1120, bounce: 48.2 },
  { page: "/pricing", views: 640, bounce: 38.5 },
  { page: "/how-it-works", views: 412, bounce: 55.1 },
  { page: "/services", views: 285, bounce: 42.0 },
  { page: "/contact", views: 198, bounce: 35.8 },
];

const healthScores = [
  { label: "Performance", score: 91 },
  { label: "Accessibility", score: 97 },
  { label: "SEO", score: 100 },
  { label: "Best Practices", score: 92 },
];

const vitals = [
  { label: "LCP", sub: "Largest Contentful Paint", value: "1.8s", status: "good" as const },
  { label: "CLS", sub: "Cumulative Layout Shift", value: "0.042", status: "good" as const },
  { label: "TBT", sub: "Total Blocking Time", value: "140ms", status: "good" as const },
  { label: "FCP", sub: "First Contentful Paint", value: "0.9s", status: "good" as const },
  { label: "SI", sub: "Speed Index", value: "2.1s", status: "good" as const },
  { label: "TTFB", sub: "Time to First Byte", value: "380ms", status: "good" as const },
];

const keywords = [
  { query: "marketing strategy consultant", clicks: 42, impressions: 1200, ctr: 3.5, position: 8.2 },
  { query: "website audit service", clicks: 28, impressions: 890, ctr: 3.1, position: 11.4 },
  { query: "brand messaging strategy", clicks: 19, impressions: 650, ctr: 2.9, position: 14.1 },
  { query: "marketing consultant memphis", clicks: 15, impressions: 340, ctr: 4.4, position: 5.8 },
  { query: "small business marketing help", clicks: 12, impressions: 980, ctr: 1.2, position: 22.3 },
  { query: "website not converting", clicks: 9, impressions: 420, ctr: 2.1, position: 18.6 },
];

/* ── Helpers ─────────────────────────────────────────────────────── */

function scoreColor(s: number) {
  if (s >= 90) return "#22c55e";
  if (s >= 50) return "#eab308";
  return "#ef4444";
}

function statusColorForVital(status: "good" | "needs-improvement" | "poor") {
  if (status === "good") return "#22c55e";
  if (status === "needs-improvement") return "#eab308";
  return "#ef4444";
}

/* ── Component ───────────────────────────────────────────────────── */

export function DashboardPreview() {
  return (
    <div style={{ background: "#0b1120", borderRadius: 16, border: "1px solid rgba(232,223,207,0.08)" }}>
      {/* ─── Overview Section ─── */}
      <div style={{ padding: "24px 20px 20px" }}>
        {/* Greeting (matches demo Header) */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 22, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)", color: "#d4a574" }}>
            Good morning
          </h3>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
            Wednesday, April 2
          </p>
        </div>

        {/* Quick Stats Row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(232,223,207,0.03)", borderRadius: 8, padding: "6px 12px",
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-display)", color: s.accent || "rgba(232,223,207,0.6)" }}>
                {s.value}
              </span>
              <span style={{ fontSize: 11, color: "rgba(232,223,207,0.3)" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Site Traffic (30d) */}
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 16,
        }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>
            Site Traffic (30d)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Sessions", value: "1,247", change: 15.5 },
              { label: "Page Views", value: "3,891", change: 21.6 },
              { label: "Bounce Rate", value: "52.3%", change: -10.0, invert: true },
              { label: "Engagement", value: "61.4%", change: 11.6 },
            ].map((m) => {
              const isPositive = m.invert ? m.change < 0 : m.change > 0;
              const changeColor = isPositive ? "#22c55e" : "#ef4444";
              const arrow = m.change > 0 ? "↑" : "↓";
              return (
                <div key={m.label} style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#d4a574", fontFamily: "var(--font-display)" }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: changeColor, marginTop: 2, fontWeight: 600 }}>
                    {arrow} {Math.abs(m.change).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 16,
        }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>
            Recent Leads
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentLeads.map((lead) => {
              const st = STATUS_COLORS[lead.status] || STATUS_COLORS.new;
              return (
                <div key={lead.name} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10,
                  background: lead.status === "new" ? "rgba(59,130,246,0.04)" : "transparent",
                  border: "1px solid rgba(232,223,207,0.06)",
                }}>
                  <div style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                    padding: "3px 8px", borderRadius: 4, flexShrink: 0,
                    background: lead.type === "audit" ? "rgba(212,165,116,0.12)" : "rgba(232,223,207,0.06)",
                    color: lead.type === "audit" ? "#d4a574" : "rgba(232,223,207,0.4)",
                    fontFamily: "var(--font-display)",
                  }}>
                    {lead.type === "audit" ? "Audit" : "Contact"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{lead.name}</span>
                      <span style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{lead.company}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
                      {lead.msg}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                    background: st.bg, color: st.text,
                    fontFamily: "var(--font-display)", flexShrink: 0,
                  }}>
                    {lead.status}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", flexShrink: 0 }}>
                    {lead.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Sources + Meetings */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Top Sources */}
          <div style={{
            background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 12, padding: "20px 20px",
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>
              Top Sources
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topSources.map((s) => (
                <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 80, fontSize: 12, color: "rgba(232,223,207,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.source}
                  </div>
                  <div style={{ flex: 1, height: 5, background: "rgba(232,223,207,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${s.pct}%`, height: "100%", background: "#d4a574", borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", width: 50, textAlign: "right" }}>
                    {s.pct.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div style={{
            background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 12, padding: "20px 20px",
          }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>
              Upcoming Meetings
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Rachel Torres", date: "Mon, Apr 7 · 10:00 AM" },
                { name: "David Park", date: "Wed, Apr 9 · 2:30 PM" },
              ].map((m) => (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(232,223,207,0.08)" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.85)" }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{m.date}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 500 }}>Join →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Divider ─── */}
      <div style={{ borderTop: "1px solid rgba(232,223,207,0.06)", margin: "8px 20px 0" }} />

      {/* ─── GA4 Analytics Section ─── */}
      <div style={{ padding: "20px" }}>
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 16,
        }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>
            Website Analytics (30d)
          </h4>

          {/* GA4 KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Sessions", value: "1,247", change: 15.5 },
              { label: "Page Views", value: "3,891", change: 21.6 },
              { label: "Bounce Rate", value: "52.3%", change: -10.0, invert: true },
              { label: "Engagement", value: "61.4%", change: 11.6 },
            ].map((m) => {
              const isPositive = m.invert ? m.change < 0 : m.change > 0;
              const changeColor = isPositive ? "#22c55e" : "#ef4444";
              const arrow = m.change > 0 ? "↑" : "↓";
              return (
                <div key={m.label} style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: "var(--font-display)" }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{m.label}</div>
                  {m.change !== 0 && (
                    <div style={{ fontSize: 10, color: changeColor, marginTop: 4, fontWeight: 600 }}>
                      {arrow} {Math.abs(m.change).toFixed(1)}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Traffic Sources */}
          <h5 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: "var(--font-display)" }}>Traffic Sources</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
            {topSources.map((src) => (
              <div key={src.source} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 100, fontSize: 12, color: "rgba(232,223,207,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {src.source}
                </div>
                <div style={{ flex: 1, height: 6, background: "rgba(232,223,207,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${src.pct}%`, height: "100%", background: "#d4a574", borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", width: 60, textAlign: "right" }}>
                  {src.sessions} ({src.pct.toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>

          {/* Top Pages */}
          <h5 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: "var(--font-display)" }}>Top Pages</h5>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
            {topPages.map((page) => (
              <div key={page.page} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(232,223,207,0.05)" }}>
                <div style={{ flex: 1, fontSize: 12, color: "rgba(232,223,207,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {page.page}
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)" }}>{page.views} views</div>
                <div style={{
                  fontSize: 10, padding: "2px 6px", borderRadius: 4,
                  background: page.bounce < 50 ? "rgba(34,197,94,0.1)" : page.bounce < 70 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)",
                  color: page.bounce < 50 ? "#22c55e" : page.bounce < 70 ? "#eab308" : "#ef4444",
                }}>
                  {page.bounce.toFixed(0)}% bounce
                </div>
              </div>
            ))}
          </div>

          {/* User Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "rgba(34,197,94,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", fontFamily: "var(--font-display)" }}>892</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)" }}>New Users</div>
            </div>
            <div style={{ background: "rgba(59,130,246,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6", fontFamily: "var(--font-display)" }}>355</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)" }}>Returning</div>
            </div>
          </div>
        </div>

        {/* ─── Website Health ─── */}
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>Website Health</h4>
            <span style={{ fontSize: 11, color: "rgba(232,223,207,0.3)" }}>atlasops.co</span>
          </div>

          {/* Uptime */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
            background: "rgba(34,197,94,0.06)", borderRadius: 10, padding: "12px 16px",
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.4)" }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>Online</span>
              <span style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", marginLeft: 8 }}>HTTP 200</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#22c55e", fontFamily: "var(--font-display)" }}>245ms</div>
              <div style={{ fontSize: 10, color: "rgba(232,223,207,0.35)" }}>Response Time</div>
            </div>
          </div>

          {/* PageSpeed Gauges */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {healthScores.map((h) => {
              const color = scoreColor(h.score);
              const circ = 2 * Math.PI * 36;
              const offset = circ - (h.score / 100) * circ;
              return (
                <div key={h.label} style={{ background: "rgba(232,223,207,0.03)", borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
                  <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 8px" }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(232,223,207,0.06)" strokeWidth="6" />
                      <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6"
                        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                        transform="rotate(-90 40 40)" />
                    </svg>
                    <div style={{
                      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                      fontSize: 22, fontWeight: 800, color, fontFamily: "var(--font-display)",
                    }}>
                      {h.score}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", fontFamily: "var(--font-display)", fontWeight: 600 }}>{h.label}</div>
                </div>
              );
            })}
          </div>

          {/* Core Web Vitals */}
          <h5 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: "var(--font-display)" }}>Core Web Vitals</h5>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {vitals.map((v) => {
              const vColor = statusColorForVital(v.status);
              const vBg = v.status === "good" ? "rgba(34,197,94,0.06)" : v.status === "needs-improvement" ? "rgba(234,179,8,0.06)" : "rgba(239,68,68,0.06)";
              return (
                <div key={v.label} style={{ background: vBg, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,223,207,0.6)", fontFamily: "var(--font-display)" }}>{v.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: vColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>Good</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: vColor, fontFamily: "var(--font-display)" }}>{v.value}</div>
                  <div style={{ fontSize: 10, color: "rgba(232,223,207,0.3)", marginTop: 2 }}>{v.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Keyword Performance ─── */}
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px",
        }}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>
            Keyword Performance (30d)
          </h4>

          {/* Keyword KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Clicks", value: "125" },
              { label: "Impressions", value: "4,480" },
              { label: "Avg CTR", value: "2.8%" },
              { label: "Avg Position", value: "13.4" },
            ].map((k) => (
              <div key={k.label} style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: "var(--font-display)" }}>{k.value}</div>
                <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Keyword table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(232,223,207,0.1)" }}>
                <th style={{ textAlign: "left", padding: "8px 8px 8px 0", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: "var(--font-display)" }}>Keyword</th>
                <th style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: "var(--font-display)" }}>Clicks</th>
                <th style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: "var(--font-display)" }}>Impressions</th>
                <th style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: "var(--font-display)" }}>CTR</th>
                <th style={{ textAlign: "right", padding: "8px 0 8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: "var(--font-display)" }}>Position</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((kw) => (
                <tr key={kw.query} style={{ borderBottom: "1px solid rgba(232,223,207,0.05)" }}>
                  <td style={{ padding: "8px 8px 8px 0", color: "rgba(232,223,207,0.7)" }}>{kw.query}</td>
                  <td style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.6)" }}>{kw.clicks}</td>
                  <td style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.5)" }}>{kw.impressions.toLocaleString()}</td>
                  <td style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.5)" }}>{kw.ctr.toFixed(1)}%</td>
                  <td style={{
                    textAlign: "right", padding: "8px 0 8px 8px", fontWeight: 600,
                    color: kw.position <= 10 ? "#22c55e" : kw.position <= 20 ? "#eab308" : "rgba(232,223,207,0.4)",
                  }}>
                    {kw.position.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
