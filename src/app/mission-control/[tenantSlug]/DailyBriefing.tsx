"use client";

import { useRouter } from "next/navigation";

interface BriefingData {
  pipelineStats: { stage: string; count: number }[];
  recentLeads: Record<string, unknown>[];
  upcomingMeetings: Record<string, unknown>[];
  recentActivities: Record<string, unknown>[];
  overdueFollowUps: Record<string, unknown>[];
}

interface Props {
  userName: string;
  tenantSlug: string;
  onboardingCompleted: boolean;
  data: BriefingData;
}

/* ─── Recommendation Engine ─── */

function generateRecommendations(data: BriefingData) {
  const issues: { priority: number; label: string; detail: string; action: string; link: string }[] = [];

  // Overdue follow-ups are the #1 issue
  if (data.overdueFollowUps.length > 0) {
    issues.push({
      priority: 1,
      label: "Overdue follow-ups",
      detail: `${data.overdueFollowUps.length} lead${data.overdueFollowUps.length > 1 ? "s" : ""} overdue for follow-up. Momentum is being lost.`,
      action: "Work overdue targets first",
      link: "targets",
    });
  }

  // High-score leads stuck in early stage
  const stuckLeads = data.recentLeads.filter(
    (l) => (l.fit_score as number) >= 75 && ["candidate", "qualified"].includes(l.stage as string)
  );
  if (stuckLeads.length > 0) {
    issues.push({
      priority: 2,
      label: "High-fit leads stalling",
      detail: `${stuckLeads.length} lead${stuckLeads.length > 1 ? "s" : ""} with 75+ fit score still in early pipeline. Move them forward.`,
      action: "Review and advance top leads",
      link: "crm",
    });
  }

  // No upcoming meetings
  if (data.upcomingMeetings.length === 0) {
    issues.push({
      priority: 3,
      label: "No meetings this week",
      detail: "Your calendar is empty for the next 7 days. Pipeline velocity depends on conversations.",
      action: "Book meetings with warm leads",
      link: "meetings",
    });
  }

  // Pipeline health
  const totalActive = data.pipelineStats
    .filter((s) => !["suppressed", "lost"].includes(s.stage))
    .reduce((sum, s) => sum + s.count, 0);
  if (totalActive === 0) {
    issues.push({
      priority: 1,
      label: "Empty pipeline",
      detail: "No active leads in your pipeline. Start generating or adding leads to get moving.",
      action: "Add your first leads",
      link: "crm",
    });
  }

  // Emailed leads with no reply
  const emailedCount = data.pipelineStats.find((s) => s.stage === "emailed")?.count ?? 0;
  if (emailedCount >= 5) {
    issues.push({
      priority: 3,
      label: "Waiting on replies",
      detail: `${emailedCount} leads emailed but no response yet. Consider a follow-up sequence.`,
      action: "Review emailed leads",
      link: "crm",
    });
  }

  issues.sort((a, b) => a.priority - b.priority);
  return issues;
}

