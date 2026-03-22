import { requireTenantAccess } from "@/lib/mc-session";
import { getSQL } from "@/lib/mc-db";
import { CrmView } from "./CrmView";

async function getCrmData(tenantId: number) {
  const sql = getSQL();

  const [leads, stats] = await Promise.all([
    sql`
      SELECT
        l.id, l.fit_score, l.stage, l.next_action, l.next_action_at,
        l.last_contacted_at, l.fit_reason, l.outreach_angle, l.pain_point_summary,
        l.owner, l.approved_for_send, l.manual_review_required,
        l.created_at, l.updated_at,
        co.name AS company_name, co.domain AS company_domain,
        co.website AS company_website, co.industry AS company_industry,
        co.city AS company_city, co.state AS company_state,
        ct.full_name AS contact_name, ct.email AS contact_email,
        ct.title AS contact_title, ct.persona_type AS contact_persona_type,
        ct.do_not_contact AS contact_do_not_contact,
        ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
      ORDER BY l.fit_score DESC, l.created_at DESC
      LIMIT 200
    `.catch(() => []),

    sql`
      SELECT stage, COUNT(*)::int AS count
      FROM leads WHERE tenant_id = ${tenantId}
      GROUP BY stage
    `.catch(() => []),
  ]);

  return {
    leads: leads as unknown as Record<string, unknown>[],
    stats: stats as unknown as { stage: string; count: number }[],
  };
}

export default async function CrmPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getCrmData(tenant.id);

  return <CrmView tenantSlug={tenant.slug} data={data} />;
}
