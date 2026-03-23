import { NextRequest, NextResponse } from "next/server";
import { validateSession, isSuperUserEmail, getSessionCookieName } from "@/lib/mc-auth";
import { setRetainerClient, getTenantById, logAudit } from "@/lib/mc-db";

/**
 * POST /api/mc/admin/retainer
 * Toggle retainer client status for a tenant (super admin only)
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ctx.user.is_super_admin || !isSuperUserEmail(ctx.user.email)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await request.json();
  const { tenantId, enabled } = body;

  if (!tenantId || typeof enabled !== "boolean") {
    return NextResponse.json({ error: "tenantId and enabled (boolean) required" }, { status: 400 });
  }

  const tenant = await getTenantById(tenantId);
  if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

  await setRetainerClient(tenantId, enabled);

  await logAudit({
    user_id: ctx.user.id,
    tenant_id: tenantId,
    action: enabled ? "retainer_client_enabled" : "retainer_client_disabled",
    ip_address: request.headers.get("x-forwarded-for") || "unknown",
  });

  return NextResponse.json({ updated: true, enabled });
}
