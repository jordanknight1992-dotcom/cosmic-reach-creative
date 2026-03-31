"use client";

import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { BriefingOutput, Insight, DailyTarget } from "@/lib/briefing-engine";

interface Props {
  userName: string;
  tenantSlug: string;
  onboardingCompleted: boolean;
  briefing: BriefingOutput;
  meetings: Record<string, unknown>[];
  activities: Record<string, unknown>[];
  pipelineStats: { stage: string; count: number }[];
}

/* ─── Stage display helpers ─── */

const STAGE_LABELS: Record<string, string> = {
  candidate: "Candidate", qualified: "Qualified", ready_to_email: "Ready",
  emailed: "Emailed", replied_positive: "Replied +", replied_negative: "Replied −",
  meeting_requested: "Mtg Req", meeting_booked: "Mtg Booked",
  won: "Won", lost: "Lost", suppressed: "Suppressed",
};

const STAGE_COLORS: Record<string, string> = {
  candidate: "rgba(232,223,207,0.35)", qualified: "#d4a574",
  ready_to_email: "#e04747", emailed: "#3b82f6",
  replied_positive: "#22c55e", replied_negative: "#ef4444",
  meeting_requested: "#eab308", meeting_booked: "#22c55e",
  won: "#10b981", lost: "#6b7280", suppressed: "rgba(232,223,207,0.2)",
};

const SEVERITY_COLORS: Record<string, { bg: string; border: string; accent: string; icon: string }> = {
  critical: { bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.2)", accent: "#f87171", icon: "⚠" },
  warning: { bg: "rgba(234,179,8,0.06)", border: "rgba(234,179,8,0.2)", accent: "#eab308", icon: "◈" },
  info: { bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)", accent: "#60a5fa", icon: "◎" },
  positive: { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.2)", accent: "#22c55e", icon: "✓" },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDateStr(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });
}

function formatTimeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

/* ─── Components ─── */

