import { NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await validateSession(sessionId);
    if (!session || !session.tenant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { domain } = body;

    if (typeof domain !== "string") {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Clean up the domain (remove protocol, trailing slashes)
    const cleanDomain = domain.trim()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/+$/, "");

    const { getSQL } = await import("@/lib/mc-db");
    const sql = getSQL();
    await sql`UPDATE tenants SET domain = ${cleanDomain || null}, updated_at = NOW() WHERE id = ${session.tenant.id}`;

    return NextResponse.json({ success: true, domain: cleanDomain });
  } catch (err) {
    console.error("Settings update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
