import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName, validateTenantAccess } from "@/lib/mc-auth";
import { getSQL, ensureMcTables, createRegistrationGrant } from "@/lib/mc-db";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
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

    await ensureMcTables();
    const sql = getSQL();

    const { id, source, status } = (await request.json()) as {
      id: number;
      source: "contact" | "audit" | "manual";
      status: string;
    };

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    let email: string | null = null;

    if (source === "manual") {
      const rows = await sql`
        UPDATE manual_leads SET status = ${status}, updated_at = NOW()
        WHERE id = ${id} AND tenant_id = ${tenantResult.ctx.tenantId}
        RETURNING email
      `;
      email = rows[0]?.email as string | null;
    } else if (source === "contact") {
      const rows = await sql`UPDATE contact_submissions SET status = ${status} WHERE id = ${id} RETURNING email`;
      email = rows[0]?.email as string | null;
    } else if (source === "audit") {
      const rows = await sql`UPDATE audit_submissions SET status = ${status} WHERE id = ${id} RETURNING email`;
      email = rows[0]?.email as string | null;
    }

    // Grant Mission Control access when build is complete
    if (email && (status === "website_build_complete" || status === "mission_control_active")) {
      try {
        await createRegistrationGrant({
          email: email.toLowerCase().trim(),
          grant_type: "promo",
        });
      } catch {
        console.error("Failed to create registration grant for:", email);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating lead status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
