import { NextResponse } from "next/server";
import { getAdminPasswordHash, setAdminPasswordHash } from "@/lib/db";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import {
  generateTotpSecret,
  verifyTotpCode,
  saveTotpSecret,
} from "@/lib/totp";

function makeSessionResponse(message: Record<string, unknown> = { success: true }) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  const sessionCookieValue = createHash("sha256").update(secret).digest("hex");

  const response = NextResponse.json(message);
  response.cookies.set("admin_session", sessionCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}

export async function POST(request: Request) {
  const { password, setupToken, totpCode, totpSecret, confirmSetup } =
    await request.json();

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const existing = await getAdminPasswordHash();

  /* ── Confirm TOTP setup (step 2) ── */
  if (confirmSetup && totpCode && totpSecret) {
    /* Password must still be valid */
    if (existing) {
      let valid = false;
      if (existing.startsWith("$2")) {
        valid = await bcrypt.compare(password, existing);
      } else {
        valid = createHash("sha256").update(password).digest("hex") === existing;
      }
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid password." },
          { status: 401 }
        );
      }
    }

    /* Verify the TOTP code against the provided secret */
    if (!verifyTotpCode(totpSecret, totpCode)) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 401 }
      );
    }

    /* If this is first-time setup, store the password now (bcrypt) */
    if (!existing) {
      const hash = await bcrypt.hash(password, 12);
      await setAdminPasswordHash(hash);
    }

    /* Persist TOTP secret permanently */
    await saveTotpSecret(totpSecret);

    return makeSessionResponse({ success: true });
  }

  /* ── Initial setup (step 1) ── */
  if (existing) {
    /* Require the current password to change it */
    let tokenValid = false;
    if (existing.startsWith("$2")) {
      tokenValid = await bcrypt.compare(setupToken ?? "", existing);
    } else {
      tokenValid = createHash("sha256").update(setupToken ?? "").digest("hex") === existing;
    }
    if (!tokenValid) {
      return NextResponse.json(
        { error: "Admin account already exists." },
        { status: 403 }
      );
    }
  }

  /* For first-time setup, store password with bcrypt */
  if (!existing) {
    const hash = await bcrypt.hash(password, 12);
    await setAdminPasswordHash(hash);
  }

  /* Generate TOTP secret and QR code */
  const totp = await generateTotpSecret();

  return NextResponse.json({
    setup: true,
    totp: { secret: totp.secret, qrDataUrl: totp.qrDataUrl },
  });
}
