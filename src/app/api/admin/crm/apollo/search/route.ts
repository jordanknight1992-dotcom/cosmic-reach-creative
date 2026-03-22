import { NextRequest, NextResponse } from "next/server";

// Diagnostic: check if key is available at runtime
export async function GET() {
  const hasKey = !!process.env.APOLLO_API_KEY;
  const keyLen = (process.env.APOLLO_API_KEY || "").length;
  return NextResponse.json({ configured: hasKey, keyLength: keyLen });
}

export async function POST(request: NextRequest) {
  try {
    const rawKey = process.env.APOLLO_API_KEY || "";
    console.log("Apollo key check — length:", rawKey.length, "hasNewline:", rawKey.includes("\n"), "lastChar:", rawKey.charCodeAt(rawKey.length - 1));
    if (!rawKey.trim()) {
      return NextResponse.json({
        error: "Apollo API key not configured",
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

    // Build Apollo search payload
    const searchPayload: Record<string, unknown> = {
      per_page: Math.min(per_page, 100),
    };

    if (query) searchPayload.q_keywords = query;
    if (location) searchPayload.person_locations = [location];
    if (industry) searchPayload.organization_industry_tag_ids = [industry];
    if (title_keywords && title_keywords.length > 0) {
      searchPayload.person_titles = title_keywords;
    }

    const apolloRes = await fetch(
      "https://api.apollo.io/api/v1/mixed_people/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.APOLLO_API_KEY?.trim() || "",
        },
        body: JSON.stringify(searchPayload),
      }
    );

    if (!apolloRes.ok) {
      const errData = await apolloRes.json().catch(() => ({}));
      console.error("Apollo API error:", apolloRes.status, errData);
      return NextResponse.json({
        error: errData.message || `Apollo API error (${apolloRes.status})`,
        fallback: true,
      });
    }

    const apolloData = await apolloRes.json();
    const people = apolloData.people || [];

    // Parse and simplify results
    const results = people.map((person: Record<string, unknown>) => {
      const org = (person.organization || {}) as Record<string, unknown>;
      return {
        contact: {
          full_name: person.name || "",
          first_name: person.first_name || "",
          last_name: person.last_name || "",
          title: person.title || "",
          email: person.email || "",
          email_status: person.email_status || "unknown",
          city: person.city || "",
          state: person.state || "",
          country: person.country || "US",
          linkedin_url: person.linkedin_url || "",
          source_contact_id: person.id || "",
        },
        company: {
          name: org.name || "",
          domain: org.primary_domain || "",
          website: org.website_url || "",
          industry: org.industry || "",
          city: org.city || "",
          state: org.state || "",
          country: org.country || "US",
        },
      };
    });

    return NextResponse.json({
      results,
      total: apolloData.pagination?.total_entries || results.length,
      page: apolloData.pagination?.page || 1,
    });
  } catch (err) {
    console.error("Error searching Apollo:", err);
    return NextResponse.json(
      { error: "Failed to search Apollo", fallback: true },
      { status: 500 }
    );
  }
}
