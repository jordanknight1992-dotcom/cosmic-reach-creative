import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName, encryptCredential, getEnvConfiguredProviders } from "@/lib/mc-auth";
import { saveCredential, getCredentialProviders, logAudit } from "@/lib/mc-db";

const ALLOWED_PROVIDERS = [
  "google_analytics",
  "google_search_console",
  "google_calendar",
  "pagespeed",
];

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

    // Merge DB-stored credentials with env-var-configured providers
    const dbProviders = await getCredentialProviders(result.ctx.tenantId);
    const envProviders = getEnvConfiguredProviders();

    const providerDetails = new Map<string, { source: "tenant" | "platform" }>();
    // DB credentials take priority
    for (const p of dbProviders) {
      providerDetails.set(p, { source: "tenant" });
    }
    // Env vars fill gaps
    for (const ep of envProviders) {
      if (!providerDetails.has(ep.provider)) {
        providerDetails.set(ep.provider, { source: ep.source });
      }
    }

    // Return flat list for backward compat, plus detailed list
    const providers = Array.from(providerDetails.keys());
    const details = Array.from(providerDetails.entries()).map(([provider, info]) => ({
      provider,
      source: info.source,
    }));

    return NextResponse.json({ providers, details });
  } catch (err) {
    console.error("Get credentials error:", err);
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
    const { provider, credential } = body;

    if (!provider || !ALLOWED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }
    if (!credential || typeof credential !== "string" || credential.trim().length < 5) {
      return NextResponse.json({ error: "Invalid credential" }, { status: 400 });
    }

    // Encrypt and store
    const encrypted = await encryptCredential(credential.trim());
    await saveCredential(result.ctx.tenantId, provider, encrypted, {
      connected_at: new Date().toISOString(),
      connected_by: result.ctx.user.id,
    });

    // Audit log
    await logAudit({
      user_id: result.ctx.user.id,
      tenant_id: result.ctx.tenantId,
      action: "credential_saved",
      resource: "tenant_credentials",
      metadata: { provider },
    });

    return NextResponse.json({ ok: true, provider });
  } catch (err) {
    console.error("Save credential error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
