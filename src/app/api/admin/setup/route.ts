import { NextResponse } from "next/server";
import { getAdminPasswordHash, setAdminPasswordHash } from "@/lib/db";
import { createHash } from "crypto";
import { createHmac } from "crypto";

export async function POST(request: Request) {
  const { password, setupToken } = await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  /* Only allow setup if no password exists yet, or the setup token matches */
  const existing = await getAdminPasswordHash();
  if (existing) {
    /* Require the current password to change it */
    const currentPasswordHash = createHash("sha256")
      .update(setupToken ?? "")
      .digest("hex");
    if (currentPasswordHash !== existing) {
      return NextResponse.json(
        { error: "Admin account already exists." },
        { status: 403 }
      );
    }
  }

  const hash = createHash("sha256").update(password).digest("hex");
  await setAdminPasswordHash(hash);

  /* Auto-login after setup */
  const secret = process.env.SESSION_SECRET ?? "fallback-secret-change-me";
  const sessionToken = createHmac("sha256", secret).update("session").digest("hex");
  const sessionCookieValue = createHash("sha256").update(secret).digest("hex");

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", sessionCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
