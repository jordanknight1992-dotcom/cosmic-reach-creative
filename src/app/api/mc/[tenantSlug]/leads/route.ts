import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName, validateTenantAccess } from "@/lib/mc-auth";
import { getSQL, ensureMcTables, createRegistrationGrant } from "@/lib/mc-db";
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureManualLeadsTable() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS manual_leads (
      id SERIAL PRIMARY KEY,
      tenant_id INTEGER REFERENCES tenants(id) NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      website TEXT,
      status TEXT DEFAULT 'lead',
      revenue NUMERIC(10,2),
      notes TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;

    // Validate session
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await validateSession(sessionId);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Validate tenant access
    const tenantResult = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in tenantResult) {
      return NextResponse.json({ error: tenantResult.error }, { status: tenantResult.status });
    }

    const tenantId = tenantResult.ctx.tenantId;

    await ensureMcTables();
    await ensureManualLeadsTable();
    const sql = getSQL();

    const { name, email, company, website, status, revenue, notes } = (await request.json()) as {
      name: string;
      email: string;
      company?: string | null;
      website?: string | null;
      status?: string;
      revenue?: number | null;
      notes?: string;
    };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const leadStatus = status || "lead";

    const rows = await sql`
      INSERT INTO manual_leads (tenant_id, name, email, company, website, status, revenue, notes)
      VALUES (${tenantId}, ${name.trim()}, ${email.trim()}, ${company || null}, ${website || null}, ${leadStatus}, ${revenue ?? null}, ${notes || ""})
      RETURNING *
    `;

    // If status is website_build_complete, create a registration grant
    if (leadStatus === "website_build_complete") {
      try {
        await createRegistrationGrant({
          email: email.trim().toLowerCase(),
          grant_type: "promo",
        });
      } catch {
        // Log but don't fail the lead creation
        console.error("Failed to create registration grant for lead:", email);
      }
    }

    return NextResponse.json({ lead: rows[0] });
  } catch (err) {
    console.error("Error creating manual lead:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
