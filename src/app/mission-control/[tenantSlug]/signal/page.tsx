import { requireTenantAccess } from "@/lib/mc-session";
import { SignalView } from "./SignalView";
import { getCredentialProviders } from "@/lib/mc-db";
import { getEnvConfiguredProviders, resolveCredential } from "@/lib/mc-auth";
import { getGA4Data, getSearchConsoleData, type GA4Metrics, type SearchConsoleMetrics } from "@/lib/ga4";

async function getPerformanceData(tenantId: number) {
  const [dbProviders] = await Promise.all([
    getCredentialProviders(tenantId),
  ]);

  // Merge DB providers with env-var-configured providers
  const envProviders = getEnvConfiguredProviders();
  const allProviders = new Set(dbProviders);
  for (const ep of envProviders) allProviders.add(ep.provider);
  const connectedProviders = Array.from(allProviders);

  const hasGA4 = connectedProviders.includes("google_analytics");

  // Fetch GA4 analytics + Search Console keyword data
  let ga4Data: GA4Metrics | null = null;
  let keywordData: SearchConsoleMetrics | null = null;

  if (hasGA4) {
    try {
      const [ga4Cred, calCred, scCred] = await Promise.all([
        resolveCredential(tenantId, "google_analytics"),
        resolveCredential(tenantId, "google_calendar"),
        resolveCredential(tenantId, "search_console"),
      ]);
      if (ga4Cred) {
        const siteUrl = scCred?.value || process.env.SEARCH_CONSOLE_SITE_URL || "";
        const [ga4Result, kwResult] = await Promise.all([
          getGA4Data({
            propertyId: ga4Cred.value,
            refreshToken: calCred?.value,
          }),
          siteUrl
            ? getSearchConsoleData({
                siteUrl,
                refreshToken: calCred?.value,
              }).catch(() => null)
            : Promise.resolve(null),
        ]);
        ga4Data = ga4Result;
        keywordData = kwResult;
      }
    } catch (err) {
      console.error("Performance data fetch failed:", err);
    }
  }

  return {
    hasGA4,
    ga4Data,
    keywordData,
    connectedProviders,
  };
}

export default async function PerformancePage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getPerformanceData(tenant.id);

  return <SignalView tenantSlug={tenant.slug} data={data} />;
}