function generateDailyTargets(data: BriefingData): Record<string, unknown>[] {
  const targets: Record<string, unknown>[] = [];

  // Priority 1: Overdue follow-ups (highest urgency)
  for (const lead of data.overdueFollowUps.slice(0, 3)) {
    targets.push({
      ...lead,
      reason: "Overdue follow-up: momentum at risk",
      recommended_action: lead.next_action || "Follow up",
    });
  }

  // Priority 2: High-score leads in actionable stages
  const actionable = data.recentLeads.filter(
    (l) =>
      !targets.some((t) => t.id === l.id) &&
      ["qualified", "ready_to_email", "replied_positive"].includes(l.stage as string)
  );
  for (const lead of actionable.slice(0, 5 - targets.length)) {
    const stage = lead.stage as string;
    const reason =
      stage === "replied_positive"
        ? "Positive reply: book a meeting"
        : stage === "ready_to_email"
          ? "Ready to email: send outreach"
          : "Qualified: advance to next stage";
    targets.push({
      ...lead,
      reason,
      recommended_action:
        stage === "replied_positive"
          ? "Book meeting"
          : stage === "ready_to_email"
            ? "Send email"
            : "Review and qualify",
    });
  }

  // Fill remaining with highest-score leads
  if (targets.length < 5) {
    const remaining = data.recentLeads.filter(
      (l) => !targets.some((t) => t.id === l.id) && !["suppressed", "lost", "won"].includes(l.stage as string)
    );
    for (const lead of remaining.slice(0, 5 - targets.length)) {
      targets.push({
        ...lead,
        reason: `Fit score ${lead.fit_score}: worth advancing`,
        recommended_action: lead.next_action || "Review lead",
      });
    }
  }

  return targets.slice(0, 5);
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getDateStr(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/* ─── Stage display helpers ─── */

const STAGE_LABELS: Record<string, string> = {
  candidate: "Candidate",
  qualified: "Qualified",
  ready_to_email: "Ready",
  emailed: "Emailed",
  replied_positive: "Replied +",
  replied_negative: "Replied −",
  meeting_requested: "Mtg Req",
  meeting_booked: "Mtg Booked",
  won: "Won",
  lost: "Lost",
  suppressed: "Suppressed",
};

const STAGE_COLORS: Record<string, string> = {
  candidate: "rgba(232,223,207,0.35)",
  qualified: "#d4a574",
  ready_to_email: "#e04747",
  emailed: "#3b82f6",
  replied_positive: "#22c55e",
  replied_negative: "#ef4444",
  meeting_requested: "#eab308",
  meeting_booked: "#22c55e",
  won: "#10b981",
  lost: "#6b7280",
  suppressed: "rgba(232,223,207,0.2)",
};

/* ─── Components ─── */

export function DailyBriefing({ userName, tenantSlug, onboardingCompleted, data }: Props) {
  const router = useRouter();
  const base = `/mission-control/${tenantSlug}`;
  const recommendations = generateRecommendations(data);
  const targets = generateDailyTargets(data);
  const firstName = (userName || "").trim().split(" ")[0] || "";
  const greeting = firstName.length > 0 ? `${getGreeting()}, ${firstName}` : getGreeting();
  const topIssue = recommendations[0];

  // Onboarding nudge
  if (!onboardingCompleted) {
    return (
      <div>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>
            {greeting}
          </h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 15, marginTop: 4 }}>{getDateStr()}</p>
        </div>

        <div style={{
          background: "rgba(212,165,116,0.08)",
          border: "1px solid rgba(212,165,116,0.2)",
          borderRadius: 16, padding: "32px 28px",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px 0", color: "#e8dfcf", fontFamily: 'var(--font-display)' }}>
            Let&apos;s get you set up
          </h2>
          <p style={{ color: "rgba(232,223,207,0.5)", fontSize: 14, margin: "0 0 20px 0" }}>
            Complete your workspace setup to unlock Daily Briefing, Targets, and recommendations.
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

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>
          {greeting}
        </h1>
        <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 15, marginTop: 4 }}>{getDateStr()}</p>
      </div>

      {/* Top Issue + Next Move */}
      {topIssue && (
        <div style={{
          background: "rgba(212,165,116,0.06)",
          border: "1px solid rgba(212,165,116,0.15)",
          borderRadius: 16, padding: "24px 28px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#d4a574", marginBottom: 8, fontFamily: 'var(--font-display)' }}>
                Biggest issue right now
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#e8dfcf", marginBottom: 4, fontFamily: 'var(--font-display)' }}>
                {topIssue.label}
              </div>
              <div style={{ fontSize: 14, color: "rgba(232,223,207,0.5)", lineHeight: 1.5 }}>
                {topIssue.detail}
              </div>
            </div>
            <div style={{
              background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
              borderRadius: 12, padding: "16px 20px", minWidth: 220,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#22c55e", marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                Next Move
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#e8dfcf", marginBottom: 10 }}>
                {topIssue.action}
              </div>
              <button
                onClick={() => router.push(`${base}/${topIssue.link}`)}
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
      )}

      {/* Empty state when no data at all */}
      {!topIssue && data.recentLeads.length === 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 16, padding: "40px 28px", textAlign: "center", marginBottom: 24,
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>◉</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", fontFamily: 'var(--font-display)' }}>Your briefing is ready</h2>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: "0 0 20px 0" }}>
            Add leads to your CRM and Mission Control will start generating daily recommendations.
          </p>
          <button
            onClick={() => router.push(`${base}/crm`)}
            style={{
              background: "#d4a574", color: "#1a1f2e", border: "none",
              borderRadius: 10, padding: "10px 20px", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            Open CRM
          </button>
        </div>
      )}

      {/* 5 Key Daily Targets */}
      {targets.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
              5 Key Daily Targets
            </h2>
            <button
              onClick={() => router.push(`${base}/targets`)}
              style={{ background: "none", border: "none", color: "#d4a574", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: 'var(--font-body)' }}
            >
              View all →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {targets.map((target, i) => (
              <div
                key={target.id as number ?? i}
                style={{
                  background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
                  borderRadius: 12, padding: "16px 20px",
                  display: "flex", alignItems: "center", gap: 16,
                  cursor: "pointer", transition: "border-color 0.15s",
                }}
                onClick={() => router.push(`${base}/crm?lead=${target.id}`)}
              >
                {/* Rank */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: i === 0 ? "rgba(212,165,116,0.15)" : "rgba(232,223,207,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  color: i === 0 ? "#d4a574" : "rgba(232,223,207,0.35)",
                  flexShrink: 0, fontFamily: 'var(--font-display)',
                }}>
                  {i + 1}
                </div>

                {/* Lead info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>
                      {(target.contact_name as string) || "Unknown"}
                    </span>
                    <span style={{
                      fontSize: 11, padding: "2px 6px", borderRadius: 4,
                      background: `${STAGE_COLORS[target.stage as string] ?? "rgba(232,223,207,0.35)"}20`,
                      color: STAGE_COLORS[target.stage as string] ?? "rgba(232,223,207,0.35)",
                      fontWeight: 500, fontFamily: 'var(--font-display)',
                    }}>
                      {STAGE_LABELS[target.stage as string] ?? target.stage}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>
                    {(target.company_name as string) || ""}{target.contact_title ? ` · ${target.contact_title}` : ""}
                  </div>
                  <div style={{ fontSize: 12, color: "#d4a574", marginTop: 4 }}>
                    {target.reason as string}
                  </div>
                </div>

                {/* Score */}
                <div style={{
                  textAlign: "center", flexShrink: 0, width: 48,
                }}>
                  <div style={{
                    fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)',
                    color: (target.fit_score as number) >= 75 ? "#22c55e" : (target.fit_score as number) >= 50 ? "#eab308" : "rgba(232,223,207,0.35)",
                  }}>
                    {target.fit_score as number}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(232,223,207,0.25)" }}>score</div>
                </div>

                {/* Action */}
                <div style={{
                  background: "rgba(212,165,116,0.1)", color: "#d4a574",
                  borderRadius: 8, padding: "6px 12px", fontSize: 12,
                  fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
                  fontFamily: 'var(--font-display)',
                }}>
                  {target.recommended_action as string}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom row: Meetings + Activity */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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

          {data.upcomingMeetings.length === 0 ? (
            <div style={{ color: "rgba(232,223,207,0.25)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              No meetings this week
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.upcomingMeetings.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < data.upcomingMeetings.length - 1 ? "1px solid rgba(232,223,207,0.08)" : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.85)" }}>{m.client_name as string}</div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>
                      {new Date(m.start_time as string).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {" · "}
                      {new Date(m.start_time as string).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </div>
                  </div>
                  {!!m.google_meet_url && (
                    <a
                      href={m.google_meet_url as string}
                      target="_blank"
                      rel="noopener"
                      style={{ fontSize: 11, color: "#22c55e", textDecoration: "none", fontWeight: 500 }}
                    >
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

          {data.recentActivities.length === 0 ? (
            <div style={{ color: "rgba(232,223,207,0.25)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
              No recent activity
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.recentActivities.map((a, i) => (
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

      {/* Pipeline Summary */}
      {data.pipelineStats.length > 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 12, padding: "20px 20px", marginTop: 16,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Pipeline</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {data.pipelineStats
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

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
