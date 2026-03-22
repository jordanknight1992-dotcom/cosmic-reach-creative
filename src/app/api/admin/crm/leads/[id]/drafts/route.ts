import { NextRequest, NextResponse } from "next/server";
import { getDraftsForLead, saveDraft } from "@/lib/crm-db";

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

    const drafts = await getDraftsForLead(leadId);
    return NextResponse.json({ drafts });
  } catch (err) {
    console.error("Error fetching drafts:", err);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
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

    const body = await request.json();
    const { subject, body_text, body_html, model, persona_type, is_ai_generated } = body;

    const draft = await saveDraft({
      lead_id: leadId,
      subject,
      body_text,
      body_html,
      model,
      persona_type,
      is_ai_generated,
    });

    return NextResponse.json({ draft }, { status: 201 });
  } catch (err) {
    console.error("Error saving draft:", err);
    return NextResponse.json(
      { error: "Failed to save draft" },
      { status: 500 }
    );
  }
}
