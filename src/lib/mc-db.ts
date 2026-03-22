import { neon } from "@neondatabase/serverless";

/* ─── Connection ─── */

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export { getSQL };

/* ─── Schema ─── */

let _tablesReady: Promise<void> | null = null;

export async function ensureMcTables() {
  if (_tablesReady) return _tablesReady;
  _tablesReady = _createTables();
  return _tablesReady;
}

async function _createTables() {
  const sql = getSQL();

  /* ── Tenants (workspaces) ── */
  await sql`
    CREATE TABLE IF NOT EXISTS tenants (
      id           SERIAL PRIMARY KEY,
      name         TEXT NOT NULL,
      slug         TEXT NOT NULL UNIQUE,
      domain       TEXT,
      industry     TEXT,
      timezone     TEXT DEFAULT 'America/Chicago',
      logo_url     TEXT,
      plan         TEXT DEFAULT 'core',
      max_users    INTEGER DEFAULT 1,
      status       TEXT DEFAULT 'active',
      onboarding_completed BOOLEAN DEFAULT FALSE,
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Users ── */
  await sql`
    CREATE TABLE IF NOT EXISTS mc_users (
      id            SERIAL PRIMARY KEY,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name     TEXT NOT NULL,
      totp_secret   TEXT,
      totp_enabled  BOOLEAN DEFAULT FALSE,
      is_super_admin BOOLEAN DEFAULT FALSE,
      status        TEXT DEFAULT 'active',
      last_login_at TIMESTAMPTZ,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Tenant membership ── */
  await sql`
    CREATE TABLE IF NOT EXISTS tenant_users (
      id         SERIAL PRIMARY KEY,
      tenant_id  INTEGER REFERENCES tenants(id) NOT NULL,
      user_id    INTEGER REFERENCES mc_users(id) NOT NULL,
      role       TEXT DEFAULT 'owner',
      status     TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(tenant_id, user_id)
    )
  `;

  /* ── Sessions ── */
  await sql`
    CREATE TABLE IF NOT EXISTS mc_sessions (
      id          TEXT PRIMARY KEY,
      user_id     INTEGER REFERENCES mc_users(id) NOT NULL,
      tenant_id   INTEGER REFERENCES tenants(id),
      is_impersonation BOOLEAN DEFAULT FALSE,
      impersonated_by  INTEGER REFERENCES mc_users(id),
      expires_at  TIMESTAMPTZ NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Encrypted tenant credentials ── */
  await sql`
    CREATE TABLE IF NOT EXISTS tenant_credentials (
      id          SERIAL PRIMARY KEY,
      tenant_id   INTEGER REFERENCES tenants(id) NOT NULL,
      provider    TEXT NOT NULL,
      credentials_encrypted TEXT NOT NULL,
      metadata    JSONB,
      status      TEXT DEFAULT 'active',
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(tenant_id, provider)
    )
  `;

  /* ── Onboarding progress ── */
  await sql`
    CREATE TABLE IF NOT EXISTS onboarding_progress (
      id         SERIAL PRIMARY KEY,
      tenant_id  INTEGER REFERENCES tenants(id) NOT NULL UNIQUE,
      steps      JSONB DEFAULT '{}',
      current_step TEXT DEFAULT 'workspace',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Audit logs (for super admin + security) ── */
  await sql`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER REFERENCES mc_users(id),
      tenant_id   INTEGER REFERENCES tenants(id),
      action      TEXT NOT NULL,
      resource    TEXT,
      resource_id TEXT,
      metadata    JSONB,
      ip_address  TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Password reset tokens ── */
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER REFERENCES mc_users(id) NOT NULL,
      token      TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used       BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Email blocklist (opt-out / GDPR) ── */
  await sql`
    CREATE TABLE IF NOT EXISTS email_blocklist (
      id         SERIAL PRIMARY KEY,
      email      TEXT NOT NULL UNIQUE,
      reason     TEXT DEFAULT 'user_request',
      blocked_by INTEGER REFERENCES mc_users(id),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Tenant goals & voice (for email generation) ── */
  await sql`
    CREATE TABLE IF NOT EXISTS tenant_goals (
      id           SERIAL PRIMARY KEY,
      tenant_id    INTEGER REFERENCES tenants(id) NOT NULL UNIQUE,
      business_name TEXT,
      business_description TEXT,
      target_audience TEXT,
      brand_voice   TEXT,
      key_offers    TEXT,
      goals         JSONB DEFAULT '[]',
      cta_url       TEXT,
      cta_label     TEXT DEFAULT 'Book a call',
      sender_name   TEXT,
      sender_title  TEXT,
      avoid_phrases TEXT,
      example_tone  TEXT,
      updated_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Indexes ── */
  await sql`CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mc_sessions_user ON mc_sessions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mc_sessions_expires ON mc_sessions(expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenant_credentials_tenant ON tenant_credentials(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug)`;

  /* ── Add tenant_id to existing CRM tables (idempotent) ── */
  await sql`ALTER TABLE companies ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE activities ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE email_drafts ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE suppressions ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE notes ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;
  await sql`ALTER TABLE blackout_dates ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id)`;

  /* ── Tenant-scoped indexes for CRM tables ── */
  await sql`CREATE INDEX IF NOT EXISTS idx_companies_tenant ON companies(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_contacts_tenant ON contacts(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activities_tenant ON activities(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_bookings_tenant ON bookings(tenant_id)`;
}

/* ─── Types ─── */

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string | null;
  industry: string | null;
  timezone: string;
  logo_url: string | null;
  status: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface McUser {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  totp_secret: string | null;
  totp_enabled: boolean;
  is_super_admin: boolean;
  status: string;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: number;
  tenant_id: number;
  user_id: number;
  role: string;
  status: string;
  created_at: string;
}

export interface McSession {
  id: string;
  user_id: number;
  tenant_id: number | null;
  is_impersonation: boolean;
  impersonated_by: number | null;
  expires_at: string;
  created_at: string;
}

/* ─── Tenant Operations ─── */

export async function createTenant(data: {
  name: string;
  slug: string;
  domain?: string;
  industry?: string;
  timezone?: string;
}): Promise<Tenant> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO tenants (name, slug, domain, industry, timezone)
    VALUES (
      ${data.name},
      ${data.slug},
      ${data.domain ?? null},
      ${data.industry ?? null},
      ${data.timezone ?? "America/Chicago"}
    )
    RETURNING *
  `;
  return rows[0] as unknown as Tenant;
}

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM tenants WHERE slug = ${slug} AND status = 'active'
  `;
  return (rows[0] as unknown as Tenant) ?? null;
}

export async function getTenantById(id: number): Promise<Tenant | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM tenants WHERE id = ${id}
  `;
  return (rows[0] as unknown as Tenant) ?? null;
}

export async function getAllTenants(): Promise<Tenant[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM tenants ORDER BY created_at DESC
  `;
  return rows as unknown as Tenant[];
}

/* ─── User Operations ─── */

export async function createUser(data: {
  email: string;
  password_hash: string;
  full_name: string;
  is_super_admin?: boolean;
}): Promise<McUser> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO mc_users (email, password_hash, full_name, is_super_admin)
    VALUES (
      ${data.email},
      ${data.password_hash},
      ${data.full_name},
      ${data.is_super_admin ?? false}
    )
    RETURNING *
  `;
  return rows[0] as unknown as McUser;
}

export async function getUserByEmail(email: string): Promise<McUser | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM mc_users WHERE email = ${email} AND status = 'active'
  `;
  return (rows[0] as unknown as McUser) ?? null;
}

export async function getUserById(id: number): Promise<McUser | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM mc_users WHERE id = ${id}
  `;
  return (rows[0] as unknown as McUser) ?? null;
}

export async function updateUserLogin(userId: number) {
  const sql = getSQL();
  await sql`
    UPDATE mc_users SET last_login_at = NOW() WHERE id = ${userId}
  `;
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const sql = getSQL();
  await sql`
    UPDATE mc_users SET password_hash = ${passwordHash}, updated_at = NOW() WHERE id = ${userId}
  `;
}

/* ─── TOTP 2FA ─── */

export async function saveMcTotpSecret(userId: number, secret: string) {
  const sql = getSQL();
  await sql`UPDATE mc_users SET totp_secret = ${secret}, updated_at = NOW() WHERE id = ${userId}`;
}

export async function enableMcTotp(userId: number) {
  const sql = getSQL();
  await sql`UPDATE mc_users SET totp_enabled = TRUE, updated_at = NOW() WHERE id = ${userId}`;
}

export async function disableMcTotp(userId: number) {
  const sql = getSQL();
  await sql`UPDATE mc_users SET totp_enabled = FALSE, totp_secret = NULL, updated_at = NOW() WHERE id = ${userId}`;
}

/* ─── Password Reset Tokens ─── */

export async function createPasswordResetToken(userId: number, token: string, expiresAt: Date) {
  await ensureMcTables();
  const sql = getSQL();
  // Invalidate any existing tokens for this user
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE user_id = ${userId} AND used = FALSE`;
  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `;
}

export async function getPasswordResetToken(token: string): Promise<{ user_id: number; expires_at: Date; used: boolean } | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT user_id, expires_at, used FROM password_reset_tokens WHERE token = ${token}
  `;
  if (!rows[0]) return null;
  const row = rows[0] as unknown as { user_id: number; expires_at: string; used: boolean };
  return { user_id: row.user_id, expires_at: new Date(row.expires_at), used: row.used };
}

