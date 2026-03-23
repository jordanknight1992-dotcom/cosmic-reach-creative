import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import {
  getTenantMembers,
  getPendingInvitations,
  createTeamInvitation,
  revokeInvitation,
  updateMemberRole,
  removeMember,
  isUserInTenant,
  getTenantBySlug,
  getUserByEmail,
  addUserToTenant,
  acceptInvitation,
  getTeamInvitationByToken,
  logAudit,
} from "@/lib/mc-db";

/**
 * GET /api/mc/team?tenantSlug=xxx
 * Get team members and pending invitations
 */
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantSlug = request.nextUrl.searchParams.get("tenantSlug");
  if (!tenantSlug) return NextResponse.json({ error: "Tenant slug required" }, { status: 400 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
  if (!hasAccess && !ctx.user.is_super_admin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const [members, invitations] = await Promise.all([
    getTenantMembers(tenant.id),
    getPendingInvitations(tenant.id),
  ]);

  return NextResponse.json({
    members: members.map((m) => ({
      id: m.id,
      email: m.email,
      full_name: m.full_name,
      role: m.role,
      status: m.status,
      last_login_at: m.last_login_at,
    })),
    invitations: invitations.map((inv) => ({
      id: inv.id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      created_at: inv.created_at,
      expires_at: inv.expires_at,
    })),
  });
}

/**
 * POST /api/mc/team
 * Actions: invite, revoke_invite, update_role, remove_member, accept_invite
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action } = body;
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

  switch (action) {
    case "invite": {
      const { tenantSlug, email, role } = body;
      if (!tenantSlug || !email) {
        return NextResponse.json({ error: "Tenant and email required" }, { status: 400 });
      }

      const tenant = await getTenantBySlug(tenantSlug);
      if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

      // Only owners and admins can invite
      const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
      if (!hasAccess && !ctx.user.is_super_admin) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      // Generate invitation token
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const token = Array.from(tokenBytes).map((b) => b.toString(16).padStart(2, "0")).join("");

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7-day expiry

      const invitation = await createTeamInvitation({
        tenant_id: tenant.id,
        email: email.toLowerCase().trim(),
        role: role || "member",
        invited_by: ctx.user.id,
        token,
        expires_at: expiresAt,
      });

      await logAudit({
        user_id: ctx.user.id,
        tenant_id: tenant.id,
        action: "team_invite_sent",
        resource: "team_invitation",
        resource_id: String(invitation.id),
        metadata: { email, role: role || "member" },
        ip_address: ipAddress,
      });

      return NextResponse.json({
        invitation: {
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
          expires_at: invitation.expires_at,
        },
      });
    }

    case "accept_invite": {
      const { token } = body;
      if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

      const invitation = await getTeamInvitationByToken(token);
      if (!invitation) {
        return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 });
      }

      // Check if user email matches invitation
      if (ctx.user.email.toLowerCase() !== invitation.email.toLowerCase()) {
        return NextResponse.json({ error: "This invitation is for a different email address" }, { status: 403 });
      }

      // Add user to tenant
      await addUserToTenant(invitation.tenant_id, ctx.user.id, invitation.role);
      await acceptInvitation(token);

      await logAudit({
        user_id: ctx.user.id,
        tenant_id: invitation.tenant_id,
        action: "team_invite_accepted",
        resource: "team_invitation",
        resource_id: String(invitation.id),
        ip_address: ipAddress,
      });

      return NextResponse.json({ accepted: true, tenantId: invitation.tenant_id });
    }

    case "revoke_invite": {
      const { invitationId, tenantSlug } = body;
      if (!invitationId || !tenantSlug) {
        return NextResponse.json({ error: "Invitation ID and tenant required" }, { status: 400 });
      }

      const tenant = await getTenantBySlug(tenantSlug);
      if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

      await revokeInvitation(invitationId);

      await logAudit({
        user_id: ctx.user.id,
        tenant_id: tenant.id,
        action: "team_invite_revoked",
        resource: "team_invitation",
        resource_id: String(invitationId),
        ip_address: ipAddress,
      });

      return NextResponse.json({ revoked: true });
    }

    case "update_role": {
      const { tenantSlug, userId, role } = body;
      if (!tenantSlug || !userId || !role) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      if (!["owner", "admin", "member"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }

      const tenant = await getTenantBySlug(tenantSlug);
      if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

      await updateMemberRole(tenant.id, userId, role);

      await logAudit({
        user_id: ctx.user.id,
        tenant_id: tenant.id,
        action: "team_role_updated",
        resource: "tenant_user",
        resource_id: String(userId),
        metadata: { new_role: role },
        ip_address: ipAddress,
      });

      return NextResponse.json({ updated: true });
    }

    case "remove_member": {
      const { tenantSlug, userId } = body;
      if (!tenantSlug || !userId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      const tenant = await getTenantBySlug(tenantSlug);
      if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

      // Can't remove yourself
      if (userId === ctx.user.id) {
        return NextResponse.json({ error: "You cannot remove yourself" }, { status: 400 });
      }

      await removeMember(tenant.id, userId);

      await logAudit({
        user_id: ctx.user.id,
        tenant_id: tenant.id,
        action: "team_member_removed",
        resource: "tenant_user",
        resource_id: String(userId),
        ip_address: ipAddress,
      });

      return NextResponse.json({ removed: true });
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
