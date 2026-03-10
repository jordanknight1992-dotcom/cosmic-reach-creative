import { NextResponse } from "next/server";
import { getAdminPasswordHash } from "@/lib/db";
import { createHash } from "crypto";

async function sha256(text: string): Promise<string> {
  return createHash("sha256").update(text).digest("hex");
}

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  const stored = await getAdminPasswordHash();
  if (!stored) {
    return NextResponse.json(
      { error: "No admin account set up yet.", setup: true },
      { status: 403 }
    );
  }

  const hash = await sha256(password);
  if (hash !== stored) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const secret = process.env.SESSION_SECRET ?? "fallback-secret-change-me";
  const sessionToken = await sha256(secret);

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return response;
}
