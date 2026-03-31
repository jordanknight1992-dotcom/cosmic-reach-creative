import { NextResponse } from "next/server";
import { getSessionCookieName, getSessionCookieOptions, validateSession } from "@/lib/mc-auth";
import { getTenantBySlug, isUserInTenant, getUserTenants, getUserByEmail } from "@/lib/mc-db";
import { cookies } from "next/headers";

/**
 * Temporary diagnostic endpoint — remove after debugging.
 * Returns session state, tenant lookup, and membership info.
 *
 * GET /api/mc/debug-session            — checks current session cookie
 * GET /api/mc/debug-session?email=x    — checks if user/tenant/membership exist
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const debugEmail = searchParams.get("email");

    const cookieStore = await cookies();
    const cookieName = getSessionCookieName();
    const sessionId = cookieStore.get(cookieName)?.value;
    const allCookieNames = cookieStore.getAll().map((c) => c.name);
    const cookieOpts = getSessionCookieOptions();

    const diagnostics: Record<string, unknown> = {
      cookieName,
      cookieOptions: cookieOpts,
      hasCookie: !!sessionId,
      allCookies: allCookieNames,
    };

    // Check session validity
    if (sessionId) {
      const session = await validateSession(sessionId);
      if (session) {
        diagnostics.session = {
          userId: session.user.id,
          email: session.user.email,
          fullName: session.user.full_name,
          isSuperAdmin: session.user.is_super_admin,
        };
      } else {
        diagnostics.session = "invalid_or_expired";
        diagnostics.sessionIdPrefix = sessionId.slice(0, 8) + "...";
      }
    }

    // Check tenant + membership for the email
    const email = debugEmail || (diagnostics.session && typeof diagnostics.session === "object" ? (diagnostics.session as { email: string }).email : null);

    if (email) {
      const user = await getUserByEmail(email);
      diagnostics.userExists = !!user;
      if (user) {
        diagnostics.userId = user.id;
        diagnostics.userStatus = user.status;

        const userTenants = await getUserTenants(user.id);
        diagnostics.userTenants = userTenants.map((t) => ({
          id: t.id,
          slug: t.slug,
          name: t.name,
          role: t.role,
        }));

        const tenant = await getTenantBySlug("cosmic-reach-creative");
        diagnostics.tenantLookup = tenant
          ? { id: tenant.id, slug: tenant.slug, name: tenant.name, status: tenant.status, domain: tenant.domain }
          : "NOT_FOUND";

        if (tenant) {
          diagnostics.isMemberOfTenant = await isUserInTenant(user.id, tenant.id);
        }
      }
    }

    return NextResponse.json(diagnostics);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
