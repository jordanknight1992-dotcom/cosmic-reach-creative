import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName } from "@/lib/mc-auth";
import { updateOnboardingProgress, getOnboardingProgress } from "@/lib/mc-db";

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

    const progress = await getOnboardingProgress(result.ctx.tenantId);
    return NextResponse.json(progress);
  } catch (err) {
    console.error("Get onboarding error:", err);
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
    const { steps, current_step } = body;

    await updateOnboardingProgress(result.ctx.tenantId, steps ?? {}, current_step ?? "workspace");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Update onboarding error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
