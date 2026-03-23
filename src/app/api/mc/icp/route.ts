import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { getTenantBySlug, isUserInTenant, getTenantICP, upsertTenantICP, logAudit } from "@/lib/mc-db";

/**
 * GET /api/mc/icp?tenantSlug=xxx
 */
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantSlug = request.nextUrl.searchParams.get("tenantSlug");
  if (!tenantSlug) return NextResponse.json({ error: "Tenant slug required" }, { status: 400 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
  if (!hasAccess && !ctx.user.is_super_admin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const icp = await getTenantICP(tenant.id);
  return NextResponse.json({ icp: icp || {
    target_roles: [],
    target_industries: [],
    target_geo: [],
    company_size_min: null,
    company_size_max: null,
    priorities: [],
    exclusion_rules: [],
    scoring_weights: {},
  }});
}

/**
 * POST /api/mc/icp
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { tenantSlug, ...icpData } = body;

  if (!tenantSlug) return NextResponse.json({ error: "Tenant slug required" }, { status: 400 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
  if (!hasAccess && !ctx.user.is_super_admin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  await upsertTenantICP(tenant.id, icpData);

  await logAudit({
    user_id: ctx.user.id,
    tenant_id: tenant.id,
    action: "icp_updated",
    resource: "tenant_icp",
    ip_address: request.headers.get("x-forwarded-for") || "unknown",
  });

  return NextResponse.json({ saved: true });
}
