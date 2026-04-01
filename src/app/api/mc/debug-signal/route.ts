import { NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Auth check - super admin only
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await validateSession(sessionId);
    if (!session || session.user.email !== "jordan@cosmicreachcreative.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: Record<string, unknown> = {
      env: {
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasGoogleRefreshToken: !!process.env.GOOGLE_REFRESH_TOKEN,
        hasGA4PropertyId: !!process.env.GA4_PROPERTY_ID,
        searchConsoleSiteUrl: process.env.SEARCH_CONSOLE_SITE_URL || "(not set)",
      },
    };

    // Test OAuth token
    try {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN || "",
          grant_type: "refresh_token",
        }),
      });
      const tokenData = await tokenRes.json();
      if (tokenData.access_token) {
        results.oauth = { status: "ok", scopes: tokenData.scope || "(not returned)" };
        const accessToken = tokenData.access_token;

        // Test Search Console API
        const scUrl = process.env.SEARCH_CONSOLE_SITE_URL || "";
        if (scUrl) {
          try {
            const endDate = new Date().toISOString().split("T")[0];
            const startDate = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
            const scRes = await fetch(
              `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(scUrl)}/searchAnalytics/query`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  startDate,
                  endDate,
                  dimensions: ["query"],
                  rowLimit: 5,
                  type: "web",
                }),
              }
            );
            if (scRes.ok) {
              const scData = await scRes.json();
              results.searchConsole = {
                status: "ok",
                rowCount: scData.rows?.length || 0,
                sampleKeyword: scData.rows?.[0]?.keys?.[0] || "(none)",
              };
            } else {
              results.searchConsole = {
                status: "error",
                httpStatus: scRes.status,
                error: await scRes.text().catch(() => ""),
              };
            }
          } catch (err) {
            results.searchConsole = { status: "exception", error: err instanceof Error ? err.message : String(err) };
          }
        }
      } else {
        results.oauth = { status: "error", error: tokenData };
      }
    } catch (err) {
      results.oauth = { status: "exception", error: err instanceof Error ? err.message : String(err) };
    }

    // Test PageSpeed API
    try {
      const psUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent("https://cosmicreachcreative.com")}&strategy=MOBILE&category=PERFORMANCE`;
      const psRes = await fetch(psUrl, { signal: AbortSignal.timeout(55000) });
      if (psRes.ok) {
        const psData = await psRes.json();
        const score = psData?.lighthouseResult?.categories?.performance?.score;
        results.pageSpeed = { status: "ok", performanceScore: score != null ? Math.round(score * 100) : null };
      } else {
        results.pageSpeed = {
          status: "error",
          httpStatus: psRes.status,
          error: await psRes.text().catch(() => "").then(t => t.substring(0, 500)),
        };
      }
    } catch (err) {
      results.pageSpeed = { status: "exception", error: err instanceof Error ? err.message : String(err) };
    }

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
