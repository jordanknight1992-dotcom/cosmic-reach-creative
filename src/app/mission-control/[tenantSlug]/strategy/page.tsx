import { requireTenantAccess } from "@/lib/mc-session";
import { getTenantGoals } from "@/lib/mc-db";
import { StrategyView } from "./StrategyView";

export default async function StrategyPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const goals = await getTenantGoals(tenant.id);

  return (
    <StrategyView
      tenantSlug={tenant.slug}
      tenantName={tenant.name}
      initialGoals={goals as unknown as Record<string, unknown> | null}
    />
  );
}
