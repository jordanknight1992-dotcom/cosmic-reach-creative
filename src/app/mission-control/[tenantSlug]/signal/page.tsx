import { requireTenantAccess } from "@/lib/mc-session";
import { SignalView } from "./SignalView";
import { getCredentialProviders } from "@/lib/mc-db";
import { getEnvConfiguredProviders, resolveCredential } from "@/lib/mc-auth";
import { getGA4Data, getSearchConsoleData, type GA4Metrics, type SearchConsoleMetrics } from "@/lib/ga4";
import { getPageSpeedData, checkUptime, type PageSpeedResult, type UptimeResult } from "@/lib/site-health";
import { calculateSiteHealth } from "@/lib/site-scoring";
import { getContactSubmissions, getAuditSubmissions } from "@/lib/db";

async function getPerformanceData(tenantId: number, domain: string | null) {
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
        resolveCredential(tenantId, "google_search_console"),
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

  // Fetch free website health data (PageSpeed + uptime) if domain is set
  let pageSpeed: PageSpeedResult | null = null;
  let uptime: UptimeResult | null = null;

  if (domain) {
    const siteUrl = domain.startsWith("http") ? domain : `https://${domain}`;
    try {
      const [psResult, uptimeResult] = await Promise.all([
        getPageSpeedData(siteUrl, "mobile").catch((err) => {
          console.error("PageSpeed fetch failed:", err instanceof Error ? err.message : err);
          return null;
        }),
        checkUptime(siteUrl).catch((err) => {
          console.error("Uptime check failed:", err instanceof Error ? err.message : err);
          return null;
        }),
      ]);
      pageSpeed = psResult;
      uptime = uptimeResult;
      if (!psResult) {
        console.warn("PageSpeed returned null for domain:", siteUrl);
      }
    } catch (err) {
      console.error("Site health fetch failed:", err);
    }
  } else {
    console.warn("No domain set for tenant, skipping site health checks");
  }

  // Get submission count for conversion rate scoring
  let submissionCount = 0;
  try {
    const [contacts, audits] = await Promise.all([
      getContactSubmissions().catch(() => []),
      getAuditSubmissions().catch(() => []),
    ]);
    submissionCount = (contacts as unknown[]).length + (audits as unknown[]).length;
  } catch {
    // non-fatal
  }

  // Calculate layer scores from all available data
  const hasSearchConsole = connectedProviders.includes("google_search_console");
  const scores = calculateSiteHealth({
    pageSpeed,
    uptime,
    ga4: ga4Data,
    keywords: keywordData,
    hasGA4,
    hasSearchConsole,
    hasDomain: !!domain,
    submissionCount,
  });

  return {
    hasGA4,
    ga4Data,
    keywordData,
    connectedProviders,
    pageSpeed,
    uptime,
    siteUrl: domain ? (domain.startsWith("http") ? domain : `https://${domain}`) : null,
    scores,
  };
}

export default async function PerformancePage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getPerformanceData(tenant.id, tenant.domain);

  return <SignalView tenantSlug={tenant.slug} data={data} />;
}
