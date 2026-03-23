import { NextRequest, NextResponse } from "next/server";
import {
  createCompany,
  createContact,
  createLead,
  createActivity,
  ensureCrmTables,
} from "@/lib/crm-db";
import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/**
 * Simple lead scoring based on qualification rubric.
 * Max score: 100
 */
function scoreLead(
  company: Record<string, unknown>,
  contact: Record<string, unknown>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Founder-led (+20)
  const title = ((contact.title as string) || "").toLowerCase();
  if (
    title.includes("founder") ||
    title.includes("ceo") ||
    title.includes("owner") ||
    title.includes("co-founder")
  ) {
    score += 20;
    reasons.push("Founder-led");
  } else if (
    title.includes("vp") ||
    title.includes("director") ||
    title.includes("head of") ||
    title.includes("chief")
  ) {
    score += 10;
    reasons.push("Senior leadership");
  }

  // Website exists (+15)
  if (company.website || company.domain) {
    score += 15;
    reasons.push("Has web presence");
  }

  // US-based (+10)
  const country = ((company.country as string) || "").toUpperCase();
  if (country === "US" || country === "UNITED STATES" || !country) {
    score += 10;
    reasons.push("US-based");
  }

  // Valid email (+15)
  const emailStatus = ((contact.email_status as string) || "").toLowerCase();
  if (emailStatus === "valid" || emailStatus === "verified") {
    score += 15;
    reasons.push("Verified email");
  } else if (contact.email) {
    score += 5;
    reasons.push("Has email (unverified)");
  }

  // B2B / SaaS / Consulting industry (+20)
  const industry = ((company.industry as string) || "").toLowerCase();
  if (
    industry.includes("saas") ||
    industry.includes("software") ||
    industry.includes("b2b") ||
    industry.includes("consulting") ||
    industry.includes("technology") ||
    industry.includes("health tech") ||
    industry.includes("fintech")
  ) {
    score += 20;
    reasons.push("Target industry");
  } else if (industry) {
    score += 5;
    reasons.push("Known industry");
  }

  // Memphis area (+20)
  const city = ((company.city as string) || "").toLowerCase();
  const state = ((company.state as string) || "").toUpperCase();
  if (
    city.includes("memphis") ||
    city.includes("germantown") ||
    city.includes("collierville") ||
    city.includes("cordova") ||
    city.includes("bartlett")
  ) {
    score += 20;
    reasons.push("Memphis metro area");
  } else if (state === "TN" || state === "TENNESSEE") {
    score += 10;
    reasons.push("Tennessee-based");
  }

  return { score: Math.min(score, 100), reasons };
}

export async function POST(request: NextRequest) {
  try {
    await ensureCrmTables();
    const sql = getSQL();

    const body = await request.json();
    const { company, contact } = body;

    if (!contact?.email || !contact?.full_name || !company?.name) {
      return NextResponse.json(
        { error: "contact.email, contact.full_name, and company.name are required" },
        { status: 400 }
      );
    }

    // Dedupe by email
    const existing = await sql`
      SELECT id FROM contacts WHERE email = ${contact.email} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A contact with this email already exists", existing_contact_id: existing[0].id },
        { status: 409 }
      );
    }

    // Dedupe company by domain -reuse existing or create new
    let companyRecord;
    if (company.domain) {
      const existingCompany = await sql`
        SELECT * FROM companies WHERE domain = ${company.domain} LIMIT 1
      `;
      if (existingCompany.length > 0) {
        companyRecord = existingCompany[0];
      }
    }

    if (!companyRecord) {
      companyRecord = await createCompany({
        ...company,
        source: "prospecting",
      });
    }

    // Create contact
    const contactRecord = await createContact({
      ...contact,
      company_id: companyRecord.id as number,
      source: "prospecting",
    });

    // Score the lead
    const { score, reasons } = scoreLead(company, contact);

    // Determine persona type
    const title = ((contact.title as string) || "").toLowerCase();
    let personaType = "other";
    if (
      title.includes("founder") ||
      title.includes("ceo") ||
      title.includes("owner") ||
      title.includes("co-founder")
    ) {
      personaType = "founder";
    } else if (
      title.includes("marketing") ||
      title.includes("growth") ||
      title.includes("brand")
    ) {
      personaType = "marketing_leader";
    }

    // Update contact persona_type if detected
    if (personaType !== "other") {
      await sql`
        UPDATE contacts SET persona_type = ${personaType}, updated_at = NOW()
        WHERE id = ${contactRecord.id}
      `;
    }

    // Create lead
    const leadRecord = await createLead({
      company_id: companyRecord.id as number,
      contact_id: contactRecord.id as number,
      fit_score: score,
      fit_reason: reasons.join(", "),
      stage: "candidate",
    });

    // Log activity
    await createActivity({
      lead_id: leadRecord.id as number,
      contact_id: contactRecord.id as number,
      company_id: companyRecord.id as number,
      type: "lead_imported",
      body_preview: `Imported from PDL: ${contact.full_name} at ${company.name} (score: ${score})`,
      metadata: { source: "apollo", score, reasons },
    });

    return NextResponse.json(
      {
        lead: leadRecord,
        company: companyRecord,
        contact: contactRecord,
        fit_score: score,
        fit_reasons: reasons,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error importing from Apollo:", err);
    return NextResponse.json(
      { error: "Failed to import lead" },
      { status: 500 }
    );
  }
}
