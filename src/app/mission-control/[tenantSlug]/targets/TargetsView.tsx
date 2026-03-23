"use client";

import { useRouter } from "next/navigation";

interface TargetsData {
  allLeads: Record<string, unknown>[];
  overdueLeads: Record<string, unknown>[];
}

const STAGE_LABELS: Record<string, string> = {
  candidate: "Candidate", qualified: "Qualified", ready_to_email: "Ready",
  emailed: "Emailed", replied_positive: "Replied +", replied_negative: "Replied −",
  meeting_requested: "Mtg Req", meeting_booked: "Mtg Booked", won: "Won",
};

const STAGE_COLORS: Record<string, string> = {
  candidate: "rgba(232,223,207,0.35)", qualified: "#d4a574", ready_to_email: "#e04747",
  emailed: "#3b82f6", replied_positive: "#22c55e", replied_negative: "#ef4444",
  meeting_requested: "#eab308", meeting_booked: "#22c55e", won: "#10b981",
};

function scoreDailyPriority(lead: Record<string, unknown>, isOverdue: boolean): number {
  let score = (lead.fit_score as number) ?? 0;

  // Overdue follow-ups are highest priority
  if (isOverdue) score += 100;

  // Stage urgency bonus
  const stage = lead.stage as string;
  if (stage === "replied_positive") score += 50;
  if (stage === "ready_to_email") score += 30;
  if (stage === "meeting_requested") score += 40;
  if (stage === "qualified") score += 10;

  // Recency penalty — stale leads drop
  if (lead.last_contacted_at) {
    const daysSince = Math.floor(
      (Date.now() - new Date(lead.last_contacted_at as string).getTime()) / 86400000
    );
    if (daysSince > 14) score -= 10;
    if (daysSince > 30) score -= 20;
  }

  return score;
}

function getRecommendedAction(lead: Record<string, unknown>): string {
  const stage = lead.stage as string;
  if (stage === "replied_positive") return "Book meeting";
  if (stage === "ready_to_email") return "Send outreach";
  if (stage === "emailed") return "Follow up";
  if (stage === "meeting_requested") return "Confirm meeting";
  if (stage === "meeting_booked") return "Prepare for meeting";
  if (stage === "qualified") return "Advance lead";
  return lead.next_action as string || "Review";
}

function getWhyReason(lead: Record<string, unknown>, isOverdue: boolean): string {
  if (isOverdue) return "Overdue follow-up: don't lose momentum";
  const stage = lead.stage as string;
  if (stage === "replied_positive") return "They responded positively: strike while warm";
  if (stage === "ready_to_email") return "Qualified and ready: send outreach now";
  if (stage === "meeting_requested") return "Meeting interest: confirm before it cools";
  if (stage === "qualified") return `Fit score ${lead.fit_score}: worth advancing`;
  if (stage === "emailed") return "Sent outreach: check for response";
  return lead.fit_reason as string || "High-priority target";
}

