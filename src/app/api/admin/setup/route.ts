import { NextResponse } from "next/server";
import { getAdminPasswordHash, setAdminPasswordHash } from "@/lib/db";
import { createHash } from "crypto";
import {
  generateTotpSecret,
  verifyTotpCode,
  saveTotpSecret,
} from "@/lib/totp";

function makeSessionResponse(message: Record<string, unknown> = { success: true }) {
  const secret = process.env.SESSION_SECRET ?? "fallback-secret-change-me";
  const sessionCookieValue = createHash("sha256").update(secret).digest("hex");

  const response = NextResponse.json(message);
  response.cookies.set("admin_session", sessionCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
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
      const hash = createHash("sha256").update(password).digest("hex");
      if (hash !== existing) {
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

    /* If this is first-time setup, store the password now */
    if (!existing) {
      const hash = createHash("sha256").update(password).digest("hex");
      await setAdminPasswordHash(hash);
    }

    /* Persist TOTP secret permanently */
    await saveTotpSecret(totpSecret);

    return makeSessionResponse({ success: true });
  }

  /* ── Initial setup (step 1) ── */
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

  /* For first-time setup, store password and generate TOTP */
  if (!existing) {
    const hash = createHash("sha256").update(password).digest("hex");
    await setAdminPasswordHash(hash);
  }

  /* Generate TOTP secret and QR code */
  const totp = await generateTotpSecret();

  return NextResponse.json({
    setup: true,
    totp: { secret: totp.secret, qrDataUrl: totp.qrDataUrl },
  });
}
