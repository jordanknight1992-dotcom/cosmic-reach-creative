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
  createSupportSession,
  getActiveSupportSession,
  getActiveSupportSessionForUser,
  endSupportSession as dbEndSupportSession,
  expireSupportSessions,
  getTenantSupportAccess,
  type McUser,
  type Tenant,
  type SupportSession,
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
  supportSession: SupportSession | null;
  isSupportMode: boolean;
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

  // Check for active support session
  let supportSession: SupportSession | null = null;
  if (user.is_super_admin && isSuperUserEmail(user.email)) {
    supportSession = await getCurrentSupportSession(user.id);
  }

  return {
    user,
    tenant,
    tenantId: session.tenant_id,
    isImpersonation: session.is_impersonation,
    impersonatedBy: session.impersonated_by,
    supportSession,
    isSupportMode: !!supportSession,
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

  // Check if user is a member of this tenant
  const isMember = await isUserInTenant(sessionCtx.user.id, tenant.id);

  if (!isMember) {
    // Super admins can access via active support session
    if (sessionCtx.user.is_super_admin && isSuperUserEmail(sessionCtx.user.email)) {
      // Check for active support session for this tenant
      const supportSession = await getCurrentSupportSession(sessionCtx.user.id);
      if (supportSession && supportSession.tenant_id === tenant.id) {
        return {
          ctx: {
            ...sessionCtx,
            tenant,
            tenantId: tenant.id,
            isImpersonation: true,
            isSupportMode: true,
            supportSession,
          },
        };
      }
      // Super admin without active support session for this tenant
      return { error: "Support session required. Start a support session from the support console.", status: 403 };
    }
    return { error: "Access denied", status: 403 };
  }

  return {
    ctx: {
      ...sessionCtx,
      tenant,
      tenantId: tenant.id,
    },
  };
}

/* ─── Super User Constants ─── */

const SUPER_USER_EMAIL = "jordan@cosmicreachcreative.com";
const SUPPORT_SESSION_DURATION_MINUTES = 30;
const STEP_UP_WINDOW_SECONDS = 300; // 5 minutes - step-up auth valid for this long

/**
 * Check if a user is the designated Super User.
 * Only jordan@cosmicreachcreative.com can hold this role.
 */
export function isSuperUserEmail(email: string): boolean {
  return email.toLowerCase().trim() === SUPER_USER_EMAIL;
}

/**
 * Enforce that is_super_admin can only be true for the designated Super User email.
 * Called server-side to prevent tampering.
 */
export async function enforceSuperUserIntegrity(userId: number): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user) return false;
  if (user.is_super_admin && !isSuperUserEmail(user.email)) {
    // Strip unauthorized super_admin flag
    const { getSQL } = await import("./mc-db");
    const sql = getSQL();
    await sql`UPDATE mc_users SET is_super_admin = FALSE WHERE id = ${userId}`;
    return false;
  }
  return user.is_super_admin;
}

/* ─── Step-Up Authentication ─── */

// In-memory store for step-up verification timestamps (per user)
// In production, this should be stored in the session or a short-lived DB record
const stepUpVerifications = new Map<number, number>();

/**
 * Verify TOTP code for step-up authentication.
 * Returns true if the code is valid. Records the verification timestamp.
 */
export async function verifyStepUp(userId: number, totpCode: string): Promise<boolean> {
  const user = await getUserById(userId);
  if (!user || !user.totp_secret || !user.totp_enabled) return false;

  const { TOTP, Secret } = await import("otpauth");
  const totp = new TOTP({
    issuer: "Mission Control",
    label: user.email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(user.totp_secret),
  });

  const delta = totp.validate({ token: totpCode, window: 1 });
  if (delta === null) return false;

  // Record step-up verification time
  stepUpVerifications.set(userId, Date.now());
  return true;
}

/**
 * Check if a recent step-up verification exists (within the window).
 */
export function hasRecentStepUp(userId: number): boolean {
  const lastVerified = stepUpVerifications.get(userId);
  if (!lastVerified) return false;
  const elapsed = (Date.now() - lastVerified) / 1000;
  return elapsed < STEP_UP_WINDOW_SECONDS;
}

