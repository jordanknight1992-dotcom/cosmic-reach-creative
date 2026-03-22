"use client";

import { useRouter } from "next/navigation";
import type { GA4Metrics } from "@/lib/ga4";

interface SignalData {
  pipelineStats: { stage: string; count: number }[];
  recentLeads: Record<string, unknown>[];
  overdueCount: number;
  hasGA4: boolean;
  ga4Data: GA4Metrics | null;
  connectedProviders: string[];
}

const STAGE_COLORS: Record<string, string> = {
  candidate: "rgba(232,223,207,0.35)", qualified: "#d4a574", ready_to_email: "#e04747",
  emailed: "#3b82f6", replied_positive: "#22c55e", meeting_booked: "#22c55e",
  won: "#10b981",
};

const STAGE_LABELS: Record<string, string> = {
  candidate: "Candidate", qualified: "Qualified", ready_to_email: "Ready",
  emailed: "Emailed", replied_positive: "Replied +", meeting_booked: "Mtg Booked", won: "Won",
};

export function SignalView({ tenantSlug, data }: { tenantSlug: string; data: SignalData }) {
  const router = useRouter();
  const base = `/mission-control/${tenantSlug}`;

  const totalActive = data.pipelineStats
    .filter((s) => !["suppressed", "lost"].includes(s.stage))
    .reduce((sum, s) => sum + s.count, 0);

  const wonCount = data.pipelineStats.find((s) => s.stage === "won")?.count ?? 0;
  const repliedCount = data.pipelineStats.find((s) => s.stage === "replied_positive")?.count ?? 0;
  const emailedCount = data.pipelineStats.find((s) => s.stage === "emailed")?.count ?? 0;

  // Biggest issue computation
  let biggestIssue = { label: "Looking good", detail: "No critical issues detected.", type: "neutral" };
  if (totalActive === 0) {
    biggestIssue = { label: "Empty pipeline", detail: "Add leads to start generating signal.", type: "warning" };
  } else if (data.overdueCount > 0) {
    biggestIssue = { label: `${data.overdueCount} overdue follow-up${data.overdueCount > 1 ? "s" : ""}`, detail: "Leads are going cold. Work your overdue targets.", type: "danger" };
  } else if (emailedCount > 5 && repliedCount === 0) {
    biggestIssue = { label: "Low reply rate", detail: `${emailedCount} leads emailed with no positive replies yet. Review your outreach.`, type: "warning" };
  }

  let nextMove = "Review your 5 daily targets";
  if (data.overdueCount > 0) nextMove = "Work your overdue follow-ups first";
  else if (repliedCount > 0) nextMove = "Book meetings with warm replies";

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>Digital Signal</h1>
        <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
          Recommendation-first view of your pipeline health and activity signal.
        </p>
      </div>

      {/* Top: Biggest Issue + Next Move */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24,
      }}>
        <div style={{
          background: biggestIssue.type === "danger" ? "rgba(239,68,68,0.06)" : biggestIssue.type === "warning" ? "rgba(234,179,8,0.06)" : "rgba(34,197,94,0.06)",
          border: `1px solid ${biggestIssue.type === "danger" ? "rgba(239,68,68,0.15)" : biggestIssue.type === "warning" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)"}`,
          borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: biggestIssue.type === "danger" ? "#f87171" : biggestIssue.type === "warning" ? "#eab308" : "#22c55e", marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            Biggest Issue
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#e8dfcf", marginBottom: 4, fontFamily: 'var(--font-display)' }}>{biggestIssue.label}</div>
          <div style={{ fontSize: 13, color: "rgba(232,223,207,0.5)" }}>{biggestIssue.detail}</div>
        </div>

        <div style={{
          background: "rgba(212,165,116,0.06)", border: "1px solid rgba(212,165,116,0.15)",
          borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#22c55e", marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            Next Move
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#e8dfcf", marginBottom: 10, fontFamily: 'var(--font-display)' }}>{nextMove}</div>
          <button
            onClick={() => router.push(`${base}/targets`)}
            style={{
              background: "#e04747", color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            Go to Targets →
          </button>
        </div>
      </div>

      {/* Pipeline Health */}
      <div style={{
        background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Pipeline Health</h2>

        {totalActive === 0 ? (
          <div style={{ color: "rgba(232,223,207,0.25)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
            No active pipeline data yet
          </div>
        ) : (
          <>
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              <KpiCard label="Active Leads" value={totalActive} color="#d4a574" />
              <KpiCard label="Won" value={wonCount} color="#22c55e" />
              <KpiCard label="Replied +" value={repliedCount} color="#22c55e" />
              <KpiCard label="Overdue" value={data.overdueCount} color={data.overdueCount > 0 ? "#ef4444" : "rgba(232,223,207,0.35)"} />
            </div>

            {/* Stage bar */}
            <div style={{ display: "flex", gap: 2, height: 8, borderRadius: 4, overflow: "hidden", background: "rgba(232,223,207,0.08)" }}>
              {data.pipelineStats
                .filter((s) => !["suppressed", "lost"].includes(s.stage))
                .map((s) => (
                  <div
                    key={s.stage}
                    style={{
                      flex: s.count,
                      background: STAGE_COLORS[s.stage] ?? "rgba(232,223,207,0.25)",
                      minWidth: s.count > 0 ? 4 : 0,
                    }}
                  />
                ))}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              {data.pipelineStats
                .filter((s) => !["suppressed", "lost"].includes(s.stage))
                .map((s) => (
                  <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: STAGE_COLORS[s.stage] ?? "rgba(232,223,207,0.25)" }} />
                    <span style={{ fontSize: 12, color: "rgba(232,223,207,0.5)" }}>{STAGE_LABELS[s.stage] ?? s.stage} ({s.count})</span>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      {/* GA4 Analytics Dashboard */}
      {data.ga4Data ? (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Website Analytics (30d)</h2>

          {/* GA4 KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <GA4KpiCard
              label="Sessions"
              value={data.ga4Data.sessions30d.toLocaleString()}
              change={data.ga4Data.comparison.sessions.changePercent}
            />
            <GA4KpiCard
              label="Page Views"
              value={data.ga4Data.pageViews30d.toLocaleString()}
              change={data.ga4Data.comparison.pageViews.changePercent}
            />
            <GA4KpiCard
              label="Bounce Rate"
              value={`${data.ga4Data.bounceRate30d.toFixed(1)}%`}
              change={data.ga4Data.comparison.bounceRate.changePercent}
              invertColor
            />
            <GA4KpiCard
              label="Engagement"
              value={`${data.ga4Data.engagementRate30d.toFixed(1)}%`}
              change={data.ga4Data.comparison.engagement.changePercent}
            />
          </div>

          {/* Traffic Sources */}
          {data.ga4Data.topSources.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Traffic Sources</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.ga4Data.topSources.slice(0, 6).map((src) => (
                  <div key={src.source} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 100, fontSize: 12, color: "rgba(232,223,207,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {src.source}
                    </div>
                    <div style={{ flex: 1, height: 6, background: "rgba(232,223,207,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${src.percentage}%`, height: "100%", background: "#d4a574", borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", width: 60, textAlign: "right" }}>
                      {src.sessions} ({src.percentage.toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Pages */}
          {data.ga4Data.topPages.length > 0 && (
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Top Pages</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {data.ga4Data.topPages.slice(0, 5).map((page) => (
                  <div key={page.page} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(232,223,207,0.05)" }}>
                    <div style={{ flex: 1, fontSize: 12, color: "rgba(232,223,207,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {page.page}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)" }}>{page.views} views</div>
                    <div style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 4,
                      background: page.bounceRate < 50 ? "rgba(34,197,94,0.1)" : page.bounceRate < 70 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)",
                      color: page.bounceRate < 50 ? "#22c55e" : page.bounceRate < 70 ? "#eab308" : "#ef4444",
                    }}>
                      {page.bounceRate.toFixed(0)}% bounce
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{ background: "rgba(34,197,94,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", fontFamily: 'var(--font-display)' }}>{data.ga4Data.newUsers30d}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)" }}>New Users</div>
            </div>
            <div style={{ background: "rgba(59,130,246,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6", fontFamily: 'var(--font-display)' }}>{data.ga4Data.returningUsers30d}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)" }}>Returning</div>
            </div>
          </div>
        </div>
      ) : !data.hasGA4 ? (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "24px 24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28, opacity: 0.3 }}>◇</div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>
                Connect Google Analytics for deeper signal
              </h3>
              <p style={{ fontSize: 13, color: "rgba(232,223,207,0.35)", margin: 0 }}>
                When connected, Mission Control will use your traffic data to enhance recommendations and surface website performance insights.
              </p>
              <button
                onClick={() => router.push(`${base}/settings`)}
                style={{
                  background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
                  borderRadius: 8, padding: "6px 14px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", marginTop: 12,
                  fontFamily: 'var(--font-display)',
                }}
              >
                Connect in Settings →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GA4KpiCard({ label, value, change, invertColor }: { label: string; value: string; change: number; invertColor?: boolean }) {
  const isPositive = invertColor ? change < 0 : change > 0;
  const changeColor = change === 0 ? "rgba(232,223,207,0.3)" : isPositive ? "#22c55e" : "#ef4444";
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "";
  return (
    <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{label}</div>
      {change !== 0 && (
        <div style={{ fontSize: 10, color: changeColor, marginTop: 4, fontWeight: 600 }}>
          {arrow} {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: `${color}08`, borderRadius: 10, padding: "14px 16px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{label}</div>
    </div>
  );
}
