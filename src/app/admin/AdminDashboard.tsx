"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { setStatus, setNotes } from "./actions";
import type { GA4Metrics } from "@/lib/ga4";

/* ─────────────────────────── Types ─────────────────────────── */

export interface Submission {
  id: number;
  name: string;
  email: string;
  company: string | null;
  status: string;
  notes: string;
  created_at: string;
  type: "contact" | "audit";
  /* contact */
  message?: string;
  /* audit */
  website?: string;
  business_description?: string;
  what_is_stuck?: string;
  primary_goal?: string;
  key_offers?: string;
  ideal_customer?: string;
  anything_else?: string;
  supporting_links?: string;
}

export interface CtaStat {
  label: string;
  clicks: number;
  clicks_30d: number;
}

export interface StripeTransaction {
  id: string;
  amount: string;
  currency: string;
  description: string;
  email: string;
  date: string;
  paid: boolean;
}

export interface StripeData {
  mtdRevenue: number;
  allTimeRevenue: number;
  recent: StripeTransaction[];
}

export interface TimelinePoint {
  [key: string]: unknown;
  date: string;
  clicks?: number;
  contacts?: number;
  audits?: number;
}

export interface AdminDashboardProps {
  submissions: Submission[];
  ctaStats: CtaStat[];
  stripe: StripeData | null;
  ctaTimeline: TimelinePoint[];
  submissionTimeline: TimelinePoint[];
  ga4: GA4Metrics | null;
}

/* ─────────────────────────── Constants ─────────────────────── */

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;
type Status = typeof STATUSES[number];

const STATUS_META: Record<Status, { label: string; bg: string; text: string }> = {
  new:       { label: "New",       bg: "#12263f", text: "#60a5fa" },
  contacted: { label: "Contacted", bg: "#2e2109", text: "#d4a230" },
  qualified: { label: "Qualified", bg: "#1e1250", text: "#a78bfa" },
  proposal:  { label: "Proposal",  bg: "#2d1f0e", text: "#d4a574" },
  won:       { label: "Won",       bg: "#0d2a1a", text: "#4db871" },
  lost:      { label: "Lost",      bg: "#1a1a1a", text: "#5e5e62" },
};

/* ─────────────────────────── Utilities ─────────────────────── */

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtShortDate(raw: string): string {
  /* GA4 format: YYYYMMDD; DB format: YYYY-MM-DD */
  const s = raw.length === 8
    ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
    : raw;
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function downloadCSV(submissions: Submission[], filename: string) {
  const headers = [
    "Name", "Email", "Company", "Type", "Status", "Date", "Notes",
    "Message", "Website", "Business Description", "What's Stuck",
    "Primary Goal", "Key Offers", "Ideal Customer", "Anything Else", "Supporting Links",
  ];
  const esc = (v: string | null | undefined) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = submissions.map((s) => [
    s.name, s.email, s.company, s.type, s.status,
    fmtDate(s.created_at), s.notes,
    s.message, s.website, s.business_description, s.what_is_stuck,
    s.primary_goal, s.key_offers, s.ideal_customer, s.anything_else, s.supporting_links,
  ].map(esc).join(","));
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────── Design tokens ─────────────────── */
const T = {
  page:        "#0B1120",
  card:        "#101726",
  border:      "#202431",
  copper:      "#D4A574",
  starlight:   "#E8DFCF",
  bodyText:    "#BCB6AC",
  muted:       "#5E5E62",
  faint:       "#343841",
  green:       "#4DB871",
  red:         "#E04747",
};

/* ─────────────────────────── Sub-components ─────────────────── */

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.muted }}>
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: T.copper }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1" style={{ color: T.faint }}>{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as Status] ?? STATUS_META.new;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{ backgroundColor: meta.bg, color: meta.text, fontFamily: "var(--font-space-grotesk)" }}
    >
      {meta.label}
    </span>
  );
}

