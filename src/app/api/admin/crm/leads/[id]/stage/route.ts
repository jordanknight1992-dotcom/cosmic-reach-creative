import { NextRequest, NextResponse } from "next/server";
import { getLeadById, updateLeadStage, isContactSuppressed } from "@/lib/crm-db";

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

    const body = await request.json();
    const { stage } = body;
    if (!stage) {
      return NextResponse.json(
        { error: "stage is required" },
        { status: 400 }
      );
    }

    // Get current lead to check suppression
    const lead = await getLeadById(leadId) as Record<string, unknown> | null;
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Block stage changes for suppressed leads (except to 'suppressed')
    if (lead.stage === "suppressed" && stage !== "suppressed") {
      return NextResponse.json(
        { error: "Cannot change stage of a suppressed lead" },
        { status: 403 }
      );
    }

    // Block emailed stage if contact is suppressed
    if (stage === "emailed") {
      const suppressed = await isContactSuppressed(lead.contact_id as number);
      if (suppressed) {
        return NextResponse.json(
          { error: "Cannot email a suppressed contact" },
          { status: 403 }
        );
      }
    }

    const updated = await updateLeadStage(leadId, stage);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead: updated });
  } catch (err) {
    console.error("Error updating lead stage:", err);
    return NextResponse.json(
      { error: "Failed to update lead stage" },
      { status: 500 }
    );
  }
}
