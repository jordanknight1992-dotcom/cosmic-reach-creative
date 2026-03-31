import { requireTenantAccess } from "@/lib/mc-session";
import { OverviewView } from "./OverviewView";
import { getContactSubmissions, getAuditSubmissions } from "@/lib/db";
import { getCredentialProviders } from "@/lib/mc-db";
import { getEnvConfiguredProviders, resolveCredential } from "@/lib/mc-auth";
import { getGA4Data, type GA4Metrics } from "@/lib/ga4";

interface Submission {
  id: number;
  type: "contact" | "audit";
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  website: string | null;
  status: string;
  created_at: string;
}

async function getOverviewData(tenantId: number) {
  // Fetch form submissions from website database
  const [contacts, audits] = await Promise.all([
    getContactSubmissions().catch(() => []),
    getAuditSubmissions().catch(() => []),
  ]);

  // Normalize into a single submissions list
  const submissions: Submission[] = [
    ...(contacts as Record<string, unknown>[]).map((c) => ({
      id: c.id as number,
      type: "contact" as const,
      name: c.name as string,
      email: c.email as string,
      company: (c.company as string) || null,
      message: (c.message as string) || null,
      website: null,
      status: (c.status as string) || "new",
      created_at: String(c.created_at),
    })),
    ...(audits as Record<string, unknown>[]).map((a) => ({
      id: a.id as number,
      type: "audit" as const,
      name: a.name as string,
      email: a.email as string,
      company: (a.company as string) || null,
      message: (a.what_is_stuck as string) || null,
      website: (a.website as string) || null,
      status: (a.status as string) || "new",
      created_at: String(a.created_at),
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Fetch GA4 summary if connected
  const dbProviders = await getCredentialProviders(tenantId).catch(() => [] as string[]);
  const envProviders = getEnvConfiguredProviders();
  const allProviders = new Set(dbProviders);
  for (const ep of envProviders) allProviders.add(ep.provider);
  const hasGA4 = allProviders.has("google_analytics");

  let ga4Data: GA4Metrics | null = null;
  if (hasGA4) {
    try {
      const [ga4Cred, calCred] = await Promise.all([
        resolveCredential(tenantId, "google_analytics"),
        resolveCredential(tenantId, "google_calendar"),
      ]);
      if (ga4Cred) {
        ga4Data = await getGA4Data({
          propertyId: ga4Cred.value,
          refreshToken: calCred?.value,
        });
      }
    } catch {
      // non-fatal
    }
  }

  // Fetch upcoming meetings
  let meetings: Record<string, unknown>[] = [];
  try {
    const { getSQL } = await import("@/lib/mc-db");
    const sql = getSQL();
    const rows = await sql`
      SELECT id, booking_type, start_time, end_time, client_name, client_email,
             google_meet_url, status, notes
      FROM bookings
      WHERE tenant_id = ${tenantId}
        AND start_time >= NOW()
        AND start_time <= NOW() + INTERVAL '7 days'
        AND status = 'confirmed'
      ORDER BY start_time ASC
      LIMIT 5
    `.catch(() => []);
    meetings = rows as unknown as Record<string, unknown>[];
  } catch {
    // non-fatal
  }

  return {
    submissions,
    ga4Data,
    hasGA4,
    meetings,
  };
}

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { user, tenant } = await requireTenantAccess(tenantSlug);

  const data = await getOverviewData(tenant.id);

  return (
    <OverviewView
      userName={user.full_name}
      tenantSlug={tenant.slug}
      onboardingCompleted={tenant.onboarding_completed}
      submissions={data.submissions}
      ga4Data={data.ga4Data}
      hasGA4={data.hasGA4}
      meetings={data.meetings}
    />
  );
}
