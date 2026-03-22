import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { getUserTenants } from "@/lib/mc-db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;

    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const ctx = await validateSession(sessionId);
    if (!ctx) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const tenants = await getUserTenants(ctx.user.id);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        full_name: ctx.user.full_name,
        is_super_admin: ctx.user.is_super_admin,
      },
      tenants: tenants.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        role: t.role,
        plan: (t as unknown as Record<string, unknown>).plan ?? "core",
      })),
      isImpersonation: ctx.isImpersonation,
    });
  } catch (err) {
    console.error("Session check error:", err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