export function DailyBriefing({ userName, tenantSlug, onboardingCompleted, briefing, meetings, activities, pipelineStats }: Props) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const base = `/mission-control/${tenantSlug}`;
  const firstName = (userName || "").trim().split(" ")[0] || "";
  const greeting = firstName.length > 0 ? `${getGreeting()}, ${firstName}` : getGreeting();

  // Onboarding nudge
  if (!onboardingCompleted) {
    return (
      <div>
        <BriefingHeader greeting={greeting} />
        <div style={{
          background: "rgba(212,165,116,0.08)", border: "1px solid rgba(212,165,116,0.2)",
          borderRadius: 16, padding: "32px 28px",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px 0", color: "#e8dfcf", fontFamily: 'var(--font-display)' }}>
            Let&apos;s get you set up
          </h2>
          <p style={{ color: "rgba(232,223,207,0.5)", fontSize: 14, margin: "0 0 20px 0" }}>
            Complete your workspace setup to start seeing lead activity and performance.
          </p>
          <button
            onClick={() => router.push(`${base}/onboarding`)}
            style={{
              background: "#d4a574", color: "#1a1f2e", border: "none",
              borderRadius: 10, padding: "12px 24px", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            Continue setup
          </button>
        </div>
      </div>
    );
  }

  const { topInsight, insights, targets, momentum, driftAlerts, narrativeSummary, quickStats } = briefing;

  return (
    <div>
      {/* Header + Quick Stats */}
      <div style={{ marginBottom: 24 }}>
        <BriefingHeader greeting={greeting} />

        {/* Quick Stats Row */}
        {quickStats.totalActive > 0 && (
          <div style={{
            display: "flex", gap: isMobile ? 8 : 16, flexWrap: "wrap", marginTop: 16,
          }}>
            <QuickStat label="Active" value={quickStats.totalActive} />
            <QuickStat label="Hot" value={quickStats.hotLeads} accent={quickStats.hotLeads > 0 ? "#22c55e" : undefined} />
            <QuickStat label="Overdue" value={quickStats.overdueCount} accent={quickStats.overdueCount > 0 ? "#f87171" : undefined} />
            <QuickStat label="Meetings" value={quickStats.meetingsThisWeek} />
            {quickStats.newToday > 0 && <QuickStat label="New today" value={quickStats.newToday} accent="#60a5fa" />}
            {quickStats.stageChangesToday > 0 && <QuickStat label="Moved" value={quickStats.stageChangesToday} accent="#22c55e" />}
          </div>
        )}
      </div>

      {/* Narrative Summary */}
      {narrativeSummary && quickStats.totalActive > 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.08)",
          borderRadius: 12, padding: "16px 20px", marginBottom: 20,
          fontSize: 14, lineHeight: 1.6, color: "rgba(232,223,207,0.6)",
        }}>
          {narrativeSummary}
        </div>
      )}

      {/* Top Insight + Next Move */}
      {topInsight && <TopInsightCard insight={topInsight} base={base} router={router} isMobile={isMobile} />}

      {/* Empty state */}
      {!topInsight && quickStats.totalActive === 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 16, padding: "40px 28px", textAlign: "center", marginBottom: 24,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>◉</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", fontFamily: 'var(--font-display)' }}>Ready when you are</h2>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: "0 0 20px 0" }}>
            Import leads to start tracking activity, sources, and follow-ups.
          </p>
          <button
            onClick={() => router.push(`${base}/crm`)}
            style={{
              background: "#d4a574", color: "#1a1f2e", border: "none",
              borderRadius: 10, padding: "10px 20px", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            Import Leads
          </button>
        </div>
      )}

      {/* Additional Insights (beyond top) */}
      {insights.length > 1 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px 0", color: "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)', letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
            What needs attention
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.slice(1, 4).map((insight) => (
              <InsightRow key={insight.id} insight={insight} base={base} router={router} />
            ))}
          </div>
        </div>
      )}

      {/* 5 Key Daily Targets */}
      {targets.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
              Leads to Follow Up
            </h2>
            <button
              onClick={() => router.push(`${base}/crm`)}
              style={{ background: "none", border: "none", color: "#d4a574", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: 'var(--font-body)' }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {targets.map((target) => (
              <TargetCard key={target.lead.id} target={target} base={base} router={router} isMobile={isMobile} />
            ))}
          </div>
        </div>
      )}

      {/* Momentum Indicators */}
      {momentum.length > 0 && quickStats.totalActive > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px 0", color: "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)', letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
            Momentum
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : `repeat(${Math.min(momentum.length, 5)}, 1fr)`, gap: 8 }}>
            {momentum.map((m) => (
              <div key={m.label} style={{
                background: "#111827", border: "1px solid rgba(232,223,207,0.08)",
                borderRadius: 10, padding: "14px 16px", textAlign: "center",
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)',
                  color: m.trend === "up" ? "#22c55e" : m.trend === "down" ? "#f87171" : "rgba(232,223,207,0.6)",
                }}>
                  {m.label === "Response rate" ? `${m.value}%` : m.value}
                  {m.label === "Avg. early-stage age" && <span style={{ fontSize: 11, fontWeight: 400, color: "rgba(232,223,207,0.3)" }}>d</span>}
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,223,207,0.35)", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drift Alerts (day-over-day changes) */}
      {driftAlerts && driftAlerts.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px 0", color: "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)', letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
            Day-over-day changes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {driftAlerts.map((alert) => {
              const isCritical = alert.severity === "critical";
              const isPositive = alert.delta < 0 && (alert.id.includes("overdue") || alert.id.includes("neglect") || alert.id.includes("stale") || alert.id.includes("cooling"));
              const color = isPositive ? "#22c55e" : isCritical ? "#f87171" : "#eab308";
              const bg = isPositive ? "rgba(34,197,94,0.06)" : isCritical ? "rgba(248,113,113,0.06)" : "rgba(234,179,8,0.06)";
              return (
                <div key={alert.id} style={{
                  background: bg, border: `1px solid ${color}20`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: 8, padding: "10px 14px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 13, color: "#e8dfcf" }}>{alert.message}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)',
                    color, minWidth: 50, textAlign: "right",
                  }}>
                    {alert.delta > 0 ? "+" : ""}{alert.delta}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom row: Meetings + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
        {/* Upcoming meetings */}
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 12, padding: "20px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Upcoming Meetings</h3>
            <button
              onClick={() => router.push(`${base}/meetings`)}
              style={{ background: "none", border: "none", color: "#d4a574", fontSize: 12, cursor: "pointer", fontFamily: 'var(--font-body)' }}
            >
              View all →
            </button>
          </div>
          {meetings.length === 0 ? (
            <div style={{ color: "rgba(232,223,207,0.25)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              No meetings this week
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meetings.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < meetings.length - 1 ? "1px solid rgba(232,223,207,0.08)" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.85)" }}>{m.client_name as string}</div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>
                      {new Date(m.start_time as string).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {" · "}
                      {new Date(m.start_time as string).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                  {!!m.google_meet_url && (
                    <a href={m.google_meet_url as string} target="_blank" rel="noopener"
                      style={{ fontSize: 11, color: "#22c55e", textDecoration: "none", fontWeight: 500 }}>
                      Join →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 12, padding: "20px 20px",
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Recent Activity</h3>
          {activities.length === 0 ? (
            <div style={{ color: "rgba(232,223,207,0.25)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              No recent activity
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {activities.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0" }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%", marginTop: 6, flexShrink: 0,
                    background:
                      (a.type as string) === "email_sent" ? "#3b82f6" :
                      (a.type as string) === "reply_logged" ? "#22c55e" :
                      (a.type as string) === "stage_change" ? "#eab308" :
                      "rgba(232,223,207,0.25)",
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "rgba(232,223,207,0.85)" }}>
                      {a.body_preview as string || `${(a.type as string).replace(/_/g, " ")}`}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginTop: 2 }}>
                      {a.contact_name ? String(a.contact_name) : ""}
                      {a.company_name ? ` · ${String(a.company_name)}` : ""}
                      {" · "}
                      {formatTimeAgo(a.created_at as string)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead Status */}
      {pipelineStats.length > 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 12, padding: "20px 20px", marginTop: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Lead Status</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {pipelineStats
              .filter((s) => !["suppressed", "lost"].includes(s.stage))
              .map((s) => (
                <div key={s.stage} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 10px", borderRadius: 8,
                  background: `${STAGE_COLORS[s.stage] ?? "rgba(232,223,207,0.35)"}10`,
                }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: STAGE_COLORS[s.stage] ?? "rgba(232,223,207,0.35)", fontFamily: 'var(--font-display)' }}>
                    {s.count}
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(232,223,207,0.5)" }}>
                    {STAGE_LABELS[s.stage] ?? s.stage}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function BriefingHeader({ greeting }: { greeting: string }) {
  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>
        {greeting}
      </h1>
      <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 15, marginTop: 4 }}>{getDateStr()}</p>
    </div>
  );
}

function QuickStat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "rgba(232,223,207,0.03)", borderRadius: 8, padding: "6px 12px",
    }}>
      <span style={{
        fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)',
        color: accent || "rgba(232,223,207,0.6)",
      }}>
        {value}
      </span>
      <span style={{ fontSize: 11, color: "rgba(232,223,207,0.3)" }}>{label}</span>
    </div>
  );
}

function TopInsightCard({ insight, base, router, isMobile }: {
  insight: Insight;
  base: string;
  router: ReturnType<typeof useRouter>;
  isMobile: boolean;
}) {
  const colors = SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.info;

  return (
    <div style={{
      background: colors.bg, border: `1px solid ${colors.border}`,
      borderRadius: 16, padding: "24px 28px", marginBottom: 24,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: isMobile ? 0 : 280 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const,
            color: colors.accent, marginBottom: 8, fontFamily: 'var(--font-display)',
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>{colors.icon}</span>
            {insight.severity === "critical" ? "Requires attention" : insight.severity === "positive" ? "Positive signal" : "Worth noting"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e8dfcf", marginBottom: 4, fontFamily: 'var(--font-display)' }}>
            {insight.headline}
          </div>
          <div style={{ fontSize: 14, color: "rgba(232,223,207,0.5)", lineHeight: 1.5 }}>
            {insight.detail}
          </div>
        </div>
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 12, padding: "16px 20px", minWidth: isMobile ? 0 : 220,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#22c55e", marginBottom: 6, fontFamily: 'var(--font-display)' }}>
            Next Move
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#e8dfcf", marginBottom: 10 }}>
            {insight.action}
          </div>
          <button
            onClick={() => router.push(`${base}/${insight.link}`)}
            style={{
              background: "#d4a574", color: "#1a1f2e", border: "none",
              borderRadius: 8, padding: "8px 16px", fontSize: 13,
              fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            Go →
          </button>
        </div>
      </div>
    </div>
  );
}

function InsightRow({ insight, base, router }: {
  insight: Insight;
  base: string;
  router: ReturnType<typeof useRouter>;
}) {
  const colors = SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.info;

  return (
    <div
      onClick={() => router.push(`${base}/${insight.link}`)}
      style={{
        background: "#111827", border: `1px solid ${colors.border}`,
        borderRadius: 10, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", transition: "border-color 0.15s",
        borderLeft: `3px solid ${colors.accent}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{insight.headline}</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(232,223,207,0.4)", marginTop: 2, lineHeight: 1.4 }}>
          {insight.detail.length > 120 ? insight.detail.slice(0, 120) + "..." : insight.detail}
        </div>
      </div>
      <div style={{
        background: `${colors.accent}15`, color: colors.accent,
        borderRadius: 8, padding: "6px 12px", fontSize: 12,
        fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
        fontFamily: 'var(--font-display)',
      }}>
        {insight.action}
      </div>
    </div>
  );
}

function TargetCard({ target, base, router, isMobile }: {
  target: DailyTarget;
  base: string;
  router: ReturnType<typeof useRouter>;
  isMobile: boolean;
}) {
  const lead = target.lead;
  const stageColor = STAGE_COLORS[lead.stage] ?? "rgba(232,223,207,0.35)";

  return (
    <div
      style={{
        background: "#111827",
        border: `1px solid ${target.rank === 1 ? "rgba(212,165,116,0.3)" : "rgba(232,223,207,0.1)"}`,
        borderRadius: 12, padding: isMobile ? "14px 16px" : "16px 20px",
        display: "flex", alignItems: "center", gap: isMobile ? 12 : 16,
        cursor: "pointer", transition: "border-color 0.15s",
      }}
      onClick={() => router.push(`${base}/crm?lead=${lead.id}`)}
    >
      {/* Rank */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: target.rank === 1 ? "rgba(212,165,116,0.15)" : "rgba(232,223,207,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700,
        color: target.rank === 1 ? "#d4a574" : "rgba(232,223,207,0.35)",
        flexShrink: 0, fontFamily: 'var(--font-display)',
      }}>
        {target.rank}
      </div>

      {/* Lead info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>
            {lead.contact_name || "Unknown"}
          </span>
          <span style={{
            fontSize: 11, padding: "2px 6px", borderRadius: 4,
            background: `${stageColor}20`, color: stageColor,
            fontWeight: 500, fontFamily: 'var(--font-display)',
          }}>
            {STAGE_LABELS[lead.stage] ?? lead.stage}
          </span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>
          {lead.company_name || ""}{lead.contact_title ? ` · ${lead.contact_title}` : ""}
        </div>
        <div style={{ fontSize: 12, color: "#d4a574", marginTop: 4 }}>
          {target.reason}
        </div>
        {/* Signals */}
        {target.signals.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            {target.signals.slice(0, 3).map((s, i) => (
              <span key={i} style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 4,
                background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.3)",
              }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Score */}
      {!isMobile && (
        <div style={{ textAlign: "center", flexShrink: 0, width: 48 }}>
          <div style={{
            fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
            color: lead.fit_score >= 75 ? "#22c55e" : lead.fit_score >= 50 ? "#eab308" : "rgba(232,223,207,0.35)",
          }}>
            {lead.fit_score}
          </div>
          <div style={{ fontSize: 10, color: "rgba(232,223,207,0.25)" }}>score</div>
        </div>
      )}

      {/* Action */}
      <div style={{
        background: "rgba(212,165,116,0.1)", color: "#d4a574",
        borderRadius: 8, padding: "6px 12px", fontSize: 12,
        fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
        fontFamily: 'var(--font-display)',
      }}>
        {target.action}
      </div>
    </div>
  );
}
