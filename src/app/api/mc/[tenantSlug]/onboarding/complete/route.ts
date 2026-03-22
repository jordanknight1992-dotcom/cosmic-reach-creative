import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName } from "@/lib/mc-auth";
import { getSQL, logAudit } from "@/lib/mc-db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const sql = getSQL();
    await sql`
      UPDATE tenants SET onboarding_completed = TRUE, updated_at = NOW()
      WHERE id = ${result.ctx.tenantId}
    `;

    await logAudit({
      user_id: result.ctx.user.id,
      tenant_id: result.ctx.tenantId,
      action: "onboarding_completed",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Complete onboarding error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
