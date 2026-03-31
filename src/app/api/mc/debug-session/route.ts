import { NextResponse } from "next/server";
import { getSessionCookieName, validateSession } from "@/lib/mc-auth";
import { getTenantBySlug, isUserInTenant, getUserTenants } from "@/lib/mc-db";
import { cookies } from "next/headers";

/**
 * Temporary diagnostic endpoint — remove after debugging.
 * Returns session state, tenant lookup, and membership info.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session cookie found", cookieName: getSessionCookieName() });
    }

    const session = await validateSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session invalid or expired", sessionIdPrefix: sessionId.slice(0, 8) + "..." });
    }

    const tenantSlug = "cosmic-reach-creative";
    const tenant = await getTenantBySlug(tenantSlug);
    const userTenants = await getUserTenants(session.user.id);

    let isMember = false;
    if (tenant) {
      isMember = await isUserInTenant(session.user.id, tenant.id);
    }

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        fullName: session.user.full_name,
        isSuperAdmin: session.user.is_super_admin,
      },
      tenantLookup: tenant
        ? { id: tenant.id, slug: tenant.slug, name: tenant.name, status: tenant.status }
        : null,
      isMember,
      userTenants: userTenants.map((t) => ({ id: t.id, slug: t.slug, name: t.name, role: t.role })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
