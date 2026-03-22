import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSession } from "@/lib/mc-db";
import { getSessionCookieName } from "@/lib/mc-auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;

    if (sessionId) {
      await deleteSession(sessionId);
    }

    cookieStore.delete(getSessionCookieName());

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ ok: true });
  }
}
