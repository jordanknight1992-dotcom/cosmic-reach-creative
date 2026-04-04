"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

/* ─────────────────────────── Types ─────────────────────── */

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  body: string | null;
  excerpt: string | null;
  feature_image: string | null;
  category: string | null;
  tags: string | null;
  author: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  published_at: string | null;
  reading_time_minutes: number | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_override: string | null;
  noindex: boolean;
  publish_email_sent: boolean;
  publish_email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  status: string;
  created_at: string;
}

interface SubscriberData {
  subscribers: Subscriber[];
  stats: { active: number; total: number };
}

type FilterKey = "all" | "published" | "draft";

/* ─────────────────────────── Helpers ─────────────────────── */

function autoSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 238));
}

function fmtDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ─────────────────────────── Empty post template ─────────────────────── */

function emptyPost(): Omit<BlogPost, "id" | "created_at" | "updated_at"> {
  return {
    title: "",
    slug: "",
    body: "",
    excerpt: "",
    feature_image: "",
    category: "",
    tags: "",
    author: "Jordan Knight",
    status: "draft",
    featured: false,
    published_at: null,
    reading_time_minutes: null,
    seo_title: "",
    seo_description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image_override: "",
    noindex: false,
    publish_email_sent: false,
    publish_email_sent_at: null,
  };
}

/* ─────────────────────────── Shared Styles ─────────────────────── */

const inputStyle: React.CSSProperties = {
  backgroundColor: T.page,
  color: T.starlight,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  padding: "8px 12px",
  width: "100%",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  color: T.muted,
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 4,
};

/* ═══════════════════════════ Component ═══════════════════════════ */

