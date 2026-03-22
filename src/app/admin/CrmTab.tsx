"use client";

import { useState, useEffect, useCallback } from "react";

/* ─────────────────────────── Design Tokens ─────────────────────── */

const T = {
  page:      "#0B1120",
  card:      "#101726",
  border:    "#202431",
  copper:    "#D4A574",
  starlight: "#E8DFCF",
  bodyText:  "#BCB6AC",
  muted:     "#5E5E62",
  faint:     "#343841",
  green:     "#4DB871",
  red:       "#E04747",
};

const FONT_HEADING: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk)",
};

/* ─────────────────────────── Pipeline Stages ─────────────────────── */

const STAGES: Record<string, { label: string; bg: string; text: string }> = {
  candidate:         { label: "Candidate",  bg: "#12263f", text: "#60a5fa" },
  qualified:         { label: "Qualified",   bg: "#1e1250", text: "#a78bfa" },
  ready_to_email:    { label: "Ready",       bg: "#2d1f0e", text: "#d4a574" },
  emailed:           { label: "Emailed",     bg: "#2e2109", text: "#d4a230" },
  replied_positive:  { label: "Replied +",   bg: "#0d2a1a", text: "#4db871" },
  replied_negative:  { label: "Replied \u2212", bg: "#1a1a1a", text: "#5e5e62" },
  meeting_requested: { label: "Meeting Req", bg: "#2d1f0e", text: "#d4a574" },
  meeting_booked:    { label: "Booked",      bg: "#0d2a1a", text: "#4db871" },
  won:               { label: "Won",         bg: "#0d2a1a", text: "#4db871" },
  lost:              { label: "Lost",        bg: "#1a1a1a", text: "#5e5e62" },
  suppressed:        { label: "Suppressed",  bg: "#2a0f0f", text: "#E04747" },
};

const STAGE_ORDER = [
  "candidate",
  "qualified",
  "ready_to_email",
  "emailed",
  "replied_positive",
  "replied_negative",
  "meeting_requested",
  "meeting_booked",
  "won",
  "lost",
];

/* The valid next stages from a given stage (forward movement only) */
const STAGE_TRANSITIONS: Record<string, string[]> = {
  candidate:         ["qualified"],
  qualified:         ["ready_to_email"],
  ready_to_email:    ["emailed"],
  emailed:           ["replied_positive", "replied_negative"],
  replied_positive:  ["meeting_requested"],
  replied_negative:  [],
  meeting_requested: ["meeting_booked"],
  meeting_booked:    ["won", "lost"],
  won:               [],
  lost:              [],
  suppressed:        [],
};

/* ─────────────────────────── View Filters ─────────────────────── */

type ViewKey = "all" | "ready_to_email" | "emailed" | "replied" | "meetings" | "suppressed";

const VIEWS: { key: ViewKey; label: string; stages?: string[] }[] = [
  { key: "all",            label: "All Leads" },
  { key: "ready_to_email", label: "Ready to Email", stages: ["ready_to_email"] },
  { key: "emailed",        label: "Sent",           stages: ["emailed"] },
  { key: "replied",        label: "Replied",        stages: ["replied_positive", "replied_negative"] },
  { key: "meetings",       label: "Meetings",       stages: ["meeting_requested", "meeting_booked"] },
  { key: "suppressed",     label: "Suppressed",     stages: ["suppressed"] },
];

/* ─────────────────────────── Types ─────────────────────── */

interface Lead {
  id: number;
  company_id: number;
  contact_id: number;
  fit_score: number;
  fit_reason: string | null;
  pain_point_summary: string | null;
  outreach_angle: string | null;
  stage: string;
  owner: string;
  next_action: string | null;
  next_action_at: string | null;
  last_contacted_at: string | null;
  manual_review_required: boolean;
  approved_for_send: boolean;
  created_at: string;
  updated_at: string;
  company_name?: string;
  company_domain?: string;
  company_website?: string;
  company_industry?: string;
  company_city?: string;
  company_state?: string;
  company_fit_score?: number;
  company_fit_summary?: string;
  contact_name?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_title?: string;
  contact_persona_type?: string;
  contact_do_not_contact?: boolean;
  contact_email_status?: string;
  contact_linkedin_url?: string;
  contact_city?: string;
  contact_state?: string;
  // Detail-only fields
  activities?: Activity[];
  drafts?: Draft[];
  notes?: Note[];
}

interface Activity {
  id: number;
  lead_id: number;
  type: string;
  channel?: string;
  body_preview?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface Draft {
  id: number;
  lead_id: number;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  model: string | null;
  persona_type: string | null;
  approval_status: string;
  is_ai_generated: boolean;
  is_manually_edited: boolean;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
}

interface Note {
  id: number;
  lead_id: number;
  body: string;
  created_at: string;
}

interface StatsRow {
  stage: string;
  count: number;
}

interface ApolloResult {
  contact: {
    full_name: string;
    first_name: string;
    last_name: string;
    title: string;
    email: string;
    email_status: string;
    linkedin_url: string;
  };
  company: {
    name: string;
    domain: string;
    website: string;
    industry: string;
    city: string;
    state: string;
  };
}

/* ─────────────────────────── Helpers ─────────────────────── */

function fmtDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateTime(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fitColor(score: number): string {
  if (score >= 75) return T.green;
  if (score >= 50) return T.copper;
  return T.red;
}

function activityIcon(type: string): string {
  switch (type) {
    case "email_sent":      return "\u2709";
    case "draft_generated": return "\u270E";
    case "stage_change":    return "\u2192";
    case "note_added":      return "\u270D";
    case "lead_created":    return "\u002B";
    case "lead_imported":   return "\u21E9";
    case "suppressed":      return "\u26D4";
    default:                return "\u2022";
  }
}

/* ─────────────────────────── Apollo Rate Limiting ─────────────────────── */

const APOLLO_DAILY_LIMIT = 100;

function getApolloUsageKey(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `apollo_searches_${today}`;
}

function getApolloUsageToday(): number {
  if (typeof window === "undefined") return 0;
  const key = getApolloUsageKey();
  const val = localStorage.getItem(key);
  return val ? parseInt(val, 10) : 0;
}

function incrementApolloUsage(): number {
  const key = getApolloUsageKey();
  const current = getApolloUsageToday();
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
}

/* ─────────────────────────── Sub-Components ─────────────────────── */

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" stroke={T.faint} strokeWidth="3" />
      <path
        d="M12 2 A10 10 0 0 1 22 12"
        stroke={T.copper}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </svg>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const s = STAGES[stage] || { label: stage, bg: T.faint, text: T.bodyText };
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium inline-block whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.text, ...FONT_HEADING }}
    >
      {s.label}
    </span>
  );
}

