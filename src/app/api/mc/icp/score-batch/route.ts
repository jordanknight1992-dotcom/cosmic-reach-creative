import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import {
  getTenantBySlug,
  isUserInTenant,
  getTenantICP,
  setCachedScore,
  getSQL,
  logAudit,
} from "@/lib/mc-db";
import { ensureCrmTables } from "@/lib/crm-db";
import { scoreLead, hashLeadData, hashICP, type LeadData } from "@/lib/scoring-engine";

/**
 * POST /api/mc/icp/score-batch
 * Score all unscored leads for a tenant against their ICP.
 * Called after CSV import completes or manually from settings.
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { tenantSlug } = body;
  if (!tenantSlug) return NextResponse.json({ error: "tenantSlug required" }, { status: 400 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
  if (!hasAccess && !ctx.user.is_super_admin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const icp = await getTenantICP(tenant.id);
  if (!icp) {
    return NextResponse.json({ ok: true, scored: 0, skipped: 0, message: "No ICP configured — set up your ICP first" });
  }

  await ensureCrmTables();
  const sql = getSQL();

  // Fetch leads that have no score yet, excluding suppressed/lost
  const leads = await sql`
    SELECT
      l.id, l.fit_score, l.stage,
      ct.title, ct.linkedin_url,
      co.name AS company_name, co.industry, co.city, co.state, co.country,
      co.website, co.domain,
      ct.email
    FROM leads l
    LEFT JOIN contacts ct ON ct.id = l.contact_id
    LEFT JOIN companies co ON co.id = l.company_id
    WHERE l.tenant_id = ${tenant.id}
      AND l.stage NOT IN ('suppressed', 'lost')
      AND l.fit_score = 0
    ORDER BY l.created_at DESC
    LIMIT 500
  ` as unknown as Array<{
    id: number;
    fit_score: number;
    stage: string;
    title: string | null;
    linkedin_url: string | null;
    company_name: string | null;
    industry: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    website: string | null;
    domain: string | null;
    email: string | null;
  }>;

  if (leads.length === 0) {
    return NextResponse.json({ ok: true, scored: 0, skipped: 0, message: "No unscored leads found" });
  }

  const icpHash = hashICP(icp);
  let scored = 0;
  let failed = 0;

  for (const lead of leads) {
    try {
      const leadData: LeadData = {
        title: lead.title,
        company_name: lead.company_name,
        industry: lead.industry,
        city: lead.city,
        state: lead.state,
        country: lead.country,
        email: lead.email,
        email_status: null,
        linkedin_url: lead.linkedin_url,
        website: lead.website || (lead.domain ? `https://${lead.domain}` : null),
        company_size: null,
      };

      const result = scoreLead(leadData, icp);
      const dataHash = hashLeadData(leadData);

      // Update the lead row
      await sql`
        UPDATE leads
        SET fit_score = ${result.fitScore}, fit_reason = ${result.shortReason}, updated_at = NOW()
        WHERE id = ${lead.id}
      `;

      // Cache it
      await setCachedScore({
        tenant_id: tenant.id,
        lead_id: lead.id,
        data_hash: dataHash,
        icp_hash: icpHash,
        fit_score: result.fitScore,
        priority: result.priority,
        short_reason: result.shortReason,
        matched_signals: result.matchedSignals,
      }).catch(() => { /* non-fatal */ });

      scored++;
    } catch {
      failed++;
    }
  }

  await logAudit({
    user_id: ctx.user.id,
    tenant_id: tenant.id,
    action: "leads_scored_batch",
    resource: "leads",
    metadata: { scored, failed, total: leads.length },
  });

  return NextResponse.json({
    ok: true,
    scored,
    failed,
    total: leads.length,
    message: `Scored ${scored} lead${scored !== 1 ? "s" : ""}`,
  });
}
