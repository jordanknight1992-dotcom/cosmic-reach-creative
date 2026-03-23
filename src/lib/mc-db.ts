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
      is_retainer_client BOOLEAN DEFAULT FALSE,
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

  /* ── Support Sessions (Super User workspace access) ── */
  await sql`
    CREATE TABLE IF NOT EXISTS support_sessions (
      id           TEXT PRIMARY KEY,
      user_id      INTEGER REFERENCES mc_users(id) NOT NULL,
      tenant_id    INTEGER REFERENCES tenants(id) NOT NULL,
      reason       TEXT NOT NULL,
      ip_address   TEXT,
      user_agent   TEXT,
      started_at   TIMESTAMPTZ DEFAULT NOW(),
      expires_at   TIMESTAMPTZ NOT NULL,
      ended_at     TIMESTAMPTZ,
      ended_reason TEXT,
      status       TEXT DEFAULT 'active'
    )
  `;

  /* ── Tenant ICP Configuration ── */
  await sql`
    CREATE TABLE IF NOT EXISTS tenant_icp (
      id              SERIAL PRIMARY KEY,
      tenant_id       INTEGER REFERENCES tenants(id) NOT NULL UNIQUE,
      target_roles    JSONB DEFAULT '[]',
      target_industries JSONB DEFAULT '[]',
      target_geo      JSONB DEFAULT '[]',
      company_size_min INTEGER,
      company_size_max INTEGER,
      priorities      JSONB DEFAULT '[]',
      exclusion_rules JSONB DEFAULT '[]',
      scoring_weights JSONB DEFAULT '{}',
      updated_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Team Invitations ── */
  await sql`
    CREATE TABLE IF NOT EXISTS team_invitations (
      id         SERIAL PRIMARY KEY,
      tenant_id  INTEGER REFERENCES tenants(id) NOT NULL,
      email      TEXT NOT NULL,
      role       TEXT DEFAULT 'member',
      invited_by INTEGER REFERENCES mc_users(id) NOT NULL,
      token      TEXT NOT NULL UNIQUE,
      status     TEXT DEFAULT 'pending',
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Import Jobs ── */
  await sql`
    CREATE TABLE IF NOT EXISTS import_jobs (
      id           SERIAL PRIMARY KEY,
      tenant_id    INTEGER REFERENCES tenants(id) NOT NULL,
      user_id      INTEGER REFERENCES mc_users(id) NOT NULL,
      filename     TEXT,
      source_type  TEXT DEFAULT 'csv',
      row_count    INTEGER DEFAULT 0,
      imported     INTEGER DEFAULT 0,
      duplicates   INTEGER DEFAULT 0,
      failed       INTEGER DEFAULT 0,
      field_mapping JSONB DEFAULT '{}',
      status       TEXT DEFAULT 'pending',
      error_log    JSONB DEFAULT '[]',
      created_at   TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;

  /* ── Score Cache ── */
  await sql`
    CREATE TABLE IF NOT EXISTS score_cache (
      id           SERIAL PRIMARY KEY,
      tenant_id    INTEGER REFERENCES tenants(id) NOT NULL,
      lead_id      INTEGER REFERENCES leads(id) NOT NULL,
      data_hash    TEXT NOT NULL,
      icp_hash     TEXT NOT NULL,
      score_version TEXT DEFAULT 'v1',
      fit_score    INTEGER,
      priority     TEXT,
      short_reason TEXT,
      matched_signals JSONB DEFAULT '[]',
      scored_at    TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(lead_id, data_hash, icp_hash, score_version)
    )
  `;

  /* ── Usage Tracking ── */
  await sql`
    CREATE TABLE IF NOT EXISTS usage_tracking (
      id           SERIAL PRIMARY KEY,
      tenant_id    INTEGER REFERENCES tenants(id) NOT NULL,
      feature      TEXT NOT NULL,
      tokens_used  INTEGER DEFAULT 0,
      model        TEXT,
      tracked_date DATE DEFAULT CURRENT_DATE,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Usage Limits ── */
  await sql`
    CREATE TABLE IF NOT EXISTS usage_limits (
      id             SERIAL PRIMARY KEY,
      tenant_id      INTEGER REFERENCES tenants(id) NOT NULL UNIQUE,
      daily_score_limit INTEGER DEFAULT 100,
      daily_draft_limit INTEGER DEFAULT 20,
      warn_threshold_pct INTEGER DEFAULT 80,
      hard_stop      BOOLEAN DEFAULT TRUE,
      updated_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── Workspace support access setting ── */
  await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS support_access_enabled BOOLEAN DEFAULT TRUE`;

  /* ── Retainer client flag ── */
  await sql`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS is_retainer_client BOOLEAN DEFAULT FALSE`;

  /* ── Indexes ── */
  await sql`CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mc_sessions_user ON mc_sessions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mc_sessions_expires ON mc_sessions(expires_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenant_credentials_tenant ON tenant_credentials(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_support_sessions_tenant ON support_sessions(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_support_sessions_user ON support_sessions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_support_sessions_status ON support_sessions(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_team_invitations_tenant ON team_invitations(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_import_jobs_tenant ON import_jobs(tenant_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_score_cache_lead ON score_cache(lead_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_tracking_tenant_date ON usage_tracking(tenant_id, tracked_date)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action)`;

  /* ── Add user_agent to audit_logs (idempotent) ── */
  await sql`ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT`;

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

  /* ── Briefing Snapshots (daily decay/drift detection) ── */
  await sql`
    CREATE TABLE IF NOT EXISTS briefing_snapshots (
      id          SERIAL PRIMARY KEY,
      tenant_id   INTEGER REFERENCES tenants(id) NOT NULL,
      snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
      total_active     INTEGER DEFAULT 0,
      hot_leads        INTEGER DEFAULT 0,
      overdue_count    INTEGER DEFAULT 0,
      stale_outreach   INTEGER DEFAULT 0,
      cooling_replies  INTEGER DEFAULT 0,
      neglected_count  INTEGER DEFAULT 0,
      meetings_booked  INTEGER DEFAULT 0,
      avg_fit_score    REAL DEFAULT 0,
      stage_counts     JSONB DEFAULT '{}',
      insight_ids      JSONB DEFAULT '[]',
      created_at       TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(tenant_id, snapshot_date)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_briefing_snapshots_tenant_date ON briefing_snapshots(tenant_id, snapshot_date)`;
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
  is_retainer_client: boolean;
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
  user_agent?: string;
}) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO audit_logs (user_id, tenant_id, action, resource, resource_id, metadata, ip_address, user_agent)
    VALUES (
      ${data.user_id},
      ${data.tenant_id ?? null},
      ${data.action},
      ${data.resource ?? null},
      ${data.resource_id ?? null},
      ${data.metadata ? JSON.stringify(data.metadata) : null},
      ${data.ip_address ?? null},
      ${data.user_agent ?? null}
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

/* ─── Support Sessions ─── */

export interface SupportSession {
  id: string;
  user_id: number;
  tenant_id: number;
  reason: string;
  ip_address: string | null;
  user_agent: string | null;
  started_at: string;
  expires_at: string;
  ended_at: string | null;
  ended_reason: string | null;
  status: string;
}

export async function createSupportSession(data: {
  id: string;
  user_id: number;
  tenant_id: number;
  reason: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
}): Promise<SupportSession> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO support_sessions (id, user_id, tenant_id, reason, ip_address, user_agent, expires_at)
    VALUES (
      ${data.id}, ${data.user_id}, ${data.tenant_id}, ${data.reason},
      ${data.ip_address ?? null}, ${data.user_agent ?? null},
      ${data.expires_at.toISOString()}
    )
    RETURNING *
  `;
  return rows[0] as unknown as SupportSession;
}

export async function getActiveSupportSession(sessionId: string): Promise<SupportSession | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM support_sessions
    WHERE id = ${sessionId} AND status = 'active' AND expires_at > NOW()
  `;
  return (rows[0] as unknown as SupportSession) ?? null;
}

