import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  ensureCrmTables,
  createCompany,
  createLead,
  createActivity,
} from "@/lib/crm-db";
import {
  brandedEmailShell,
  emailCard,
  emailSectionLabel,
  emailField,
  emailButton,
} from "@/lib/email-template";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/**
 * Upsert a contact by email. If the email already exists, update the
 * timestamp and return the existing row instead of throwing.
 */
async function upsertContact(data: {
  full_name: string;
  email: string;
  company_id?: number;
  source?: string;
}) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO contacts (full_name, email, company_id, source)
    VALUES (
      ${data.full_name},
      ${data.email},
      ${data.company_id ?? null},
      ${data.source ?? "case_study_download"}
    )
    ON CONFLICT (email) DO UPDATE SET
      updated_at = NOW()
    RETURNING *
  `;
  return rows[0];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    const email = body.email?.trim()?.toLowerCase();
    const company = body.company?.trim() || null;

    /* ── Validation ── */

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    /* ── CRM records ── */

    await ensureCrmTables();

    // Company (optional)
    let companyId: number | null = null;
    if (company) {
      const companyRow = await createCompany({
        name: company,
        source: "case_study_download",
      });
      companyId = companyRow.id as number;
    }

    // Contact (upsert on email)
    const contact = await upsertContact({
      full_name: name,
      email,
      company_id: companyId ?? undefined,
      source: "case_study_download",
    });
    const contactId = contact.id as number;

    // Lead (use ON CONFLICT to handle duplicate contact_id)
    const sql = getSQL();
    const leadRows = await sql`
      INSERT INTO leads (contact_id, company_id, stage, pain_point_summary, outreach_angle)
      VALUES (
        ${contactId},
        ${companyId},
        'candidate',
        ${"Downloaded La Chérie case study"},
        ${"Brand positioning and trust gap rebuild"}
      )
      ON CONFLICT (contact_id) DO UPDATE SET
        updated_at = NOW()
      RETURNING *
    `;
    const lead = leadRows[0];
    const leadId = lead.id as number;

    // Activity
    await createActivity({
      lead_id: leadId,
      contact_id: contactId,
      company_id: companyId ?? undefined,
      type: "case_study_download",
      body_preview: "Downloaded La Chérie Weddings case study",
      metadata: {
        timestamp: new Date().toISOString(),
        company: company ?? "Not provided",
      },
    });

    /* ── Notification email ── */

    try {
      const fieldRows = [
        emailField("Name", name),
        emailField("Email", email),
        emailField("Company", company ?? "Not provided"),
        emailField("Downloaded", "La Chérie Weddings Case Study"),
        emailField("Time", new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })),
      ].join("");

      const html = brandedEmailShell(
        emailCard(
          [
            emailSectionLabel("New Case Study Lead"),
            `<table width="100%" cellpadding="0" cellspacing="0" role="presentation">${fieldRows}</table>`,
            emailButton("View in Mission Control", "https://cosmicreachcreative.com/admin"),
          ].join("")
        )
      );

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Cosmic Reach Creative <hello@cosmicreachcreative.com>",
          to: "jordan@cosmicreachcreative.com",
          subject: `New Case Study Lead: ${name}`,
          html,
          text: `New case study download lead:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company ?? "Not provided"}\nAsset: La Chérie Weddings Case Study`,
        }),
      });
    } catch (emailErr) {
      console.error("Failed to send lead notification email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Case study lead error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
