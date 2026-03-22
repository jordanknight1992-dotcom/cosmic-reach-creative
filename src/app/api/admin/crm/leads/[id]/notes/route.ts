import { NextRequest, NextResponse } from "next/server";
import { getNotesForLead, addNote, createActivity, getLeadById } from "@/lib/crm-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const notes = await getNotesForLead(leadId);
    return NextResponse.json({ notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

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

    const reqBody = await request.json();
    const { body } = reqBody;
    if (!body) {
      return NextResponse.json(
        { error: "body is required" },
        { status: 400 }
      );
    }

    const lead = await getLeadById(leadId) as Record<string, unknown> | null;
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const note = await addNote(leadId, body);

    await createActivity({
      lead_id: leadId,
      contact_id: lead.contact_id as number,
      company_id: lead.company_id as number,
      type: "note_added",
      body_preview: body.substring(0, 200),
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    console.error("Error adding note:", err);
    return NextResponse.json(
      { error: "Failed to add note" },
      { status: 500 }
    );
  }
}