function MiniBarChart({
  data,
  color = T.copper,
  labelKey,
  valueKey,
}: {
  data: Record<string, unknown>[];
  color?: string;
  labelKey: string;
  valueKey: string;
}) {
  const max = Math.max(...data.map((d) => (d[valueKey] as number) || 0), 1);
  return (
    <div className="flex items-end gap-px" style={{ height: 64 }}>
      {data.map((d, i) => {
        const val = (d[valueKey] as number) || 0;
        const pct = (val / max) * 100;
        return (
          <div
            key={i}
            className="flex-1 group relative flex items-end"
            title={`${fmtShortDate(String(d[labelKey]))}: ${val}`}
            style={{ height: "100%" }}
          >
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: pct > 0 ? `${pct}%` : "1px",
                backgroundColor: pct > 0 ? color : T.border,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── CRM Row ────────────────────────── */

function SubmissionRow({
  sub,
  onStatusChange,
  onNotesSave,
}: {
  sub: Submission;
  onStatusChange: (table: "contact" | "audit", id: number, status: string) => void;
  onNotesSave: (table: "contact" | "audit", id: number, notes: string) => void;
}) {
  const [open, setOpen]           = useState(false);
  const [localNotes, setLocalNotes] = useState(sub.notes ?? "");
  const [saving, startSaving]     = useTransition();
  const [statusSaving, startStatusSaving] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStatusChange = (newStatus: string) => {
    startStatusSaving(() => onStatusChange(sub.type, sub.id, newStatus));
  };

  const handleNotesChange = (val: string) => {
    setLocalNotes(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startSaving(() => onNotesSave(sub.type, sub.id, val));
    }, 800);
  };

  const auditFields = [
    { key: "website",              label: "Website" },
    { key: "business_description", label: "Business Description" },
    { key: "what_is_stuck",        label: "What's Stuck" },
    { key: "primary_goal",         label: "Primary Goal" },
    { key: "key_offers",           label: "Key Offers" },
    { key: "ideal_customer",       label: "Ideal Customer" },
    { key: "anything_else",        label: "Anything Else" },
    { key: "supporting_links",     label: "Supporting Links" },
  ] as const;

  return (
    <div
      className="rounded-lg mb-2 overflow-hidden"
      style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
    >
      {/* Row summary */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        style={{ color: T.starlight }}
      >
        <StatusBadge status={sub.status} />
        <span className="text-sm font-semibold truncate flex-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          {sub.name}
        </span>
        <span className="text-xs truncate hidden sm:block" style={{ color: T.muted }}>{sub.email}</span>
        {sub.company && (
          <span className="text-xs truncate hidden md:block" style={{ color: T.muted }}>· {sub.company}</span>
        )}
        <span
          className="text-xs px-2 py-0.5 rounded shrink-0"
          style={{ backgroundColor: T.border, color: T.muted, fontFamily: "var(--font-space-grotesk)" }}
        >
          {sub.type === "audit" ? "Audit" : "Contact"}
        </span>
        <span className="text-xs shrink-0" style={{ color: T.faint }}>{fmtDate(sub.created_at)}</span>
        <span className="text-xs shrink-0" style={{ color: T.muted }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-5 pt-1 space-y-4" style={{ borderTop: `1px solid ${T.border}` }}>
          {/* Status selector */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>
              Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => {
                const meta = STATUS_META[s];
                const active = sub.status === s;
                return (
                  <button
                    key={s}
                    disabled={statusSaving}
                    onClick={() => handleStatusChange(s)}
                    className="px-2.5 py-0.5 rounded text-xs font-semibold transition-opacity"
                    style={{
                      backgroundColor: active ? meta.bg : "transparent",
                      color: active ? meta.text : T.faint,
                      border: `1px solid ${active ? meta.text + "40" : T.border}`,
                      fontFamily: "var(--font-space-grotesk)",
                      opacity: statusSaving ? 0.5 : 1,
                    }}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
            <a
              href={`mailto:${sub.email}`}
              className="ml-auto text-xs px-2.5 py-0.5 rounded transition-colors"
              style={{ color: T.copper, border: `1px solid ${T.border}` }}
            >
              ✉ Email
            </a>
          </div>

          {/* Submission fields */}
          {sub.type === "contact" && sub.message && (
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: T.muted }}>Message</p>
              <p className="text-sm whitespace-pre-wrap" style={{ color: T.bodyText }}>{sub.message}</p>
            </div>
          )}
          {sub.type === "audit" && auditFields.map(({ key, label }) =>
            sub[key] ? (
              <div key={key}>
                <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: T.muted }}>{label}</p>
                <p className="text-sm whitespace-pre-wrap" style={{ color: T.bodyText }}>{sub[key]}</p>
              </div>
            ) : null
          )}

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>Notes</p>
              {saving && <span className="text-xs" style={{ color: T.faint }}>saving…</span>}
            </div>
            <textarea
              value={localNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add notes about this lead…"
              rows={3}
              className="w-full rounded-lg text-sm resize-y px-3 py-2 outline-none focus:ring-1"
              style={{
                backgroundColor: "#0B1120",
                border: `1px solid ${T.border}`,
                color: T.bodyText,
                caretColor: T.copper,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Panels ─────────────────────────── */

function SectionHeader({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ fontFamily: "var(--font-space-grotesk)", color: T.muted }}
      >
        {title}
      </h2>
      {count !== undefined && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: T.border, color: T.muted }}
        >
          {count}
        </span>
      )}
      <div className="flex-1 h-px" style={{ backgroundColor: T.border }} />
      {children}
    </div>
  );
}

/* ─── Bookings Tab ─── */
function BookingsTab() {
  const [bookings, setBookings] = useState<Array<{
    id: string; type: string; name: string; email: string; start_time: string;
    end_time: string; notes: string | null; google_meet_url: string | null;
  }>>([]);
  const [blackoutDates, setBlackoutDates] = useState<Array<{ id: number; date: string; label: string | null }>>([]);
  const [newDate, setNewDate] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [bRes, dRes] = await Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/blackout-dates").then((r) => r.json()),
    ]);
    setBookings(bRes.bookings || []);
    setBlackoutDates(dRes.dates || []);
    setLoading(false);
  }, []);

  useState(() => { fetchData(); });

  const addBlackout = async () => {
    if (!newDate) return;
    await fetch("/api/admin/blackout-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, label: newLabel || null }),
    });
    setNewDate("");
    setNewLabel("");
    fetchData();
  };

  const removeBlackout = async (id: number) => {
    await fetch(`/api/admin/blackout-dates?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <p style={{ color: T.muted }}>Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <SectionHeader title="Upcoming Bookings" count={bookings.length} />
        {bookings.length === 0 ? (
          <p style={{ color: T.muted }} className="text-sm">No upcoming bookings.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-lg p-4" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm" style={{ color: T.starlight }}>{b.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: T.copper + "22", color: T.copper }}>{b.type}</span>
                </div>
                <p className="text-xs" style={{ color: T.muted }}>{b.email}</p>
                <p className="text-xs mt-1" style={{ color: T.muted }}>
                  {new Date(b.start_time).toLocaleString()} — {new Date(b.end_time).toLocaleTimeString()}
                </p>
                {b.google_meet_url && (
                  <a href={b.google_meet_url} target="_blank" rel="noopener noreferrer" className="text-xs mt-1 inline-block" style={{ color: T.copper }}>
                    Join Google Meet →
                  </a>
                )}
                {b.notes && <p className="text-xs mt-1" style={{ color: T.muted }}>Notes: {b.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionHeader title="PTO / Blackout Dates" />
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded px-3 py-1.5 text-sm"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.starlight }}
          />
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (optional)"
            className="rounded px-3 py-1.5 text-sm"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.starlight }}
          />
          <button
            onClick={addBlackout}
            className="rounded px-4 py-1.5 text-sm font-semibold"
            style={{ backgroundColor: T.copper, color: T.page }}
          >
            Add
          </button>
        </div>
        {blackoutDates.length === 0 ? (
          <p style={{ color: T.muted }} className="text-sm">No blackout dates set.</p>
        ) : (
          <div className="space-y-2">
            {blackoutDates.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg px-4 py-2" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <span className="text-sm" style={{ color: T.starlight }}>
                  {d.date}{d.label ? ` — ${d.label}` : ""}
                </span>
                <button onClick={() => removeBlackout(d.id)} className="text-xs" style={{ color: T.red }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Dashboard Tab ─── */
function DashboardTab({
  stripe,
  ctaStats,
  ctaTimeline,
  submissionTimeline,
  ga4,
  totalSubmissions,
  auditCount,
  contactCount,
  convRate,
  totalCtaClicks,
}: {
  stripe: StripeData | null;
  ctaStats: CtaStat[];
  ctaTimeline: TimelinePoint[];
  submissionTimeline: TimelinePoint[];
  ga4: GA4Metrics | null;
  totalSubmissions: number;
  auditCount: number;
  contactCount: number;
  convRate: string;
  totalCtaClicks: number;
}) {
  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Revenue MTD"
          value={stripe ? `$${stripe.mtdRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}` : "—"}
          sub="This calendar month"
        />
        <StatCard
          label="All-Time Revenue"
          value={stripe ? `$${stripe.allTimeRevenue.toLocaleString("en-US", { minimumFractionDigits: 0 })}` : "—"}
          sub="Recent transactions"
        />
        <StatCard
          label="Total Submissions"
          value={String(totalSubmissions)}
          sub={`${auditCount} audits · ${contactCount} contacts`}
        />
        <StatCard
          label="CTA → Conversion"
          value={convRate}
          sub={`${totalCtaClicks} total clicks tracked`}
        />
      </div>

      {/* Activity Charts */}
      {(ctaTimeline.length > 0 || submissionTimeline.length > 0) && (
        <div className="mb-10">
          <SectionHeader title="Activity — Last 30 Days" />
          <div className="grid sm:grid-cols-2 gap-4">
            {ctaTimeline.length > 0 && (
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: T.muted }}>
                  CTA Clicks
                </p>
                <MiniBarChart data={ctaTimeline} labelKey="date" valueKey="clicks" color={T.copper} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: T.faint }}>
                    {ctaTimeline.length > 0 ? fmtShortDate(String(ctaTimeline[0].date)) : ""}
                  </span>
                  <span className="text-xs" style={{ color: T.faint }}>
                    {ctaTimeline.length > 0 ? fmtShortDate(String(ctaTimeline[ctaTimeline.length - 1].date)) : ""}
                  </span>
                </div>
              </div>
            )}
            {submissionTimeline.length > 0 && (
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: T.muted }}>
                  Submissions
                </p>
                <div className="flex gap-3 mb-2">
                  <span className="flex items-center gap-1 text-xs" style={{ color: T.faint }}>
                    <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: T.copper }} /> Audits
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: T.faint }}>
                    <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: "#60a5fa" }} /> Contacts
                  </span>
                </div>
                {/* Stacked audit + contact bars */}
                <div className="flex items-end gap-px" style={{ height: 64 }}>
                  {submissionTimeline.map((d, i) => {
                    const audits   = (d.audits as number) || 0;
                    const contacts = (d.contacts as number) || 0;
                    const total    = audits + contacts;
                    const maxTotal = Math.max(
                      ...submissionTimeline.map((p) => ((p.audits as number) || 0) + ((p.contacts as number) || 0)),
                      1
                    );
                    const totalPct = (total / maxTotal) * 100;
                    const auditPct = total > 0 ? (audits / total) * 100 : 0;
                    return (
                      <div
                        key={i}
                        title={`${fmtShortDate(String(d.date))}: ${audits} audits, ${contacts} contacts`}
                        className="flex-1 flex flex-col justify-end"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="w-full rounded-t-sm overflow-hidden"
                          style={{ height: totalPct > 0 ? `${totalPct}%` : "1px" }}
                        >
                          <div style={{ height: `${auditPct}%`, backgroundColor: T.copper }} />
                          <div style={{ height: `${100 - auditPct}%`, backgroundColor: "#60a5fa" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: T.faint }}>
                    {submissionTimeline.length > 0 ? fmtShortDate(String(submissionTimeline[0].date)) : ""}
                  </span>
                  <span className="text-xs" style={{ color: T.faint }}>
                    {submissionTimeline.length > 0 ? fmtShortDate(String(submissionTimeline[submissionTimeline.length - 1].date)) : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GA4 Section */}
      <div className="mb-10">
        <SectionHeader title="Site Analytics" />
        {ga4 ? (
          <div className="space-y-4">
            {/* GA4 stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.muted }}>Sessions (30d)</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: T.copper }}>
                  {ga4.sessions30d.toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.muted }}>Page Views (30d)</p>
                <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: T.copper }}>
                  {ga4.pageViews30d.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Daily sessions chart */}
            {ga4.dailySessions.length > 0 && (
              <div className="rounded-xl p-5" style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: T.muted }}>Daily Sessions</p>
                <MiniBarChart data={ga4.dailySessions} labelKey="date" valueKey="sessions" color="#60a5fa" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: T.faint }}>
                    {ga4.dailySessions.length > 0 ? fmtShortDate(ga4.dailySessions[0].date) : ""}
                  </span>
                  <span className="text-xs" style={{ color: T.faint }}>
                    {ga4.dailySessions.length > 0 ? fmtShortDate(ga4.dailySessions[ga4.dailySessions.length - 1].date) : ""}
                  </span>
                </div>
              </div>
            )}
            {/* Top pages */}
            {ga4.topPages.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: T.card }}>
                      <th className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>Page</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ga4.topPages.map((p) => (
                      <tr key={p.page} style={{ borderTop: `1px solid ${T.border}` }}>
                        <td className="px-4 py-2.5 text-xs font-mono truncate max-w-xs" style={{ color: T.bodyText }}>{p.page}</td>
                        <td className="px-4 py-2.5 text-right font-semibold" style={{ color: T.copper }}>{p.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div
            className="rounded-xl p-7 text-center"
            style={{ backgroundColor: T.card, border: `1px dashed ${T.border}` }}
          >
            <p className="text-sm font-semibold mb-3" style={{ color: T.muted }}>Connect GA4 for Site Analytics</p>
            <p className="text-xs mb-4 max-w-md mx-auto leading-relaxed" style={{ color: T.faint }}>
              Add three Vercel env vars to unlock sessions, page views, and traffic data directly in this dashboard.
            </p>
            <div className="inline-block text-left rounded-lg px-4 py-3 space-y-1" style={{ backgroundColor: "#0B1120", border: `1px solid ${T.border}` }}>
              {["GA4_PROPERTY_ID", "GOOGLE_CLIENT_EMAIL", "GOOGLE_PRIVATE_KEY"].map((v) => (
                <p key={v} className="text-xs font-mono" style={{ color: T.copper }}>{v}</p>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: T.faint }}>
              See <span className="font-mono" style={{ color: T.muted }}>src/lib/ga4.ts</span> for setup instructions.
            </p>
          </div>
        )}
      </div>

      {/* CTA click table */}
      {ctaStats.length > 0 && (
        <div className="mb-10">
          <SectionHeader title="CTA Click Tracking" count={ctaStats.length} />
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: T.card }}>
                  {["CTA Label", "All-Time", "Last 30 Days"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ctaStats.map((r) => (
                  <tr key={r.label} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td className="px-4 py-3" style={{ color: T.starlight }}>{r.label}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: T.copper }}>{r.clicks}</td>
                    <td className="px-4 py-3" style={{ color: T.bodyText }}>{r.clicks_30d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stripe transactions */}
      {stripe ? (
        <div className="mb-10">
          <SectionHeader title="Recent Stripe Transactions" count={stripe.recent.length} />
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: T.card }}>
                  {["Date", "Amount", "Description", "Email"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: T.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stripe.recent.map((t) => (
                  <tr key={t.id} style={{ borderTop: `1px solid ${T.border}` }}>
                    <td className="px-4 py-3 text-xs" style={{ color: T.muted }}>{t.date}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: t.paid ? T.green : T.red }}>${t.amount}</td>
                    <td className="px-4 py-3" style={{ color: T.bodyText }}>{t.description}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: T.muted }}>{t.email}</td>
                  </tr>
                ))}
                {stripe.recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-xs" style={{ color: T.faint }}>No transactions yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl p-5 mb-10 text-sm text-center"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.muted }}
        >
          Add{" "}
          <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: T.border }}>
            STRIPE_SECRET_KEY
          </code>{" "}
          to Vercel env vars to see revenue.
        </div>
      )}
    </div>
  );
}

/* ─── Pipeline Tab ─── */
function PipelineTab({
  submissions,
  onStatusChange,
  onNotesSave,
}: {
  submissions: Submission[];
  onStatusChange: (table: "contact" | "audit", id: number, status: string) => void;
  onNotesSave: (table: "contact" | "audit", id: number, notes: string) => void;
}) {
  const [typeFilter,   setTypeFilter]   = useState<"all" | "audit" | "contact">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const filtered = submissions.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  const handleExport = () => {
    const filename = `cosmic-reach-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filtered, filename);
  };

  const pipeCounts: Record<string, number> = {};
  for (const s of submissions) pipeCounts[s.status] = (pipeCounts[s.status] || 0) + 1;

  return (
    <div>
      {/* Pipeline status summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => {
          const meta  = STATUS_META[s];
          const count = pipeCounts[s] || 0;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                backgroundColor: statusFilter === s ? meta.bg : "transparent",
                color: statusFilter === s ? meta.text : T.muted,
                border: `1px solid ${statusFilter === s ? meta.text + "40" : T.border}`,
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {meta.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: T.border, color: T.faint }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          {(["all", "audit", "contact"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="px-3 py-1.5 text-xs font-semibold"
              style={{
                backgroundColor: typeFilter === t ? T.border : "transparent",
                color: typeFilter === t ? T.starlight : T.muted,
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {t === "all" ? "All" : t === "audit" ? "Audits" : "Contacts"}
            </button>
          ))}
        </div>

        <span className="text-xs" style={{ color: T.faint }}>
          {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
        </span>

        <div className="ml-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              backgroundColor: "transparent",
              color: T.copper,
              border: `1px solid ${T.border}`,
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            ↓ Export CSV
          </button>
        </div>
      </div>

      {/* Submission list */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl py-12 text-center"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <p className="text-sm" style={{ color: T.faint }}>No submissions match the current filters.</p>
        </div>
      ) : (
        <div>
          {filtered.map((sub) => (
            <SubmissionRow
              key={`${sub.type}-${sub.id}`}
              sub={sub}
              onStatusChange={onStatusChange}
              onNotesSave={onNotesSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Main component ─────────────────── */

export function AdminDashboard({
  submissions: initialSubmissions,
  ctaStats,
  stripe,
  ctaTimeline,
  submissionTimeline,
  ga4,
}: AdminDashboardProps) {
  const [tab, setTab] = useState<"dashboard" | "pipeline" | "bookings">("dashboard");
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [, startTransition] = useTransition();

  /* Derived stats */
  const auditCount   = submissions.filter((s) => s.type === "audit").length;
  const contactCount = submissions.filter((s) => s.type === "contact").length;
  const totalSubmissions = submissions.length;
  const totalCtaClicks = ctaStats.reduce((s, r) => s + r.clicks, 0);
  const clicks30d  = ctaStats.reduce((s, r) => s + r.clicks_30d, 0);
  const convRate   = clicks30d > 0
    ? ((totalSubmissions / clicks30d) * 100).toFixed(1) + "%"
    : "—";

  const handleStatusChange = useCallback(
    (table: "contact" | "audit", id: number, status: string) => {
      /* Optimistic update */
      setSubmissions((prev) =>
        prev.map((s) => s.type === table && s.id === id ? { ...s, status } : s)
      );
      startTransition(() => setStatus(table, id, status));
    },
    []
  );

  const handleNotesSave = useCallback(
    (table: "contact" | "audit", id: number, notes: string) => {
      /* Optimistic update */
      setSubmissions((prev) =>
        prev.map((s) => s.type === table && s.id === id ? { ...s, notes } : s)
      );
      startTransition(() => setNotes(table, id, notes));
    },
    []
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.page, color: T.starlight }}>
      {/* ── Sticky header ── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 gap-6"
        style={{ backgroundColor: T.page, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-mark-light.svg" alt="" className="w-7 h-7" />
          <span
            className="font-bold text-sm tracking-wide"
            style={{ fontFamily: "var(--font-space-grotesk)", color: T.starlight }}
          >
            Mission Control
          </span>
        </div>

        {/* Tab nav */}
        <nav className="flex gap-1" role="tablist">
          {(["dashboard", "pipeline", "bookings"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors"
              style={{
                backgroundColor: tab === t ? T.border : "transparent",
                color:           tab === t ? T.starlight : T.muted,
                fontFamily:      "var(--font-space-grotesk)",
              }}
            >
              {t === "dashboard" ? "Dashboard" : t === "pipeline" ? "Pipeline" : "Bookings"}
            </button>
          ))}
        </nav>

        {/* Logout — imported LogoutButton can't be used directly here since it needs a router;
            inline the same behaviour with a simple form action */}
        <LogoutButtonInline />
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {tab === "dashboard" ? (
          <DashboardTab
            stripe={stripe}
            ctaStats={ctaStats}
            ctaTimeline={ctaTimeline}
            submissionTimeline={submissionTimeline}
            ga4={ga4}
            totalSubmissions={totalSubmissions}
            auditCount={auditCount}
            contactCount={contactCount}
            convRate={convRate}
            totalCtaClicks={totalCtaClicks}
          />
        ) : tab === "pipeline" ? (
          <PipelineTab
            submissions={submissions}
            onStatusChange={handleStatusChange}
            onNotesSave={handleNotesSave}
          />
        ) : (
          <BookingsTab />
        )}
      </div>
    </div>
  );
}

/* Inline logout button — avoids importing from LogoutButton.tsx inside a "use client" file
   that already has its own transition state */
function LogoutButtonInline() {
  const [, start] = useTransition();
  const handleLogout = () =>
    start(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.href = "/admin/login";
    });
  return (
    <button
      onClick={handleLogout}
      className="shrink-0 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors"
      style={{ color: T.muted, border: `1px solid ${T.border}`, fontFamily: "var(--font-space-grotesk)" }}
    >
      Log out
    </button>
  );
}
