"use client";

import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { GA4Metrics } from "@/lib/ga4";

interface Submission {
  id: number;
  type: "contact" | "audit";
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  website: string | null;
  status: string;
  created_at: string;
}

interface Props {
  userName: string;
  tenantSlug: string;
  onboardingCompleted: boolean;
  submissions: Submission[];
  ga4Data: GA4Metrics | null;
  hasGA4: boolean;
  meetings: Record<string, unknown>[];
}

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
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  contacted: { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  closed: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
};

export function OverviewView({ userName, tenantSlug, onboardingCompleted, submissions, ga4Data, hasGA4, meetings }: Props) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const base = `/mission-control/${tenantSlug}`;
  const firstName = (userName || "").trim().split(" ")[0] || "";
  const greeting = firstName.length > 0 ? `${getGreeting()}, ${firstName}` : getGreeting();

  // Onboarding nudge
  if (!onboardingCompleted) {
    return (
      <div>
        <Header greeting={greeting} />
        <div style={{
          background: "rgba(212,165,116,0.08)", border: "1px solid rgba(212,165,116,0.2)",
          borderRadius: 16, padding: "32px 28px",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px 0", color: "#e8dfcf", fontFamily: 'var(--font-display)' }}>
            Let&apos;s get you set up
          </h2>
          <p style={{ color: "rgba(232,223,207,0.5)", fontSize: 14, margin: "0 0 20px 0" }}>
            Complete your workspace setup to start seeing leads and performance data.
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

  const newSubmissions = submissions.filter((s) => s.status === "new");
  const recentSubmissions = submissions.slice(0, 8);

  return (
    <div>
      {/* Header */}
      <Header greeting={greeting} />

      {/* Quick Stats Row */}
      <div style={{
        display: "flex", gap: isMobile ? 8 : 16, flexWrap: "wrap", marginTop: 16, marginBottom: 24,
      }}>
        <QuickStat label="Total Leads" value={submissions.length} />
        <QuickStat label="New" value={newSubmissions.length} accent={newSubmissions.length > 0 ? "#60a5fa" : undefined} />
        <QuickStat label="Audits" value={submissions.filter((s) => s.type === "audit").length} accent="#d4a574" />
        <QuickStat label="Contacts" value={submissions.filter((s) => s.type === "contact").length} />
        {meetings.length > 0 && <QuickStat label="Meetings" value={meetings.length} accent="#22c55e" />}
      </div>

      {/* GA4 Summary (compact) */}
      {ga4Data && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Site Traffic (30d)</h2>
            <button
              onClick={() => router.push(`${base}/signal`)}
              style={{ background: "none", border: "none", color: "#d4a574", fontSize: 12, cursor: "pointer", fontFamily: 'var(--font-body)' }}
            >
              View details →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12 }}>
            <CompactStat label="Sessions" value={ga4Data.sessions30d.toLocaleString()} change={ga4Data.comparison.sessions.changePercent} />
            <CompactStat label="Page Views" value={ga4Data.pageViews30d.toLocaleString()} change={ga4Data.comparison.pageViews.changePercent} />
            <CompactStat label="New Users" value={ga4Data.newUsers30d.toLocaleString()} change={ga4Data.comparison.newUsers.changePercent} />
            <CompactStat label="Bounce Rate" value={`${ga4Data.bounceRate30d.toFixed(1)}%`} change={ga4Data.comparison.bounceRate.changePercent} invertColor />
          </div>
        </div>
      )}

      {/* Recent Submissions */}
      <div style={{
        background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Recent Leads</h2>
          <button
            onClick={() => router.push(`${base}/crm`)}
            style={{ background: "none", border: "none", color: "#d4a574", fontSize: 12, cursor: "pointer", fontFamily: 'var(--font-body)' }}
          >
            View all →
          </button>
        </div>

        {recentSubmissions.length === 0 ? (
          <div style={{ color: "rgba(232,223,207,0.25)", fontSize: 13, textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>◉</div>
            <p style={{ margin: "0 0 4px 0" }}>No submissions yet</p>
            <p style={{ fontSize: 12, color: "rgba(232,223,207,0.15)" }}>Leads from your website contact and audit forms will appear here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {recentSubmissions.map((sub) => {
              const statusStyle = STATUS_COLORS[sub.status] || STATUS_COLORS.new;
              return (
                <div
                  key={`${sub.type}-${sub.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10,
                    background: sub.status === "new" ? "rgba(59,130,246,0.04)" : "transparent",
                    border: "1px solid rgba(232,223,207,0.06)",
                  }}
                >
                  {/* Type badge */}
                  <div style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const,
                    padding: "3px 8px", borderRadius: 4, flexShrink: 0,
                    background: sub.type === "audit" ? "rgba(212,165,116,0.12)" : "rgba(232,223,207,0.06)",
                    color: sub.type === "audit" ? "#d4a574" : "rgba(232,223,207,0.4)",
                    fontFamily: 'var(--font-display)',
                  }}>
                    {sub.type === "audit" ? "Audit" : "Contact"}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{sub.name}</span>
                      {sub.company && (
                        <span style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{sub.company}</span>
                      )}
                    </div>
                    {sub.message && (
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: isMobile ? 200 : 400 }}>
                        {sub.message}
                      </div>
                    )}
                  </div>

                  {/* Status + Time */}
                  {!isMobile && (
                    <div style={{
                      fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                      background: statusStyle.bg, color: statusStyle.text,
                      fontFamily: 'var(--font-display)', flexShrink: 0,
                    }}>
                      {sub.status}
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", flexShrink: 0 }}>
                    {formatTimeAgo(sub.created_at)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom row: Meetings + Lead Sources */}
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

        {/* Traffic sources summary */}
        {ga4Data && ga4Data.topSources.length > 0 ? (
          <div style={{
            background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 12, padding: "20px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Top Sources</h3>
              <button
                onClick={() => router.push(`${base}/signal`)}
                style={{ background: "none", border: "none", color: "#d4a574", fontSize: 12, cursor: "pointer", fontFamily: 'var(--font-body)' }}
              >
                Details →
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ga4Data.topSources.slice(0, 5).map((src) => (
                <div key={src.source} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 80, fontSize: 12, color: "rgba(232,223,207,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {src.source}
                  </div>
                  <div style={{ flex: 1, height: 5, background: "rgba(232,223,207,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${src.percentage}%`, height: "100%", background: "#d4a574", borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", width: 50, textAlign: "right" }}>
                    {src.percentage.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !hasGA4 ? (
          <div style={{
            background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 12, padding: "20px 20px",
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Traffic Sources</h3>
            <p style={{ fontSize: 13, color: "rgba(232,223,207,0.3)", margin: "0 0 14px 0" }}>
              Connect Google Analytics to see where your visitors come from.
            </p>
            <button
              onClick={() => router.push(`${base}/settings`)}
              style={{
                background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
                borderRadius: 8, padding: "6px 14px", fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
              }}
            >
              Connect in Settings →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function Header({ greeting }: { greeting: string }) {
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

function CompactStat({ label, value, change, invertColor }: { label: string; value: string; change: number; invertColor?: boolean }) {
  const isPositive = invertColor ? change < 0 : change > 0;
  const changeColor = change === 0 ? "rgba(232,223,207,0.3)" : isPositive ? "#22c55e" : "#ef4444";
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "";

  return (
    <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{label}</div>
      {change !== 0 && (
        <div style={{ fontSize: 10, color: changeColor, marginTop: 2, fontWeight: 600 }}>
          {arrow} {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
