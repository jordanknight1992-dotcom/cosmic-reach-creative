import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/crm/apollo/search
 *
 * Prospect search powered by People Data Labs (PDL).
 * Accepts the same UI contract the CrmTab sends (query, location, industry, title_keywords).
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = (process.env.PDL_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json({
        error: "Prospecting API key not configured",
        fallback: true,
      });
    }

    const body = await request.json();
    const {
      query,
      location,
      industry,
      title_keywords,
      per_page = 5,
    } = body;

    // Build Elasticsearch bool query for PDL
    const mustClauses: Record<string, unknown>[] = [];

    if (query) {
      // General keyword search — match against company name or person name
      mustClauses.push({
        bool: {
          should: [
            { match: { job_company_name: query } },
            { match: { full_name: query } },
          ],
          minimum_should_match: 1,
        },
      });
    }

    if (location) {
      // Parse "City, ST" format
      const parts = location.split(",").map((s: string) => s.trim());
      if (parts[0]) {
        mustClauses.push({ match: { location_locality: parts[0].toLowerCase() } });
      }
      if (parts[1]) {
        // Could be state abbreviation or full name
        mustClauses.push({ match: { location_region: parts[1].toLowerCase() } });
      }
    }

    if (industry) {
      mustClauses.push({ match: { industry: industry.toLowerCase() } });
    }

    if (title_keywords && title_keywords.length > 0) {
      // Match any of the title keywords
      mustClauses.push({
        bool: {
          should: title_keywords.map((kw: string) => ({
            match: { job_title: kw.toLowerCase() },
          })),
          minimum_should_match: 1,
        },
      });
    }

    // Default: at least search for people with work emails
    if (mustClauses.length === 0) {
      mustClauses.push({ exists: { field: "work_email" } });
    }

    const pdlRes = await fetch(
      "https://api.peopledatalabs.com/v5/person/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          query: { bool: { must: mustClauses } },
          size: Math.min(per_page, 10),
        }),
      }
    );

    if (!pdlRes.ok) {
      const errData = await pdlRes.json().catch(() => ({}));
      console.error("PDL API error:", pdlRes.status, errData);

      // 404 means no results found (not an error)
      if (pdlRes.status === 404) {
        return NextResponse.json({ results: [], total: 0, page: 1 });
      }

      return NextResponse.json({
        error: errData?.error?.message || `Search error (${pdlRes.status})`,
        fallback: pdlRes.status === 401 || pdlRes.status === 403,
      });
    }

    const pdlData = await pdlRes.json();
    const people = pdlData.data || [];

    // Map PDL response to the same shape the CrmTab expects
    const results = people.map((person: Record<string, unknown>) => ({
      contact: {
        full_name: person.full_name || "",
        first_name: person.first_name || "",
        last_name: person.last_name || "",
        title: (person.job_title as string) || "",
        email: (person.work_email as string) || (person.recommended_personal_email as string) || "",
        email_status: person.work_email ? "valid" : "unknown",
        city: (person.location_locality as string) || "",
        state: (person.location_region as string) || "",
        country: (person.location_country as string) || "US",
        linkedin_url: person.linkedin_url ? `https://${person.linkedin_url}` : "",
        source_contact_id: (person.id as string) || "",
      },
      company: {
        name: (person.job_company_name as string) || "",
        domain: (person.job_company_website as string) || "",
        website: person.job_company_website ? `https://${person.job_company_website}` : "",
        industry: (person.job_company_industry as string) || "",
        city: (person.job_company_location_locality as string) || "",
        state: (person.job_company_location_region as string) || "",
        country: (person.job_company_location_country as string) || "US",
      },
    }));

    return NextResponse.json({
      results,
      total: pdlData.total || results.length,
      page: 1,
    });
  } catch (err) {
    console.error("Error searching PDL:", err);
    return NextResponse.json(
      { error: "Failed to search prospects", fallback: true },
      { status: 500 }
    );
  }
}
