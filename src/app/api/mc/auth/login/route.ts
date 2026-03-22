import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  authenticateUser,
  verifyTotpAndCreateSession,
  getSessionCookieName,
  getSessionCookieOptions,
} from "@/lib/mc-auth";
import { getUserTenants } from "@/lib/mc-db";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

async function buildLoginResponse(userId: number, sessionId: string, user: { id: number; email: string; full_name: string; is_super_admin: boolean }) {
  const cookieStore = await cookies();
  cookieStore.set(getSessionCookieName(), sessionId, getSessionCookieOptions());

  const tenants = await getUserTenants(userId);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      is_super_admin: user.is_super_admin,
    },
    tenants: tenants.map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      role: t.role,
      plan: (t as unknown as Record<string, unknown>).plan ?? "core",
    })),
    redirect:
      tenants.length === 1
        ? `/mission-control/${tenants[0].slug}`
        : tenants.length === 0 && user.is_super_admin
          ? "/mission-control/super"
          : "/mission-control/select-workspace",
  });
}

export async function POST(request: Request) {
  try {
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT, RATE_WINDOW_MS);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, totp_code, user_id } = body;

    // Step 2: TOTP verification (after initial auth returned requireTotp)
    if (totp_code && user_id) {
      const totpResult = await verifyTotpAndCreateSession(user_id, totp_code);
      if ("error" in totpResult) {
        return NextResponse.json({ error: totpResult.error }, { status: 401 });
      }
      const { getUserById } = await import("@/lib/mc-db");
      const user = await getUserById(user_id);
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 401 });

      return buildLoginResponse(user.id, totpResult.sessionId, user);
    }

    // Step 1: Email + password
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await authenticateUser(email, password);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // TOTP required — send back user ID, client must prompt for code
    if ("requireTotp" in result) {
      return NextResponse.json({
        requireTotp: true,
        user_id: result.user.id,
      });
    }

    const { user, sessionId } = result;
    return buildLoginResponse(user.id, sessionId, user);
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