export async function getActiveSupportSessionForUser(userId: number): Promise<SupportSession | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM support_sessions
    WHERE user_id = ${userId} AND status = 'active' AND expires_at > NOW()
    ORDER BY started_at DESC LIMIT 1
  `;
  return (rows[0] as unknown as SupportSession) ?? null;
}

export async function endSupportSession(sessionId: string, reason: string = "manual") {
  const sql = getSQL();
  await sql`
    UPDATE support_sessions
    SET status = 'ended', ended_at = NOW(), ended_reason = ${reason}
    WHERE id = ${sessionId}
  `;
}

export async function expireSupportSessions() {
  const sql = getSQL();
  await sql`
    UPDATE support_sessions
    SET status = 'expired', ended_at = NOW(), ended_reason = 'timeout'
    WHERE status = 'active' AND expires_at <= NOW()
  `;
}

export async function getSupportSessionsForTenant(tenantId: number, limit: number = 20): Promise<SupportSession[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT ss.*, u.full_name AS user_name, u.email AS user_email
    FROM support_sessions ss
    LEFT JOIN mc_users u ON u.id = ss.user_id
    WHERE ss.tenant_id = ${tenantId}
    ORDER BY ss.started_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as SupportSession[];
}

export async function getRecentSupportSessions(userId: number, limit: number = 20): Promise<(SupportSession & { tenant_name: string })[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT ss.*, t.name AS tenant_name
    FROM support_sessions ss
    LEFT JOIN tenants t ON t.id = ss.tenant_id
    WHERE ss.user_id = ${userId}
    ORDER BY ss.started_at DESC
    LIMIT ${limit}
  `;
  return rows as unknown as (SupportSession & { tenant_name: string })[];
}

