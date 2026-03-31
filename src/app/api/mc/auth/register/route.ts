import { NextResponse } from "next/server";
import { hashPassword, getSessionCookieName, getSessionCookieOptions } from "@/lib/mc-auth";
import {
  createUser,
  createTenant,
  addUserToTenant,
  createSession,
  getUserByEmail,
  isEmailBlocked,
  getUnusedGrantByEmail,
  markGrantUsed,
  getPromoCodeByCode,
  incrementPromoCodeUsage,
  createRegistrationGrant,
} from "@/lib/mc-db";
import { checkRateLimit } from "@/lib/rate-limit";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
    const { email, password, full_name, company_name, industry, timezone, promo_code } = body;

    if (!email || !password || !full_name || !company_name) {
      return NextResponse.json(
        { error: "Email, password, full name, and company name are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check blocklist
    const blocked = await isEmailBlocked(email);
    if (blocked) {
      return NextResponse.json(
        { error: "This email cannot be used to create an account" },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existing = await getUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // ── Registration gate: require Stripe purchase or valid promo code ──
    // Super admin email bypasses the gate entirely
    const SUPER_ADMIN_EMAILS = ["jordan@cosmicreachcreative.com"];
    const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(email.toLowerCase().trim());

    // First check for an existing grant (from Stripe webhook)
    let grant = isSuperAdmin ? { id: 0, email, grant_type: "admin", used: false } : await getUnusedGrantByEmail(email);

    // If no existing grant, try promo code
    if (!grant && promo_code) {
      const code = await getPromoCodeByCode(promo_code);
      if (!code) {
        return NextResponse.json(
          { error: "Invalid promo code." },
          { status: 403 }
        );
      }
      if (!code.is_active) {
        return NextResponse.json(
          { error: "This promo code is no longer active." },
          { status: 403 }
        );
      }
      if (code.times_used >= code.max_uses) {
        return NextResponse.json(
          { error: "This promo code has reached its usage limit." },
          { status: 403 }
        );
      }
      if (code.expires_at && new Date(code.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "This promo code has expired." },
          { status: 403 }
        );
      }

      // Create a promo-based grant
      await createRegistrationGrant({
        email: email.toLowerCase().trim(),
        grant_type: "promo",
        promo_code_id: code.id,
      });
      await incrementPromoCodeUsage(code.id);

      // Re-fetch the grant
      grant = await getUnusedGrantByEmail(email);
    }

    if (!grant) {
      return NextResponse.json(
        {
          error: "Registration requires a subscription purchase or a valid promo code. If you just purchased, please wait a moment and try again.",
        },
        { status: 403 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      full_name: full_name.trim(),
    });

    // Mark grant as used (skip for super admin bypass)
    if (grant.id > 0) {
      await markGrantUsed(grant.id);
    }

    // Create tenant workspace
    let slug = slugify(company_name);
    const { getTenantBySlug } = await import("@/lib/mc-db");
    const existingTenant = await getTenantBySlug(slug);
    if (existingTenant) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const tenant = await createTenant({
      name: company_name.trim(),
      slug,
      industry: industry ?? null,
      timezone: timezone ?? "America/Chicago",
    });

    // Add user as owner
    await addUserToTenant(tenant.id, user.id, "owner");

    // Create session
    const sessionId = generateSessionId();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await createSession({
      id: sessionId,
      user_id: user.id,
      tenant_id: tenant.id,
      expires_at: expiresAt,
    });

    // Build response — include sessionId for callback-based cookie flow
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      redirect: `/mission-control/${tenant.slug}/onboarding`,
      sessionId,
    });

    response.cookies.set(getSessionCookieName(), sessionId, getSessionCookieOptions());

    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
