import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName, resolveCredential } from "@/lib/mc-auth";
import { getSQL, logAudit } from "@/lib/mc-db";

/** ICP queries for PDL */
const ICP_QUERIES = [
  {
    query: { bool: { must: [
      { match: { location_region: "tennessee" } },
      { bool: { should: [
        { match: { location_locality: "memphis" } },
        { match: { location_locality: "germantown" } },
        { match: { location_locality: "collierville" } },
        { match: { location_locality: "cordova" } },
        { match: { location_locality: "bartlett" } },
      ]}},
      { bool: { should: [
        { match: { job_title: "founder" } },
        { match: { job_title: "ceo" } },
        { match: { job_title: "co-founder" } },
        { match: { job_title: "owner" } },
      ]}},
    ]}},
    label: "Memphis metro founders & CEOs",
  },
  {
    query: { bool: { must: [
      { match: { location_region: "tennessee" } },
      { match: { location_locality: "memphis" } },
      { bool: { should: [
        { match: { job_title: "marketing director" } },
        { match: { job_title: "vp marketing" } },
        { match: { job_title: "head of marketing" } },
        { match: { job_title: "chief marketing officer" } },
      ]}},
    ]}},
    label: "Memphis marketing leaders",
  },
  {
    query: { bool: { must: [
      { match: { location_region: "tennessee" } },
      { bool: { should: [
        { match: { job_company_industry: "computer software" } },
        { match: { job_company_industry: "information technology" } },
        { match: { job_company_industry: "internet" } },
      ]}},
      { bool: { should: [
        { match: { job_title: "founder" } },
        { match: { job_title: "ceo" } },
      ]}},
    ]}},
    label: "Tennessee tech/SaaS founders",
  },
];