/* ─── Tenant ICP ─── */

export interface TenantICP {
  id: number;
  tenant_id: number;
  target_roles: string[];
  target_industries: string[];
  target_geo: string[];
  company_size_min: number | null;
  company_size_max: number | null;
  priorities: string[];
  exclusion_rules: string[];
  scoring_weights: Record<string, number>;
  updated_at: string;
}

export async function getTenantICP(tenantId: number): Promise<TenantICP | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM tenant_icp WHERE tenant_id = ${tenantId}`;
  if (!rows[0]) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    ...row,
    target_roles: typeof row.target_roles === "string" ? JSON.parse(row.target_roles) : row.target_roles || [],
    target_industries: typeof row.target_industries === "string" ? JSON.parse(row.target_industries) : row.target_industries || [],
    target_geo: typeof row.target_geo === "string" ? JSON.parse(row.target_geo) : row.target_geo || [],
    priorities: typeof row.priorities === "string" ? JSON.parse(row.priorities) : row.priorities || [],
    exclusion_rules: typeof row.exclusion_rules === "string" ? JSON.parse(row.exclusion_rules) : row.exclusion_rules || [],
    scoring_weights: typeof row.scoring_weights === "string" ? JSON.parse(row.scoring_weights) : row.scoring_weights || {},
  } as unknown as TenantICP;
}

export async function upsertTenantICP(tenantId: number, data: Partial<Omit<TenantICP, "id" | "tenant_id" | "updated_at">>) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO tenant_icp (tenant_id, target_roles, target_industries, target_geo,
      company_size_min, company_size_max, priorities, exclusion_rules, scoring_weights)
    VALUES (
      ${tenantId},
      ${JSON.stringify(data.target_roles ?? [])},
      ${JSON.stringify(data.target_industries ?? [])},
      ${JSON.stringify(data.target_geo ?? [])},
      ${data.company_size_min ?? null},
      ${data.company_size_max ?? null},
      ${JSON.stringify(data.priorities ?? [])},
      ${JSON.stringify(data.exclusion_rules ?? [])},
      ${JSON.stringify(data.scoring_weights ?? {})}
    )
    ON CONFLICT (tenant_id) DO UPDATE SET
      target_roles = ${JSON.stringify(data.target_roles ?? [])},
      target_industries = ${JSON.stringify(data.target_industries ?? [])},
      target_geo = ${JSON.stringify(data.target_geo ?? [])},
      company_size_min = ${data.company_size_min ?? null},
      company_size_max = ${data.company_size_max ?? null},
      priorities = ${JSON.stringify(data.priorities ?? [])},
      exclusion_rules = ${JSON.stringify(data.exclusion_rules ?? [])},
      scoring_weights = ${JSON.stringify(data.scoring_weights ?? {})},
      updated_at = NOW()
  `;
}

/* ─── Team Invitations ─── */

