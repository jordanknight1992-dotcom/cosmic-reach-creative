import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/mc-auth";
import { getBlocklist, addToBlocklist, removeFromBlocklist, logAudit } from "@/lib/mc-db";

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

  const blocklist = await getBlocklist();
  return NextResponse.json({ blocklist });
}

export async function POST(request: Request) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { action, email, reason } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  if (action === "remove") {
    await removeFromBlocklist(email);
    await logAudit({
      user_id: session.user.id,
      action: "blocklist_remove",
      resource: "email_blocklist",
      metadata: { email },
    });
    return NextResponse.json({ success: true });
  }

  // Default: add to blocklist
  await addToBlocklist(email, reason || "admin_action", session.user.id);
  await logAudit({
    user_id: session.user.id,
    action: "blocklist_add",
    resource: "email_blocklist",
    metadata: { email, reason },
  });

  return NextResponse.json({ success: true });
}
