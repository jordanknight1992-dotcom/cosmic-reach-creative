import { requireAuth } from "@/lib/mc-session";
import { getAllTenants, getSQL } from "@/lib/mc-db";
import { redirect } from "next/navigation";
import { SuperAdminView } from "./SuperAdminView";

export default async function SuperAdminPage() {
  const session = await requireAuth();

  if (!session.user.is_super_admin) {
    redirect("/mission-control/login");
  }

  const sql = getSQL();

  // Batch all queries in parallel instead of N+1 per tenant
  const [tenants, leadCounts, userCounts, credCounts, recentAudits] = await Promise.all([
    getAllTenants(),
    sql`SELECT tenant_id, COUNT(*)::int AS count FROM leads GROUP BY tenant_id`.catch(() => []),
    sql`SELECT tenant_id, COUNT(*)::int AS count FROM tenant_users GROUP BY tenant_id`.catch(() => []),
    sql`SELECT tenant_id, COUNT(*)::int AS count FROM tenant_credentials GROUP BY tenant_id`.catch(() => []),
    sql`
      SELECT al.*, u.full_name AS user_name, t.name AS tenant_name
      FROM audit_logs al
      LEFT JOIN mc_users u ON u.id = al.user_id
      LEFT JOIN tenants t ON t.id = al.tenant_id
      ORDER BY al.created_at DESC LIMIT 20
    `.catch(() => []),
  ]);

  // Index counts by tenant_id for O(1) lookup
  const leadMap = new Map(leadCounts.map((r: Record<string, unknown>) => [r.tenant_id, (r as { count: number }).count]));
  const userMap = new Map(userCounts.map((r: Record<string, unknown>) => [r.tenant_id, (r as { count: number }).count]));
  const credMap = new Map(credCounts.map((r: Record<string, unknown>) => [r.tenant_id, (r as { count: number }).count]));

  const tenantData = tenants.map((t) => ({
    ...t,
    lead_count: leadMap.get(t.id) ?? 0,
    user_count: userMap.get(t.id) ?? 0,
    credential_count: credMap.get(t.id) ?? 0,
  }));

  return (
    <SuperAdminView
      adminName={session.user.full_name}
      adminId={session.user.id}
      tenants={tenantData as unknown as Record<string, unknown>[]}
      auditLogs={recentAudits as unknown as Record<string, unknown>[]}
    />
  );
}
