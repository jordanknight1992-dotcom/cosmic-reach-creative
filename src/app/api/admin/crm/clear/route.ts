import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash } from "crypto";
import { clearAllCrmData } from "@/lib/crm-db";

/**
 * POST /api/admin/crm/clear
 * Deletes all CRM data (companies, contacts, leads, etc.)
 * Requires valid admin session.
 */
export async function POST() {
  try {
    // Verify admin session
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    const expected = createHash("sha256").update(secret).digest("hex");

    if (!session || session !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await clearAllCrmData();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error clearing CRM data:", err);
    return NextResponse.json(
      { error: "Failed to clear CRM data" },
      { status: 500 }
    );
  }
}
