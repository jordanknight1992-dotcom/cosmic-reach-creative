import { cookies } from "next/headers";
import {
  validateSession,
  getSessionCookieName,
  getCurrentSupportSession,
  isSuperUserEmail,
  type SessionContext,
} from "./mc-auth";
import {
  getUserTenants,
  getTenantBySlug,
  isUserInTenant,
  getAllTenants,
  type Tenant,
} from "./mc-db";
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
 * Require Super User access. Redirects if not super admin.
 */
export async function requireSuperUser(): Promise<SessionContext> {
  const session = await requireAuth();
  if (!session.user.is_super_admin || !isSuperUserEmail(session.user.email)) {
    redirect("/mission-control/login");
  }
  return session;
}

/**
 * Require authentication + tenant access. Used in [tenantSlug] layouts.
 * Now supports support mode for Super Users with active support sessions.
 */
export async function requireTenantAccess(
  tenantSlug: string
): Promise<SessionContext & { tenant: Tenant; tenantId: number }> {
  const session = await requireAuth();

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) {
    redirect("/mission-control/login");
  }

  // Check direct membership first
  const hasAccess = await isUserInTenant(session.user.id, tenant.id);

  if (hasAccess) {
    return {
      ...session,
      tenant,
      tenantId: tenant.id,
    };
  }

  // Super User support access path
  if (session.user.is_super_admin && isSuperUserEmail(session.user.email)) {
    const supportSession = await getCurrentSupportSession(session.user.id);
    if (supportSession && supportSession.tenant_id === tenant.id) {
      return {
        ...session,
        tenant,
        tenantId: tenant.id,
        isImpersonation: true,
        isSupportMode: true,
        supportSession,
      };
    }
    // Redirect to support console to start a session
    redirect("/mission-control/super");
  }

  redirect("/mission-control/login");
}

/**
 * Get user's tenants for workspace selection.
 * For Super Users, also returns all tenants with a flag.
 */
export async function getUserWorkspaces() {
  const session = await requireAuth();
  const userTenants = await getUserTenants(session.user.id);

  if (session.user.is_super_admin && isSuperUserEmail(session.user.email)) {
    const allTenants = await getAllTenants();
    return {
      ownTenants: userTenants,
      allTenants,
      isSuperUser: true,
    };
  }

  return {
    ownTenants: userTenants,
    allTenants: null,
    isSuperUser: false,
  };
}
