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

  /* ─── CRM columns (idempotent) ─── */
  await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'`;
  await sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS notes  TEXT DEFAULT ''`;
  await sql`ALTER TABLE audit_submissions   ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new'`;
  await sql`ALTER TABLE audit_submissions   ADD COLUMN IF NOT EXISTS notes  TEXT DEFAULT ''`;
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

/* ─── CRM mutations ─── */

export async function updateSubmissionStatus(
  table: "contact" | "audit",
  id: number,
  status: string
) {
  await ensureTables();
  if (table === "contact") {
    await sql`UPDATE contact_submissions SET status = ${status} WHERE id = ${id}`;
  } else {
    await sql`UPDATE audit_submissions SET status = ${status} WHERE id = ${id}`;
  }
}

export async function updateSubmissionNotes(
  table: "contact" | "audit",
  id: number,
  notes: string
) {
  await ensureTables();
  if (table === "contact") {
    await sql`UPDATE contact_submissions SET notes = ${notes} WHERE id = ${id}`;
  } else {
    await sql`UPDATE audit_submissions SET notes = ${notes} WHERE id = ${id}`;
  }
}

/* ─── Analytics timelines ─── */

export async function getCtaTimeline(): Promise<{ date: string; clicks: number }[]> {
  await ensureTables();
  const { rows } = await sql`
    SELECT
      TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date,
      COUNT(*)::int AS clicks
    FROM cta_events
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `;
  return rows as { date: string; clicks: number }[];
}

export async function getSubmissionTimeline(): Promise<
  { date: string; contacts: number; audits: number }[]
> {
  await ensureTables();
  const [{ rows: cRows }, { rows: aRows }] = await Promise.all([
    sql`
      SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date, COUNT(*)::int AS cnt
      FROM contact_submissions
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
    `,
    sql`
      SELECT TO_CHAR(DATE(created_at), 'YYYY-MM-DD') AS date, COUNT(*)::int AS cnt
      FROM audit_submissions
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
    `,
  ]);

  /* Build a unified date map */
  const map: Record<string, { contacts: number; audits: number }> = {};
  for (const r of cRows) map[r.date as string] = { contacts: r.cnt as number, audits: 0 };
  for (const r of aRows) {
    if (!map[r.date as string]) map[r.date as string] = { contacts: 0, audits: 0 };
    map[r.date as string].audits = r.cnt as number;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));
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
