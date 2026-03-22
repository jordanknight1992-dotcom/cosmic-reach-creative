import { requireTenantAccess } from "@/lib/mc-session";
import { DailyBriefing } from "./DailyBriefing";
import { getSQL } from "@/lib/mc-db";

async function getBriefingData(tenantId: number) {
  const sql = getSQL();

  // Parallel data fetches for the briefing
  const [
    pipelineStats,
    recentLeads,
    upcomingMeetings,
    recentActivities,
    overdueFollowUps,
  ] = await Promise.all([
    // Pipeline summary
    sql`
      SELECT stage, COUNT(*)::int AS count
      FROM leads WHERE tenant_id = ${tenantId}
      GROUP BY stage
    `.catch(() => []),

    // Recent high-score leads (for targets)
    sql`
      SELECT
        l.id, l.fit_score, l.stage, l.next_action, l.next_action_at,
        l.last_contacted_at, l.fit_reason, l.outreach_angle,
        co.name AS company_name, co.industry AS company_industry,
        ct.full_name AS contact_name, ct.email AS contact_email, ct.title AS contact_title
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
        AND l.stage NOT IN ('suppressed', 'lost')
      ORDER BY l.fit_score DESC, l.updated_at DESC
      LIMIT 20
    `.catch(() => []),

    // Upcoming meetings (next 7 days)
    sql`
      SELECT id, booking_type, start_time, end_time, client_name, client_email,
             google_meet_url, status, notes
      FROM bookings
      WHERE tenant_id = ${tenantId}
        AND start_time >= NOW()
        AND start_time <= NOW() + INTERVAL '7 days'
        AND status = 'confirmed'
      ORDER BY start_time ASC
      LIMIT 5
    `.catch(() => []),

    // Recent activity (last 48h)
    sql`
      SELECT a.type, a.body_preview, a.created_at,
             ct.full_name AS contact_name, co.name AS company_name
      FROM activities a
      LEFT JOIN leads l ON l.id = a.lead_id
      LEFT JOIN contacts ct ON ct.id = a.contact_id
      LEFT JOIN companies co ON co.id = a.company_id
      WHERE a.tenant_id = ${tenantId}
      ORDER BY a.created_at DESC
      LIMIT 8
    `.catch(() => []),

    // Overdue follow-ups
    sql`
      SELECT
        l.id, l.next_action, l.next_action_at, l.stage, l.fit_score,
        co.name AS company_name,
        ct.full_name AS contact_name, ct.email AS contact_email
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
        AND l.next_action_at < NOW()
        AND l.stage NOT IN ('suppressed', 'lost', 'won')
      ORDER BY l.next_action_at ASC
      LIMIT 10
    `.catch(() => []),
  ]);

  return {
    pipelineStats: pipelineStats as unknown as { stage: string; count: number }[],
    recentLeads: recentLeads as unknown as Record<string, unknown>[],
    upcomingMeetings: upcomingMeetings as unknown as Record<string, unknown>[],
    recentActivities: recentActivities as unknown as Record<string, unknown>[],
    overdueFollowUps: overdueFollowUps as unknown as Record<string, unknown>[],
  };
}

export default async function BriefingPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { user, tenant } = await requireTenantAccess(tenantSlug);

  const data = await getBriefingData(tenant.id);

  return (
    <DailyBriefing
      userName={user.full_name}
      tenantSlug={tenant.slug}
      onboardingCompleted={tenant.onboarding_completed}
      data={data}
    />
  );
}
