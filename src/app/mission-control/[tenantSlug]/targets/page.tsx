import { requireTenantAccess } from "@/lib/mc-session";
import { getSQL } from "@/lib/mc-db";
import { TargetsView } from "./TargetsView";

async function getTargetsData(tenantId: number) {
  const sql = getSQL();

  const [allLeads, overdueLeads] = await Promise.all([
    sql`
      SELECT
        l.id, l.fit_score, l.stage, l.next_action, l.next_action_at,
        l.last_contacted_at, l.fit_reason, l.outreach_angle, l.pain_point_summary,
        co.name AS company_name, co.domain AS company_domain, co.industry AS company_industry,
        ct.full_name AS contact_name, ct.email AS contact_email, ct.title AS contact_title,
        ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
        AND l.stage NOT IN ('suppressed', 'lost')
      ORDER BY l.fit_score DESC, l.updated_at DESC
      LIMIT 50
    `.catch(() => []),

    sql`
      SELECT
        l.id, l.fit_score, l.stage, l.next_action, l.next_action_at,
        l.last_contacted_at,
        co.name AS company_name,
        ct.full_name AS contact_name, ct.email AS contact_email, ct.title AS contact_title
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
        AND l.next_action_at < NOW()
        AND l.stage NOT IN ('suppressed', 'lost', 'won')
      ORDER BY l.next_action_at ASC
    `.catch(() => []),
  ]);

  return {
    allLeads: allLeads as unknown as Record<string, unknown>[],
    overdueLeads: overdueLeads as unknown as Record<string, unknown>[],
  };
}

export default async function TargetsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getTargetsData(tenant.id);

  return <TargetsView tenantSlug={tenant.slug} data={data} />;
}
