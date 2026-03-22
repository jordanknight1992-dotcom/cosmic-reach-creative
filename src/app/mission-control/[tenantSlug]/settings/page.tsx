import { requireTenantAccess } from "@/lib/mc-session";
import { getCredentialProviders } from "@/lib/mc-db";
import { getEnvConfiguredProviders } from "@/lib/mc-auth";
import { SettingsView } from "./SettingsView";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { user, tenant } = await requireTenantAccess(tenantSlug);
  const dbProviders = await getCredentialProviders(tenant.id);

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
    <SettingsView
      tenantSlug={tenant.slug}
      tenant={{
        name: tenant.name,
        plan: (tenant as unknown as Record<string, unknown>).plan as string ?? "core",
        timezone: tenant.timezone,
      }}
      user={{
        full_name: user.full_name,
        email: user.email,
        totp_enabled: user.totp_enabled,
      }}
      connectedProviders={connectedProviders}
      providerSources={providerSources}
    />
  );
}
