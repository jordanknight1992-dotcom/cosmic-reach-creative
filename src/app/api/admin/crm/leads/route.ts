import { NextRequest, NextResponse } from "next/server";
import {
  getLeads,
  createCompany,
  createContact,
  createLead,
  createActivity,
} from "@/lib/crm-db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage") || undefined;
    const search = searchParams.get("search") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : undefined;
    const offset = searchParams.get("offset")
      ? parseInt(searchParams.get("offset")!, 10)
      : undefined;

    const leads = await getLeads({ stage, search, limit, offset });
    return NextResponse.json({ leads });
  } catch (err) {
    console.error("Error fetching leads:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, contact, lead } = body;

    if (!company?.name || !contact?.email || !contact?.full_name) {
      return NextResponse.json(
        { error: "company.name, contact.full_name, and contact.email are required" },
        { status: 400 }
      );
    }

    const createdCompany = await createCompany(company);
    const createdContact = await createContact({
      ...contact,
      company_id: createdCompany.id as number,
    });
    const createdLead = await createLead({
      ...lead,
      company_id: createdCompany.id as number,
      contact_id: createdContact.id as number,
    });

    await createActivity({
      lead_id: createdLead.id as number,
      contact_id: createdContact.id as number,
      company_id: createdCompany.id as number,
      type: "lead_created",
      body_preview: `Lead created for ${contact.full_name} at ${company.name}`,
    });

    return NextResponse.json({ lead: createdLead }, { status: 201 });
  } catch (err) {
    console.error("Error creating lead:", err);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
