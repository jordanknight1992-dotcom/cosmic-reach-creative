import { getContactSubmissions, getAuditSubmissions, getCtaStats } from "@/lib/db";
import { LogoutButton } from "./LogoutButton";
import Stripe from "stripe";

/* ─── Types ─── */
type Row = Record<string, string | number | null>;

/* ─── Stripe helpers ─── */
async function getStripeData() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const now = Math.floor(Date.now() / 1000);
    const startOfMonth = Math.floor(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000
    );

    const [recent, mtd] = await Promise.all([
      stripe.charges.list({ limit: 20 }),
      stripe.charges.list({ limit: 100, created: { gte: startOfMonth } }),
    ]);

    const mtdRevenue = mtd.data
      .filter((c) => c.paid)
      .reduce((s, c) => s + c.amount, 0) / 100;

    const allPaid = recent.data.filter((c) => c.paid);
    const allTimeRevenue = allPaid.reduce((s, c) => s + c.amount, 0) / 100;

    return {
      mtdRevenue,
      allTimeRevenue,
      recent: recent.data.slice(0, 10).map((c) => ({
        id: c.id,
        amount: (c.amount / 100).toFixed(2),
        currency: c.currency.toUpperCase(),
        description: c.description ?? c.statement_descriptor ?? "—",
        email: c.billing_details?.email ?? "—",
        date: new Date(c.created * 1000).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        paid: c.paid,
      })),
    };
  } catch {
    return null;
  }
}

/* ─── Stat Card ─── */
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#101726", border: "1px solid #202431" }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#5E5E62" }}>
        {label}
      </p>
      <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)", color: "#D4A574" }}>
        {value}
      </p>
      {sub && <p className="text-xs mt-1" style={{ color: "#343841" }}>{sub}</p>}
    </div>
  );
}

/* ─── Submission accordion ─── */
function SubmissionRow({ row, fields }: { row: Row; fields: { key: string; label: string }[] }) {
  const date = row.created_at
    ? new Date(row.created_at as string).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "—";
  return (
    <details className="rounded-lg mb-2" style={{ backgroundColor: "#0B1120", border: "1px solid #202431" }}>
      <summary
        className="flex items-center justify-between px-4 py-3 cursor-pointer list-none select-none"
        style={{ color: "#E8DFCF" }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            {row.name as string}
          </span>
          <span className="text-xs truncate" style={{ color: "#5E5E62" }}>{row.email as string}</span>
          {row.company && (
            <span className="text-xs truncate" style={{ color: "#5E5E62" }}>· {row.company as string}</span>
          )}
        </div>
        <span className="text-xs flex-shrink-0 ml-4" style={{ color: "#343841" }}>{date}</span>
      </summary>
      <div className="px-4 pb-4 pt-1 space-y-3">
        {fields.map(({ key, label }) =>
          row[key] ? (
            <div key={key}>
              <p className="text-xs font-semibold tracking-wider uppercase mb-1" style={{ color: "#5E5E62" }}>
                {label}
              </p>
              <p className="text-sm whitespace-pre-wrap" style={{ color: "#BCB6AC" }}>
                {row[key] as string}
              </p>
            </div>
          ) : null
        )}
      </div>
    </details>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ fontFamily: "var(--font-space-grotesk)", color: "#5E5E62" }}>
          {title}
        </h2>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "#202431", color: "#5E5E62" }}
        >
          {count}
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#202431" }} />
      </div>
      {children}
    </div>
  );
}