export function TargetsView({ tenantSlug, data }: { tenantSlug: string; data: TargetsData }) {
  const router = useRouter();
  const base = `/mission-control/${tenantSlug}`;

  // Build prioritized target list
  const overdueIds = new Set(data.overdueLeads.map((l) => l.id));
  const allLeadsScored: (Record<string, unknown> & { _priority: number; _isOverdue: boolean })[] = data.allLeads.map((lead) => ({
    ...lead,
    _priority: scoreDailyPriority(lead, overdueIds.has(lead.id as number)),
    _isOverdue: overdueIds.has(lead.id as number),
  }));
  allLeadsScored.sort((a, b) => b._priority - a._priority);

  const top5 = allLeadsScored.slice(0, 5);
  const rest = allLeadsScored.slice(5);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>5 Key Daily Targets</h1>
        <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
          The highest-leverage leads to work today, ranked by urgency, stage, and fit.
        </p>
      </div>

      {top5.length === 0 ? (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)", borderRadius: 16,
          padding: "48px 28px", textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px 0", fontFamily: 'var(--font-display)' }}>No targets yet</h2>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: "0 0 20px 0" }}>
            Import leads and Mission Control will automatically surface your highest-priority targets each day.
          </p>
          <button
            onClick={() => router.push(`${base}/crm`)}
            style={{
              background: "#d4a574", color: "#1a1f2e", border: "none",
              borderRadius: 10, padding: "10px 20px", fontSize: 14,
              fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            Import Leads →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {top5.map((target, i) => (
            <div
              key={target.id as number}
              style={{
                background: "#111827", border: `1px solid ${i === 0 ? "rgba(212,165,116,0.3)" : "rgba(232,223,207,0.1)"}`,
                borderRadius: 14, padding: "20px 24px",
                cursor: "pointer", transition: "border-color 0.15s",
              }}
              onClick={() => router.push(`${base}/crm?lead=${target.id}`)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Rank badge */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: i === 0 ? "rgba(212,165,116,0.15)" : "rgba(232,223,207,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 800,
                  color: i === 0 ? "#d4a574" : "rgba(232,223,207,0.25)",
                  fontFamily: 'var(--font-display)',
                }}>
                  {i + 1}
                </div>

                {/* Main content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#e8dfcf" }}>
                      {target.contact_name as string || "Unknown"}
                    </span>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 4,
                      background: `${STAGE_COLORS[target.stage as string] ?? "rgba(232,223,207,0.35)"}20`,
                      color: STAGE_COLORS[target.stage as string] ?? "rgba(232,223,207,0.35)",
                      fontWeight: 600, fontFamily: 'var(--font-display)',
                    }}>
                      {STAGE_LABELS[target.stage as string] ?? target.stage}
                    </span>
                    {target._isOverdue && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(239,68,68,0.15)", color: "#f87171", fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                        Overdue
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: 13, color: "rgba(232,223,207,0.5)", marginBottom: 6 }}>
                    {target.company_name as string || ""}
                    {target.contact_title ? ` · ${target.contact_title}` : ""}
                    {target.company_industry ? ` · ${target.company_industry}` : ""}
                  </div>

                  {/* Why this made the list */}
                  <div style={{ fontSize: 13, color: "#d4a574", marginBottom: 10, lineHeight: 1.4 }}>
                    {getWhyReason(target, target._isOverdue)}
                  </div>

                  {/* Actions row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); router.push(`${base}/crm?lead=${target.id}`); }}
                      style={{
                        background: "#d4a574", color: "#1a1f2e", border: "none",
                        borderRadius: 8, padding: "6px 14px", fontSize: 12,
                        fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
                      }}
                    >
                      {getRecommendedAction(target)}
                    </button>
                    {!!target.contact_email && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${target.contact_email}`;
                        }}
                        style={{
                          background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)", border: "none",
                          borderRadius: 8, padding: "6px 14px", fontSize: 12,
                          fontWeight: 500, cursor: "pointer",
                        }}
                      >
                        Email
                      </button>
                    )}
                    {!!target.contact_linkedin_url && (
                      <a
                        href={target.contact_linkedin_url as string}
                        target="_blank"
                        rel="noopener"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
                          borderRadius: 8, padding: "6px 14px", fontSize: 12,
                          fontWeight: 500, cursor: "pointer", textDecoration: "none",
                        }}
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: (target.fit_score as number) >= 75 ? "rgba(34,197,94,0.1)" : (target.fit_score as number) >= 50 ? "rgba(234,179,8,0.1)" : "rgba(232,223,207,0.05)",
                    fontSize: 18, fontWeight: 800,
                    color: (target.fit_score as number) >= 75 ? "#22c55e" : (target.fit_score as number) >= 50 ? "#eab308" : "rgba(232,223,207,0.35)",
                    fontFamily: 'var(--font-display)',
                  }}>
                    {target.fit_score as number}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(232,223,207,0.25)", marginTop: 4 }}>fit score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remaining leads */}
      {rest.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 14px 0", color: "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)' }}>
            Other Active Leads ({rest.length})
          </h2>
          <div style={{
            background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 12, overflow: "hidden",
          }}>
            {rest.map((lead, i) => (
              <div
                key={lead.id as number}
                onClick={() => router.push(`${base}/crm?lead=${lead.id}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", cursor: "pointer",
                  borderBottom: i < rest.length - 1 ? "1px solid rgba(232,223,207,0.08)" : "none",
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,223,207,0.85)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lead.contact_name as string || "Unknown"}
                </span>
                <span style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lead.company_name as string || ""}
                </span>
                <span style={{
                  fontSize: 11, padding: "2px 6px", borderRadius: 4,
                  background: `${STAGE_COLORS[lead.stage as string] ?? "rgba(232,223,207,0.35)"}15`,
                  color: STAGE_COLORS[lead.stage as string] ?? "rgba(232,223,207,0.35)",
                  fontWeight: 500, flexShrink: 0, fontFamily: 'var(--font-display)',
                }}>
                  {STAGE_LABELS[lead.stage as string] ?? lead.stage}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", flexShrink: 0, width: 32, textAlign: "right" }}>
                  {lead.fit_score as number}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