function FitBar({ score }: { score: number }) {
  const color = fitColor(score);
  return (
    <div className="flex items-center gap-2">
      <div
        className="rounded-full h-1.5 flex-1"
        style={{ backgroundColor: T.faint, maxWidth: 60 }}
      >
        <div
          className="rounded-full h-1.5"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs tabular-nums" style={{ color, ...FONT_HEADING }}>
        {score}
      </span>
    </div>
  );
}

/* ─────────────────────────── KPI Bar ─────────────────────── */

function KpiBar({ stats }: { stats: StatsRow[] }) {
  const count = (stages: string[]) =>
    stats.filter((s) => stages.includes(s.stage)).reduce((a, s) => a + s.count, 0);
  const total = stats.reduce((a, s) => a + s.count, 0);

  const kpis = [
    { label: "Total Leads",   value: total },
    { label: "Qualified",     value: count(["qualified"]) },
    { label: "Ready",         value: count(["ready_to_email"]) },
    { label: "Emails Sent",   value: count(["emailed"]) },
    { label: "Positive",      value: count(["replied_positive"]) },
    { label: "Meetings",      value: count(["meeting_requested", "meeting_booked"]) },
    { label: "Won",           value: count(["won"]) },
    { label: "Suppressed",    value: count(["suppressed"]) },
  ];

  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((k) => (
        <div
          key={k.label}
          className="rounded-lg px-3 py-2.5"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="text-xs mb-0.5" style={{ color: T.muted, ...FONT_HEADING }}>
            {k.label}
          </div>
          <div className="text-lg font-semibold" style={{ color: T.starlight, ...FONT_HEADING }}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Add Lead Modal ─────────────────────── */

function AddLeadModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    company_name: "",
    website: "",
    industry: "",
    city: "",
    state: "",
    first_name: "",
    last_name: "",
    title: "",
    email: "",
    persona_type: "founder",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: {
            name: form.company_name,
            website: form.website || undefined,
            domain: form.website ? new URL(form.website.startsWith("http") ? form.website : `https://${form.website}`).hostname : undefined,
            industry: form.industry || undefined,
            city: form.city || undefined,
            state: form.state || undefined,
          },
          contact: {
            full_name: `${form.first_name} ${form.last_name}`.trim(),
            first_name: form.first_name,
            last_name: form.last_name,
            title: form.title || undefined,
            email: form.email,
            persona_type: form.persona_type,
          },
          lead: { stage: "candidate" },
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to create lead");
      }
      onCreated();
      onClose();
      setForm({
        company_name: "", website: "", industry: "", city: "", state: "",
        first_name: "", last_name: "", title: "", email: "", persona_type: "founder",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  const inputStyle: React.CSSProperties = {
    backgroundColor: T.page,
    border: `1px solid ${T.border}`,
    color: T.starlight,
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    color: T.muted,
    fontSize: 11,
    marginBottom: 2,
    display: "block",
    ...FONT_HEADING,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 w-full max-w-lg"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: T.starlight, ...FONT_HEADING }}>
          Add Lead
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Company Name *</label>
              <input
                required
                value={form.company_name}
                onChange={(e) => set("company_name", e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Website</label>
              <input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="example.com"
                style={inputStyle}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label style={labelStyle}>Industry</label>
              <input value={form.industry} onChange={(e) => set("industry", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>City</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input value={form.state} onChange={(e) => set("state", e.target.value)} style={inputStyle} />
            </div>
          </div>
          <hr style={{ borderColor: T.border }} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>First Name *</label>
              <input required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle}>Title</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Persona</label>
            <select value={form.persona_type} onChange={(e) => set("persona_type", e.target.value)} style={inputStyle}>
              <option value="founder">Founder / CEO</option>
              <option value="marketing_leader">Marketing Leader</option>
              <option value="other">Other</option>
            </select>
          </div>
          {error && (
            <div className="text-sm rounded px-3 py-2" style={{ color: T.red, backgroundColor: "rgba(224,71,71,0.1)" }}>
              {error}
            </div>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ color: T.bodyText, border: `1px solid ${T.border}` }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: T.copper, color: T.page }}
            >
              {saving && <Spinner size={14} />}
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────── Email Preview Modal ─────────────────────── */

function EmailPreviewModal({
  open,
  onClose,
  subject,
  bodyText,
  contactEmail,
}: {
  open: boolean;
  onClose: () => void;
  subject: string;
  bodyText: string;
  contactEmail: string;
}) {
  if (!open) return null;

  const escapedBody = bodyText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const previewHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0; padding:0; background-color:#0b1120;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1120;">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px; width:100%;">
        <tr><td style="padding:0 0 28px; text-align:center;">
          <span style="color:#D4A574; font-size:18px; font-weight:600; font-family:-apple-system,sans-serif;">Cosmic Reach Creative</span>
        </td></tr>
        <tr><td style="background-color:#111827; border-radius:12px; border:1px solid rgba(212,165,116,0.15); padding:28px 24px;">
          <div style="font-size:15px; line-height:1.6; color:#e8dfcf; font-family:-apple-system,sans-serif;">
            <p>${escapedBody}</p>
          </div>
        </td></tr>
        <tr><td style="padding:24px 0 0; text-align:center;">
          <p style="font-size:12px; color:rgba(232,223,207,0.25); margin:0;">Cosmic Reach Creative | Memphis, TN</p>
          <p style="font-size:12px; color:rgba(232,223,207,0.25); margin:6px 0 0;">
            <a href="#" style="color:rgba(212,165,116,0.5); text-decoration:underline;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div>
            <div className="text-xs" style={{ color: T.muted, ...FONT_HEADING }}>Email Preview</div>
            <div className="text-sm font-medium" style={{ color: T.starlight }}>
              Subject: {subject}
            </div>
            <div className="text-xs" style={{ color: T.muted }}>To: {contactEmail}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg"
            style={{ color: T.muted, border: `1px solid ${T.border}` }}
          >
            &#x2715;
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <iframe
            srcDoc={previewHtml}
            title="Email Preview"
            className="w-full"
            style={{ border: "none", minHeight: 500, backgroundColor: "#0b1120" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Apollo Search Section (Top-Level) ─────────────────────── */

function ApolloSearchBar({ onImported }: { onImported: () => void }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [titleKeywords, setTitleKeywords] = useState("");
  const [location, setLocation] = useState("Memphis, TN");
  const [results, setResults] = useState<ApolloResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(true);
  const [usage, setUsage] = useState(0);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const perPage = 10;

  useEffect(() => {
    setUsage(getApolloUsageToday());
  }, []);

  const limitReached = usage >= APOLLO_DAILY_LIMIT;

  async function search(searchPage = 1) {
    if (limitReached) return;
    setSearching(true);
    setError(null);
    try {
      const titleArr = titleKeywords
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/crm/apollo/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query || undefined,
          location: location || undefined,
          industry: industry || undefined,
          title_keywords: titleArr.length > 0 ? titleArr : undefined,
          per_page: perPage,
          page: searchPage,
        }),
      });
      const data = await res.json();
      if (data.fallback) {
        setUnavailable(true);
        return;
      }
      setResults(data.results || []);
      setTotalResults(data.total || 0);
      setPage(searchPage);
      setResultsOpen(true);
      const newUsage = incrementApolloUsage();
      setUsage(newUsage);
    } catch {
      setError("Search failed");
    } finally {
      setSearching(false);
    }
  }

  async function importLead(r: ApolloResult) {
    setImporting(r.contact.email);
    try {
      const res = await fetch("/api/admin/crm/apollo/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: r.company, contact: r.contact }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Import failed");
      }
      onImported();
      setResults((prev) => prev.filter((x) => x.contact.email !== r.contact.email));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: T.page,
    border: `1px solid ${T.border}`,
    color: T.starlight,
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    outline: "none",
  };

  if (unavailable) {
    return (
      <div
        className="rounded-lg px-4 py-3"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium" style={{ color: T.muted, ...FONT_HEADING }}>
            Prospect Search &mdash; API key not configured
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
        style={{ borderBottom: expanded ? `1px solid ${T.border}` : "none" }}
      >
        <div className="flex items-center gap-3">
          <div className="text-xs font-medium" style={{ color: T.copper, ...FONT_HEADING }}>
            Prospect Search
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              backgroundColor: limitReached ? "rgba(224,71,71,0.15)" : "rgba(77,184,113,0.12)",
              color: limitReached ? T.red : T.green,
              ...FONT_HEADING,
            }}
          >
            {usage}/{APOLLO_DAILY_LIMIT} searches today
          </span>
        </div>
        <span className="text-xs" style={{ color: T.muted }}>
          {expanded ? "\u25B2" : "\u25BC"}
        </span>
      </div>

      {/* Expanded search form */}
      {expanded && (
        <div className="px-4 py-3 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-xs block mb-1" style={{ color: T.muted, ...FONT_HEADING }}>
                Keywords
              </label>
              <input
                placeholder="Search companies or people..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>
            <div className="min-w-[140px]">
              <label className="text-xs block mb-1" style={{ color: T.muted, ...FONT_HEADING }}>
                Industry
              </label>
              <input
                placeholder="e.g. SaaS, Healthcare"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>
            <div className="min-w-[160px]">
              <label className="text-xs block mb-1" style={{ color: T.muted, ...FONT_HEADING }}>
                Title Keywords
              </label>
              <input
                placeholder="founder, CEO, VP Marketing"
                value={titleKeywords}
                onChange={(e) => setTitleKeywords(e.target.value)}
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>
            <div className="min-w-[130px]">
              <label className="text-xs block mb-1" style={{ color: T.muted, ...FONT_HEADING }}>
                Location
              </label>
              <input
                placeholder="Memphis, TN"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ ...inputStyle, width: "100%" }}
              />
            </div>
            <button
              onClick={() => search(1)}
              disabled={searching || limitReached || (!query.trim() && !industry.trim() && !titleKeywords.trim())}
              className="px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 self-end"
              style={{
                backgroundColor: limitReached ? T.faint : T.copper,
                color: limitReached ? T.muted : T.page,
                opacity: searching || limitReached ? 0.6 : 1,
                ...FONT_HEADING,
              }}
            >
              {searching ? <Spinner size={14} /> : null}
              {limitReached ? "Daily Limit Reached" : "Search Prospects"}
            </button>
          </div>

          {error && <div className="text-xs" style={{ color: T.red }}>{error}</div>}

          {/* Results */}
          {results.length > 0 && (
            <div>
              <div
                className="flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => setResultsOpen((o) => !o)}
              >
                <div className="text-xs font-medium" style={{ color: T.muted, ...FONT_HEADING }}>
                  Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalResults)} of {totalResults.toLocaleString()} results
                </div>
                <span className="text-xs" style={{ color: T.muted }}>
                  {resultsOpen ? "\u25B2 Collapse" : "\u25BC Expand"}
                </span>
              </div>
              {resultsOpen && (
                <>
                <div className="flex flex-col gap-1.5 max-h-80 overflow-auto">
                  {results.map((r) => (
                    <div
                      key={r.contact.email || `${r.contact.full_name}-${r.company.name}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ backgroundColor: T.page, border: `1px solid ${T.border}` }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate" style={{ color: T.starlight }}>
                          {r.contact.full_name}
                          <span className="ml-2 text-xs" style={{ color: T.muted }}>{r.contact.title}</span>
                        </div>
                        <div className="text-xs truncate" style={{ color: T.bodyText }}>
                          {r.company.name}
                          {r.company.industry ? ` \u00B7 ${r.company.industry}` : ""}
                          {r.company.city ? ` \u00B7 ${r.company.city}, ${r.company.state}` : ""}
                        </div>
                        {r.contact.email && (
                          <div className="text-xs truncate" style={{ color: T.muted }}>
                            {r.contact.email}
                            {r.contact.email_status && r.contact.email_status !== "unknown"
                              ? ` (${r.contact.email_status})`
                              : ""}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => importLead(r)}
                        disabled={importing === r.contact.email}
                        className="px-2.5 py-1 rounded text-xs font-medium ml-3 flex items-center gap-1"
                        style={{ backgroundColor: T.copper, color: T.page }}
                      >
                        {importing === r.contact.email ? <Spinner size={12} /> : null}
                        Import
                      </button>
                    </div>
                  ))}
                </div>
                {totalResults > perPage && (
                  <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: `1px solid ${T.border}` }}>
                    <button
                      onClick={() => search(page - 1)}
                      disabled={page <= 1 || searching}
                      className="px-3 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: page <= 1 ? T.faint : T.card,
                        color: page <= 1 ? T.muted : T.starlight,
                        border: `1px solid ${T.border}`,
                        opacity: page <= 1 ? 0.4 : 1,
                        cursor: page <= 1 ? "not-allowed" : "pointer",
                        ...FONT_HEADING,
                      }}
                    >
                      ← Previous
                    </button>
                    <span className="text-xs" style={{ color: T.muted, ...FONT_HEADING }}>
                      Page {page} of {Math.ceil(totalResults / perPage).toLocaleString()}
                    </span>
                    <button
                      onClick={() => search(page + 1)}
                      disabled={page * perPage >= totalResults || searching}
                      className="px-3 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: page * perPage >= totalResults ? T.faint : T.card,
                        color: page * perPage >= totalResults ? T.muted : T.starlight,
                        border: `1px solid ${T.border}`,
                        opacity: page * perPage >= totalResults ? 0.4 : 1,
                        cursor: page * perPage >= totalResults ? "not-allowed" : "pointer",
                        ...FONT_HEADING,
                      }}
                    >
                      Next →
                    </button>
                  </div>
                )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Lead Detail Panel ─────────────────────── */

function LeadDetailPanel({
  leadId,
  onClose,
  onMutated,
  allLeads,
}: {
  leadId: number;
  onClose: () => void;
  onMutated: () => void;
  allLeads: Lead[];
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Draft editing state
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [draftId, setDraftId] = useState<number | null>(null);
  const [draftIsAi, setDraftIsAi] = useState(false);
  const [draftEdited, setDraftEdited] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailSentAt, setEmailSentAt] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Stage changing
  const [changingStage, setChangingStage] = useState(false);

  // Suppress contact
  const [suppressConfirm, setSuppressConfirm] = useState(false);
  const [suppressing, setSuppressing] = useState(false);

  // Suppress company
  const [suppressCompanyConfirm, setSuppressCompanyConfirm] = useState(false);
  const [suppressingCompany, setSuppressingCompany] = useState(false);

  // Notes
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Action feedback
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "ok" | "err" } | null>(null);

  const isSuppressed = lead?.stage === "suppressed";

  const fetchLead = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}`);
      if (!res.ok) throw new Error("Failed to load lead");
      const data = await res.json();
      setLead(data.lead);

      // Load latest unsent draft if exists
      const drafts: Draft[] = data.lead.drafts || [];
      const latest = drafts.find((d: Draft) => !d.sent_at);
      if (latest) {
        setDraftSubject(latest.subject || "");
        setDraftBody(latest.body_text || "");
        setDraftId(latest.id);
        setDraftIsAi(latest.is_ai_generated);
        setDraftEdited(latest.is_manually_edited);
      }

      // Check if email was sent
      const sentDraft = drafts.find((d: Draft) => d.sent_at);
      if (sentDraft) {
        setEmailSentAt(sentDraft.sent_at);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  function flash(text: string, type: "ok" | "err") {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 3000);
  }

  async function generateDraft() {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      const d = data.draft;
      setDraftSubject(d.subject || "");
      setDraftBody(d.body_text || "");
      setDraftId(d.id);
      setDraftIsAi(d.is_ai_generated);
      setDraftEdited(false);
      flash("Draft generated", "ok");
      fetchLead();
    } catch {
      flash("Failed to generate draft", "err");
    } finally {
      setGenerating(false);
    }
  }

  async function saveDraft() {
    setSavingDraft(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: draftSubject,
          body_text: draftBody,
          is_ai_generated: draftIsAi,
          is_manually_edited: true,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setDraftId(data.draft.id);
      setDraftEdited(true);
      flash("Draft saved", "ok");
      fetchLead();
    } catch {
      flash("Failed to save draft", "err");
    } finally {
      setSavingDraft(false);
    }
  }

  async function sendEmail() {
    if (isSuppressed) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft_id: draftId,
          subject: draftSubject,
          body_text: draftBody,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Send failed");
      }
      setEmailSentAt(new Date().toISOString());
      flash("Email sent!", "ok");
      onMutated();
      fetchLead();
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : "Send failed", "err");
    } finally {
      setSending(false);
    }
  }

  async function changeStage(newStage: string) {
    setChangingStage(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/stage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Stage change failed");
      }
      flash(`Moved to ${STAGES[newStage]?.label || newStage}`, "ok");
      onMutated();
      fetchLead();
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : "Stage change failed", "err");
    } finally {
      setChangingStage(false);
    }
  }

  async function suppressLead() {
    setSuppressing(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/suppress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "manual_opt_out" }),
      });
      if (!res.ok) throw new Error("Suppress failed");
      flash("Contact opted out", "ok");
      setSuppressConfirm(false);
      onMutated();
      fetchLead();
    } catch {
      flash("Failed to opt out contact", "err");
    } finally {
      setSuppressing(false);
    }
  }

  async function suppressCompany() {
    if (!lead) return;
    setSuppressingCompany(true);
    try {
      // Find all leads with the same company_id
      const companyLeads = allLeads.filter((l) => l.company_id === lead.company_id);

      // Suppress each one via the existing suppress endpoint
      const promises = companyLeads.map((l) =>
        fetch(`/api/admin/crm/leads/${l.id}/suppress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "company_suppressed" }),
        })
      );

      // If no other leads found, at least suppress the current one
      if (companyLeads.length === 0) {
        const res = await fetch(`/api/admin/crm/leads/${leadId}/suppress`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: "company_suppressed" }),
        });
        if (!res.ok) throw new Error("Suppress failed");
      } else {
        const results = await Promise.all(promises);
        const failed = results.filter((r) => !r.ok);
        if (failed.length > 0) throw new Error(`Failed to suppress ${failed.length} contacts`);
      }

      flash(
        `Company "${lead.company_name}" suppressed (${Math.max(companyLeads.length, 1)} contact${companyLeads.length !== 1 ? "s" : ""})`,
        "ok"
      );
      setSuppressCompanyConfirm(false);
      onMutated();
      fetchLead();
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : "Failed to suppress company", "err");
    } finally {
      setSuppressingCompany(false);
    }
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const res = await fetch(`/api/admin/crm/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: noteText.trim() }),
      });
      if (!res.ok) throw new Error("Failed to save note");
      setNoteText("");
      flash("Note added", "ok");
      fetchLead();
    } catch {
      flash("Failed to add note", "err");
    } finally {
      setSavingNote(false);
    }
  }

  const nextStages = lead ? (STAGE_TRANSITIONS[lead.stage] || []) : [];

  const sectionStyle: React.CSSProperties = {
    backgroundColor: T.page,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: 16,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: T.page,
    border: `1px solid ${T.border}`,
    color: T.starlight,
    borderRadius: 6,
    padding: "6px 10px",
    fontSize: 13,
    width: "100%",
    outline: "none",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-y-auto"
        style={{
          width: "min(620px, 90vw)",
          backgroundColor: T.card,
          borderLeft: `1px solid ${T.border}`,
        }}
      >
        {/* Close button */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="text-xs" style={{ color: T.muted, ...FONT_HEADING }}>Lead Detail</div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded"
            style={{ color: T.muted, border: `1px solid ${T.border}` }}
          >
            &#x2715;
          </button>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Spinner size={24} />
          </div>
        )}

        {error && (
          <div className="p-5">
            <div className="text-sm" style={{ color: T.red }}>{error}</div>
          </div>
        )}

        {lead && !loading && (
          <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Action feedback */}
            {actionMsg && (
              <div
                className="rounded-lg px-3 py-2 text-sm"
                style={{
                  color: actionMsg.type === "ok" ? T.green : T.red,
                  backgroundColor: actionMsg.type === "ok" ? "rgba(77,184,113,0.1)" : "rgba(224,71,71,0.1)",
                }}
              >
                {actionMsg.text}
              </div>
            )}

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold" style={{ color: T.starlight, ...FONT_HEADING }}>
                  {lead.contact_name || "Unknown"}
                </h2>
                <div className="text-sm" style={{ color: T.bodyText }}>
                  {lead.contact_title}
                  {lead.contact_title && lead.company_name ? " at " : ""}
                  {lead.company_name}
                </div>
                <div className="mt-1.5">
                  <StageBadge stage={lead.stage} />
                </div>
              </div>
              {!isSuppressed && (
                <div className="flex flex-col gap-2 items-end">
                  {/* Opt Out Contact */}
                  {!suppressConfirm ? (
                    <button
                      onClick={() => setSuppressConfirm(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ color: T.red, border: `1px solid ${T.red}33` }}
                    >
                      Opt Out Contact
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: T.red }}>Opt out this contact?</span>
                      <button
                        onClick={suppressLead}
                        disabled={suppressing}
                        className="px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: T.red, color: "#fff" }}
                      >
                        {suppressing && <Spinner size={12} />}
                        Yes, Opt Out
                      </button>
                      <button
                        onClick={() => setSuppressConfirm(false)}
                        className="px-2 py-1 rounded text-xs"
                        style={{ color: T.muted, border: `1px solid ${T.border}` }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Suppress Company */}
                  {!suppressCompanyConfirm ? (
                    <button
                      onClick={() => setSuppressCompanyConfirm(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ color: T.red, border: `1px solid ${T.red}33` }}
                    >
                      Suppress Company
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: T.red }}>
                        Suppress all contacts at {lead.company_name}?
                      </span>
                      <button
                        onClick={suppressCompany}
                        disabled={suppressingCompany}
                        className="px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: T.red, color: "#fff" }}
                      >
                        {suppressingCompany && <Spinner size={12} />}
                        Yes, Suppress
                      </button>
                      <button
                        onClick={() => setSuppressCompanyConfirm(false)}
                        className="px-2 py-1 rounded text-xs"
                        style={{ color: T.muted, border: `1px solid ${T.border}` }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Info Cards ── */}
            <div className="grid grid-cols-2 gap-3">
              {/* Company */}
              <div style={sectionStyle}>
                <div className="text-xs font-medium mb-2" style={{ color: T.copper, ...FONT_HEADING }}>Company</div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm" style={{ color: T.starlight }}>{lead.company_name}</div>
                  {lead.company_website && (
                    <a
                      href={lead.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline truncate"
                      style={{ color: T.copper }}
                    >
                      {lead.company_domain || lead.company_website}
                    </a>
                  )}
                  {lead.company_industry && (
                    <div className="text-xs" style={{ color: T.muted }}>{lead.company_industry}</div>
                  )}
                  {(lead.company_city || lead.company_state) && (
                    <div className="text-xs" style={{ color: T.muted }}>
                      {[lead.company_city, lead.company_state].filter(Boolean).join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div style={sectionStyle}>
                <div className="text-xs font-medium mb-2" style={{ color: T.copper, ...FONT_HEADING }}>Contact</div>
                <div className="flex flex-col gap-1">
                  {isSuppressed ? (
                    <div className="text-sm font-medium" style={{ color: T.red }}>OPT-OUT</div>
                  ) : (
                    <div className="text-sm truncate" style={{ color: T.starlight }}>
                      {lead.contact_email}
                    </div>
                  )}
                  {lead.contact_linkedin_url && (
                    <a
                      href={lead.contact_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline truncate"
                      style={{ color: T.copper }}
                    >
                      LinkedIn
                    </a>
                  )}
                  <div className="text-xs" style={{ color: T.muted }}>
                    {lead.contact_persona_type === "founder"
                      ? "Founder"
                      : lead.contact_persona_type === "marketing_leader"
                      ? "Marketing Leader"
                      : "Other"}
                  </div>
                </div>
              </div>
            </div>

            {/* Fit card */}
            <div style={sectionStyle}>
              <div className="text-xs font-medium mb-2" style={{ color: T.copper, ...FONT_HEADING }}>Fit Analysis</div>
              <div className="flex items-center gap-4">
                <div
                  className="text-3xl font-bold"
                  style={{ color: fitColor(lead.fit_score), ...FONT_HEADING }}
                >
                  {lead.fit_score}
                </div>
                <div className="flex-1">
                  {lead.fit_reason && (
                    <div className="text-xs mb-1" style={{ color: T.bodyText }}>{lead.fit_reason}</div>
                  )}
                  {lead.pain_point_summary && (
                    <div className="text-xs mb-1" style={{ color: T.muted }}>
                      <strong style={{ color: T.bodyText }}>Pain:</strong> {lead.pain_point_summary}
                    </div>
                  )}
                  {lead.outreach_angle && (
                    <div className="text-xs" style={{ color: T.muted }}>
                      <strong style={{ color: T.bodyText }}>Angle:</strong> {lead.outreach_angle}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Pipeline Controls ── */}
            {!isSuppressed && nextStages.length > 0 && (
              <div style={sectionStyle}>
                <div className="text-xs font-medium mb-2" style={{ color: T.copper, ...FONT_HEADING }}>
                  Move to Stage
                </div>
                <div className="flex flex-wrap gap-2">
                  {nextStages.map((st) => {
                    const meta = STAGES[st];
                    return (
                      <button
                        key={st}
                        onClick={() => changeStage(st)}
                        disabled={changingStage}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                        style={{ backgroundColor: meta.bg, color: meta.text, ...FONT_HEADING }}
                      >
                        {changingStage && <Spinner size={12} />}
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Email Draft Section ── */}
            <div style={sectionStyle}>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium" style={{ color: T.copper, ...FONT_HEADING }}>
                  Email Outreach
                </div>
                {draftSubject && (
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: draftIsAi && !draftEdited ? "#1e1250" : T.faint,
                      color: draftIsAi && !draftEdited ? "#a78bfa" : T.bodyText,
                    }}
                  >
                    {draftIsAi && !draftEdited ? "AI Generated" : "Manually Edited"}
                  </span>
                )}
              </div>

              {isSuppressed && (
                <div
                  className="rounded-lg px-3 py-2 text-sm mb-3"
                  style={{ color: T.red, backgroundColor: "rgba(224,71,71,0.1)" }}
                >
                  This contact has opted out and cannot be emailed.
                </div>
              )}

              {emailSentAt ? (
                <div className="text-sm" style={{ color: T.green }}>
                  Email sent {fmtDateTime(emailSentAt)}
                </div>
              ) : (
                <>
                  {!draftSubject && !isSuppressed && (
                    <button
                      onClick={generateDraft}
                      disabled={generating}
                      className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      style={{ backgroundColor: T.faint, color: T.starlight }}
                    >
                      {generating ? <Spinner size={14} /> : null}
                      Generate AI Draft
                    </button>
                  )}

                  {draftSubject && (
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: T.muted, ...FONT_HEADING }}>
                          Subject
                        </label>
                        <input
                          value={draftSubject}
                          onChange={(e) => {
                            setDraftSubject(e.target.value);
                            setDraftEdited(true);
                          }}
                          disabled={isSuppressed}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{ color: T.muted, ...FONT_HEADING }}>
                          Body
                        </label>
                        <textarea
                          value={draftBody}
                          onChange={(e) => {
                            setDraftBody(e.target.value);
                            setDraftEdited(true);
                          }}
                          disabled={isSuppressed}
                          rows={8}
                          style={{ ...inputStyle, resize: "vertical" }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setPreviewOpen(true)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ color: T.bodyText, border: `1px solid ${T.border}` }}
                        >
                          Preview Email
                        </button>
                        {!isSuppressed && (
                          <>
                            <button
                              onClick={saveDraft}
                              disabled={savingDraft}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                              style={{ color: T.bodyText, border: `1px solid ${T.border}` }}
                            >
                              {savingDraft && <Spinner size={12} />}
                              Save Draft
                            </button>
                            <button
                              onClick={generateDraft}
                              disabled={generating}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                              style={{ color: T.bodyText, border: `1px solid ${T.border}` }}
                            >
                              {generating && <Spinner size={12} />}
                              Regenerate
                            </button>
                            <button
                              onClick={sendEmail}
                              disabled={sending || !draftSubject || !draftBody}
                              className="px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 ml-auto"
                              style={{
                                backgroundColor: T.copper,
                                color: T.page,
                                opacity: sending || !draftSubject || !draftBody ? 0.5 : 1,
                              }}
                            >
                              {sending && <Spinner size={14} />}
                              Send Email
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Activity Timeline ── */}
            <div style={sectionStyle}>
              <div className="text-xs font-medium mb-3" style={{ color: T.copper, ...FONT_HEADING }}>
                Activity Timeline
              </div>
              {(!lead.activities || lead.activities.length === 0) ? (
                <div className="text-xs" style={{ color: T.muted }}>No activity yet.</div>
              ) : (
                <div className="flex flex-col gap-2">
                  {lead.activities.map((a) => (
                    <div key={a.id} className="flex gap-2 items-start">
                      <span
                        className="text-sm w-5 text-center flex-shrink-0 mt-0.5"
                        style={{ color: T.muted }}
                      >
                        {activityIcon(a.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs" style={{ color: T.bodyText }}>
                          {a.body_preview || a.type.replace(/_/g, " ")}
                        </div>
                        <div className="text-xs" style={{ color: T.muted }}>
                          {fmtDateTime(a.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Notes ── */}
            <div style={sectionStyle}>
              <div className="text-xs font-medium mb-3" style={{ color: T.copper, ...FONT_HEADING }}>
                Notes
              </div>
              {lead.notes && lead.notes.length > 0 && (
                <div className="flex flex-col gap-2 mb-3">
                  {lead.notes.map((n) => (
                    <div key={n.id} className="rounded-lg p-2.5" style={{ backgroundColor: T.card }}>
                      <div className="text-xs whitespace-pre-wrap" style={{ color: T.bodyText }}>
                        {n.body}
                      </div>
                      <div className="text-xs mt-1" style={{ color: T.muted }}>
                        {fmtDateTime(n.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                  style={{ ...inputStyle, flex: 1, resize: "vertical" }}
                />
                <button
                  onClick={addNote}
                  disabled={savingNote || !noteText.trim()}
                  className="px-3 self-end rounded-lg text-xs font-medium flex items-center gap-1.5"
                  style={{
                    backgroundColor: T.faint,
                    color: T.starlight,
                    height: 32,
                    opacity: !noteText.trim() ? 0.4 : 1,
                  }}
                >
                  {savingNote && <Spinner size={12} />}
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email preview modal */}
      {lead && (
        <EmailPreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          subject={draftSubject}
          bodyText={draftBody}
          contactEmail={lead.contact_email || ""}
        />
      )}
    </>
  );
}

/* ─────────────────────────── Main Component ─────────────────────── */

export function CrmTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<StatsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [activeView, setActiveView] = useState<ViewKey>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"fit_score" | "last_contacted_at">("fit_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Detail panel
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  // Add lead modal
  const [addOpen, setAddOpen] = useState(false);

  // Seeding
  const [seeding, setSeeding] = useState(false);

  // Track suppressed companies for red highlighting in the table
  const suppressedCompanyIds = new Set(
    leads.filter((l) => l.stage === "suppressed").map((l) => l.company_id)
  );

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/crm/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats || []);
      }
    } catch {
      /* swallow */
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const view = VIEWS.find((v) => v.key === activeView);
      const stageParam = view?.stages;

      // If the view maps to multiple stages, we need to fetch each separately or fetch all
      // The API only supports a single stage filter, so for multi-stage views we fetch all and filter client-side
      let url = "/api/admin/crm/leads?limit=200";
      if (stageParam && stageParam.length === 1) {
        url += `&stage=${stageParam[0]}`;
      }
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      let fetched: Lead[] = data.leads || [];

      // Client-side filter for multi-stage views
      if (stageParam && stageParam.length > 1) {
        fetched = fetched.filter((l) => stageParam.includes(l.stage));
      }

      // Sort
      fetched.sort((a, b) => {
        if (sortBy === "fit_score") {
          return sortDir === "desc" ? b.fit_score - a.fit_score : a.fit_score - b.fit_score;
        }
        const aDate = a.last_contacted_at || "";
        const bDate = b.last_contacted_at || "";
        return sortDir === "desc"
          ? bDate.localeCompare(aDate)
          : aDate.localeCompare(bDate);
      });

      setLeads(fetched);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [activeView, search, sortBy, sortDir]);

  useEffect(() => {
    fetchStats();
    fetchLeads();
  }, [fetchStats, fetchLeads]);

  const handleMutated = useCallback(() => {
    fetchStats();
    fetchLeads();
  }, [fetchStats, fetchLeads]);

  async function seedData() {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/crm/seed", { method: "POST" });
      if (!res.ok) throw new Error("Seed failed");
      handleMutated();
    } catch {
      setError("Failed to seed data");
    } finally {
      setSeeding(false);
    }
  }

  function toggleSort(col: "fit_score" | "last_contacted_at") {
    if (sortBy === col) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  }

  const sortIndicator = (col: string) => {
    if (sortBy !== col) return "";
    return sortDir === "desc" ? " \u25BC" : " \u25B2";
  };

  const totalLeads = stats.reduce((a, s) => a + s.count, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* KPI Bar */}
      <KpiBar stats={stats} />

      {/* Prospect Search Search */}
      <ApolloSearchBar onImported={handleMutated} />

      {/* Filter Bar */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-lg px-3 py-2.5"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
      >
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: activeView === v.key ? T.faint : "transparent",
              color: activeView === v.key ? T.starlight : T.muted,
              ...FONT_HEADING,
            }}
          >
            {v.label}
          </button>
        ))}

        <div className="flex-1" />

        <input
          type="text"
          placeholder="Search name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg px-3 py-1.5 text-sm"
          style={{
            backgroundColor: T.page,
            border: `1px solid ${T.border}`,
            color: T.starlight,
            width: 240,
            outline: "none",
          }}
        />

        <button
          onClick={() => setAddOpen(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ backgroundColor: T.copper, color: T.page, ...FONT_HEADING }}
        >
          + Add Lead
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ color: T.red, backgroundColor: "rgba(224,71,71,0.1)", border: `1px solid ${T.red}33` }}
        >
          {error}
        </div>
      )}

      {/* Seed Data Button */}
      {!loading && totalLeads === 0 && (
        <div
          className="flex flex-col items-center gap-3 py-12 rounded-lg"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="text-sm" style={{ color: T.muted }}>No leads in the pipeline yet.</div>
          <button
            onClick={seedData}
            disabled={seeding}
            className="px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ backgroundColor: T.copper, color: T.page, ...FONT_HEADING }}
          >
            {seeding && <Spinner size={16} />}
            Seed Test Data
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size={24} />
        </div>
      )}

      {/* Leads Table */}
      {!loading && leads.length > 0 && (
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: `1px solid ${T.border}` }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: T.card }}>
                  {[
                    { label: "Status", key: null, w: 100 },
                    { label: "Name", key: null, w: undefined },
                    { label: "Company", key: null, w: undefined },
                    { label: "Title", key: null, w: undefined },
                    { label: "Fit", key: "fit_score" as const, w: 100 },
                    { label: "Email", key: null, w: undefined },
                    { label: "Source", key: null, w: 80 },
                    { label: "Last Contact", key: "last_contacted_at" as const, w: 120 },
                    { label: "Next Action", key: null, w: undefined },
                  ].map((col, i) => (
                    <th
                      key={i}
                      className="px-3 py-2.5 text-xs font-medium whitespace-nowrap"
                      style={{
                        color: T.muted,
                        borderBottom: `1px solid ${T.border}`,
                        width: col.w,
                        cursor: col.key ? "pointer" : "default",
                        userSelect: "none",
                        ...FONT_HEADING,
                      }}
                      onClick={() => col.key && toggleSort(col.key)}
                    >
                      {col.label}
                      {col.key && sortIndicator(col.key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const suppressed = lead.stage === "suppressed";
                  const companySuppressed = suppressedCompanyIds.has(lead.company_id);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="cursor-pointer transition-colors"
                      style={{
                        backgroundColor: suppressed
                          ? "rgba(224,71,71,0.08)"
                          : T.card,
                        borderLeft: suppressed ? `3px solid ${T.red}` : "3px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = suppressed
                          ? "rgba(224,71,71,0.12)"
                          : T.page;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = suppressed
                          ? "rgba(224,71,71,0.08)"
                          : T.card;
                      }}
                    >
                      <td className="px-3 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                        <StageBadge stage={lead.stage} />
                      </td>
                      <td
                        className="px-3 py-2.5 text-sm"
                        style={{ color: T.starlight, borderBottom: `1px solid ${T.border}` }}
                      >
                        {lead.contact_name || "\u2014"}
                      </td>
                      <td
                        className="px-3 py-2.5 text-sm"
                        style={{
                          color: companySuppressed ? T.red : T.bodyText,
                          fontWeight: companySuppressed ? 600 : 400,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {lead.company_name || "\u2014"}
                      </td>
                      <td
                        className="px-3 py-2.5 text-xs"
                        style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}
                      >
                        {lead.contact_title || "\u2014"}
                      </td>
                      <td className="px-3 py-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                        <FitBar score={lead.fit_score} />
                      </td>
                      <td
                        className="px-3 py-2.5 text-xs"
                        style={{
                          color: suppressed ? T.red : T.muted,
                          fontWeight: suppressed ? 600 : 400,
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {suppressed ? "OPT-OUT" : lead.contact_email || "\u2014"}
                      </td>
                      <td
                        className="px-3 py-2.5 text-xs"
                        style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}
                      >
                        {lead.owner || "\u2014"}
                      </td>
                      <td
                        className="px-3 py-2.5 text-xs whitespace-nowrap"
                        style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}
                      >
                        {fmtDate(lead.last_contacted_at)}
                      </td>
                      <td
                        className="px-3 py-2.5 text-xs"
                        style={{ color: T.bodyText, borderBottom: `1px solid ${T.border}` }}
                      >
                        {lead.next_action || "\u2014"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state (after loading, with leads in pipeline but filtered view empty) */}
      {!loading && leads.length === 0 && totalLeads > 0 && (
        <div
          className="flex flex-col items-center py-12 rounded-lg"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="text-sm" style={{ color: T.muted }}>
            No leads match this filter.
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedLeadId !== null && (
        <LeadDetailPanel
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onMutated={handleMutated}
          allLeads={leads}
        />
      )}

      {/* Add Lead Modal */}
      <AddLeadModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleMutated}
      />
    </div>
  );
}
