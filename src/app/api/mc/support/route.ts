import { NextRequest, NextResponse } from "next/server";
import {
  validateSession,
  validateSupportEntry,
  startSupportAccess,
  endSupportAccess,
  verifyStepUp,
  hasRecentStepUp,
  isSuperUserEmail,
  getSessionCookieName,
} from "@/lib/mc-auth";
import {
  getActiveSupportSessionForUser,
  getRecentSupportSessions,
  getTenantById,
  getAllTenants,
  expireSupportSessions,
  logAudit,
} from "@/lib/mc-db";

/**
 * GET /api/mc/support
 * Get support console data: active session, recent sessions, all tenants
 */
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ctx.user.is_super_admin || !isSuperUserEmail(ctx.user.email)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  // Expire stale sessions
  await expireSupportSessions();

  const [activeSession, recentSessions, tenants] = await Promise.all([
    getActiveSupportSessionForUser(ctx.user.id),
    getRecentSupportSessions(ctx.user.id, 20),
    getAllTenants(),
  ]);

  // Get tenant name for active session
  let activeTenantName: string | null = null;
  if (activeSession) {
    const tenant = await getTenantById(activeSession.tenant_id);
    activeTenantName = tenant?.name ?? null;
  }

  return NextResponse.json({
    activeSession: activeSession ? {
      ...activeSession,
      tenant_name: activeTenantName,
    } : null,
    recentSessions,
    tenants: tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      status: t.status,
      support_access_enabled: (t as unknown as Record<string, unknown>).support_access_enabled ?? true,
      is_retainer_client: (t as unknown as Record<string, unknown>).is_retainer_client ?? false,
    })),
    hasStepUp: hasRecentStepUp(ctx.user.id),
    totpEnabled: ctx.user.totp_enabled,
  });
}

/**
 * POST /api/mc/support
 * Actions: step_up, start, end
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!ctx.user.is_super_admin || !isSuperUserEmail(ctx.user.email)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const body = await request.json();
  const { action } = body;
  const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  switch (action) {
    case "step_up": {
      // Step-up verification with TOTP code
      const { code } = body;
      if (!code || typeof code !== "string") {
        return NextResponse.json({ error: "Verification code required" }, { status: 400 });
      }

      if (!ctx.user.totp_enabled) {
        return NextResponse.json({
          error: "Two-factor authentication must be enabled before using support access",
        }, { status: 400 });
      }

      const verified = await verifyStepUp(ctx.user.id, code);
      if (!verified) {
        await logAudit({
          user_id: ctx.user.id,
          action: "support_step_up_failed",
          ip_address: ipAddress,
          user_agent: userAgent,
        });
        return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
      }

      await logAudit({
        user_id: ctx.user.id,
        action: "support_step_up_verified",
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      return NextResponse.json({ verified: true });
    }

    case "start": {
      // Start a support session
      const { tenantId, reason } = body;
      if (!tenantId || !reason || typeof reason !== "string" || reason.trim().length < 3) {
        return NextResponse.json({
          error: "Tenant ID and access reason (3+ characters) are required",
        }, { status: 400 });
      }

      // Validate support entry (checks MFA, step-up, tenant permissions)
      const validation = await validateSupportEntry(ctx.user.id, tenantId);
      if (!validation.allowed) {
        return NextResponse.json({
          error: validation.reason,
          requireStepUp: validation.reason === "step_up_required",
        }, { status: 403 });
      }

      // End any existing active session first
      const existing = await getActiveSupportSessionForUser(ctx.user.id);
      if (existing) {
        await endSupportAccess(existing.id, ctx.user.id, ipAddress, userAgent);
      }

      // Start the new session
      const session = await startSupportAccess({
        userId: ctx.user.id,
        tenantId,
        reason: reason.trim(),
        ipAddress,
        userAgent,
      });

      const tenant = await getTenantById(tenantId);

      return NextResponse.json({
        session: {
          ...session,
          tenant_name: tenant?.name ?? null,
          tenant_slug: tenant?.slug ?? null,
        },
      });
    }

    case "end": {
      // End current support session
      const { supportSessionId } = body;
      if (!supportSessionId) {
        // End any active session for this user
        const active = await getActiveSupportSessionForUser(ctx.user.id);
        if (active) {
          await endSupportAccess(active.id, ctx.user.id, ipAddress, userAgent);
        }
      } else {
        await endSupportAccess(supportSessionId, ctx.user.id, ipAddress, userAgent);
      }

      return NextResponse.json({ ended: true });
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