export async function markResetTokenUsed(token: string) {
  const sql = getSQL();
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE token = ${token}`;
}

/* ─── Tenant Membership ─── */

export async function addUserToTenant(
  tenantId: number,
  userId: number,
  role: string = "owner"
): Promise<TenantUser> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO tenant_users (tenant_id, user_id, role)
    VALUES (${tenantId}, ${userId}, ${role})
    ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = ${role}
    RETURNING *
  `;
  return rows[0] as unknown as TenantUser;
}

export async function getUserTenants(userId: number): Promise<(Tenant & { role: string })[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT t.*, tu.role
    FROM tenants t
    JOIN tenant_users tu ON tu.tenant_id = t.id
    WHERE tu.user_id = ${userId} AND tu.status = 'active' AND t.status = 'active'
    ORDER BY t.name ASC
  `;
  return rows as unknown as (Tenant & { role: string })[];
}

export async function isUserInTenant(userId: number, tenantId: number): Promise<boolean> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT 1 FROM tenant_users
    WHERE user_id = ${userId} AND tenant_id = ${tenantId} AND status = 'active'
    LIMIT 1
  `;
  return rows.length > 0;
}

/* ─── Sessions ─── */

export async function createSession(data: {
  id: string;
  user_id: number;
  tenant_id?: number;
  is_impersonation?: boolean;
  impersonated_by?: number;
  expires_at: Date;
}): Promise<McSession> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO mc_sessions (id, user_id, tenant_id, is_impersonation, impersonated_by, expires_at)
    VALUES (
      ${data.id},
      ${data.user_id},
      ${data.tenant_id ?? null},
      ${data.is_impersonation ?? false},
      ${data.impersonated_by ?? null},
      ${data.expires_at.toISOString()}
    )
    RETURNING *
  `;
  return rows[0] as unknown as McSession;
}

export async function getSession(sessionId: string): Promise<McSession | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM mc_sessions
    WHERE id = ${sessionId} AND expires_at > NOW()
  `;
  return (rows[0] as unknown as McSession) ?? null;
}

