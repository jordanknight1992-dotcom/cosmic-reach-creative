import { sql } from "@vercel/postgres";

/* ─── Schema ─── */

export async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      company    TEXT,
      message    TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS audit_submissions (
      id                   SERIAL PRIMARY KEY,
      name                 TEXT NOT NULL,
      email                TEXT NOT NULL,
      company              TEXT,
      website              TEXT,
      business_description TEXT,
      what_is_stuck        TEXT,
      primary_goal         TEXT,
      key_offers           TEXT,
      ideal_customer       TEXT,
      anything_else        TEXT,
      supporting_links     TEXT,
      created_at           TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS cta_events (
      id         SERIAL PRIMARY KEY,
      label      TEXT NOT NULL,
      page       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

/* ─── Admin password ─── */

export async function getAdminPasswordHash(): Promise<string | null> {
  await ensureTables();
  const { rows } = await sql`
    SELECT value FROM admin_settings WHERE key = 'admin_password_hash'
  `;
  return rows[0]?.value ?? null;
}

export async function setAdminPasswordHash(hash: string) {
  await ensureTables();
  await sql`
    INSERT INTO admin_settings (key, value)
    VALUES ('admin_password_hash', ${hash})
    ON CONFLICT (key) DO UPDATE SET value = ${hash}, updated_at = NOW()
  `;
}

/* ─── Submissions ─── */

export async function saveContactSubmission(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  await ensureTables();
  await sql`
    INSERT INTO contact_submissions (name, email, company, message)
    VALUES (${data.name}, ${data.email}, ${data.company ?? null}, ${data.message})
  `;
}

export async function saveAuditSubmission(data: {
  name: string;
  email: string;
  company?: string;
  website?: string;
  businessDescription?: string;
  whatIsStuck?: string;
  primaryGoal?: string;
  keyOffers?: string;
  idealCustomer?: string;
  anythingElse?: string;
  supportingLinks?: string;
}) {
  await ensureTables();
  await sql`
    INSERT INTO audit_submissions (
      name, email, company, website,
      business_description, what_is_stuck, primary_goal,
      key_offers, ideal_customer, anything_else, supporting_links
    ) VALUES (
      ${data.name}, ${data.email}, ${data.company ?? null}, ${data.website ?? null},
      ${data.businessDescription ?? null}, ${data.whatIsStuck ?? null},
      ${data.primaryGoal ?? null}, ${data.keyOffers ?? null},
      ${data.idealCustomer ?? null}, ${data.anythingElse ?? null},
      ${data.supportingLinks ?? null}
    )
  `;
}

/* ─── CTA Events ─── */

export async function trackCtaClick(label: string, page: string) {
  await ensureTables();
  await sql`
    INSERT INTO cta_events (label, page) VALUES (${label}, ${page})
  `;
}

/* ─── Reads ─── */

export async function getContactSubmissions() {
  await ensureTables();
  const { rows } = await sql`
    SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 200
  `;
  return rows;
}

export async function getAuditSubmissions() {
  await ensureTables();
  const { rows } = await sql`
    SELECT * FROM audit_submissions ORDER BY created_at DESC LIMIT 200
  `;
  return rows;
}

export async function getCtaStats() {
  await ensureTables();
  const { rows } = await sql`
    SELECT
      label,
      COUNT(*)::int AS clicks,
      COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END)::int AS clicks_30d
    FROM cta_events
    GROUP BY label
    ORDER BY clicks DESC
  `;
  return rows;
}
