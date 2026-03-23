import { requireTenantAccess } from "@/lib/mc-session";
import { DailyBriefing } from "./DailyBriefing";
import { getSQL, saveBriefingSnapshot, getYesterdaySnapshot } from "@/lib/mc-db";
import { generateBriefing, type BriefingInput, type LeadSnapshot, type MeetingRecord, type ActivityRecord } from "@/lib/briefing-engine";

async function getBriefingData(tenantId: number) {
  const sql = getSQL();
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    pipelineStats,
    allLeads,
    overdueFollowUps,
    upcomingMeetings,
    recentActivities,
    recentStageChanges,
    newLeadsToday,
    totalLeadsYesterday,
  ] = await Promise.all([
    // Pipeline summary
    sql`
      SELECT stage, COUNT(*)::int AS count
      FROM leads WHERE tenant_id = ${tenantId}
      GROUP BY stage
    `.catch(() => []),

    // All active leads with full context (not just top 20)
    sql`
      SELECT
        l.id, l.fit_score, l.stage, l.next_action, l.next_action_at,
        l.last_contacted_at, l.created_at, l.updated_at,
        l.fit_reason, l.outreach_angle,
        co.name AS company_name, co.industry AS company_industry,
        ct.full_name AS contact_name, ct.email AS contact_email,
        ct.title AS contact_title, ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
        AND l.stage NOT IN ('suppressed', 'lost')
      ORDER BY l.fit_score DESC, l.updated_at DESC
      LIMIT 100
    `.catch(() => []),

    // Overdue follow-ups
    sql`
      SELECT
        l.id, l.fit_score, l.stage, l.next_action, l.next_action_at,
        l.last_contacted_at, l.created_at, l.updated_at,
        l.fit_reason, l.outreach_angle,
        co.name AS company_name, co.industry AS company_industry,
        ct.full_name AS contact_name, ct.email AS contact_email,
        ct.title AS contact_title, ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      WHERE l.tenant_id = ${tenantId}
        AND l.next_action_at < NOW()
        AND l.stage NOT IN ('suppressed', 'lost', 'won')
      ORDER BY l.next_action_at ASC
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
      SELECT a.type, a.body_preview, a.created_at, a.lead_id,
             ct.full_name AS contact_name, co.name AS company_name
      FROM activities a
      LEFT JOIN leads l ON l.id = a.lead_id
      LEFT JOIN contacts ct ON ct.id = a.contact_id
      LEFT JOIN companies co ON co.id = a.company_id
      WHERE a.tenant_id = ${tenantId}
        AND a.created_at >= NOW() - INTERVAL '48 hours'
      ORDER BY a.created_at DESC
      LIMIT 15
    `.catch(() => []),

    // Stage changes in last 24h
    sql`
      SELECT a.lead_id, a.metadata, a.created_at AS changed_at,
             ct.full_name AS contact_name, co.name AS company_name
      FROM activities a
      LEFT JOIN leads l ON l.id = a.lead_id
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      LEFT JOIN companies co ON co.id = l.company_id
      WHERE a.tenant_id = ${tenantId}
        AND a.type = 'stage_change'
        AND a.created_at >= ${yesterday.toISOString()}::timestamptz
      ORDER BY a.created_at DESC
    `.catch(() => []),

    // New leads imported today
    sql`
      SELECT COUNT(*)::int AS count
      FROM leads
      WHERE tenant_id = ${tenantId}
        AND created_at >= ${yesterday.toISOString()}::timestamptz
    `.catch(() => [{ count: 0 }]),

    // Total leads count (for delta comparison)
    sql`
      SELECT COUNT(*)::int AS count
      FROM leads
      WHERE tenant_id = ${tenantId}
        AND created_at < ${yesterday.toISOString()}::timestamptz
    `.catch(() => [{ count: 0 }]),
  ]);

  // Parse stage changes from activity metadata
  const parsedStageChanges = (recentStageChanges as Record<string, unknown>[]).map((row) => {
    const meta = row.metadata as Record<string, string> | null;
    const bodyPreview = (row as Record<string, unknown>).body_preview as string | null;
    // Try to parse old/new from metadata, fall back to body_preview parsing
    const old_stage = meta?.old_stage || "";
    let new_stage = meta?.new_stage || "";
    if (!old_stage && bodyPreview) {
      const match = bodyPreview.match(/Stage changed to (\w+)/);
      if (match) new_stage = match[1];
    }
    return {
      lead_id: row.lead_id as number,
      old_stage,
      new_stage,
      changed_at: row.changed_at as string,
      contact_name: row.contact_name as string | null,
      company_name: row.company_name as string | null,
    };
  });

  // Load yesterday's snapshot for drift detection
  const yesterdaySnapshot = await getYesterdaySnapshot(tenantId).catch(() => null);

  const briefingInput: BriefingInput = {
    pipelineStats: pipelineStats as unknown as { stage: string; count: number }[],
    allLeads: allLeads as unknown as LeadSnapshot[],
    overdueFollowUps: overdueFollowUps as unknown as LeadSnapshot[],
    upcomingMeetings: upcomingMeetings as unknown as MeetingRecord[],
    recentActivities: recentActivities as unknown as ActivityRecord[],
    recentStageChanges: parsedStageChanges,
    newLeadsToday: ((newLeadsToday as Record<string, unknown>[])[0]?.count as number) || 0,
    totalLeadsYesterday: ((totalLeadsYesterday as Record<string, unknown>[])[0]?.count as number) || 0,
    yesterdaySnapshot,
  };

  // Run the briefing engine
  const briefing = generateBriefing(briefingInput);

  // Save today's snapshot (non-blocking, once per day per tenant via UPSERT)
  saveBriefingSnapshot({
    tenant_id: tenantId,
    ...briefing.snapshotData,
  }).catch(() => { /* non-fatal */ });

  return {
    briefing,
    // Pass raw data too for meetings and activity timeline
    upcomingMeetings: upcomingMeetings as unknown as Record<string, unknown>[],
    recentActivities: recentActivities as unknown as Record<string, unknown>[],
    pipelineStats: pipelineStats as unknown as { stage: string; count: number }[],
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
      briefing={data.briefing}
      meetings={data.upcomingMeetings}
      activities={data.recentActivities}
      pipelineStats={data.pipelineStats}
    />
  );
}