export async function deleteSession(sessionId: string) {
  const sql = getSQL();
  await sql`DELETE FROM mc_sessions WHERE id = ${sessionId}`;
}

export async function deleteUserSessions(userId: number) {
  const sql = getSQL();
  await sql`DELETE FROM mc_sessions WHERE user_id = ${userId}`;
}

/* ─── Encrypted Credentials ─── */

export async function saveCredential(
  tenantId: number,
  provider: string,
  encryptedData: string,
  metadata?: Record<string, unknown>
) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO tenant_credentials (tenant_id, provider, credentials_encrypted, metadata)
    VALUES (${tenantId}, ${provider}, ${encryptedData}, ${metadata ? JSON.stringify(metadata) : null})
    ON CONFLICT (tenant_id, provider) DO UPDATE SET
      credentials_encrypted = ${encryptedData},
      metadata = ${metadata ? JSON.stringify(metadata) : null},
      updated_at = NOW()
  `;
}

export async function getCredential(
  tenantId: number,
  provider: string
): Promise<{ credentials_encrypted: string; metadata: Record<string, unknown> | null } | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT credentials_encrypted, metadata
    FROM tenant_credentials
    WHERE tenant_id = ${tenantId} AND provider = ${provider} AND status = 'active'
  `;
  if (!rows[0]) return null;
  return rows[0] as unknown as {
    credentials_encrypted: string;
    metadata: Record<string, unknown> | null;
  };
}

