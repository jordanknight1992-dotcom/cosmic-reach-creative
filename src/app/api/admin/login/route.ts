import { NextResponse } from "next/server";
import { getAdminPasswordHash } from "@/lib/db";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import {
  isTotpEnabled,
  getTotpSecret,
  verifyTotpCode,
  generateTotpSecret,
} from "@/lib/totp";

function makeSessionResponse(message: Record<string, unknown> = { success: true }) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  const sessionToken = createHash("sha256").update(secret).digest("hex");

  const response = NextResponse.json(message);
  response.cookies.set("admin_session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days (was 30)
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

  /* Verify password (supports both bcrypt and legacy SHA256 hashes) */
  let passwordValid = false;
  if (stored.startsWith("$2")) {
    passwordValid = await bcrypt.compare(password, stored);
  } else {
    // Legacy SHA256 fallback
    const hash = createHash("sha256").update(password).digest("hex");
    passwordValid = hash === stored;
  }
  if (!passwordValid) {
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
    /* totpCode was provided -this shouldn't happen without a secret stored.
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
