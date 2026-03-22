import { requireTenantAccess } from "@/lib/mc-session";
import { SignalView } from "./SignalView";
import { getSQL, getCredentialProviders } from "@/lib/mc-db";
import { getEnvConfiguredProviders, resolveCredential } from "@/lib/mc-auth";
import { getGA4Data, type GA4Metrics } from "@/lib/ga4";

async function getSignalData(tenantId: number) {
  const sql = getSQL();

  const [pipelineStats, recentLeads, overdueFollowUps, dbProviders] = await Promise.all([
    sql`
      SELECT stage, COUNT(*)::int AS count
      FROM leads WHERE tenant_id = ${tenantId}
      GROUP BY stage
    `.catch(() => []),

    sql`
      SELECT l.id, l.fit_score, l.stage, l.last_contacted_at,
        co.name AS company_name, ct.full_name AS contact_name
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId} AND l.stage NOT IN ('suppressed', 'lost')
      ORDER BY l.fit_score DESC LIMIT 10
    `.catch(() => []),

    sql`
      SELECT COUNT(*)::int AS count FROM leads
      WHERE tenant_id = ${tenantId} AND next_action_at < NOW()
        AND stage NOT IN ('suppressed', 'lost', 'won')
    `.catch(() => [{ count: 0 }]),

    getCredentialProviders(tenantId),
  ]);

  // Merge DB providers with env-var-configured providers
  const envProviders = getEnvConfiguredProviders();
  const allProviders = new Set(dbProviders);
  for (const ep of envProviders) allProviders.add(ep.provider);
  const connectedProviders = Array.from(allProviders);

  const hasGA4 = connectedProviders.includes("google_analytics");

  // Fetch GA4 analytics data if connected
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
    } catch (err) {
      console.error("GA4 fetch failed:", err);
    }
  }

  return {
    pipelineStats: pipelineStats as unknown as { stage: string; count: number }[],
    recentLeads: recentLeads as unknown as Record<string, unknown>[],
    overdueCount: (overdueFollowUps[0] as unknown as { count: number })?.count ?? 0,
    hasGA4,
    ga4Data,
    connectedProviders,
  };
}

export default async function SignalPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getSignalData(tenant.id);

  return <SignalView tenantSlug={tenant.slug} data={data} />;
}
