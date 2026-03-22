import { requireTenantAccess } from "@/lib/mc-session";
import { getOnboardingProgress, getCredentialProviders } from "@/lib/mc-db";
import { getEnvConfiguredProviders } from "@/lib/mc-auth";
import { OnboardingWizard } from "./OnboardingWizard";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { user, tenant } = await requireTenantAccess(tenantSlug);
  const [progress, dbProviders] = await Promise.all([
    getOnboardingProgress(tenant.id),
    getCredentialProviders(tenant.id),
  ]);

  // Merge DB credentials with env-var-configured providers
  const envProviders = getEnvConfiguredProviders();
  const providerMap = new Map<string, "tenant" | "platform">();
  for (const p of dbProviders) providerMap.set(p, "tenant");
  for (const ep of envProviders) {
    if (!providerMap.has(ep.provider)) providerMap.set(ep.provider, "platform");
  }

  const connectedProviders = Array.from(providerMap.keys());
  const providerSources = Object.fromEntries(providerMap);

  return (
    <OnboardingWizard
      tenantSlug={tenant.slug}
      tenantName={tenant.name}
      userName={user.full_name}
      progress={progress}
      connectedProviders={connectedProviders}
      providerSources={providerSources}
    />
  );
}
