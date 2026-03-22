import { cookies } from "next/headers";
import { validateSession, getSessionCookieName, type SessionContext } from "./mc-auth";
import { getUserTenants, getTenantBySlug, isUserInTenant, type Tenant } from "./mc-db";
import { redirect } from "next/navigation";

/**
 * Get the current session from server components.
 * Returns null if not authenticated.
 */
export async function getServerSession(): Promise<SessionContext | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(getSessionCookieName())?.value;
  if (!sessionId) return null;
  return validateSession(sessionId);
}

/**
 * Require authentication. Redirects to login if not authenticated.
 */
export async function requireAuth(): Promise<SessionContext> {
  const session = await getServerSession();
  if (!session) {
    redirect("/mission-control/login");
  }
  return session;
}

/**
 * Require authentication + tenant access. Used in [tenantSlug] layouts.
 */
export async function requireTenantAccess(
  tenantSlug: string
): Promise<SessionContext & { tenant: Tenant; tenantId: number }> {
  const session = await requireAuth();

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) {
    redirect("/mission-control/login");
  }

  // Super admins can access any tenant
  if (!session.user.is_super_admin) {
    const hasAccess = await isUserInTenant(session.user.id, tenant.id);
    if (!hasAccess) {
      redirect("/mission-control/login");
    }
  }

  return {
    ...session,
    tenant,
    tenantId: tenant.id,
  };
}

/**
 * Get user's tenants for workspace selection
 */
export async function getUserWorkspaces() {
  const session = await requireAuth();
  return getUserTenants(session.user.id);
}