/**
 * Clear step-up verification for a user.
 */
export function clearStepUp(userId: number): void {
  stepUpVerifications.delete(userId);
}

/* ─── Support Access System ─── */

/**
 * Validate that a Super User can enter support mode for a tenant.
 * Checks:
 * 1. User is the designated Super User
 * 2. User has is_super_admin flag
 * 3. User has TOTP enabled (MFA required)
 * 4. Step-up verification is recent
 * 5. Tenant has support access enabled
 */
export async function validateSupportEntry(
  userId: number,
  tenantId: number
): Promise<{ allowed: true } | { allowed: false; reason: string }> {
  const user = await getUserById(userId);
  if (!user) return { allowed: false, reason: "User not found" };

  // Must be the designated Super User email
  if (!isSuperUserEmail(user.email)) {
    return { allowed: false, reason: "Only the designated support account can use support access" };
  }

  // Must have super_admin flag
  if (!user.is_super_admin) {
    return { allowed: false, reason: "Super admin privileges required" };
  }

  // Must have TOTP/MFA enabled
  if (!user.totp_enabled || !user.totp_secret) {
    return { allowed: false, reason: "Two-factor authentication must be enabled for support access" };
  }

  // Must have recent step-up verification
  if (!hasRecentStepUp(userId)) {
    return { allowed: false, reason: "step_up_required" };
  }

  // Tenant must allow support access
  const supportEnabled = await getTenantSupportAccess(tenantId);
  if (!supportEnabled) {
    return { allowed: false, reason: "This workspace has disabled support access" };
  }

  // Expire any stale sessions
  await expireSupportSessions();

  return { allowed: true };
}

/**
 * Start a support session for a Super User entering a customer workspace.
 * Creates a time-limited support session and logs the event.
 */
export async function startSupportAccess(data: {
  userId: number;
  tenantId: number;
  reason: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<SupportSession> {
  const sessionId = generateSessionId();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + SUPPORT_SESSION_DURATION_MINUTES);

  const session = await createSupportSession({
    id: sessionId,
    user_id: data.userId,
    tenant_id: data.tenantId,
    reason: data.reason,
    ip_address: data.ipAddress,
    user_agent: data.userAgent,
    expires_at: expiresAt,
  });

  // Audit log
  await logAudit({
    user_id: data.userId,
    tenant_id: data.tenantId,
    action: "support_access_start",
    resource: "support_session",
    resource_id: sessionId,
    metadata: { reason: data.reason, expires_at: expiresAt.toISOString() },
    ip_address: data.ipAddress,
    user_agent: data.userAgent,
  });

  // Clear step-up verification after use (one-time use)
  clearStepUp(data.userId);

  return session;
}

/**
 * End an active support session.
 */
export async function endSupportAccess(
  supportSessionId: string,
  userId: number,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const session = await getActiveSupportSession(supportSessionId);
  if (!session) return;

  await dbEndSupportSession(supportSessionId, "manual");

  await logAudit({
    user_id: userId,
    tenant_id: session.tenant_id,
    action: "support_access_end",
    resource: "support_session",
    resource_id: supportSessionId,
    metadata: { reason: session.reason, ended_reason: "manual" },
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

/**
 * Get current active support session for a user, if any.
 * Also handles expiration of stale sessions.
 */
export async function getCurrentSupportSession(userId: number): Promise<SupportSession | null> {
  await expireSupportSessions();
  return getActiveSupportSessionForUser(userId);
}

/* ─── Legacy impersonation (kept for backward compat, delegates to support access) ─── */

export async function startImpersonation(
  adminUserId: number,
  tenantId: number,
  ipAddress?: string
): Promise<string> {
  const session = await startSupportAccess({
    userId: adminUserId,
    tenantId,
    reason: "Legacy support access",
    ipAddress,
  });
  return session.id;
}

export async function endImpersonation(
  sessionId: string,
  adminUserId: number,
  tenantId: number,
  ipAddress?: string
) {
  await endSupportAccess(sessionId, adminUserId, ipAddress);
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
  search_console: () => process.env.SEARCH_CONSOLE_SITE_URL,
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
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAge ?? SESSION_DURATION_DAYS * 24 * 60 * 60,
  };
}
