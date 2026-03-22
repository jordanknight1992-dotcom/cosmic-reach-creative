import { NextResponse } from "next/server";
import {
  ensureCrmTables,
  createCompany,
  createContact,
  createLead,
  createActivity,
} from "@/lib/crm-db";
import { neon } from "@neondatabase/serverless";

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/** Ideal customer profile for auto-generation */
const ICP_QUERIES = [
  // Memphis founders & CEOs
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
  // Memphis marketing leaders
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
  // Tennessee SaaS/tech founders
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

/** Lead scoring (same logic as import route) */
function scoreLead(
  person: Record<string, unknown>
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const title = ((person.job_title as string) || "").toLowerCase();
  if (title.includes("founder") || title.includes("ceo") || title.includes("owner") || title.includes("co-founder")) {
    score += 20;
    reasons.push("Founder-led");
  } else if (title.includes("vp") || title.includes("director") || title.includes("head of") || title.includes("chief")) {
    score += 10;
    reasons.push("Senior leadership");
  }

  if (person.job_company_website) {
    score += 15;
    reasons.push("Has web presence");
  }

  const country = ((person.location_country as string) || "").toLowerCase();
  if (country === "united states" || !country) {
    score += 10;
    reasons.push("US-based");
  }

  if (person.work_email) {
    score += 15;
    reasons.push("Verified work email");
  } else if (person.recommended_personal_email) {
    score += 5;
    reasons.push("Has email (personal)");
  }

  const industry = ((person.job_company_industry as string) || "").toLowerCase();
  if (industry.includes("software") || industry.includes("technology") || industry.includes("consulting") || industry.includes("saas") || industry.includes("internet")) {
    score += 20;
    reasons.push("Target industry");
  } else if (industry) {
    score += 5;
    reasons.push("Known industry");
  }

  const city = ((person.location_locality as string) || "").toLowerCase();
  if (city.includes("memphis") || city.includes("germantown") || city.includes("collierville") || city.includes("cordova") || city.includes("bartlett")) {
    score += 20;
    reasons.push("Memphis metro area");
  } else if (((person.location_region as string) || "").toLowerCase().includes("tennessee")) {
    score += 10;
    reasons.push("Tennessee-based");
  }

  return { score: Math.min(score, 100), reasons };
}

/**
 * POST /api/admin/crm/generate-leads
 *
 * Auto-generates up to 25 scored leads from PDL based on ICP criteria.
 * Deduplicates against existing contacts by email.
 */
export async function POST() {
  try {
    const apiKey = (process.env.PDL_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json({ error: "PDL API key not configured" }, { status: 400 });
    }

    await ensureCrmTables();
    const sql = getSQL();

    // Get existing contact emails for dedup
    const existingContacts = await sql`SELECT email FROM contacts WHERE email IS NOT NULL`;
    const existingEmails = new Set(existingContacts.map((c) => (c.email as string).toLowerCase()));

    const imported: { name: string; company: string; score: number }[] = [];
    const skipped: { name: string; reason: string }[] = [];
    const errors: string[] = [];
    const targetCount = 25;

    for (const icpQuery of ICP_QUERIES) {
      if (imported.length >= targetCount) break;

      const remaining = targetCount - imported.length;

      try {
        const pdlRes = await fetch("https://api.peopledatalabs.com/v5/person/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": apiKey,
          },
          body: JSON.stringify({
            query: icpQuery.query,
            size: Math.min(remaining * 2, 50), // Fetch extra to account for dedup
          }),
        });

        if (!pdlRes.ok) {
          if (pdlRes.status === 404) continue; // No results for this query
          const errData = await pdlRes.json().catch(() => ({}));
          errors.push(`${icpQuery.label}: ${errData?.error?.message || pdlRes.status}`);
          continue;
        }

        const pdlData = await pdlRes.json();
        const people = pdlData.data || [];

        for (const person of people) {
          if (imported.length >= targetCount) break;

          const email = (person.work_email || person.recommended_personal_email || "") as string;
          const fullName = (person.full_name || "") as string;

          if (!email || !fullName) {
            skipped.push({ name: fullName || "Unknown", reason: "Missing email or name" });
            continue;
          }

          if (existingEmails.has(email.toLowerCase())) {
            skipped.push({ name: fullName, reason: "Already in CRM" });
            continue;
          }

          // Score the lead
          const { score, reasons } = scoreLead(person);

          // Skip very low scores
          if (score < 20) {
            skipped.push({ name: fullName, reason: `Low fit score (${score})` });
            continue;
          }

          try {
            const companyName = (person.job_company_name || "Unknown") as string;
            const companyDomain = (person.job_company_website || "") as string;

            // Dedup company by domain
            let companyRecord;
            if (companyDomain) {
              const existing = await sql`SELECT * FROM companies WHERE domain = ${companyDomain} LIMIT 1`;
              if (existing.length > 0) companyRecord = existing[0];
            }

            if (!companyRecord) {
              companyRecord = await createCompany({
                name: companyName,
                domain: companyDomain || undefined,
                industry: (person.job_company_industry as string) || undefined,
                source: "auto-generate",
              });
            }

            const nameParts = fullName.split(" ");
            const contactRecord = await createContact({
              company_id: companyRecord.id as number,
              full_name: fullName,
              first_name: nameParts[0] || fullName,
              last_name: nameParts.slice(1).join(" ") || undefined,
              email,
              title: (person.job_title as string) || undefined,
              linkedin_url: person.linkedin_url ? `https://${person.linkedin_url}` : undefined,
              source: "auto-generate",
              persona_type: ((person.job_title as string) || "").toLowerCase().includes("founder") || ((person.job_title as string) || "").toLowerCase().includes("ceo")
                ? "founder"
                : ((person.job_title as string) || "").toLowerCase().includes("marketing")
                  ? "marketing_leader"
                  : "other",
            });

            const leadRecord = await createLead({
              company_id: companyRecord.id as number,
              contact_id: contactRecord.id as number,
              fit_score: score,
              fit_reason: reasons.join(", "),
              stage: "candidate",
            });

            await createActivity({
              lead_id: leadRecord.id as number,
              contact_id: contactRecord.id as number,
              company_id: companyRecord.id as number,
              type: "lead_imported",
              body_preview: `Auto-generated from ${icpQuery.label} (score: ${score})`,
              metadata: { source: "auto-generate", score, reasons, icp: icpQuery.label },
            });

            existingEmails.add(email.toLowerCase());
            imported.push({ name: fullName, company: companyName, score });
          } catch (dbErr) {
            const msg = dbErr instanceof Error ? dbErr.message : "DB error";
            skipped.push({ name: fullName, reason: msg });
          }
        }
      } catch (queryErr) {
        const msg = queryErr instanceof Error ? queryErr.message : "Query failed";
        errors.push(`${icpQuery.label}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      leads: imported,
      skipped: skipped.length,
      skippedDetails: skipped,
      errors,
    });
  } catch (err) {
    console.error("Generate leads error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate leads" },
      { status: 500 }
    );
  }
}
