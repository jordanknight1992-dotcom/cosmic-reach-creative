import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import {
  getTenantBySlug,
  isUserInTenant,
  getSupportSessionsForTenant,
  getTenantSupportAccess,
  setTenantSupportAccess,
  logAudit,
} from "@/lib/mc-db";

/**
 * GET /api/mc/support-history?tenantSlug=xxx
 * Customer-visible support access history for their workspace
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

  const [sessions, supportEnabled] = await Promise.all([
    getSupportSessionsForTenant(tenant.id),
    getTenantSupportAccess(tenant.id),
  ]);

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      user_name: (s as unknown as Record<string, unknown>).user_name || "Support",
      user_email: (s as unknown as Record<string, unknown>).user_email || "",
      reason: s.reason,
      started_at: s.started_at,
      expires_at: s.expires_at,
      ended_at: s.ended_at,
      status: s.status,
    })),
    supportEnabled,
  });
}

/**
 * POST /api/mc/support-history
 * Toggle support access for workspace
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { tenantSlug, enabled } = body;

  if (!tenantSlug || typeof enabled !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  // Only owners can toggle support access
  const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
  if (!hasAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  await setTenantSupportAccess(tenant.id, enabled);

  await logAudit({
    user_id: ctx.user.id,
    tenant_id: tenant.id,
    action: enabled ? "support_access_enabled" : "support_access_disabled",
    ip_address: request.headers.get("x-forwarded-for") || "unknown",
  });

  return NextResponse.json({ updated: true, enabled });
}