export async function getCredentialProviders(tenantId: number): Promise<string[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT provider FROM tenant_credentials
    WHERE tenant_id = ${tenantId} AND status = 'active'
  `;
  return rows.map((r) => r.provider as string);
}

/* ─── Onboarding ─── */

export async function getOnboardingProgress(tenantId: number) {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM onboarding_progress WHERE tenant_id = ${tenantId}
  `;
  if (!rows[0]) {
    // Create default progress
    const defaultRows = await sql`
      INSERT INTO onboarding_progress (tenant_id, steps, current_step)
      VALUES (${tenantId}, '{}', 'workspace')
      RETURNING *
    `;
    return defaultRows[0] as unknown as {
      tenant_id: number;
      steps: Record<string, unknown>;
      current_step: string;
    };
  }
  return rows[0] as unknown as {
    tenant_id: number;
    steps: Record<string, unknown>;
    current_step: string;
  };
}

export async function updateOnboardingProgress(
  tenantId: number,
  steps: Record<string, unknown>,
  currentStep: string
) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    UPDATE onboarding_progress
    SET steps = ${JSON.stringify(steps)}, current_step = ${currentStep}, updated_at = NOW()
    WHERE tenant_id = ${tenantId}
  `;
}

/* ─── Audit Logs ─── */

export async function logAudit(data: {
  user_id: number;
  tenant_id?: number;
  action: string;
  resource?: string;
  resource_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
}) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO audit_logs (user_id, tenant_id, action, resource, resource_id, metadata, ip_address)
    VALUES (
      ${data.user_id},
      ${data.tenant_id ?? null},
      ${data.action},
      ${data.resource ?? null},
      ${data.resource_id ?? null},
      ${data.metadata ? JSON.stringify(data.metadata) : null},
      ${data.ip_address ?? null}
    )
  `;
}

/* ─── Admin: User Management ─── */

export async function getAllUsers(): Promise<(McUser & { tenant_count: number })[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT u.*, COALESCE(tc.cnt, 0)::int AS tenant_count
    FROM mc_users u
    LEFT JOIN (SELECT user_id, COUNT(*)::int AS cnt FROM tenant_users GROUP BY user_id) tc ON tc.user_id = u.id
    ORDER BY u.created_at DESC
  `;
  return rows as unknown as (McUser & { tenant_count: number })[];
}

export async function deactivateUser(userId: number) {
  const sql = getSQL();
  await sql`UPDATE mc_users SET status = 'inactive', updated_at = NOW() WHERE id = ${userId}`;
  await sql`DELETE FROM mc_sessions WHERE user_id = ${userId}`;
}

export async function reactivateUser(userId: number) {
  const sql = getSQL();
  await sql`UPDATE mc_users SET status = 'active', updated_at = NOW() WHERE id = ${userId}`;
}

export async function deleteUserData(userId: number) {
  const sql = getSQL();
  // Delete sessions
  await sql`DELETE FROM mc_sessions WHERE user_id = ${userId}`;
  // Delete password reset tokens
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`;
  // Delete tenant memberships
  await sql`DELETE FROM tenant_users WHERE user_id = ${userId}`;
  // Delete audit logs referencing this user
  await sql`UPDATE audit_logs SET user_id = NULL WHERE user_id = ${userId}`;
  // Delete the user record
  await sql`DELETE FROM mc_users WHERE id = ${userId}`;
}