export function BlogTab() {
  /* ── Data state ── */
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [subData, setSubData] = useState<SubscriberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  /* ── UI state ── */
  const [filter, setFilter] = useState<FilterKey>("all");
  const [showSubs, setShowSubs] = useState(false);
  const [view, setView] = useState<"list" | "editor">("list");

  /* ── Editor state ── */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyPost());
  const [slugManual, setSlugManual] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const saveMsgTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* ── Fetch data ── */
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/posts");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts(data);
      setFetchError(false);
    } catch {
      setFetchError(true);
    }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/blog/subscribers");
      if (!res.ok) return;
      setSubData(await res.json());
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchPosts(), fetchSubscribers()]);
      setLoading(false);
    })();
  }, [fetchPosts, fetchSubscribers]);

  /* ── Setup tables ── */
  const handleSetup = async () => {
    try {
      const res = await fetch("/api/admin/blog/setup", { method: "POST" });
      if (!res.ok) throw new Error();
      await fetchPosts();
      await fetchSubscribers();
    } catch {
      alert("Setup failed. Check server logs.");
    }
  };

  /* ── Filtered list ── */
  const filtered = posts.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  /* ── Editor helpers ── */
  const openEditor = (post: BlogPost | null) => {
    if (post) {
      setEditingId(post.id);
      setForm({
        title: post.title,
        slug: post.slug,
        body: post.body ?? "",
        excerpt: post.excerpt ?? "",
        feature_image: post.feature_image ?? "",
        category: post.category ?? "",
        tags: post.tags ?? "",
        author: post.author,
        status: post.status,
        featured: post.featured,
        published_at: post.published_at,
        reading_time_minutes: post.reading_time_minutes,
        seo_title: post.seo_title ?? "",
        seo_description: post.seo_description ?? "",
        canonical_url: post.canonical_url ?? "",
        og_title: post.og_title ?? "",
        og_description: post.og_description ?? "",
        og_image_override: post.og_image_override ?? "",
        noindex: post.noindex,
        publish_email_sent: post.publish_email_sent,
        publish_email_sent_at: post.publish_email_sent_at,
      });
      setSlugManual(true);
    } else {
      setEditingId(null);
      setForm(emptyPost());
      setSlugManual(false);
    }
    setSaveMsg(null);
    setSeoOpen(false);
    setView("editor");
  };

  const updateField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    updateField("title", title);
    if (!slugManual) {
      updateField("slug", autoSlug(title));
    }
  };

  const handleSlugChange = (slug: string) => {
    setSlugManual(slug !== "");
    updateField("slug", slug);
  };

  const flash = (ok: boolean, text: string) => {
    setSaveMsg({ ok, text });
    clearTimeout(saveMsgTimer.current);
    saveMsgTimer.current = setTimeout(() => setSaveMsg(null), 4000);
  };

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const slug = form.slug || autoSlug(form.title);
      const payload = { ...form, slug };

      let res: Response;
      if (editingId) {
        res = await fetch(`/api/admin/blog/posts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error();
      const saved: BlogPost = await res.json();
      setEditingId(saved.id);
      setForm((prev) => ({
        ...prev,
        slug: saved.slug,
        publish_email_sent: saved.publish_email_sent,
        publish_email_sent_at: saved.publish_email_sent_at,
        reading_time_minutes: saved.reading_time_minutes,
      }));
      setSlugManual(true);
      flash(true, "Saved successfully");
      await fetchPosts();
    } catch {
      flash(false, "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!editingId) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/blog/posts/${editingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setView("list");
      await fetchPosts();
    } catch {
      flash(false, "Delete failed");
    }
  };

  /* ── Send email ── */
  const handleSendEmail = async (resend = false) => {
    if (!editingId) return;
    const msg = resend
      ? "Resend this email to all subscribers? They may receive a duplicate."
      : "Send this post to all active subscribers?";
    if (!confirm(msg)) return;

    setSendingEmail(true);
    try {
      const res = await fetch(`/api/admin/blog/posts/${editingId}/send-email`, {
        method: "POST",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        publish_email_sent: true,
        publish_email_sent_at: data.sent_at ?? new Date().toISOString(),
      }));
      flash(true, resend ? "Email resent" : "Email sent to subscribers");
      await fetchPosts();
    } catch {
      flash(false, "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const bodyReadingTime = form.body ? readingTime(form.body) : 0;

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  /* ── Loading / Error ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p style={{ color: T.muted }}>Loading blog data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p style={{ color: T.muted }}>
          Could not load blog posts. The tables may not exist yet.
        </p>
        <button
          onClick={handleSetup}
          className="rounded-lg px-5 py-2 font-semibold"
          style={{ backgroundColor: T.copper, color: T.page }}
        >
          Run Setup
        </button>
      </div>
    );
  }

  /* ── Editor View ── */
  if (view === "editor") {
    return (
      <div className="flex flex-col gap-6">
        {/* Back */}
        <button
          onClick={() => setView("list")}
          className="self-start text-sm"
          style={{ color: T.muted }}
        >
          &larr; Back to posts
        </button>

        {/* Title */}
        <div>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            style={{ ...inputStyle, fontSize: 20, fontWeight: 600, ...FONT_HEADING }}
          />
        </div>

        {/* Slug */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label style={labelStyle} className="mb-0">Slug</label>
            {!slugManual && (
              <span
                className="text-xs rounded px-1.5 py-0.5"
                style={{ backgroundColor: T.faint, color: T.muted }}
              >
                Auto
              </span>
            )}
          </div>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="auto-generated-from-title"
            style={inputStyle}
          />
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label style={labelStyle}>Body</label>
            {bodyReadingTime > 0 && (
              <span className="text-xs" style={{ color: T.muted }}>
                ~{bodyReadingTime} min read
              </span>
            )}
          </div>
          <textarea
            value={form.body ?? ""}
            onChange={(e) => updateField("body", e.target.value)}
            placeholder="Write your post in markdown..."
            style={{
              ...inputStyle,
              minHeight: 400,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              resize: "vertical",
            }}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea
            value={form.excerpt ?? ""}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={3}
            placeholder="Short summary for previews"
            style={inputStyle}
          />
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Category</label>
            <input
              type="text"
              value={form.category ?? ""}
              onChange={(e) => updateField("category", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Tags</label>
            <input
              type="text"
              value={form.tags ?? ""}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="design, branding, strategy"
              style={inputStyle}
            />
            <span className="text-xs mt-0.5 block" style={{ color: T.muted }}>
              Comma-separated
            </span>
          </div>
          <div>
            <label style={labelStyle}>Author</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Feature Image URL</label>
            <input
              type="text"
              value={form.feature_image ?? ""}
              onChange={(e) => updateField("feature_image", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                updateField("status", e.target.value as "draft" | "published" | "archived")
              }
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-end gap-3 pb-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: T.copper }}
              />
              <span style={{ color: T.bodyText, fontSize: 14 }}>Featured</span>
            </label>
          </div>
        </div>

        {/* SEO collapsible */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: `1px solid ${T.border}`, backgroundColor: T.card }}
        >
          <button
            onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between px-4 py-3"
            style={{ color: T.muted }}
          >
            <span className="text-sm font-semibold uppercase tracking-wider">
              SEO &amp; Social
            </span>
            <span>{seoOpen ? "\u25B2" : "\u25BC"}</span>
          </button>

          {seoOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 pb-4">
              <div className="md:col-span-2">
                <label style={labelStyle}>SEO Title</label>
                <input
                  type="text"
                  value={form.seo_title ?? ""}
                  onChange={(e) => updateField("seo_title", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>SEO Description</label>
                <textarea
                  value={form.seo_description ?? ""}
                  onChange={(e) => updateField("seo_description", e.target.value)}
                  rows={2}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Canonical URL</label>
                <input
                  type="text"
                  value={form.canonical_url ?? ""}
                  onChange={(e) => updateField("canonical_url", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>OG Title</label>
                <input
                  type="text"
                  value={form.og_title ?? ""}
                  onChange={(e) => updateField("og_title", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div className="md:col-span-2">
                <label style={labelStyle}>OG Description</label>
                <textarea
                  value={form.og_description ?? ""}
                  onChange={(e) => updateField("og_description", e.target.value)}
                  rows={2}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>OG Image Override URL</label>
                <input
                  type="text"
                  value={form.og_image_override ?? ""}
                  onChange={(e) => updateField("og_image_override", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.noindex}
                    onChange={(e) => updateField("noindex", e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: T.copper }}
                  />
                  <span style={{ color: T.bodyText, fontSize: 14 }}>Noindex</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg px-5 py-2 font-semibold disabled:opacity-50"
            style={{ backgroundColor: T.copper, color: T.page }}
          >
            {saving ? "Saving..." : "Save"}
          </button>

          {editingId && (
            <button
              onClick={handleDelete}
              className="rounded-lg px-4 py-2 text-sm font-medium"
              style={{ color: T.red, border: `1px solid ${T.red}30` }}
            >
              Delete
            </button>
          )}

          {editingId &&
            form.status === "published" &&
            !form.publish_email_sent && (
              <button
                onClick={() => handleSendEmail(false)}
                disabled={sendingEmail}
                className="rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
                style={{ backgroundColor: T.green, color: T.page }}
              >
                {sendingEmail ? "Sending..." : "Send to Subscribers"}
              </button>
            )}

          {editingId && form.publish_email_sent && (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: T.green }}>
                Email sent {form.publish_email_sent_at ? `on ${fmtDate(form.publish_email_sent_at)}` : ""}
              </span>
              <button
                onClick={() => handleSendEmail(true)}
                disabled={sendingEmail}
                className="rounded px-3 py-1 text-xs disabled:opacity-50"
                style={{ color: T.muted, border: `1px solid ${T.faint}` }}
              >
                {sendingEmail ? "Sending..." : "Resend"}
              </button>
            </div>
          )}

          {saveMsg && (
            <span
              className="text-sm ml-2"
              style={{ color: saveMsg.ok ? T.green : T.red }}
            >
              {saveMsg.text}
            </span>
          )}
        </div>
      </div>
    );
  }

  /* ── List View ── */
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ color: T.starlight, ...FONT_HEADING }}
        >
          The Observatory
        </h2>
        <button
          onClick={() => openEditor(null)}
          className="rounded-lg px-4 py-2 font-semibold"
          style={{ backgroundColor: T.copper, color: T.page }}
        >
          New Post
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "published", "draft"] as FilterKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium capitalize"
            style={{
              backgroundColor: filter === key ? T.copper : T.faint,
              color: filter === key ? T.page : T.bodyText,
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Post table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: `1px solid ${T.border}` }}
      >
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: T.card }}>
              {["Title", "Status", "Category", "Published", "Email Sent"].map(
                (col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                    style={{ color: T.muted, borderBottom: `1px solid ${T.border}` }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center"
                  style={{ color: T.muted }}
                >
                  No posts found
                </td>
              </tr>
            )}
            {filtered.map((post) => {
              const isPub = post.status === "published";
              return (
                <tr
                  key={post.id}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                  className="hover:opacity-90"
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEditor(post)}
                      className="text-left font-medium hover:underline flex items-center gap-1.5"
                      style={{ color: T.starlight }}
                    >
                      {post.featured && (
                        <span style={{ color: T.copper, fontSize: 12 }}>&#9733;</span>
                      )}
                      {post.title}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: isPub ? `${T.green}20` : `${T.muted}20`,
                        color: isPub ? T.green : T.muted,
                      }}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: T.bodyText }}>
                    {post.category || "\u2014"}
                  </td>
                  <td className="px-4 py-3" style={{ color: T.bodyText }}>
                    {fmtDate(post.published_at)}
                  </td>
                  <td className="px-4 py-3">
                    {post.publish_email_sent ? (
                      <span style={{ color: T.green }}>&#10003; Sent</span>
                    ) : (
                      <span style={{ color: T.muted }}>&mdash;</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Subscriber stats */}
      {subData && (
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: T.card, border: `1px solid ${T.border}` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <span style={{ color: T.bodyText }}>
                Active Subscribers:{" "}
                <strong style={{ color: T.starlight }}>
                  {subData.stats.active}
                </strong>
              </span>
              <span style={{ color: T.bodyText }}>
                Total:{" "}
                <strong style={{ color: T.starlight }}>
                  {subData.stats.total}
                </strong>
              </span>
            </div>
            <button
              onClick={() => setShowSubs(!showSubs)}
              className="text-xs"
              style={{ color: T.muted }}
            >
              {showSubs ? "Hide list" : "Show list"}
            </button>
          </div>

          {showSubs && subData.subscribers.length > 0 && (
            <div
              className="mt-3 pt-3 flex flex-col gap-1"
              style={{ borderTop: `1px solid ${T.border}` }}
            >
              {subData.subscribers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between text-xs px-2 py-1 rounded"
                  style={{ color: T.bodyText }}
                >
                  <span>{s.email}</span>
                  <span style={{ color: T.muted }}>{fmtDate(s.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
