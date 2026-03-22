import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import {
  getTotpSecret as dbGetTotpSecret,
  saveTotpSecret as dbSaveTotpSecret,
  isTotpEnabled as dbIsTotpEnabled,
} from "@/lib/db";

const ISSUER = "Cosmic Reach Creative";
const ACCOUNT = "admin";

/**
 * Generate a new TOTP secret, otpauth URL, and QR code data URL.
 */
export async function generateTotpSecret(): Promise<{
  secret: string;
  otpauthUrl: string;
  qrDataUrl: string;
}> {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: ACCOUNT,
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

  return { secret, otpauthUrl, qrDataUrl };
}

/**
 * Verify a TOTP code against a base32 secret.
 * Allows a window of 1 (±30 seconds).
 */
export function verifyTotpCode(secret: string, code: string): boolean {
  const totp = new OTPAuth.TOTP({
    issuer: ISSUER,
    label: ACCOUNT,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  return delta !== null;
}

/* Re-export DB helpers for convenient single-import usage */
export const getTotpSecret = dbGetTotpSecret;
export const saveTotpSecret = dbSaveTotpSecret;
export const isTotpEnabled = dbIsTotpEnabled;
