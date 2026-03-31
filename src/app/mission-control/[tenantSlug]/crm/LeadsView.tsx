"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Lead {
  id: number;
  source: "contact" | "audit" | "manual";
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  status: string;
  revenue: number | null;
  notes: string;
  created_at: string;
}

interface Props {
  tenantSlug: string;
  leads: Lead[];
}

const PIPELINE_STATUSES = [
  "lead",
  "audit_purchased",
  "audit_delivered",
  "rebuild_proposal",
  "rebuild_in_progress",
  "website_build_complete",
  "mission_control_active",
  "lost",
] as const;

type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

const STATUS_LABELS: Record<string, string> = {
  lead: "Lead",
  audit_purchased: "Audit Purchased",
  audit_delivered: "Audit Delivered",
  rebuild_proposal: "Rebuild Proposal",
  rebuild_in_progress: "Rebuild In Progress",
  website_build_complete: "Website Build Complete",
  mission_control_active: "Mission Control Active",
  lost: "Lost",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  lead: { bg: "rgba(96,165,250,0.15)", text: "#60a5fa" },
  audit_purchased: { bg: "rgba(212,165,116,0.15)", text: "#d4a574" },
  audit_delivered: { bg: "rgba(167,139,250,0.15)", text: "#a78bfa" },
  rebuild_proposal: { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  rebuild_in_progress: { bg: "rgba(249,115,22,0.15)", text: "#f97316" },
  website_build_complete: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
  mission_control_active: { bg: "rgba(16,185,129,0.15)", text: "#10b981" },
  lost: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
  // Legacy statuses from old system
  new: { bg: "rgba(96,165,250,0.15)", text: "#60a5fa" },
  contacted: { bg: "rgba(234,179,8,0.15)", text: "#eab308" },
  closed: { bg: "rgba(34,197,94,0.15)", text: "#22c55e" },
};

function getStatusStyle(status: string) {
  return STATUS_COLORS[status] || STATUS_COLORS.lead;
}

function getStatusLabel(status: string) {
  return STATUS_LABELS[status] || status;
}

function formatCurrency(value: number | null): string {
  if (value == null) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  website: "",
  status: "lead" as string,
  revenue: "",
  notes: "",
};

export function LeadsView({ tenantSlug, leads }: Props) {
  const isMobile = useIsMobile();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState<string | null>(null);

  const filtered = leads.filter((l) => {
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    return true;
  });

  const statusCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = leads.reduce((sum, l) => sum + (l.revenue || 0), 0);
  const filteredRevenue = filtered.reduce((sum, l) => sum + (l.revenue || 0), 0);

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || !form.name.trim() || !form.email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/mc/${tenantSlug}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim() || null,
          website: form.website.trim() || null,
          status: form.status,
          revenue: form.revenue ? parseFloat(form.revenue) : null,
          notes: form.notes.trim(),
        }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setSubmitting(false);
      }
    } catch {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(lead: Lead, newStatus: string) {
    setStatusDropdown(null);
    try {
      await fetch(`/api/mc/${tenantSlug}/leads/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, source: lead.source, status: newStatus }),
      });
      window.location.reload();
    } catch {
      // ignore
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)", color: "#d4a574" }}>
            Leads
          </h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4, fontFamily: "var(--font-body)" }}>
            Sales pipeline &middot; {leads.length} lead{leads.length !== 1 ? "s" : ""} &middot; {formatCurrency(totalRevenue)} total value
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? "rgba(212,165,116,0.15)" : "linear-gradient(135deg, #d4a574, #b8956a)",
            border: showForm ? "1px solid rgba(212,165,116,0.3)" : "none",
            borderRadius: 8,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 600,
            color: showForm ? "#d4a574" : "#0b1120",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
          }}
        >
          {showForm ? "Cancel" : "+ Add Lead"}
        </button>
      </div>

      {/* Add Lead Form */}
      {showForm && (
        <form
          onSubmit={handleAddLead}
          style={{
            background: "#111827",
            border: "1px solid rgba(212,165,116,0.2)",
            borderRadius: 14,
            padding: isMobile ? 16 : 24,
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 600, color: "#d4a574", marginBottom: 16, fontFamily: "var(--font-display)" }}>
            New Lead
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
            <FormField label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Full name" />
            <FormField label="Email *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="email@example.com" type="email" />
            <FormField label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Company name" />
            <FormField label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://example.com" />
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,223,207,0.5)", fontFamily: "var(--font-display)", letterSpacing: "0.03em", textTransform: "uppercase" as const, display: "block", marginBottom: 4 }}>
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                style={{
                  width: "100%",
                  background: "rgba(232,223,207,0.04)",
                  border: "1px solid rgba(232,223,207,0.1)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  color: "#e8dfcf",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                }}
              >
                {PIPELINE_STATUSES.map((s) => (
                  <option key={s} value={s} style={{ background: "#111827", color: "#e8dfcf" }}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <FormField label="Revenue / Deal Value" value={form.revenue} onChange={(v) => setForm({ ...form, revenue: v })} placeholder="5000" type="number" />
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,223,207,0.5)", fontFamily: "var(--font-display)", letterSpacing: "0.03em", textTransform: "uppercase" as const, display: "block", marginBottom: 4 }}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any relevant notes..."
              rows={3}
              style={{
                width: "100%",
                background: "rgba(232,223,207,0.04)",
                border: "1px solid rgba(232,223,207,0.1)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#e8dfcf",
                fontFamily: "var(--font-body)",
                resize: "vertical" as const,
                outline: "none",
              }}
            />
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={submitting || !form.name.trim() || !form.email.trim()}
              style={{
                background: submitting ? "rgba(212,165,116,0.3)" : "linear-gradient(135deg, #d4a574, #b8956a)",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontSize: 13,
                fontWeight: 600,
                color: "#0b1120",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "var(--font-display)",
                opacity: !form.name.trim() || !form.email.trim() ? 0.5 : 1,
              }}
            >
              {submitting ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      )}

      {/* Status Filters */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        <FilterPill
          label={`All (${leads.length})`}
          active={filterStatus === "all"}
          onClick={() => setFilterStatus("all")}
        />
        {PIPELINE_STATUSES.map((s) => {
          const count = statusCounts[s] || 0;
          if (count === 0 && filterStatus !== s) return null;
          const style = getStatusStyle(s);
          return (
            <FilterPill
              key={s}
              label={`${STATUS_LABELS[s]} (${count})`}
              active={filterStatus === s}
              onClick={() => setFilterStatus(s)}
              color={style.text}
            />
          );
        })}
        {/* Show pills for legacy statuses that have leads */}
        {Object.keys(statusCounts)
          .filter((s) => !PIPELINE_STATUSES.includes(s as PipelineStatus) && statusCounts[s] > 0)
          .map((s) => (
            <FilterPill
              key={s}
              label={`${getStatusLabel(s)} (${statusCounts[s]})`}
              active={filterStatus === s}
              onClick={() => setFilterStatus(s)}
              color={getStatusStyle(s).text}
            />
          ))}
      </div>

      {/* Revenue summary for filtered */}
      {filterStatus !== "all" && (
        <div style={{ fontSize: 12, color: "rgba(232,223,207,0.4)", marginBottom: 12, fontFamily: "var(--font-body)" }}>
          Showing {filtered.length} lead{filtered.length !== 1 ? "s" : ""} &middot; {formatCurrency(filteredRevenue)} value
        </div>
      )}

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div style={{
          background: "#111827",
          border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14,
          padding: "40px 28px",
          textAlign: "center" as const,
        }}>
          <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>&#9673;</div>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: 0, fontFamily: "var(--font-body)" }}>
            {leads.length === 0
              ? "No leads yet. Add your first lead or they will appear from website forms."
              : "No leads match the current filter."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          {filtered.map((lead) => {
            const key = `${lead.source}-${lead.id}`;
            const isExpanded = expandedId === key;
            const style = getStatusStyle(lead.status);
            const isDropdownOpen = statusDropdown === key;

            return (
              <div
                key={key}
                style={{
                  background: "#111827",
                  border: "1px solid rgba(232,223,207,0.08)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {/* Summary row */}
                <div
                  onClick={() => {
                    if (statusDropdown) {
                      setStatusDropdown(null);
                      return;
                    }
                    setExpandedId(isExpanded ? null : key);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 8 : 12,
                    padding: isMobile ? "12px 14px" : "14px 20px",
                    cursor: "pointer",
                  }}
                >
                  {/* Source badge */}
                  <div style={{
                    fontSize: 9,
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    padding: "3px 6px",
                    borderRadius: 4,
                    flexShrink: 0,
                    background: lead.source === "manual" ? "rgba(96,165,250,0.1)" : lead.source === "audit" ? "rgba(212,165,116,0.12)" : "rgba(232,223,207,0.06)",
                    color: lead.source === "manual" ? "#60a5fa" : lead.source === "audit" ? "#d4a574" : "rgba(232,223,207,0.4)",
                    fontFamily: "var(--font-display)",
                  }}>
                    {lead.source === "audit" ? "Audit" : lead.source === "manual" ? "Manual" : "Contact"}
                  </div>

                  {/* Name + company */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf", fontFamily: "var(--font-body)" }}>{lead.name}</span>
                      {lead.company && (
                        <span style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", fontFamily: "var(--font-body)" }}>{lead.company}</span>
                      )}
                    </div>
                    {!isMobile && (
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.3)", marginTop: 1, fontFamily: "var(--font-body)" }}>{lead.email}</div>
                    )}
                  </div>

                  {/* Revenue */}
                  {!isMobile && lead.revenue != null && (
                    <div style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#22c55e",
                      flexShrink: 0,
                      fontFamily: "var(--font-display)",
                    }}>
                      {formatCurrency(lead.revenue)}
                    </div>
                  )}

                  {/* Status tag (clickable dropdown) */}
                  <div style={{ position: "relative" as const, flexShrink: 0 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusDropdown(isDropdownOpen ? null : key);
                      }}
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: style.bg,
                        color: style.text,
                        border: `1px solid ${style.text}30`,
                        cursor: "pointer",
                        fontFamily: "var(--font-display)",
                        whiteSpace: "nowrap" as const,
                      }}
                    >
                      {getStatusLabel(lead.status)}
                    </button>

                    {/* Status dropdown */}
                    {isDropdownOpen && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: "absolute" as const,
                          top: "100%",
                          right: 0,
                          marginTop: 4,
                          background: "#1a2332",
                          border: "1px solid rgba(232,223,207,0.15)",
                          borderRadius: 10,
                          padding: 4,
                          zIndex: 50,
                          minWidth: 200,
                          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                        }}
                      >
                        {PIPELINE_STATUSES.map((s) => {
                          const sStyle = getStatusStyle(s);
                          const isCurrent = lead.status === s;
                          return (
                            <button
                              key={s}
                              onClick={() => {
                                if (!isCurrent) handleStatusChange(lead, s);
                                else setStatusDropdown(null);
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                width: "100%",
                                padding: "7px 10px",
                                background: isCurrent ? "rgba(232,223,207,0.06)" : "transparent",
                                border: "none",
                                borderRadius: 6,
                                cursor: isCurrent ? "default" : "pointer",
                                fontSize: 12,
                                color: isCurrent ? sStyle.text : "rgba(232,223,207,0.7)",
                                fontFamily: "var(--font-display)",
                                textAlign: "left" as const,
                              }}
                            >
                              <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: sStyle.text,
                                flexShrink: 0,
                                opacity: isCurrent ? 1 : 0.5,
                              }} />
                              {STATUS_LABELS[s]}
                              {isCurrent && (
                                <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(232,223,207,0.3)" }}>current</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  {!isMobile && (
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", flexShrink: 0, width: 80, textAlign: "right" as const, fontFamily: "var(--font-body)" }}>
                      {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  )}

                  {/* Expand indicator */}
                  <div style={{ fontSize: 12, color: "rgba(232,223,207,0.2)", flexShrink: 0 }}>
                    {isExpanded ? "\u25BE" : "\u25B8"}
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
                          <a href={`mailto:${lead.email}`} style={{ color: "#d4a574", textDecoration: "none" }}>{lead.email}</a>
                        </DetailValue>

                        {lead.company && (
                          <>
                            <DetailLabel>Company</DetailLabel>
                            <DetailValue>{lead.company}</DetailValue>
                          </>
                        )}

                        {lead.website && (
                          <>
                            <DetailLabel>Website</DetailLabel>
                            <DetailValue>
                              <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener" style={{ color: "#d4a574", textDecoration: "none" }}>{lead.website}</a>
                            </DetailValue>
                          </>
                        )}

                        <DetailLabel>Source</DetailLabel>
                        <DetailValue>{lead.source === "manual" ? "Manually added" : lead.source === "audit" ? "Audit submission" : "Contact form"}</DetailValue>

                        <DetailLabel>Added</DetailLabel>
                        <DetailValue>{new Date(lead.created_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</DetailValue>
                      </div>

                      <div>
                        {lead.revenue != null && (
                          <>
                            <DetailLabel>Revenue / Deal Value</DetailLabel>
                            <DetailValue>
                              <span style={{ color: "#22c55e", fontWeight: 600 }}>{formatCurrency(lead.revenue)}</span>
                            </DetailValue>
                          </>
                        )}

                        {lead.notes && (
                          <>
                            <DetailLabel>Notes</DetailLabel>
                            <DetailValue>{lead.notes}</DetailValue>
                          </>
                        )}
                      </div>
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

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label style={{
        fontSize: 11,
        fontWeight: 600,
        color: "rgba(232,223,207,0.5)",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.03em",
        textTransform: "uppercase" as const,
        display: "block",
        marginBottom: 4,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "rgba(232,223,207,0.04)",
          border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 13,
          color: "#e8dfcf",
          fontFamily: "var(--font-body)",
          outline: "none",
          boxSizing: "border-box" as const,
        }}
      />
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active
          ? color
            ? `${color}18`
            : "rgba(212,165,116,0.15)"
          : "rgba(232,223,207,0.04)",
        border: active
          ? `1px solid ${color ? color + "40" : "rgba(212,165,116,0.3)"}`
          : "1px solid rgba(232,223,207,0.08)",
        borderRadius: 8,
        padding: "5px 12px",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        color: active ? (color || "#d4a574") : "rgba(232,223,207,0.45)",
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        whiteSpace: "nowrap" as const,
      }}
    >
      {label}
    </button>
  );
}

function DetailLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 11,
      fontWeight: 600,
      color: "rgba(232,223,207,0.35)",
      marginTop: 10,
      marginBottom: 2,
      fontFamily: "var(--font-display)",
      letterSpacing: "0.03em",
      textTransform: "uppercase" as const,
    }}>
      {children}
    </div>
  );
}

function DetailValue({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: "rgba(232,223,207,0.7)", lineHeight: 1.5, fontFamily: "var(--font-body)" }}>
      {children}
    </div>
  );
}