export interface TeamInvitation {
  id: number;
  tenant_id: number;
  email: string;
  role: string;
  invited_by: number;
  token: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export async function createTeamInvitation(data: {
  tenant_id: number;
  email: string;
  role: string;
  invited_by: number;
  token: string;
  expires_at: Date;
}): Promise<TeamInvitation> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO team_invitations (tenant_id, email, role, invited_by, token, expires_at)
    VALUES (${data.tenant_id}, ${data.email.toLowerCase().trim()}, ${data.role}, ${data.invited_by}, ${data.token}, ${data.expires_at.toISOString()})
    RETURNING *
  `;
  return rows[0] as unknown as TeamInvitation;
}

export async function getTeamInvitationByToken(token: string): Promise<TeamInvitation | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM team_invitations WHERE token = ${token} AND status = 'pending' AND expires_at > NOW()
  `;
  return (rows[0] as unknown as TeamInvitation) ?? null;
}

export async function getPendingInvitations(tenantId: number): Promise<TeamInvitation[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM team_invitations
    WHERE tenant_id = ${tenantId} AND status = 'pending' AND expires_at > NOW()
    ORDER BY created_at DESC
  `;
  return rows as unknown as TeamInvitation[];
}

export async function acceptInvitation(token: string) {
  const sql = getSQL();
  await sql`UPDATE team_invitations SET status = 'accepted' WHERE token = ${token}`;
}

export async function revokeInvitation(invitationId: number) {
  const sql = getSQL();
  await sql`UPDATE team_invitations SET status = 'revoked' WHERE id = ${invitationId}`;
}

/* ─── Team Members ─── */

export async function getTenantMembers(tenantId: number): Promise<(McUser & { role: string; membership_status: string })[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT u.id, u.email, u.full_name, u.is_super_admin, u.status, u.last_login_at, u.created_at,
           tu.role, tu.status AS membership_status
    FROM mc_users u
    JOIN tenant_users tu ON tu.user_id = u.id
    WHERE tu.tenant_id = ${tenantId} AND tu.status = 'active'
    ORDER BY tu.role ASC, u.full_name ASC
  `;
  return rows as unknown as (McUser & { role: string; membership_status: string })[];
}

export async function updateMemberRole(tenantId: number, userId: number, role: string) {
  const sql = getSQL();
  await sql`
    UPDATE tenant_users SET role = ${role}
    WHERE tenant_id = ${tenantId} AND user_id = ${userId}
  `;
}

export async function removeMember(tenantId: number, userId: number) {
  const sql = getSQL();
  await sql`
    UPDATE tenant_users SET status = 'removed'
    WHERE tenant_id = ${tenantId} AND user_id = ${userId}
  `;
}

/* ─── Import Jobs ─── */

export interface ImportJob {
  id: number;
  tenant_id: number;
  user_id: number;
  filename: string | null;
  source_type: string;
  row_count: number;
  imported: number;
  duplicates: number;
  failed: number;
  field_mapping: Record<string, string>;
  status: string;
  error_log: unknown[];
  created_at: string;
  completed_at: string | null;
}

export async function createImportJob(data: {
  tenant_id: number;
  user_id: number;
  filename?: string;
  source_type?: string;
  row_count?: number;
  field_mapping?: Record<string, string>;
}): Promise<ImportJob> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO import_jobs (tenant_id, user_id, filename, source_type, row_count, field_mapping)
    VALUES (
      ${data.tenant_id}, ${data.user_id}, ${data.filename ?? null},
      ${data.source_type ?? "csv"}, ${data.row_count ?? 0},
      ${JSON.stringify(data.field_mapping ?? {})}
    )
    RETURNING *
  `;
  return rows[0] as unknown as ImportJob;
}

export async function updateImportJob(jobId: number, data: Partial<{
  imported: number;
  duplicates: number;
  failed: number;
  status: string;
  error_log: unknown[];
  completed_at: string;
}>) {
  const sql = getSQL();
  await sql`
    UPDATE import_jobs SET
      imported = COALESCE(${data.imported ?? null}, imported),
      duplicates = COALESCE(${data.duplicates ?? null}, duplicates),
      failed = COALESCE(${data.failed ?? null}, failed),
      status = COALESCE(${data.status ?? null}, status),
      error_log = COALESCE(${data.error_log ? JSON.stringify(data.error_log) : null}::jsonb, error_log),
      completed_at = COALESCE(${data.completed_at ?? null}::timestamptz, completed_at)
    WHERE id = ${jobId}
  `;
}

export async function getImportJobs(tenantId: number, limit: number = 10): Promise<ImportJob[]> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM import_jobs WHERE tenant_id = ${tenantId}
    ORDER BY created_at DESC LIMIT ${limit}
  `;
  return rows as unknown as ImportJob[];
}

