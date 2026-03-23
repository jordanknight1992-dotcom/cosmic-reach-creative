"use client";

import { useState, useRef } from "react";
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

const STANDARD_FIELDS = [
  { value: "skip", label: "Skip" },
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "full_name", label: "Full Name" },
  { value: "email", label: "Email" },
  { value: "title", label: "Title / Role" },
  { value: "company", label: "Company" },
  { value: "website", label: "Website" },
  { value: "domain", label: "Domain" },
  { value: "phone", label: "Phone" },
  { value: "linkedin_url", label: "LinkedIn URL" },
  { value: "industry", label: "Industry" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "country", label: "Country" },
  { value: "company_size", label: "Company Size" },
];

/* ─── Import Modal State Machine ─── */
type ImportStep = "idle" | "uploading" | "mapping" | "importing" | "done";

interface PreviewData {
  filename: string;
  totalRows: number;
  headers: string[];
  sampleRows: string[][];
  suggestedMapping: Record<string, { field: string; confidence: number }>;
}

interface ImportResult {
  imported: number;
  duplicates: number;
  failed: number;
  total: number;
  errors: { row: number; reason: string }[];
}

export function CrmView({ tenantSlug, data }: { tenantSlug: string; data: CrmData }) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Record<string, unknown> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Draft state
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [generatedLeadIds, setGeneratedLeadIds] = useState<Set<number>>(new Set());

  // Send email state
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Import state
  const [importStep, setImportStep] = useState<ImportStep>("idle");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [csvRawText, setCsvRawText] = useState<string>("");

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
    setSendResult(null);
  }

  const leadAlreadyGenerated = selectedLead ? generatedLeadIds.has(selectedLead.id as number) : false;

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

  /* ─── CSV Import Flow ─── */

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "tsv", "txt"].includes(ext || "")) {
      setImportError("Please upload a CSV or TSV file.");
      return;
    }

    setImportStep("uploading");
    setImportError(null);

    try {
      // Read file text for later import
      const text = await file.text();
      setCsvRawText(text);

      // Send to preview endpoint
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenantSlug", tenantSlug);

      const res = await fetch("/api/mc/imports", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        setImportError(result.error || "Failed to parse file");
        setImportStep("idle");
        return;
      }

      setPreview(result.preview);
      // Initialize mapping from suggestions
      const initialMapping: Record<string, string> = {};
      for (const [header, suggestion] of Object.entries(result.preview.suggestedMapping)) {
        initialMapping[header] = (suggestion as { field: string }).field;
      }
      setMapping(initialMapping);
      setImportStep("mapping");
    } catch {
      setImportError("Failed to read file. Check the format and try again.");
      setImportStep("idle");
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleConfirmImport() {
    if (!preview || !csvRawText) return;

    setImportStep("importing");
    setImportError(null);

    try {
      const res = await fetch("/api/mc/imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import",
          tenantSlug,
          csvData: csvRawText,
          mapping,
          filename: preview.filename,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setImportError(result.error || "Import failed");
        setImportStep("mapping");
        return;
      }

      setImportResult(result.result);
      setImportStep("done");
    } catch {
      setImportError("Import failed. Please try again.");
      setImportStep("mapping");
    }
  }

  function resetImport() {
    setImportStep("idle");
    setPreview(null);
    setMapping({});
    setImportResult(null);
    setImportError(null);
    setCsvRawText("");
  }

  function handleMappingChange(header: string, field: string) {
    setMapping((prev) => ({ ...prev, [header]: field }));
  }

  // Check if mapping has at least email and a name field
  const hasEmail = Object.values(mapping).includes("email");
  const hasName = Object.values(mapping).includes("full_name") ||
    (Object.values(mapping).includes("first_name") && Object.values(mapping).includes("last_name"));
  const mappingValid = hasEmail && hasName;

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

  // Show import flow
  const showImportFlow = importStep !== "idle";

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>Leads</h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
            {totalActive} active lead{totalActive !== 1 ? "s" : ""} requiring attention
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={showImportFlow}
            style={{
              background: "#d4a574", color: "#0b1120", border: "none",
              borderRadius: 10, padding: "10px 20px", fontSize: 14,
              fontWeight: 700, cursor: showImportFlow ? "not-allowed" : "pointer",
              fontFamily: 'var(--font-display)',
              opacity: showImportFlow ? 0.5 : 1,
            }}
          >
            Import CSV
          </button>
        </div>
      </div>

      {/* Import Error Banner */}
      {importError && !showImportFlow && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#f87171",
          marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>{importError}</span>
          <button onClick={() => setImportError(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      )}

      {/* ─── Import Flow Overlay ─── */}
      {showImportFlow && (
        <div style={{
          background: "#111827", border: "1px solid rgba(212,165,116,0.2)",
          borderRadius: 16, padding: isMobile ? "20px 16px" : "28px 28px", marginBottom: 24,
        }}>
          {/* Uploading state */}
          {importStep === "uploading" && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ fontSize: 16, color: "rgba(232,223,207,0.6)", fontFamily: "var(--font-display)" }}>
                Parsing file...
              </div>
            </div>
          )}

          {/* Mapping step */}
          {importStep === "mapping" && preview && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)", color: "#e8dfcf" }}>
                    Map Your Fields
                  </h2>
                  <p style={{ color: "rgba(232,223,207,0.4)", fontSize: 13, marginTop: 4 }}>
                    {preview.filename} · {preview.totalRows} row{preview.totalRows !== 1 ? "s" : ""} detected
                  </p>
                </div>
                <button
                  onClick={resetImport}
                  style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", cursor: "pointer", fontSize: 20 }}
                >
                  ×
                </button>
              </div>

              {/* Auto-mapping confidence note */}
              <div style={{
                background: "rgba(212,165,116,0.06)", border: "1px solid rgba(212,165,116,0.12)",
                borderRadius: 10, padding: "10px 16px", marginBottom: 20, fontSize: 13,
                color: "rgba(212,165,116,0.7)",
              }}>
                Fields auto-mapped from your column headers. Review and adjust before importing.
              </div>

              {importError && (
                <div style={{
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#f87171", marginBottom: 16,
                }}>
                  {importError}
                </div>
              )}

              {/* Field mapping table */}
              <div style={{ overflowX: "auto", marginBottom: 20 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(232,223,207,0.1)" }}>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "rgba(232,223,207,0.5)", fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                        CSV Column
                      </th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "rgba(232,223,207,0.5)", fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                        Maps To
                      </th>
                      <th style={{ textAlign: "left", padding: "8px 12px", color: "rgba(232,223,207,0.5)", fontWeight: 600, fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                        Sample Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.headers.map((header, idx) => {
                      const sampleValues = preview.sampleRows
                        .map((row) => row[idx])
                        .filter(Boolean)
                        .slice(0, 2);
                      const confidence = preview.suggestedMapping[header]?.confidence ?? 0;

                      return (
                        <tr key={header} style={{ borderBottom: "1px solid rgba(232,223,207,0.06)" }}>
                          <td style={{ padding: "10px 12px", color: "#e8dfcf", fontWeight: 500 }}>
                            {header}
                            {confidence > 80 && (
                              <span style={{ fontSize: 10, color: "#22c55e", marginLeft: 6 }}>✓</span>
                            )}
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <select
                              value={mapping[header] || "skip"}
                              onChange={(e) => handleMappingChange(header, e.target.value)}
                              style={{
                                background: "#0b1120", border: "1px solid rgba(232,223,207,0.15)",
                                borderRadius: 6, padding: "6px 10px", color: mapping[header] === "skip" ? "rgba(232,223,207,0.3)" : "#e8dfcf",
                                fontSize: 12, outline: "none", fontFamily: "var(--font-body)",
                                cursor: "pointer", minWidth: 130,
                              }}
                            >
                              {STANDARD_FIELDS.map((f) => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                              ))}
                            </select>
                          </td>
                          <td style={{ padding: "10px 12px", color: "rgba(232,223,207,0.35)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {sampleValues.join(", ") || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Validation status */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{
                  fontSize: 12,
                  color: hasEmail ? "#22c55e" : "#f87171",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {hasEmail ? "✓" : "✗"} Email field mapped
                </div>
                <div style={{
                  fontSize: 12,
                  color: hasName ? "#22c55e" : "#f87171",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  {hasName ? "✓" : "✗"} Name field mapped
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={handleConfirmImport}
                  disabled={!mappingValid}
                  style={{
                    background: mappingValid ? "#d4a574" : "rgba(212,165,116,0.3)",
                    color: "#0b1120", border: "none",
                    borderRadius: 10, padding: "12px 28px", fontSize: 14,
                    fontWeight: 700, cursor: mappingValid ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Import {preview.totalRows} Lead{preview.totalRows !== 1 ? "s" : ""}
                </button>
                <button
                  onClick={resetImport}
                  style={{
                    background: "none", border: "1px solid rgba(232,223,207,0.15)",
                    borderRadius: 10, padding: "12px 20px", fontSize: 14,
                    color: "rgba(232,223,207,0.5)", cursor: "pointer",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Importing state */}
          {importStep === "importing" && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 16, color: "#d4a574", fontWeight: 600, fontFamily: "var(--font-display)", marginBottom: 8 }}>
                Importing leads...
              </div>
              <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 13, margin: 0 }}>
                Deduplicating, creating companies, contacts, and leads. This may take a moment.
              </p>
            </div>
          )}

          {/* Done state */}
          {importStep === "done" && importResult && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)", color: "#22c55e" }}>
                  Import Complete
                </h2>
                <button
                  onClick={() => { resetImport(); window.location.reload(); }}
                  style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", cursor: "pointer", fontSize: 20 }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
                <ResultStat label="Imported" value={importResult.imported} color="#22c55e" />
                <ResultStat label="Duplicates skipped" value={importResult.duplicates} color="#eab308" />
                <ResultStat label="Failed" value={importResult.failed} color={importResult.failed > 0 ? "#f87171" : "rgba(232,223,207,0.3)"} />
                <ResultStat label="Total rows" value={importResult.total} color="rgba(232,223,207,0.5)" />
              </div>

              {importResult.errors.length > 0 && (
                <div style={{
                  background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 16, maxHeight: 120, overflowY: "auto",
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#f87171", marginBottom: 6, fontFamily: "var(--font-display)" }}>
                    Errors
                  </div>
                  {importResult.errors.map((err, i) => (
                    <div key={i} style={{ fontSize: 12, color: "rgba(232,223,207,0.5)", marginBottom: 2 }}>
                      Row {err.row}: {err.reason}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { resetImport(); window.location.reload(); }}
                  style={{
                    background: "#d4a574", color: "#0b1120", border: "none",
                    borderRadius: 10, padding: "12px 24px", fontSize: 14,
                    fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)",
                  }}
                >
                  View Leads
                </button>
                <button
                  onClick={() => { resetImport(); fileInputRef.current?.click(); }}
                  style={{
                    background: "none", border: "1px solid rgba(232,223,207,0.15)",
                    borderRadius: 10, padding: "12px 20px", fontSize: 14,
                    color: "rgba(232,223,207,0.5)", cursor: "pointer",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Import Another File
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pipeline KPIs */}
      {data.stats.length > 0 && (
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
      )}

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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
                  <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: "0 0 20px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                    Import a CSV from Apollo, LinkedIn Sales Navigator, HubSpot, or any spreadsheet.
                    Mission Control will map your fields automatically and score every lead against your ICP.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: "#d4a574", color: "#0b1120", border: "none",
                      borderRadius: 10, padding: "12px 28px", fontSize: 15,
                      fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)",
                    }}
                  >
                    Import CSV
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
                  <div style={{ width: 40, flexShrink: 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700, textAlign: "center", fontFamily: 'var(--font-display)',
                      color: (lead.fit_score as number) >= 75 ? "#22c55e" : (lead.fit_score as number) >= 50 ? "#eab308" : "rgba(232,223,207,0.35)",
                    }}>
                      {lead.fit_score as number}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.contact_name as string || "Unknown"}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {lead.company_name as string}{lead.contact_title ? ` · ${lead.contact_title}` : ""}
                    </div>
                  </div>
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
              <button onClick={() => selectLead(null)} style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", cursor: "pointer", fontSize: 18 }}>×</button>
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
        {value || "—"}
      </div>
    </div>
  );
}

function ResultStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "rgba(232,223,207,0.03)", borderRadius: 10, padding: "12px 16px",
      minWidth: 100,
    }}>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", color }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", marginTop: 2 }}>{label}</div>
    </div>
  );
}
