import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import { saveMcTotpSecret, enableMcTotp, disableMcTotp, getUserById, logAudit } from "@/lib/mc-db";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

const ISSUER = "Mission Control";

/**
 * GET — Generate a new TOTP secret + QR code for enrollment
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ctx = await validateSession(sessionId);
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const totp = new OTPAuth.TOTP({
      issuer: ISSUER,
      label: ctx.user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: new OTPAuth.Secret({ size: 20 }),
    });

    const secret = totp.secret.base32;
    const otpauthUrl = totp.toString();
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
      width: 256,
      margin: 2,
      color: { dark: "#E8DFCF", light: "#101726" },
    });

    // Save secret (not yet enabled — user must verify first)
    await saveMcTotpSecret(ctx.user.id, secret);

    return NextResponse.json({ secret, qrDataUrl });
  } catch (err) {
    console.error("TOTP setup error:", err);
    return NextResponse.json({ error: "Failed to generate TOTP" }, { status: 500 });
  }
}

/**
 * POST — Verify code and enable TOTP, or disable TOTP
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const ctx = await validateSession(sessionId);
    if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action, code } = body;

    if (action === "enable") {
      const user = await getUserById(ctx.user.id);
      if (!user?.totp_secret) {
        return NextResponse.json({ error: "No TOTP secret found. Start setup first." }, { status: 400 });
      }

      const totp = new OTPAuth.TOTP({
        issuer: ISSUER,
        label: user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(user.totp_secret),
      });

      const delta = totp.validate({ token: code, window: 1 });
      if (delta === null) {
        return NextResponse.json({ error: "Invalid code. Try again." }, { status: 400 });
      }

      await enableMcTotp(ctx.user.id);
      await logAudit({
        user_id: ctx.user.id,
        action: "totp_enabled",
        resource: "account",
      });

      return NextResponse.json({ success: true, enabled: true });
    }

    if (action === "disable") {
      await disableMcTotp(ctx.user.id);
      await logAudit({
        user_id: ctx.user.id,
        action: "totp_disabled",
        resource: "account",
      });

      return NextResponse.json({ success: true, enabled: false });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("TOTP action error:", err);
    return NextResponse.json({ error: "Failed to process TOTP action" }, { status: 500 });
  }
}
