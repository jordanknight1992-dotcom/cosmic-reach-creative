import { NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { getUserTenants, getSQL } from "@/lib/mc-db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await validateSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get tenant from session or look up user's tenants
    let tenantId = session.tenantId;
    if (!tenantId) {
      const tenants = await getUserTenants(session.user.id);
      if (tenants.length === 0) {
        return NextResponse.json({ error: "No workspace found" }, { status: 403 });
      }
      tenantId = tenants[0].id;
    }

    const body = await request.json();
    const { domain } = body;

    if (typeof domain !== "string") {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Clean up the domain (remove protocol and trailing slashes, preserve www)
    const cleanDomain = domain.trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "");

    const sql = getSQL();
    await sql`UPDATE tenants SET domain = ${cleanDomain || null}, updated_at = NOW() WHERE id = ${tenantId}`;

    return NextResponse.json({ success: true, domain: cleanDomain });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