/* ─── Page ─── */
export default async function AdminPage() {
  const [audits, contacts, ctaStats, stripe] = await Promise.all([
    getAuditSubmissions().catch(() => [] as Row[]),
    getContactSubmissions().catch(() => [] as Row[]),
    getCtaStats().catch(() => [] as Row[]),
    getStripeData(),
  ]);

  const totalSubmissions = audits.length + contacts.length;
  const totalCtaClicks = ctaStats.reduce((s, r) => s + (r.clicks as number), 0);

  /* Conversion rate = submissions / CTA clicks (last 30 days) */
  const clicks30d = ctaStats.reduce((s, r) => s + (r.clicks_30d as number), 0);
  const convRate = clicks30d > 0
    ? ((totalSubmissions / clicks30d) * 100).toFixed(1) + "%"
    : "—";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0B1120", color: "#E8DFCF" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "#0B1120", borderBottom: "1px solid #202431" }}
      >
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-mark-light.svg" alt="" className="w-7 h-7" />
          <span
            className="font-bold text-sm tracking-wide"
            style={{ fontFamily: "var(--font-space-grotesk)", color: "#E8DFCF" }}
          >
            Mission Control
          </span>
        </div>
        <LogoutButton />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ── Stats row ── */}
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
            sub={`${audits.length} audits · ${contacts.length} contacts`}
          />
          <StatCard
            label="CTA → Conversion"
            value={convRate}
            sub={`${totalCtaClicks} total clicks tracked`}
          />
        </div>

        {/* ── Stripe transactions ── */}
        {stripe ? (
          <Section title="Recent Stripe Transactions" count={stripe.recent.length}>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #202431" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#101726" }}>
                    {["Date", "Amount", "Description", "Email"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase"
                        style={{ color: "#5E5E62" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stripe.recent.map((t) => (
                    <tr key={t.id} style={{ borderTop: "1px solid #202431" }}>
                      <td className="px-4 py-3 text-xs" style={{ color: "#5E5E62" }}>{t.date}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: t.paid ? "#4DB871" : "#E04747" }}>
                        ${t.amount}
                      </td>
                      <td className="px-4 py-3" style={{ color: "#BCB6AC" }}>{t.description}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "#5E5E62" }}>{t.email}</td>
                    </tr>
                  ))}
                  {stripe.recent.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-xs" style={{ color: "#343841" }}>
                        No transactions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Section>
        ) : (
          <div
            className="rounded-xl p-6 mb-10 text-sm text-center"
            style={{ backgroundColor: "#101726", border: "1px solid #202431", color: "#5E5E62" }}
          >
            Add <code className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#202431" }}>STRIPE_SECRET_KEY</code> to Vercel env vars to see revenue.
          </div>
        )}

        {/* ── CTA Clicks ── */}
        {ctaStats.length > 0 && (
          <Section title="CTA Click Tracking" count={ctaStats.length}>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #202431" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#101726" }}>
                    {["CTA Label", "All-Time Clicks", "Last 30 Days"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wider uppercase" style={{ color: "#5E5E62" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ctaStats.map((r) => (
                    <tr key={r.label as string} style={{ borderTop: "1px solid #202431" }}>
                      <td className="px-4 py-3" style={{ color: "#E8DFCF" }}>{r.label as string}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "#D4A574" }}>{r.clicks as number}</td>
                      <td className="px-4 py-3" style={{ color: "#BCB6AC" }}>{r.clicks_30d as number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        )}

        {/* ── Audit Submissions ── */}
        <Section title="Clarity Audit Intakes" count={audits.length}>
          {audits.length === 0 ? (
            <p className="text-sm" style={{ color: "#343841" }}>No audit submissions yet.</p>
          ) : (
            audits.map((row) => (
              <SubmissionRow
                key={row.id as number}
                row={row}
                fields={[
                  { key: "website", label: "Website" },
                  { key: "business_description", label: "Business Description" },
                  { key: "what_is_stuck", label: "What's Stuck" },
                  { key: "primary_goal", label: "Primary Goal" },
                  { key: "key_offers", label: "Key Offers" },
                  { key: "ideal_customer", label: "Ideal Customer" },
                  { key: "anything_else", label: "Anything Else" },
                  { key: "supporting_links", label: "Supporting Links" },
                ]}
              />
            ))
          )}
        </Section>

        {/* ── Contact Submissions ── */}
        <Section title="Contact Submissions" count={contacts.length}>
          {contacts.length === 0 ? (
            <p className="text-sm" style={{ color: "#343841" }}>No contact submissions yet.</p>
          ) : (
            contacts.map((row) => (
              <SubmissionRow
                key={row.id as number}
                row={row}
                fields={[{ key: "message", label: "Message" }]}
              />
            ))
          )}
        </Section>
      </div>
    </div>
  );
}
