import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName } from "@/lib/mc-auth";
import { getTenantGoals, upsertTenantGoals, logAudit } from "@/lib/mc-db";

export async function GET(
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

    const goals = await getTenantGoals(result.ctx.tenantId);
    return NextResponse.json({ goals });
  } catch (err) {
    console.error("Get goals error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> }
) {
  try {
    const { tenantSlug } = await params;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const body = await request.json();

    await upsertTenantGoals(result.ctx.tenantId, {
      business_name: body.business_name,
      business_description: body.business_description,
      target_audience: body.target_audience,
      brand_voice: body.brand_voice,
      key_offers: body.key_offers,
      goals: body.goals || [],
      cta_url: body.cta_url,
      cta_label: body.cta_label,
      sender_name: body.sender_name,
      sender_title: body.sender_title,
      avoid_phrases: body.avoid_phrases,
      example_tone: body.example_tone,
    });

    await logAudit({
      user_id: result.ctx.user.id,
      tenant_id: result.ctx.tenantId,
      action: "goals_updated",
      resource: "tenant_goals",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Update goals error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