/* ─── Score Cache ─── */

export async function getCachedScore(leadId: number, dataHash: string, icpHash: string, version: string = "v1") {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM score_cache
    WHERE lead_id = ${leadId} AND data_hash = ${dataHash} AND icp_hash = ${icpHash} AND score_version = ${version}
    LIMIT 1
  `;
  if (!rows[0]) return null;
  return rows[0] as unknown as {
    fit_score: number;
    priority: string;
    short_reason: string;
    matched_signals: string[];
    scored_at: string;
  };
}

export async function setCachedScore(data: {
  tenant_id: number;
  lead_id: number;
  data_hash: string;
  icp_hash: string;
  score_version?: string;
  fit_score: number;
  priority: string;
  short_reason: string;
  matched_signals: string[];
}) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO score_cache (tenant_id, lead_id, data_hash, icp_hash, score_version,
      fit_score, priority, short_reason, matched_signals)
    VALUES (
      ${data.tenant_id}, ${data.lead_id}, ${data.data_hash}, ${data.icp_hash},
      ${data.score_version ?? "v1"}, ${data.fit_score}, ${data.priority},
      ${data.short_reason}, ${JSON.stringify(data.matched_signals)}
    )
    ON CONFLICT (lead_id, data_hash, icp_hash, score_version) DO UPDATE SET
      fit_score = ${data.fit_score},
      priority = ${data.priority},
      short_reason = ${data.short_reason},
      matched_signals = ${JSON.stringify(data.matched_signals)},
      scored_at = NOW()
  `;
}

/* ─── Usage Tracking ─── */

export async function trackUsage(tenantId: number, feature: string, tokensUsed: number, model?: string) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO usage_tracking (tenant_id, feature, tokens_used, model)
    VALUES (${tenantId}, ${feature}, ${tokensUsed}, ${model ?? null})
  `;
}

export async function getDailyUsageByFeature(tenantId: number, feature: string): Promise<number> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT COALESCE(SUM(tokens_used), 0)::int AS total
    FROM usage_tracking
    WHERE tenant_id = ${tenantId} AND feature = ${feature} AND tracked_date = CURRENT_DATE
  `;
  return (rows[0] as unknown as { total: number })?.total ?? 0;
}

export async function getUsageLimits(tenantId: number) {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`SELECT * FROM usage_limits WHERE tenant_id = ${tenantId}`;
  if (!rows[0]) return { daily_score_limit: 100, daily_draft_limit: 20, warn_threshold_pct: 80, hard_stop: true };
  return rows[0] as unknown as {
    daily_score_limit: number;
    daily_draft_limit: number;
    warn_threshold_pct: number;
    hard_stop: boolean;
  };
}

