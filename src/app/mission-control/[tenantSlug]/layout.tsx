import { requireTenantAccess } from "@/lib/mc-session";
import { McShell } from "./McShell";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const session = await requireTenantAccess(tenantSlug);
  const { user, tenant, isImpersonation, isSupportMode, supportSession } = session;

  return (
    <>
      <style>{`
        body > header,
        body > footer,
        body > a.skip-link,
        body > div[class*="fixed"] { display: none !important; }
        a[href="/connect"][class*="fixed"] { display: none !important; }
      `}</style>
    <McShell
      user={{ id: user.id, email: user.email, full_name: user.full_name, is_super_admin: user.is_super_admin }}
      tenant={{ id: tenant.id, name: tenant.name, slug: tenant.slug, plan: (tenant as unknown as Record<string, unknown>).plan as string ?? "core", is_retainer_client: tenant.is_retainer_client ?? false, onboarding_completed: tenant.onboarding_completed }}
      isImpersonation={isImpersonation}
      isSupportMode={isSupportMode}
      supportSession={supportSession ? {
        id: supportSession.id,
        reason: supportSession.reason,
        started_at: supportSession.started_at,
        expires_at: supportSession.expires_at,
      } : null}
    >
      {children}
    </McShell>
    </>
  );
}
