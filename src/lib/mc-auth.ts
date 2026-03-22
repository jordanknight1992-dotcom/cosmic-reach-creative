import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserById,
  getSession,
  createSession,
  deleteSession,
  updateUserLogin,
  updateUserPassword,
  createPasswordResetToken,
  getPasswordResetToken,
  markResetTokenUsed,
  isUserInTenant,
  getTenantBySlug,
  logAudit,
  type McUser,
  type Tenant,
} from "./mc-db";

const SALT_ROUNDS = 12;
const SESSION_DURATION_DAYS = 30;
const SESSION_COOKIE = "mc_session";

/* ─── Password ─── */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/* ─── Session Token Generation ─── */

function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ─── Auth Flow ─── */

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: McUser; sessionId: string } | { user: McUser; requireTotp: true } | { error: string }> {
  const user = await getUserByEmail(email.toLowerCase().trim());
  if (!user) return { error: "Invalid email or password" };
  if (user.status !== "active") return { error: "Account is disabled" };

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return { error: "Invalid email or password" };

  // Check if TOTP is enabled — if so, require verification
  if (user.totp_enabled && user.totp_secret) {
    return { user, requireTotp: true };
  }

  // Create session
  const sessionId = generateSessionId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await createSession({
    id: sessionId,
    user_id: user.id,
    expires_at: expiresAt,
  });

  await updateUserLogin(user.id);

  return { user, sessionId };
}

/* ─── TOTP Verification + Session Creation ─── */

export async function verifyTotpAndCreateSession(
  userId: number,
  code: string
): Promise<{ sessionId: string } | { error: string }> {
  const user = await getUserById(userId);
  if (!user || !user.totp_secret) return { error: "Invalid request" };

  const { TOTP, Secret } = await import("otpauth");
  const totp = new TOTP({
    issuer: "Mission Control",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(user.totp_secret),
  });

  const delta = totp.validate({ token: code, window: 1 });
  if (delta === null) return { error: "Invalid verification code" };

  const sessionId = generateSessionId();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await createSession({
    id: sessionId,
    user_id: user.id,
    expires_at: expiresAt,
  });

  await updateUserLogin(user.id);
  return { sessionId };
}

/* ─── Password Reset ─── */

export async function requestPasswordReset(
  email: string
): Promise<{ token: string; user: McUser } | { error: string }> {
  const user = await getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    // Return success-like response to prevent email enumeration
    return { error: "not_found" };
  }

  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const token = Array.from(tokenBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

  await createPasswordResetToken(user.id, token, expiresAt);

  return { token, user };
}

export async function executePasswordReset(
  token: string,
  newPassword: string
): Promise<{ success: true } | { error: string }> {
  const resetToken = await getPasswordResetToken(token);
  if (!resetToken) return { error: "Invalid or expired reset link" };
  if (resetToken.used) return { error: "This reset link has already been used" };
  if (new Date() > resetToken.expires_at) return { error: "This reset link has expired" };

  const hash = await hashPassword(newPassword);
  await updateUserPassword(resetToken.user_id, hash);
  await markResetTokenUsed(token);

  return { success: true };
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: true } | { error: string }> {
  const user = await getUserById(userId);
  if (!user) return { error: "User not found" };

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) return { error: "Current password is incorrect" };

  const hash = await hashPassword(newPassword);
  await updateUserPassword(userId, hash);

  return { success: true };
}

/* ─── Session Validation ─── */

export interface SessionContext {
  user: McUser;
  tenant: Tenant | null;
  tenantId: number | null;
  isImpersonation: boolean;
  impersonatedBy: number | null;
}

export async function validateSession(
  sessionId: string
): Promise<SessionContext | null> {
  const session = await getSession(sessionId);
  if (!session) return null;

  const user = await getUserById(session.user_id);
  if (!user || user.status !== "active") return null;

  let tenant: Tenant | null = null;
  if (session.tenant_id) {
    const { getTenantById } = await import("./mc-db");
    tenant = await getTenantById(session.tenant_id);
  }

  return {
    user,
    tenant,
    tenantId: session.tenant_id,
    isImpersonation: session.is_impersonation,
    impersonatedBy: session.impersonated_by,
  };
}

/* ─── Tenant Access Check ─── */

export async function validateTenantAccess(
  sessionId: string,
  tenantSlug: string
): Promise<
  | { ctx: SessionContext & { tenant: Tenant; tenantId: number } }
  | { error: string; status: number }
