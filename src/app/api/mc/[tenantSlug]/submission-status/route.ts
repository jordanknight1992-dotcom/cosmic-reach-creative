import { NextRequest, NextResponse } from "next/server";
import { requireTenantAccess } from "@/lib/mc-session";
import { updateSubmissionStatus } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    await requireTenantAccess(tenantSlug);

    const { table, id, status } = (await request.json()) as {
      table: "contact" | "audit";
      id: number;
      status: string;
    };

    if (!["contact", "audit"].includes(table) || !id || !status) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!["new", "contacted", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateSubmissionStatus(table, id, status);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