/* ─── Admin: Email Blocklist ─── */

export async function addToBlocklist(email: string, reason: string, blockedBy: number) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO email_blocklist (email, reason, blocked_by)
    VALUES (${email.toLowerCase().trim()}, ${reason}, ${blockedBy})
    ON CONFLICT (email) DO UPDATE SET reason = ${reason}, blocked_by = ${blockedBy}
  `;
}

export async function removeFromBlocklist(email: string) {
  const sql = getSQL();
  await sql`DELETE FROM email_blocklist WHERE email = ${email.toLowerCase().trim()}`;
}

export async function getBlocklist(): Promise<{ id: number; email: string; reason: string; created_at: string }[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM email_blocklist ORDER BY created_at DESC`;
  return rows as unknown as { id: number; email: string; reason: string; created_at: string }[];
}

export async function isEmailBlocked(email: string): Promise<boolean> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`SELECT 1 FROM email_blocklist WHERE email = ${email.toLowerCase().trim()}`;
  return rows.length > 0;
}

/* ─── Daily Usage Tracking ─── */

export async function getDailyUsage(tenantId: number, feature: string, tenantTimezone: string): Promise<number> {
  await ensureMcTables();
  const sql = getSQL();

  // Get start of today in tenant's timezone
  const rows = await sql`
    SELECT COUNT(*)::int AS count FROM audit_logs
    WHERE tenant_id = ${tenantId}
      AND action = ${feature}
      AND created_at >= (NOW() AT TIME ZONE ${tenantTimezone})::date::timestamptz
  `;
  return (rows[0] as unknown as { count: number })?.count ?? 0;
}

/* ─── Tenant Goals ─── */

export interface TenantGoals {
  id?: number;
  tenant_id: number;
  business_name: string | null;
  business_description: string | null;
  target_audience: string | null;
  brand_voice: string | null;
  key_offers: string | null;
  goals: { label: string; description: string }[];
  cta_url: string | null;
  cta_label: string | null;
  sender_name: string | null;
  sender_title: string | null;
  avoid_phrases: string | null;
  example_tone: string | null;
}

export async function getTenantGoals(tenantId: number): Promise<TenantGoals | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM tenant_goals WHERE tenant_id = ${tenantId}`;
  if (!rows[0]) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    ...row,
    goals: (typeof row.goals === "string" ? JSON.parse(row.goals) : row.goals) || [],
  } as unknown as TenantGoals;
}

export async function upsertTenantGoals(tenantId: number, data: Partial<TenantGoals>) {
  await ensureMcTables();
  const sql = getSQL();
  const goalsJson = data.goals ? JSON.stringify(data.goals) : "[]";

  await sql`
    INSERT INTO tenant_goals (
      tenant_id, business_name, business_description, target_audience,
      brand_voice, key_offers, goals, cta_url, cta_label,
      sender_name, sender_title, avoid_phrases, example_tone, updated_at
    ) VALUES (
      ${tenantId}, ${data.business_name ?? null}, ${data.business_description ?? null},
      ${data.target_audience ?? null}, ${data.brand_voice ?? null},
      ${data.key_offers ?? null}, ${goalsJson}, ${data.cta_url ?? null},
      ${data.cta_label ?? "Book a call"}, ${data.sender_name ?? null},
      ${data.sender_title ?? null}, ${data.avoid_phrases ?? null},
      ${data.example_tone ?? null}, NOW()
    )
    ON CONFLICT (tenant_id) DO UPDATE SET
      business_name = ${data.business_name ?? null},
      business_description = ${data.business_description ?? null},
      target_audience = ${data.target_audience ?? null},
      brand_voice = ${data.brand_voice ?? null},
      key_offers = ${data.key_offers ?? null},
      goals = ${goalsJson},
      cta_url = ${data.cta_url ?? null},
      cta_label = ${data.cta_label ?? "Book a call"},
      sender_name = ${data.sender_name ?? null},
      sender_title = ${data.sender_title ?? null},
      avoid_phrases = ${data.avoid_phrases ?? null},
      example_tone = ${data.example_tone ?? null},
      updated_at = NOW()
  `;
}
