import {
  getContactSubmissions,
  getAuditSubmissions,
  getCtaStats,
  getCtaTimeline,
  getSubmissionTimeline,
} from "@/lib/db";
import { getGA4Data } from "@/lib/ga4";
import { AdminDashboard } from "./AdminDashboard";
import type { Submission, StripeData } from "./AdminDashboard";
import Stripe from "stripe";

/* ─── Types ─── */
type Row = Record<string, string | number | null>;

/* ─── Stripe ─── */
async function getStripeData(): Promise<StripeData | null> {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe       = new Stripe(process.env.STRIPE_SECRET_KEY);
    const startOfMonth = Math.floor(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() / 1000
    );

    const [recent, mtd] = await Promise.all([
      stripe.charges.list({ limit: 20 }),
      stripe.charges.list({ limit: 100, created: { gte: startOfMonth } }),
    ]);

    const mtdRevenue     = mtd.data.filter((c) => c.paid).reduce((s, c) => s + c.amount, 0) / 100;
    const allTimePaid    = recent.data.filter((c) => c.paid);
    const allTimeRevenue = allTimePaid.reduce((s, c) => s + c.amount, 0) / 100;

    return {
      mtdRevenue,
      allTimeRevenue,
      recent: recent.data.slice(0, 10).map((c) => ({
        id:          c.id,
        amount:      (c.amount / 100).toFixed(2),
        currency:    c.currency.toUpperCase(),
        description: c.description ?? c.statement_descriptor ?? "-",
        email:       c.billing_details?.email ?? "-",
        date:        new Date(c.created * 1000).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
        paid: c.paid,
      })),
    };
  } catch {
    return null;
  }
}

/* ─── Page ─── */
export default async function AdminPage() {
  const [auditRows, contactRows, ctaStats, stripe, ctaTimeline, submissionTimeline, ga4] =
    await Promise.all([
      getAuditSubmissions().catch((): Row[] => []),
      getContactSubmissions().catch((): Row[] => []),
      getCtaStats().catch(() => []),
      getStripeData(),
      getCtaTimeline().catch(() => []),
      getSubmissionTimeline().catch(() => []),
      getGA4Data().catch(() => null),
    ]);

  /* Merge contacts + audits into a unified, typed list sorted newest-first */
  const submissions: Submission[] = [
    ...contactRows.map(
      (r): Submission => ({
        id:         r.id as number,
        name:       r.name as string,
        email:      r.email as string,
        company:    r.company as string | null,
        status:     (r.status as string) ?? "new",
        notes:      (r.notes as string) ?? "",
        created_at: r.created_at as string,
        type:       "contact",
        message:    r.message as string | undefined,
      })
    ),
    ...auditRows.map(
      (r): Submission => ({
        id:                   r.id as number,
        name:                 r.name as string,
        email:                r.email as string,
        company:              r.company as string | null,
        status:               (r.status as string) ?? "new",
        notes:                (r.notes as string) ?? "",
        created_at:           r.created_at as string,
        type:                 "audit",
        website:              r.website as string | undefined,
        business_description: r.business_description as string | undefined,
        what_is_stuck:        r.what_is_stuck as string | undefined,
        primary_goal:         r.primary_goal as string | undefined,
        key_offers:           r.key_offers as string | undefined,
        ideal_customer:       r.ideal_customer as string | undefined,
        anything_else:        r.anything_else as string | undefined,
        supporting_links:     r.supporting_links as string | undefined,
      })
    ),
  ].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <AdminDashboard
      submissions={submissions}
      ctaStats={ctaStats.map((r) => ({
        label:      r.label as string,
        clicks:     r.clicks as number,
        clicks_30d: r.clicks_30d as number,
      }))}
      stripe={stripe}
      ctaTimeline={ctaTimeline}
      submissionTimeline={submissionTimeline}
      ga4={ga4}
    />
  );
}
