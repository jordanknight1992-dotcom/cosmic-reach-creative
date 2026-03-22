import { NextResponse } from "next/server";
import { getAdminPasswordHash } from "@/lib/db";
import { createHash } from "crypto";
import {
  isTotpEnabled,
  getTotpSecret,
  verifyTotpCode,
  generateTotpSecret,
} from "@/lib/totp";

async function sha256(text: string): Promise<string> {
  return createHash("sha256").update(text).digest("hex");
}

function makeSessionResponse(message: Record<string, unknown> = { success: true }) {
  const secret = process.env.SESSION_SECRET ?? "fallback-secret-change-me";
  const sessionToken = createHash("sha256").update(secret).digest("hex");

  const response = NextResponse.json(message);
  response.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
  return response;
}

export async function POST(request: Request) {
  const { password, totpCode } = await request.json();

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

  /* Verify password */
  const hash = await sha256(password);
  if (hash !== stored) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const totpEnabled = await isTotpEnabled();

  /* ── TOTP not yet set up (migration case) ── */
  if (!totpEnabled) {
    if (!totpCode) {
      /* Generate a new secret and send QR for first-time setup */
      const { secret, qrDataUrl } = await generateTotpSecret();
      return NextResponse.json({
        requireTotpSetup: true,
        totp: { secret, qrDataUrl },
      });
    }
    /* totpCode was provided — this shouldn't happen without a secret stored.
       Fall through to error below. */
    return NextResponse.json(
      { error: "Invalid verification code." },
      { status: 401 }
    );
  }

  /* ── TOTP is enabled ── */
  if (!totpCode) {
    /* Step 1: password correct, now ask for TOTP code */
    return NextResponse.json({ requireTotp: true });
  }

  /* Step 2: verify TOTP code */
  const secret = await getTotpSecret();
  if (!secret || !verifyTotpCode(secret, totpCode)) {
    return NextResponse.json(
      { error: "Invalid verification code." },
      { status: 401 }
    );
  }

  return makeSessionResponse();
}