> {
  const sessionCtx = await validateSession(sessionId);
  if (!sessionCtx) return { error: "Unauthorized", status: 401 };

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return { error: "Workspace not found", status: 404 };

  // Super admins can access any tenant
  if (!sessionCtx.user.is_super_admin) {
    const hasAccess = await isUserInTenant(sessionCtx.user.id, tenant.id);
    if (!hasAccess) return { error: "Access denied", status: 403 };
  }

  return {
    ctx: {
      ...sessionCtx,
      tenant,
      tenantId: tenant.id,
    },
  };
}

/* ─── Impersonation ─── */

export async function startImpersonation(
  adminUserId: number,
  tenantId: number,
  ipAddress?: string
): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2); // 2-hour limit

  await createSession({
    id: sessionId,
    user_id: adminUserId,
    tenant_id: tenantId,
    is_impersonation: true,
    impersonated_by: adminUserId,
    expires_at: expiresAt,
  });

  await logAudit({
    user_id: adminUserId,
    tenant_id: tenantId,
    action: "impersonation_start",
    ip_address: ipAddress,
  });

  return sessionId;
}

export async function endImpersonation(
  sessionId: string,
  adminUserId: number,
  tenantId: number,
  ipAddress?: string
) {
  await deleteSession(sessionId);
  await logAudit({
    user_id: adminUserId,
    tenant_id: tenantId,
    action: "impersonation_end",
    ip_address: ipAddress,
  });
}

/* ─── Encryption for tenant credentials ─── */

const ENCRYPTION_ALGO = "AES-GCM";
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_SALT = "mc-credential-encryption-v1"; // Static salt (key material is already high-entropy env secret)

function getEncryptionKey(): string {
  const key = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (!key) throw new Error("CREDENTIALS_ENCRYPTION_KEY is not set");
  return key;
}

async function deriveKey(usage: KeyUsage[]): Promise<CryptoKey> {
  const keyMaterial = getEncryptionKey();
  const encoder = new TextEncoder();

  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(keyMaterial),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(PBKDF2_SALT),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: ENCRYPTION_ALGO, length: 256 },
    false,
    usage
  );
}

export async function encryptCredential(plaintext: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await deriveKey(["encrypt"]);

  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encrypted = await crypto.subtle.encrypt(
    { name: ENCRYPTION_ALGO, iv },
    key,
    encoder.encode(plaintext)
  );

  // Combine IV + ciphertext, encode as base64
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

export async function decryptCredential(ciphertext: string): Promise<string> {
  const key = await deriveKey(["decrypt"]);

  const combined = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, IV_LENGTH);
  const data = combined.slice(IV_LENGTH);

  const decrypted = await crypto.subtle.decrypt(
    { name: ENCRYPTION_ALGO, iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

/* ─── Credential Resolver (tenant DB first, env var fallback) ─── */

const ENV_VAR_MAP: Record<string, () => string | undefined> = {
  google_calendar: () => process.env.GOOGLE_REFRESH_TOKEN,
  google_analytics: () => process.env.GA4_PROPERTY_ID,
  pdl: () => process.env.PDL_API_KEY,
  resend: () => process.env.RESEND_API_KEY,
  openai: () => process.env.OPENAI_API_KEY,
};

/**
 * Returns the list of providers available to a tenant.
 * Includes both DB-stored credentials and env-var-configured providers.
 * Each entry includes the source ("tenant" | "platform").
 */
export function getEnvConfiguredProviders(): { provider: string; source: "platform" }[] {
  return Object.entries(ENV_VAR_MAP)
    .filter(([, getter]) => !!getter())
    .map(([provider]) => ({ provider, source: "platform" as const }));
}

/**
 * Resolves a credential for a provider:
 * 1. Check tenant_credentials DB (decrypts)
 * 2. Fall back to env var
 * Returns null if neither exists.
 */
export async function resolveCredential(
  tenantId: number,
  provider: string
): Promise<{ value: string; source: "tenant" | "platform" } | null> {
  // 1. Try tenant-specific credential from DB
  try {
    const { getCredential } = await import("./mc-db");
    const row = await getCredential(tenantId, provider);
    if (row) {
      const value = await decryptCredential(row.credentials_encrypted);
      return { value, source: "tenant" };
    }
  } catch {
    // DB or decryption failure -- fall through to env var
  }

  // 2. Fall back to platform env var
  const envGetter = ENV_VAR_MAP[provider];
  const envValue = envGetter?.();
  if (envValue) {
    return { value: envValue, source: "platform" };
  }

  return null;
}

/* ─── Cookie helpers ─── */

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function getSessionCookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: maxAge ?? SESSION_DURATION_DAYS * 24 * 60 * 60,
  };
}
