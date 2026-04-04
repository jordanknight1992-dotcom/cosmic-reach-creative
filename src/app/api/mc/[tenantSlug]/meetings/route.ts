import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName, validateTenantAccess } from "@/lib/mc-auth";
import { getSQL, ensureMcTables } from "@/lib/mc-db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/** DELETE a meeting (cancel/remove) */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;

    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await validateSession(sessionId);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tenantResult = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in tenantResult) {
      return NextResponse.json({ error: tenantResult.error }, { status: tenantResult.status });
    }

    const { id } = (await request.json()) as { id: number };
    if (!id) return NextResponse.json({ error: "Booking id is required" }, { status: 400 });

    await ensureMcTables();
    const sql = getSQL();

    // Only delete if it belongs to this tenant
    await sql`DELETE FROM bookings WHERE id = ${id} AND tenant_id = ${tenantResult.ctx.tenantId}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting meeting:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
