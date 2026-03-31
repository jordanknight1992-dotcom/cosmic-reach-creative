import { requireTenantAccess } from "@/lib/mc-session";
import { getCredentialProviders, getTenantMembers, getTenantICP, getTenantSupportAccess, getSupportSessionsForTenant } from "@/lib/mc-db";
import { getEnvConfiguredProviders } from "@/lib/mc-auth";
import { SettingsView } from "./SettingsView";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { user, tenant, isSupportMode } = await requireTenantAccess(tenantSlug);

  const [dbProviders, members, icp, supportEnabled, supportSessions] = await Promise.all([
    getCredentialProviders(tenant.id),
    getTenantMembers(tenant.id),
    getTenantICP(tenant.id),
    getTenantSupportAccess(tenant.id),
    getSupportSessionsForTenant(tenant.id, 10),
  ]);

  // Merge DB credentials with env-var-configured providers
  // Only show platform pre-configured providers for the owner account
  const isOwner = user.email.toLowerCase() === "jordan@cosmicreachcreative.com";
  const envProviders = getEnvConfiguredProviders();
  const providerMap = new Map<string, "tenant" | "platform">();
  for (const p of dbProviders) providerMap.set(p, "tenant");
  if (isOwner) {
    for (const ep of envProviders) {
      if (!providerMap.has(ep.provider)) providerMap.set(ep.provider, "platform");
    }
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
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        totp_enabled: user.totp_enabled,
        is_super_admin: user.is_super_admin,
      }}
      connectedProviders={connectedProviders}
      providerSources={providerSources}
      members={members.map((m) => ({
        id: m.id,
        email: m.email,
        full_name: m.full_name,
        role: m.role,
        status: m.status,
        last_login_at: m.last_login_at,
      }))}
      icp={icp ? {
        target_roles: icp.target_roles,
        target_industries: icp.target_industries,
        target_geo: icp.target_geo,
        company_size_min: icp.company_size_min,
        company_size_max: icp.company_size_max,
        priorities: icp.priorities,
        exclusion_rules: icp.exclusion_rules,
      } : null}
      supportAccess={{
        enabled: supportEnabled,
        recentSessions: supportSessions.map((s) => ({
          id: s.id,
          user_name: (s as unknown as Record<string, unknown>).user_name as string || "Support",
          reason: s.reason,
          started_at: s.started_at,
          ended_at: s.ended_at,
          status: s.status,
        })),
      }}
      isSupportMode={isSupportMode}
    />
  );
}