export async function upsertUsageLimits(tenantId: number, data: {
  daily_score_limit?: number;
  daily_draft_limit?: number;
  warn_threshold_pct?: number;
  hard_stop?: boolean;
}) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO usage_limits (tenant_id, daily_score_limit, daily_draft_limit, warn_threshold_pct, hard_stop)
    VALUES (${tenantId}, ${data.daily_score_limit ?? 100}, ${data.daily_draft_limit ?? 20}, ${data.warn_threshold_pct ?? 80}, ${data.hard_stop ?? true})
    ON CONFLICT (tenant_id) DO UPDATE SET
      daily_score_limit = COALESCE(${data.daily_score_limit ?? null}, usage_limits.daily_score_limit),
      daily_draft_limit = COALESCE(${data.daily_draft_limit ?? null}, usage_limits.daily_draft_limit),
      warn_threshold_pct = COALESCE(${data.warn_threshold_pct ?? null}, usage_limits.warn_threshold_pct),
      hard_stop = COALESCE(${data.hard_stop ?? null}, usage_limits.hard_stop),
      updated_at = NOW()
  `;
}

/* ─── Tenant Support Access Toggle ─── */

export async function getTenantSupportAccess(tenantId: number): Promise<boolean> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`SELECT support_access_enabled FROM tenants WHERE id = ${tenantId}`;
  return (rows[0] as unknown as { support_access_enabled: boolean })?.support_access_enabled ?? true;
}

export async function setTenantSupportAccess(tenantId: number, enabled: boolean) {
  const sql = getSQL();
  await sql`UPDATE tenants SET support_access_enabled = ${enabled}, updated_at = NOW() WHERE id = ${tenantId}`;
}

/* ─── Retainer Client ─── */

export async function isRetainerClient(tenantId: number): Promise<boolean> {
  const sql = getSQL();
  const rows = await sql`SELECT is_retainer_client FROM tenants WHERE id = ${tenantId}`;
  return rows[0]?.is_retainer_client ?? false;
}

export async function setRetainerClient(tenantId: number, enabled: boolean) {
  const sql = getSQL();
  await sql`UPDATE tenants SET is_retainer_client = ${enabled}, updated_at = NOW() WHERE id = ${tenantId}`;
}

/* ─── Tenant Goals ─── */

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

/* ─── Briefing Snapshots ─── */

export interface BriefingSnapshot {
  id: number;
  tenant_id: number;
  snapshot_date: string;
  total_active: number;
  hot_leads: number;
  overdue_count: number;
  stale_outreach: number;
  cooling_replies: number;
  neglected_count: number;
  meetings_booked: number;
  avg_fit_score: number;
  stage_counts: Record<string, number>;
  insight_ids: string[];
  created_at: string;
}

export async function saveBriefingSnapshot(data: {
  tenant_id: number;
  total_active: number;
  hot_leads: number;
  overdue_count: number;
  stale_outreach: number;
  cooling_replies: number;
  neglected_count: number;
  meetings_booked: number;
  avg_fit_score: number;
  stage_counts: Record<string, number>;
  insight_ids: string[];
}) {
  await ensureMcTables();
  const sql = getSQL();
  await sql`
    INSERT INTO briefing_snapshots (
      tenant_id, total_active, hot_leads, overdue_count,
      stale_outreach, cooling_replies, neglected_count,
      meetings_booked, avg_fit_score, stage_counts, insight_ids
    ) VALUES (
      ${data.tenant_id}, ${data.total_active}, ${data.hot_leads}, ${data.overdue_count},
      ${data.stale_outreach}, ${data.cooling_replies}, ${data.neglected_count},
      ${data.meetings_booked}, ${data.avg_fit_score},
      ${JSON.stringify(data.stage_counts)}, ${JSON.stringify(data.insight_ids)}
    )
    ON CONFLICT (tenant_id, snapshot_date) DO UPDATE SET
      total_active = ${data.total_active},
      hot_leads = ${data.hot_leads},
      overdue_count = ${data.overdue_count},
      stale_outreach = ${data.stale_outreach},
      cooling_replies = ${data.cooling_replies},
      neglected_count = ${data.neglected_count},
      meetings_booked = ${data.meetings_booked},
      avg_fit_score = ${data.avg_fit_score},
      stage_counts = ${JSON.stringify(data.stage_counts)},
      insight_ids = ${JSON.stringify(data.insight_ids)}
  `;
}

export async function getYesterdaySnapshot(tenantId: number): Promise<BriefingSnapshot | null> {
  await ensureMcTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM briefing_snapshots
    WHERE tenant_id = ${tenantId} AND snapshot_date = CURRENT_DATE - INTERVAL '1 day'
    LIMIT 1
  `;
  if (!rows[0]) return null;
  const row = rows[0] as Record<string, unknown>;
  return {
    ...row,
    stage_counts: typeof row.stage_counts === "string" ? JSON.parse(row.stage_counts) : row.stage_counts || {},
    insight_ids: typeof row.insight_ids === "string" ? JSON.parse(row.insight_ids) : row.insight_ids || [],
  } as unknown as BriefingSnapshot;
}
