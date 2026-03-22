import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { hashPassword, getSessionCookieName, getSessionCookieOptions } from "@/lib/mc-auth";
import {
  createUser,
  createTenant,
  addUserToTenant,
  createSession,
  getUserByEmail,
  isEmailBlocked,
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
    const { email, password, full_name, company_name, industry, timezone } = body;

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

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      full_name: full_name.trim(),
    });

    // Create tenant workspace
    let slug = slugify(company_name);
    // Ensure uniqueness by appending random chars if needed
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

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(getSessionCookieName(), sessionId, getSessionCookieOptions());

    return NextResponse.json({
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
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
