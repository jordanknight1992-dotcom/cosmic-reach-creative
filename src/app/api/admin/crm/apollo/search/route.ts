import { NextRequest, NextResponse } from "next/server";

/** US state abbreviation → full name (PDL uses full names) */
const STATE_MAP: Record<string, string> = {
  AL:"alabama",AK:"alaska",AZ:"arizona",AR:"arkansas",CA:"california",
  CO:"colorado",CT:"connecticut",DE:"delaware",FL:"florida",GA:"georgia",
  HI:"hawaii",ID:"idaho",IL:"illinois",IN:"indiana",IA:"iowa",KS:"kansas",
  KY:"kentucky",LA:"louisiana",ME:"maine",MD:"maryland",MA:"massachusetts",
  MI:"michigan",MN:"minnesota",MS:"mississippi",MO:"missouri",MT:"montana",
  NE:"nebraska",NV:"nevada",NH:"new hampshire",NJ:"new jersey",NM:"new mexico",
  NY:"new york",NC:"north carolina",ND:"north dakota",OH:"ohio",OK:"oklahoma",
  OR:"oregon",PA:"pennsylvania",RI:"rhode island",SC:"south carolina",
  SD:"south dakota",TN:"tennessee",TX:"texas",UT:"utah",VT:"vermont",
  VA:"virginia",WA:"washington",WV:"west virginia",WI:"wisconsin",WY:"wyoming",
  DC:"district of columbia",
};

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
      per_page = 10,
      scroll_token,
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
        },
      });
    }

    if (location) {
      // Parse "City, ST" or "City, State" format
      const parts = location.split(",").map((s: string) => s.trim());
      if (parts[0]) {
        mustClauses.push({ match: { location_locality: parts[0].toLowerCase() } });
      }
      if (parts[1]) {
        // Convert state abbreviation to full name (PDL requires full names)
        const stateInput = parts[1].toUpperCase();
        const fullState = STATE_MAP[stateInput] || parts[1].toLowerCase();
        mustClauses.push({ match: { location_region: fullState } });
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
          size: Math.min(per_page, 25),
          ...(scroll_token ? { scroll_token } : {}),
        }),
      }
    );

    // Log the query for debugging
    const builtQuery = { bool: { must: mustClauses } };
    console.log("PDL search query:", JSON.stringify(builtQuery));

    if (!pdlRes.ok) {
      const errData = await pdlRes.json().catch(() => ({}));
      console.error("PDL API error:", pdlRes.status, JSON.stringify(errData));

      // 404 means no results found (not an error)
      if (pdlRes.status === 404) {
        return NextResponse.json({
          results: [],
          total: 0,
          scroll_token: null,
          debug: { status: 404, message: "No matching people found", query: builtQuery },
        });
      }

      const errorMessage = errData?.error?.message || `PDL API error (${pdlRes.status})`;
      return NextResponse.json({
        error: errorMessage,
        debug: { status: pdlRes.status, raw: errData, query: builtQuery },
        fallback: pdlRes.status === 401 || pdlRes.status === 403,
      });
    }

    const pdlData = await pdlRes.json();
    const people = pdlData.data || [];
    console.log("PDL results:", people.length, "of", pdlData.total, "total");

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
      scroll_token: pdlData.scroll_token || null,
      per_page: Math.min(per_page, 25),
    });
  } catch (err) {
    console.error("Error searching PDL:", err);
    return NextResponse.json(
      { error: "Failed to search prospects", fallback: true },
      { status: 500 }
    );
  }
}
