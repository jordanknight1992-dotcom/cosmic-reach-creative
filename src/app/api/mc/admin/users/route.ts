import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/mc-auth";
import {
  getAllUsers,
  deactivateUser,
  reactivateUser,
  deleteUserData,
  addToBlocklist,
  logAudit,
} from "@/lib/mc-db";

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;
  if (!sessionId) return null;

  const session = await validateSession(sessionId);
  if (!session || !session.user.is_super_admin) return null;

  return session;
}

export async function GET() {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { action, userId, email, reason } = await request.json();

  if (!action || !userId) {
    return NextResponse.json({ error: "Action and userId are required" }, { status: 400 });
  }

  // Prevent self-deactivation
  if (userId === session.user.id && (action === "deactivate" || action === "delete")) {
    return NextResponse.json({ error: "Cannot deactivate or delete your own account" }, { status: 400 });
  }

  switch (action) {
    case "deactivate":
      await deactivateUser(userId);
      await logAudit({
        user_id: session.user.id,
        action: "user_deactivated",
        resource: "mc_users",
        resource_id: String(userId),
      });
      return NextResponse.json({ success: true });

    case "reactivate":
      await reactivateUser(userId);
      await logAudit({
        user_id: session.user.id,
        action: "user_reactivated",
        resource: "mc_users",
        resource_id: String(userId),
      });
      return NextResponse.json({ success: true });

    case "delete":
      // Delete user data and optionally blocklist their email
      if (email && reason) {
        await addToBlocklist(email, reason, session.user.id);
      }
      await deleteUserData(userId);
      await logAudit({
        user_id: session.user.id,
        action: "user_deleted",
        resource: "mc_users",
        resource_id: String(userId),
        metadata: { email, reason, blocklisted: !!email },
      });
      return NextResponse.json({ success: true });

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}
