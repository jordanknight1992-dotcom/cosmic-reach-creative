"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Submission {
  id: number;
  type: "contact" | "audit";
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  website: string | null;
  status: string;
  notes: string;
  created_at: string;
}

const STATUS_OPTIONS = ["new", "contacted", "closed"];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  contacted: { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  closed: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
};

type FilterType = "all" | "contact" | "audit";
type FilterStatus = "all" | "new" | "contacted" | "closed";

export function LeadsView({ tenantSlug, submissions }: { tenantSlug: string; submissions: Submission[] }) {
  const isMobile = useIsMobile();
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = submissions.filter((s) => {
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    return true;
  });

  const counts = {
    all: submissions.length,
    contact: submissions.filter((s) => s.type === "contact").length,
    audit: submissions.filter((s) => s.type === "audit").length,
    new: submissions.filter((s) => s.status === "new").length,
    contacted: submissions.filter((s) => s.status === "contacted").length,
    closed: submissions.filter((s) => s.status === "closed").length,
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>Leads</h1>
        <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
          Form submissions from your website.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {/* Type filters */}
        {(["all", "contact", "audit"] as FilterType[]).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            style={{
              background: filterType === t ? "rgba(212,165,116,0.15)" : "rgba(232,223,207,0.04)",
              border: filterType === t ? "1px solid rgba(212,165,116,0.3)" : "1px solid rgba(232,223,207,0.08)",
              borderRadius: 8, padding: "6px 14px", fontSize: 13,
              fontWeight: filterType === t ? 600 : 400,
              color: filterType === t ? "#d4a574" : "rgba(232,223,207,0.5)",
              cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            {t === "all" ? "All" : t === "contact" ? "Contacts" : "Audits"} ({counts[t]})
          </button>
        ))}
        <div style={{ width: 1, background: "rgba(232,223,207,0.1)", margin: "0 4px" }} />
        {/* Status filters */}
        {(["all", "new", "contacted", "closed"] as FilterStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              background: filterStatus === s ? "rgba(232,223,207,0.08)" : "transparent",
              border: filterStatus === s ? "1px solid rgba(232,223,207,0.15)" : "1px solid transparent",
              borderRadius: 8, padding: "6px 12px", fontSize: 12,
              fontWeight: filterStatus === s ? 600 : 400,
              color: filterStatus === s ? "rgba(232,223,207,0.8)" : "rgba(232,223,207,0.35)",
              cursor: "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            {s === "all" ? "Any status" : s} {s !== "all" && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "40px 28px", textAlign: "center",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>◉</div>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: 0 }}>
            {submissions.length === 0
              ? "No submissions yet. Leads from your website forms will appear here."
              : "No leads match the current filters."
            }
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((sub) => {
            const key = `${sub.type}-${sub.id}`;
            const isExpanded = expandedId === key;
            const statusStyle = STATUS_COLORS[sub.status] || STATUS_COLORS.new;

            return (
              <div
                key={key}
                style={{
                  background: "#111827", border: "1px solid rgba(232,223,207,0.08)",
                  borderRadius: 12, overflow: "hidden",
                }}
              >
                {/* Summary row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: isMobile ? "12px 14px" : "14px 20px",
                    cursor: "pointer", transition: "background 0.15s",
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

                  {/* Name + company */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{sub.name}</span>
                      {sub.company && (
                        <span style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{sub.company}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.3)", marginTop: 1 }}>{sub.email}</div>
                  </div>

                  {/* Status */}
                  <div style={{
                    fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
                    background: statusStyle.bg, color: statusStyle.text,
                    fontFamily: 'var(--font-display)', flexShrink: 0,
                  }}>
                    {sub.status}
                  </div>

                  {/* Date */}
                  {!isMobile && (
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", flexShrink: 0, width: 90, textAlign: "right" }}>
                      {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  )}

                  {/* Expand indicator */}
                  <div style={{ fontSize: 12, color: "rgba(232,223,207,0.2)", flexShrink: 0 }}>
                    {isExpanded ? "▾" : "▸"}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{
                    borderTop: "1px solid rgba(232,223,207,0.06)",
                    padding: isMobile ? "14px 14px" : "16px 20px",
                    background: "rgba(0,0,0,0.15)",
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                      <div>
                        <DetailLabel>Email</DetailLabel>
                        <DetailValue>
                          <a href={`mailto:${sub.email}`} style={{ color: "#d4a574", textDecoration: "none" }}>{sub.email}</a>
                        </DetailValue>

                        {sub.website && (
                          <>
                            <DetailLabel>Website</DetailLabel>
                            <DetailValue>
                              <a href={sub.website.startsWith("http") ? sub.website : `https://${sub.website}`} target="_blank" rel="noopener" style={{ color: "#d4a574", textDecoration: "none" }}>{sub.website}</a>
                            </DetailValue>
                          </>
                        )}

                        <DetailLabel>Submitted</DetailLabel>
                        <DetailValue>{new Date(sub.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</DetailValue>
                      </div>

                      <div>
                        {sub.message && (
                          <>
                            <DetailLabel>{sub.type === "audit" ? "What feels stuck" : "Message"}</DetailLabel>
                            <DetailValue>{sub.message}</DetailValue>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status update buttons */}
                    <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                      {STATUS_OPTIONS.map((status) => (
                        <StatusButton
                          key={status}
                          label={status}
                          active={sub.status === status}
                          submissionType={sub.type}
                          submissionId={sub.id}
                          tenantSlug={tenantSlug}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,223,207,0.35)", marginTop: 10, marginBottom: 2, fontFamily: 'var(--font-display)', letterSpacing: "0.03em", textTransform: "uppercase" as const }}>
      {children}
    </div>
  );
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: "rgba(232,223,207,0.7)", lineHeight: 1.5 }}>
      {children}
    </div>
  );
}

function StatusButton({ label, active, submissionType, submissionId, tenantSlug }: {
  label: string;
  active: boolean;
  submissionType: "contact" | "audit";
  submissionId: number;
  tenantSlug: string;
}) {
  const [updating, setUpdating] = useState(false);

  async function handleClick() {
    if (active || updating) return;
    setUpdating(true);
    try {
      await fetch(`/api/mc/${tenantSlug}/submission-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: submissionType, id: submissionId, status: label }),
      });
      // Reload to reflect change
      window.location.reload();
    } catch {
      setUpdating(false);
    }
  }

  const statusStyle = STATUS_COLORS[label] || STATUS_COLORS.new;

  return (
    <button
      onClick={handleClick}
      disabled={active || updating}
      style={{
        background: active ? statusStyle.bg : "transparent",
        border: `1px solid ${active ? statusStyle.text + "40" : "rgba(232,223,207,0.1)"}`,
        borderRadius: 6, padding: "5px 12px", fontSize: 12,
        fontWeight: active ? 600 : 400,
        color: active ? statusStyle.text : "rgba(232,223,207,0.4)",
        cursor: active ? "default" : "pointer",
        fontFamily: 'var(--font-display)',
        textTransform: "capitalize" as const,
        opacity: updating ? 0.5 : 1,
      }}
    >
      {updating ? "..." : label}
    </button>
  );
}
