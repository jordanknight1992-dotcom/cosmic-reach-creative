"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CrmData {
  leads: Record<string, unknown>[];
  stats: { stage: string; count: number }[];
}

const STAGES = [
  { key: "all", label: "All" },
  { key: "candidate", label: "Candidate" },
  { key: "qualified", label: "Qualified" },
  { key: "ready_to_email", label: "Ready" },
  { key: "emailed", label: "Emailed" },
  { key: "replied_positive", label: "Replied +" },
  { key: "meeting_requested", label: "Mtg Req" },
  { key: "meeting_booked", label: "Mtg Booked" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "suppressed", label: "Suppressed" },
];

const STAGE_COLORS: Record<string, string> = {
  candidate: "rgba(232,223,207,0.35)", qualified: "#d4a574", ready_to_email: "#e04747",
  emailed: "#3b82f6", replied_positive: "#22c55e", replied_negative: "#ef4444",
  meeting_requested: "#eab308", meeting_booked: "#22c55e", won: "#10b981",
  lost: "#6b7280", suppressed: "rgba(232,223,207,0.2)",
};

export function CrmView({ tenantSlug, data }: { tenantSlug: string; data: CrmData }) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);

  // Draft state -- one per lead, tracked by lead ID
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [generatedLeadIds, setGeneratedLeadIds] = useState<Set<number>>(new Set());

  async function handleGenerateDraft(lead: Record<string, unknown>) {
    setDraftLoading(true);
    setDraftError(null);
    try {
      const res = await fetch(`/api/mc/${tenantSlug}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead }),
      });
      const result = await res.json();
      if (!res.ok) {
        setDraftError(result.error || "Failed to generate draft");
        return;
      }
      setDraftSubject(result.draft.subject);
      setDraftBody(result.draft.body);
      setDraftGenerated(true);
      // Track that this lead has been generated -- no second chances
      setGeneratedLeadIds((prev) => new Set(prev).add(lead.id as number));
    } catch {
      setDraftError("Something went wrong");
    } finally {
      setDraftLoading(false);
    }
  }

  function selectLead(lead: Record<string, unknown> | null) {
    setSelectedLead(lead);
    setDraftSubject("");
    setDraftBody("");
    setDraftGenerated(false);
    setDraftError(null);
  }

  const leadAlreadyGenerated = selectedLead ? generatedLeadIds.has(selectedLead.id as number) : false;

  // Send email state
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSendEmail(lead: Record<string, unknown>) {
    if (!draftSubject || !draftBody) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(`/api/mc/${tenantSlug}/leads/${lead.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: draftSubject, body_text: draftBody }),
      });
      const result = await res.json();
      if (!res.ok) {
        setSendResult({ type: "error", text: result.error || "Failed to send" });
        return;
      }
      setSendResult({ type: "success", text: `Email sent to ${lead.contact_email}` });
    } catch {
      setSendResult({ type: "error", text: "Something went wrong" });
    } finally {
      setSending(false);
    }
  }

  // Find Leads state
  const [findingLeads, setFindingLeads] = useState(false);
  const [findResult, setFindResult] = useState<{ imported: number; message?: string } | null>(null);

  async function handleFindLeads() {
    // Demo mode: simulate finding leads
    if (tenantSlug === "demo") {
      setFindingLeads(true);
      setFindResult(null);
      await new Promise((r) => setTimeout(r, 1200));
      setFindResult({ imported: data.leads.length, message: `Found ${data.leads.length} leads matching your ICP criteria` });
      setFindingLeads(false);
      return;
    }

    setFindingLeads(true);
    setFindResult(null);
    try {
      const res = await fetch(`/api/mc/${tenantSlug}/leads/generate`, { method: "POST" });
      const result = await res.json();
      if (!res.ok) {
        setFindResult({ imported: 0, message: result.error || "Failed to find leads" });
        return;
      }
      setFindResult({ imported: result.imported, message: result.imported > 0 ? `Found ${result.imported} new leads from ${result.icp}` : result.message || "No new leads found. Try again tomorrow." });
      if (result.imported > 0) {
        // Refresh to show new leads
        window.location.reload();
      }
    } catch {
      setFindResult({ imported: 0, message: "Something went wrong" });
    } finally {
      setFindingLeads(false);
    }
  }

  const filtered = data.leads.filter((l) => {
    if (filter !== "all" && l.stage !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        ((l.contact_name as string) || "").toLowerCase().includes(s) ||
        ((l.company_name as string) || "").toLowerCase().includes(s) ||
        ((l.contact_email as string) || "").toLowerCase().includes(s)
      );
    }
    return true;
  });

  const totalActive = data.stats
    .filter((s) => !["suppressed", "lost"].includes(s.stage))
    .reduce((sum, s) => sum + s.count, 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>CRM</h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
            {totalActive} active lead{totalActive !== 1 ? "s" : ""} in pipeline
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleFindLeads}
            disabled={findingLeads}
            style={{
              background: "#d4a574", color: "#0b1120", border: "none",
              borderRadius: 10, padding: "10px 20px", fontSize: 14,
              fontWeight: 700, cursor: findingLeads ? "wait" : "pointer", fontFamily: 'var(--font-display)',
            }}
          >
            {findingLeads ? "Searching..." : "Find Leads"}
          </button>
        </div>
      </div>

      {/* Find Leads result banner */}
      {findResult && (
        <div style={{
          background: findResult.imported > 0 ? "rgba(34,197,94,0.1)" : "rgba(212,165,116,0.1)",
          border: `1px solid ${findResult.imported > 0 ? "rgba(34,197,94,0.2)" : "rgba(212,165,116,0.2)"}`,
          borderRadius: 10, padding: "10px 16px", fontSize: 13,
          color: findResult.imported > 0 ? "#22c55e" : "#d4a574",
          marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>{findResult.message}</span>
          <button onClick={() => setFindResult(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16 }}>x</button>
        </div>
      )}

      {/* Pipeline KPIs */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20,
        background: "#111827", border: "1px solid rgba(232,223,207,0.1)", borderRadius: 12, padding: "12px 16px",
      }}>
        {data.stats
          .filter((s) => !["suppressed", "lost"].includes(s.stage))
          .sort((a, b) => {
            const order = ["candidate", "qualified", "ready_to_email", "emailed", "replied_positive", "meeting_requested", "meeting_booked", "won"];
            return order.indexOf(a.stage) - order.indexOf(b.stage);
          })
          .map((s) => (
            <button
              key={s.stage}
              onClick={() => setFilter(filter === s.stage ? "all" : s.stage)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 8,
                background: filter === s.stage ? `${STAGE_COLORS[s.stage] ?? "rgba(232,223,207,0.35)"}20` : "transparent",
                border: "none", cursor: "pointer", transition: "all 0.15s",
                fontFamily: 'var(--font-body)',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: STAGE_COLORS[s.stage] ?? "rgba(232,223,207,0.35)", fontFamily: 'var(--font-display)' }}>
                {s.count}
              </span>
              <span style={{ fontSize: 12, color: "rgba(232,223,207,0.5)" }}>
                {STAGES.find((st) => st.key === s.stage)?.label ?? String(s.stage)}
              </span>
            </button>
          ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div style={{
          display: "flex", gap: 4, background: "#111827", borderRadius: 8,
          border: "1px solid rgba(232,223,207,0.1)", padding: 4, overflowX: "auto",
        }}>
          {STAGES.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                padding: "5px 10px", borderRadius: 6, border: "none",
                background: filter === s.key ? "rgba(232,223,207,0.1)" : "transparent",
                color: filter === s.key ? "#e8dfcf" : "rgba(232,223,207,0.35)",
                fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: 'var(--font-body)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, padding: "8px 14px", background: "#111827",
            border: "1px solid rgba(232,223,207,0.1)", borderRadius: 8,
            color: "#e8dfcf", fontSize: 13, outline: "none", minWidth: 160,
            fontFamily: 'var(--font-body)',
          }}
        />
      </div>

      {/* Lead list + detail split */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 16 }}>
        {/* Lead list */}
        <div style={{ flex: selectedLead && !isMobile ? "0 0 50%" : 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{
              background: "#111827", border: "1px solid rgba(232,223,207,0.1)", borderRadius: 12,
              padding: "48px 20px", textAlign: "center",
            }}>
              {data.leads.length === 0 ? (
                <>
                  <div style={{ fontSize: 32, marginBottom: 12, color: "rgba(232,223,207,0.15)" }}>◈</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", fontFamily: "var(--font-display)", color: "#e8dfcf" }}>No leads yet</h3>
                  <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: "0 0 20px", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
                    Find scored leads matching your ideal customer profile with one click.
                  </p>
                  <button
                    onClick={handleFindLeads}
                    disabled={findingLeads}
                    style={{
                      background: "#d4a574", color: "#0b1120", border: "none",
                      borderRadius: 10, padding: "12px 28px", fontSize: 15,
                      fontWeight: 700, cursor: findingLeads ? "wait" : "pointer", fontFamily: "var(--font-display)",
                    }}
                  >
                    {findingLeads ? "Searching..." : "Find Leads"}
                  </button>
                </>
              ) : (
                <p style={{ color: "rgba(232,223,207,0.25)", fontSize: 14, margin: 0 }}>
                  No leads match this filter.
                </p>
              )}
            </div>
          ) : (
            <div style={{
              background: "#111827", border: "1px solid rgba(232,223,207,0.1)", borderRadius: 12,
              overflow: "hidden",
            }}>
              {filtered.map((lead, i) => (
                <div
                  key={lead.id as number}
                  onClick={() => selectLead(selectedLead?.id === lead.id ? null : lead)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", cursor: "pointer",
                    borderBottom: i < filtered.length - 1 ? "1px solid rgba(232,223,207,0.08)" : "none",
                    background: selectedLead?.id === lead.id ? "rgba(212,165,116,0.06)" : "transparent",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Score bar */}
                  <div style={{ width: 40, flexShrink: 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700, textAlign: "center", fontFamily: 'var(--font-display)',
                      color: (lead.fit_score as number) >= 75 ? "#22c55e" : (lead.fit_score as number) >= 50 ? "#eab308" : "rgba(232,223,207,0.35)",
                    }}>
                      {lead.fit_score as number}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.contact_name as string || "Unknown"}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.company_name as string}{lead.contact_title ? ` · ${lead.contact_title}` : ""}
                    </div>
                  </div>

                  {/* Stage badge */}
                  <span style={{
                    fontSize: 11, padding: "2px 8px", borderRadius: 4, flexShrink: 0,
                    background: `${STAGE_COLORS[lead.stage as string] ?? "rgba(232,223,207,0.35)"}15`,
                    color: STAGE_COLORS[lead.stage as string] ?? "rgba(232,223,207,0.35)",
                    fontWeight: 500, fontFamily: 'var(--font-display)',
                  }}>
                    {STAGES.find((s) => s.key === lead.stage)?.label ?? String(lead.stage)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lead detail panel */}
        {selectedLead && (
          <div style={{
            flex: isMobile ? "1 1 auto" : "0 0 50%", background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 12, padding: isMobile ? "20px 16px" : "24px 20px", alignSelf: "flex-start",
            position: isMobile ? "static" : "sticky", top: 20, maxHeight: isMobile ? "none" : "calc(100vh - 120px)", overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>{selectedLead.contact_name as string}</h2>
              <button onClick={() => selectLead(null)} style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", cursor: "pointer", fontSize: 18 }}>x</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <DetailItem label="Company" value={selectedLead.company_name as string} />
              <DetailItem label="Title" value={selectedLead.contact_title as string} />
              <DetailItem label="Email" value={selectedLead.contact_email as string} />
              <DetailItem label="Industry" value={selectedLead.company_industry as string} />
              <DetailItem label="Location" value={[selectedLead.company_city, selectedLead.company_state].filter(Boolean).join(", ")} />
              <DetailItem label="Stage" value={STAGES.find((s) => s.key === selectedLead.stage)?.label ?? String(selectedLead.stage)} />
              <DetailItem label="Fit Score" value={String(selectedLead.fit_score)} />
              <DetailItem label="Owner" value={selectedLead.owner as string || "Unassigned"} />
            </div>

            {!!selectedLead.fit_reason && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,223,207,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 4, fontFamily: 'var(--font-display)' }}>Fit Reason</div>
                <div style={{ fontSize: 13, color: "rgba(232,223,207,0.85)", lineHeight: 1.5 }}>{String(selectedLead.fit_reason)}</div>
              </div>
            )}

            {!!selectedLead.outreach_angle && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,223,207,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 4, fontFamily: 'var(--font-display)' }}>Outreach Angle</div>
                <div style={{ fontSize: 13, color: "rgba(232,223,207,0.85)", lineHeight: 1.5 }}>{String(selectedLead.outreach_angle)}</div>
              </div>
            )}

            {/* Email Draft */}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(232,223,207,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,223,207,0.35)", textTransform: "uppercase" as const, letterSpacing: "0.05em", fontFamily: "var(--font-display)" }}>Email Draft</div>
                {!draftGenerated && !leadAlreadyGenerated && (
                  <button
                    onClick={() => handleGenerateDraft(selectedLead)}
                    disabled={draftLoading}
                    style={{
                      background: "#d4a574", color: "#1a1f2e", border: "none",
                      borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600,
                      cursor: draftLoading ? "wait" : "pointer", fontFamily: "var(--font-display)",
                    }}
                  >
                    {draftLoading ? "Generating..." : "Generate Draft"}
                  </button>
                )}
              </div>

              {draftError && (
                <div style={{
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#f87171", marginBottom: 12,
                }}>
                  {draftError}
                </div>
              )}

              {draftGenerated && (
                <div style={{ background: "#0b1120", borderRadius: 10, padding: "16px", border: "1px solid rgba(232,223,207,0.08)" }}>
                  <div style={{
                    background: "rgba(212,165,116,0.06)", borderRadius: 8, padding: "8px 12px",
                    border: "1px solid rgba(212,165,116,0.1)", marginBottom: 14, fontSize: 12,
                    color: "rgba(212,165,116,0.7)",
                  }}>
                    This is your starting point. Edit it to make it yours before sending.
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", display: "block", marginBottom: 4, fontFamily: "var(--font-display)" }}>Subject</label>
                    <input
                      value={draftSubject}
                      onChange={(e) => setDraftSubject(e.target.value)}
                      style={{
                        width: "100%", padding: "8px 12px", background: "rgba(232,223,207,0.03)",
                        border: "1px solid rgba(232,223,207,0.1)", borderRadius: 6, color: "#e8dfcf",
                        fontSize: 14, fontWeight: 600, outline: "none", boxSizing: "border-box",
                        fontFamily: "var(--font-body)",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", display: "block", marginBottom: 4, fontFamily: "var(--font-display)" }}>Body</label>
                    <textarea
                      value={draftBody}
                      onChange={(e) => setDraftBody(e.target.value)}
                      rows={8}
                      style={{
                        width: "100%", padding: "10px 12px", background: "rgba(232,223,207,0.03)",
                        border: "1px solid rgba(232,223,207,0.1)", borderRadius: 6, color: "rgba(232,223,207,0.85)",
                        fontSize: 13, outline: "none", boxSizing: "border-box", resize: "vertical",
                        lineHeight: 1.6, fontFamily: "var(--font-body)",
                      }}
                    />
                  </div>
                  {sendResult && (
                    <div style={{
                      background: sendResult.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${sendResult.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                      borderRadius: 8, padding: "8px 12px", fontSize: 12, marginBottom: 10,
                      color: sendResult.type === "success" ? "#22c55e" : "#f87171",
                    }}>
                      {sendResult.text}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {!!selectedLead.contact_email && !sendResult?.type && (
                      <button
                        onClick={() => handleSendEmail(selectedLead)}
                        disabled={sending}
                        style={{
                          background: "#d4a574", color: "#0b1120", border: "none",
                          borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700,
                          cursor: sending ? "wait" : "pointer", fontFamily: "var(--font-display)",
                        }}
                      >
                        {sending ? "Sending..." : "Send Email"}
                      </button>
                    )}
                    {!!selectedLead.contact_email && (
                      <a
                        href={`mailto:${selectedLead.contact_email}?subject=${encodeURIComponent(draftSubject)}&body=${encodeURIComponent(draftBody)}`}
                        style={{
                          background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
                          borderRadius: 8, padding: "8px 14px", fontSize: 13,
                          fontWeight: 500, textDecoration: "none", fontFamily: "var(--font-body)",
                          display: "inline-block",
                        }}
                      >
                        Open in Gmail
                      </a>
                    )}
                    <button
                      onClick={() => { navigator.clipboard.writeText(`Subject: ${draftSubject}\n\n${draftBody}`); }}
                      style={{
                        background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
                        border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13,
                        fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)",
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {!draftGenerated && !draftError && (
                <p style={{ fontSize: 12, color: "rgba(232,223,207,0.2)", margin: 0 }}>
                  {leadAlreadyGenerated
                    ? "Draft already generated for this lead. Select the lead again to view it."
                    : "Generate a personalized email based on your Strategy and this lead's profile."
                  }
                </p>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(232,223,207,0.08)" }}>
              {!!selectedLead.contact_linkedin_url && (
                <a href={selectedLead.contact_linkedin_url as string} target="_blank" rel="noopener" style={{
                  background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
                  borderRadius: 8, padding: "8px 14px", fontSize: 13,
                  fontWeight: 500, textDecoration: "none",
                }}>
                  LinkedIn
                </a>
              )}
              {!!selectedLead.company_website && (
                <a href={selectedLead.company_website as string} target="_blank" rel="noopener" style={{
                  background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)",
                  borderRadius: 8, padding: "8px 14px", fontSize: 13,
                  fontWeight: 500, textDecoration: "none",
                }}>
                  Website
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | undefined | null }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginBottom: 2, fontFamily: 'var(--font-display)' }}>{label}</div>
      <div style={{ fontSize: 13, color: value ? "rgba(232,223,207,0.85)" : "rgba(232,223,207,0.2)", fontWeight: 500 }}>
        {value || "-"}
      </div>
    </div>
  );
}
