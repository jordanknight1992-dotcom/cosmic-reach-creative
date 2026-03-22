import { NextRequest, NextResponse } from "next/server";
import { getLeadById, suppressContact } from "@/lib/crm-db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await getLeadById(leadId) as Record<string, unknown> | null;
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    await suppressContact(lead.contact_id as number, reason);

    return NextResponse.json({
      success: true,
      message: "Contact suppressed permanently",
    });
  } catch (err) {
    console.error("Error suppressing contact:", err);
    return NextResponse.json(
      { error: "Failed to suppress contact" },
      { status: 500 }
    );
  }
}