function scoreLead(person: Record<string, unknown>): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const title = ((person.job_title as string) || "").toLowerCase();
  if (title.includes("founder") || title.includes("ceo") || title.includes("owner") || title.includes("co-founder")) {
    score += 20; reasons.push("Founder-led");
  } else if (title.includes("vp") || title.includes("director") || title.includes("head of") || title.includes("chief")) {
    score += 10; reasons.push("Senior leadership");
  }

  if (person.job_company_website) { score += 15; reasons.push("Has web presence"); }

  const country = ((person.location_country as string) || "").toLowerCase();
  if (country === "united states" || !country) { score += 10; reasons.push("US-based"); }

  if (person.work_email) { score += 15; reasons.push("Verified work email"); }
  else if (person.recommended_personal_email) { score += 5; reasons.push("Has email (personal)"); }

  const industry = ((person.job_company_industry as string) || "").toLowerCase();
  if (industry.includes("software") || industry.includes("technology") || industry.includes("consulting") || industry.includes("saas") || industry.includes("internet")) {
    score += 20; reasons.push("Target industry");
  } else if (industry) { score += 5; reasons.push("Known industry"); }

  const city = ((person.location_locality as string) || "").toLowerCase();
  if (city.includes("memphis") || city.includes("germantown") || city.includes("collierville") || city.includes("cordova") || city.includes("bartlett")) {
    score += 20; reasons.push("Memphis metro area");
  } else if (((person.location_region as string) || "").toLowerCase().includes("tennessee")) {
    score += 10; reasons.push("Tennessee-based");
  }

  return { score: Math.min(score, 100), reasons };
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const tenantId = result.ctx.tenantId;

    // Resolve PDL API key (tenant DB first, env var fallback)
    const pdlCred = await resolveCredential(tenantId, "pdl");
    if (!pdlCred) {
      return NextResponse.json({ error: "PDL API key not configured. Add it in Settings > Integrations." }, { status: 400 });
    }

    const sql = getSQL();

    // Get existing emails for this tenant to dedup
    const existingContacts = await sql`
      SELECT ct.email FROM contacts ct
      JOIN leads l ON l.contact_id = ct.id
      WHERE l.tenant_id = ${tenantId} AND ct.email IS NOT NULL
    `.catch(() => []);

    const existingEmails = new Set(
      existingContacts
        .filter((c) => typeof c.email === "string" && c.email)
        .map((c) => (c.email as string).toLowerCase())
    );

    const imported: { name: string; company: string; score: number }[] = [];
    const skipped: { name: string; reason: string }[] = [];

    // Rotate ICP query by day
    const queryIndex = new Date().getDate() % ICP_QUERIES.length;
    const icpQuery = ICP_QUERIES[queryIndex];

    const pdlRes = await fetch("https://api.peopledatalabs.com/v5/person/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": pdlCred.value,
      },
      body: JSON.stringify({ query: icpQuery.query, size: 10 }),
    });

    if (!pdlRes.ok) {
      const errData = await pdlRes.json().catch(() => ({}));
      if (pdlRes.status === 402) {
        return NextResponse.json({ error: "Monthly PDL quota exhausted (100/month). Resets next month.", imported: 0, leads: [] });
      }
      if (pdlRes.status === 404) {
        return NextResponse.json({ success: true, imported: 0, leads: [], message: `No results for "${icpQuery.label}". Try again tomorrow.` });
      }
      return NextResponse.json({ error: errData?.error?.message || `PDL error (${pdlRes.status})` }, { status: 500 });
    }

    const pdlData = await pdlRes.json();
    const people = pdlData.data || [];

    for (const person of people) {
      if (imported.length >= 10) break;

      const email = (person.work_email || person.recommended_personal_email || "") as string;
      const fullName = (person.full_name || "") as string;

      if (!email || !fullName) { skipped.push({ name: fullName || "Unknown", reason: "Missing email or name" }); continue; }
      if (existingEmails.has(email.toLowerCase())) { skipped.push({ name: fullName, reason: "Already in CRM" }); continue; }

      const { score, reasons } = scoreLead(person);
      if (score < 20) { skipped.push({ name: fullName, reason: `Low fit score (${score})` }); continue; }

      try {
        const companyName = (person.job_company_name || "Unknown") as string;
        const companyDomain = (person.job_company_website || "") as string;

        // Upsert company
        let companyId: number;
        if (companyDomain) {
          const existing = await sql`SELECT id FROM companies WHERE domain = ${companyDomain} AND (tenant_id = ${tenantId} OR tenant_id IS NULL) LIMIT 1`;
          if (existing.length > 0) {
            companyId = existing[0].id as number;
          } else {
            const created = await sql`
              INSERT INTO companies (name, domain, industry, source, tenant_id) VALUES
              (${companyName}, ${companyDomain}, ${(person.job_company_industry as string) || null}, 'pdl', ${tenantId})
              RETURNING id
            `;
            companyId = created[0].id as number;
          }
        } else {
          const created = await sql`
            INSERT INTO companies (name, source, tenant_id) VALUES (${companyName}, 'pdl', ${tenantId})
            RETURNING id
          `;
          companyId = created[0].id as number;
        }

        // Create contact
        const nameParts = fullName.split(" ");
        const titleStr = (person.job_title as string) || null;
        const personaType = (titleStr || "").toLowerCase().includes("founder") || (titleStr || "").toLowerCase().includes("ceo")
          ? "founder" : (titleStr || "").toLowerCase().includes("marketing") ? "marketing_leader" : "other";

        const contactRows = await sql`
          INSERT INTO contacts (company_id, full_name, first_name, last_name, email, title, linkedin_url, source, persona_type, tenant_id) VALUES
          (${companyId}, ${fullName}, ${nameParts[0]}, ${nameParts.slice(1).join(" ") || null}, ${email},
           ${titleStr}, ${person.linkedin_url ? `https://${person.linkedin_url}` : null}, 'pdl', ${personaType}, ${tenantId})
          RETURNING id
        `;
        const contactId = contactRows[0].id as number;

        // Create lead
        const leadRows = await sql`
          INSERT INTO leads (company_id, contact_id, fit_score, fit_reason, stage, tenant_id) VALUES
          (${companyId}, ${contactId}, ${score}, ${reasons.join(", ")}, 'candidate', ${tenantId})
          RETURNING id
        `;
        const leadId = leadRows[0].id as number;

        // Activity log
        await sql`
          INSERT INTO activities (lead_id, contact_id, company_id, type, body_preview, tenant_id) VALUES
          (${leadId}, ${contactId}, ${companyId}, 'lead_imported',
           ${'Auto-generated from ' + icpQuery.label + ' (score: ' + score + ')'},
           ${tenantId})
        `;

        existingEmails.add(email.toLowerCase());
        imported.push({ name: fullName, company: companyName, score });
      } catch (dbErr) {
        skipped.push({ name: fullName, reason: dbErr instanceof Error ? dbErr.message : "DB error" });
      }
    }

    await logAudit({
      user_id: result.ctx.user.id,
      tenant_id: tenantId,
      action: "leads_generated",
      resource: "leads",
      metadata: { imported: imported.length, skipped: skipped.length, icp: icpQuery.label },
    });

    return NextResponse.json({
      success: true,
      imported: imported.length,
      leads: imported,
      skipped: skipped.length,
      skippedDetails: skipped,
      icp: icpQuery.label,
    });
  } catch (err) {
    console.error("Generate leads error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to generate leads" }, { status: 500 });
  }
}
