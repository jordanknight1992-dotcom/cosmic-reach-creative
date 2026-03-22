import { neon } from "@neondatabase/serverless";

/* ─── Connection ─── */

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/* ─── Schema ─── */

let _tablesReady: Promise<void> | null = null;

export async function ensureCrmTables() {
  if (_tablesReady) return _tablesReady;
  _tablesReady = _createTables();
  return _tablesReady;
}

async function _createTables() {
  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS companies (
      id              SERIAL PRIMARY KEY,
      name            TEXT NOT NULL,
      domain          TEXT,
      website         TEXT,
      industry        TEXT,
      city            TEXT,
      state           TEXT,
      country         TEXT DEFAULT 'US',
      fit_score       INTEGER DEFAULT 0,
      fit_summary     TEXT,
      source          TEXT DEFAULT 'manual',
      source_metadata JSONB,
      created_at      TIMESTAMPTZ DEFAULT NOW(),
      updated_at      TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(domain)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contacts (
      id                SERIAL PRIMARY KEY,
      company_id        INTEGER REFERENCES companies(id),
      full_name         TEXT NOT NULL,
      first_name        TEXT,
      last_name         TEXT,
      title             TEXT,
      email             TEXT NOT NULL UNIQUE,
      email_status      TEXT DEFAULT 'valid',
      city              TEXT,
      state             TEXT,
      country           TEXT DEFAULT 'US',
      linkedin_url      TEXT,
      source            TEXT DEFAULT 'manual',
      source_contact_id TEXT,
      persona_type      TEXT DEFAULT 'other',
      do_not_contact    BOOLEAN DEFAULT FALSE,
      opt_out_at        TIMESTAMPTZ,
      created_at        TIMESTAMPTZ DEFAULT NOW(),
      updated_at        TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id                     SERIAL PRIMARY KEY,
      company_id             INTEGER REFERENCES companies(id),
      contact_id             INTEGER REFERENCES contacts(id),
      fit_score              INTEGER DEFAULT 0,
      fit_reason             TEXT,
      pain_point_summary     TEXT,
      outreach_angle         TEXT,
      stage                  TEXT DEFAULT 'candidate',
      owner                  TEXT DEFAULT 'jordan',
      next_action            TEXT,
      next_action_at         TIMESTAMPTZ,
      last_contacted_at      TIMESTAMPTZ,
      manual_review_required BOOLEAN DEFAULT FALSE,
      approved_for_send      BOOLEAN DEFAULT FALSE,
      created_at             TIMESTAMPTZ DEFAULT NOW(),
      updated_at             TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(contact_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS activities (
      id         SERIAL PRIMARY KEY,
      lead_id    INTEGER REFERENCES leads(id),
      contact_id INTEGER,
      company_id INTEGER,
      type       TEXT NOT NULL,
      channel    TEXT DEFAULT 'email',
      body_preview TEXT,
      metadata   JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS email_drafts (
      id                SERIAL PRIMARY KEY,
      lead_id           INTEGER REFERENCES leads(id) NOT NULL,
      subject           TEXT,
      body_text         TEXT,
      body_html         TEXT,
      model             TEXT,
      persona_type      TEXT,
      approval_status   TEXT DEFAULT 'draft',
      is_ai_generated   BOOLEAN DEFAULT FALSE,
      is_manually_edited BOOLEAN DEFAULT FALSE,
      created_at        TIMESTAMPTZ DEFAULT NOW(),
      updated_at        TIMESTAMPTZ DEFAULT NOW(),
      sent_at           TIMESTAMPTZ
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS suppressions (
      id             SERIAL PRIMARY KEY,
      contact_id     INTEGER REFERENCES contacts(id) NOT NULL,
      email_original TEXT NOT NULL,
      reason         TEXT DEFAULT 'opt_out',
      source         TEXT DEFAULT 'manual',
      created_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id         SERIAL PRIMARY KEY,
      lead_id    INTEGER REFERENCES leads(id) NOT NULL,
      body       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Indexes
  await sql`CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_leads_contact_id ON leads(contact_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_leads_company_id ON leads(company_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON contacts(company_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON activities(lead_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_email_drafts_lead_id ON email_drafts(lead_id)`;
}

/* ─── Types ─── */

export interface LeadRow {
  id: number;
  company_id: number;
  contact_id: number;
  fit_score: number;
  fit_reason: string | null;
  pain_point_summary: string | null;
  outreach_angle: string | null;
  stage: string;
  owner: string;
  next_action: string | null;
  next_action_at: string | null;
  last_contacted_at: string | null;
  manual_review_required: boolean;
  approved_for_send: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  company_name?: string;
  company_domain?: string;
  company_industry?: string;
  company_city?: string;
  company_state?: string;
  contact_name?: string;
  contact_email?: string;
  contact_title?: string;
  contact_persona_type?: string;
  contact_do_not_contact?: boolean;
  contact_email_status?: string;
  contact_linkedin_url?: string;
}

/* ─── Leads ─── */

export async function getLeads(filters?: {
  stage?: string;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<LeadRow[]> {
  await ensureCrmTables();
  const sql = getSQL();
  const limit = filters?.limit ?? 50;
  const offset = filters?.offset ?? 0;

  if (filters?.stage && filters?.search) {
    const pattern = `%${filters.search}%`;
    return sql`
      SELECT
        l.*,
        co.name   AS company_name,
        co.domain AS company_domain,
        co.industry AS company_industry,
        co.city   AS company_city,
        co.state  AS company_state,
        ct.full_name AS contact_name,
        ct.email     AS contact_email,
        ct.title     AS contact_title,
        ct.persona_type AS contact_persona_type,
        ct.do_not_contact AS contact_do_not_contact,
        ct.email_status AS contact_email_status,
        ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct  ON ct.id = l.contact_id
      WHERE l.stage = ${filters.stage}
        AND (
          ct.full_name ILIKE ${pattern}
          OR ct.email ILIKE ${pattern}
          OR co.name ILIKE ${pattern}
        )
      ORDER BY l.fit_score DESC, l.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Promise<LeadRow[]>;
  }

  if (filters?.stage) {
    return sql`
      SELECT
        l.*,
        co.name   AS company_name,
        co.domain AS company_domain,
        co.industry AS company_industry,
        co.city   AS company_city,
        co.state  AS company_state,
        ct.full_name AS contact_name,
        ct.email     AS contact_email,
        ct.title     AS contact_title,
        ct.persona_type AS contact_persona_type,
        ct.do_not_contact AS contact_do_not_contact,
        ct.email_status AS contact_email_status,
        ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct  ON ct.id = l.contact_id
      WHERE l.stage = ${filters.stage}
      ORDER BY l.fit_score DESC, l.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Promise<LeadRow[]>;
  }

  if (filters?.search) {
    const pattern = `%${filters.search}%`;
    return sql`
      SELECT
        l.*,
        co.name   AS company_name,
        co.domain AS company_domain,
        co.industry AS company_industry,
        co.city   AS company_city,
        co.state  AS company_state,
        ct.full_name AS contact_name,
        ct.email     AS contact_email,
        ct.title     AS contact_title,
        ct.persona_type AS contact_persona_type,
        ct.do_not_contact AS contact_do_not_contact,
        ct.email_status AS contact_email_status,
        ct.linkedin_url AS contact_linkedin_url
      FROM leads l
      LEFT JOIN companies co ON co.id = l.company_id
      LEFT JOIN contacts ct  ON ct.id = l.contact_id
      WHERE ct.full_name ILIKE ${pattern}
        OR ct.email ILIKE ${pattern}
        OR co.name ILIKE ${pattern}
      ORDER BY l.fit_score DESC, l.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    ` as unknown as Promise<LeadRow[]>;
  }

  return sql`
    SELECT
      l.*,
      co.name   AS company_name,
      co.domain AS company_domain,
      co.industry AS company_industry,
      co.city   AS company_city,
      co.state  AS company_state,
      ct.full_name AS contact_name,
      ct.email     AS contact_email,
      ct.title     AS contact_title,
      ct.persona_type AS contact_persona_type,
      ct.do_not_contact AS contact_do_not_contact,
      ct.email_status AS contact_email_status,
      ct.linkedin_url AS contact_linkedin_url
    FROM leads l
    LEFT JOIN companies co ON co.id = l.company_id
    LEFT JOIN contacts ct  ON ct.id = l.contact_id
    ORDER BY l.fit_score DESC, l.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as unknown as Promise<LeadRow[]>;
}

export async function getLeadById(id: number) {
  await ensureCrmTables();
  const sql = getSQL();

  const leads = await sql`
    SELECT
      l.*,
      co.name   AS company_name,
      co.domain AS company_domain,
      co.website AS company_website,
      co.industry AS company_industry,
      co.city   AS company_city,
      co.state  AS company_state,
      co.fit_score AS company_fit_score,
      co.fit_summary AS company_fit_summary,
      ct.full_name AS contact_name,
      ct.first_name AS contact_first_name,
      ct.last_name AS contact_last_name,
      ct.email     AS contact_email,
      ct.title     AS contact_title,
      ct.persona_type AS contact_persona_type,
      ct.do_not_contact AS contact_do_not_contact,
      ct.email_status AS contact_email_status,
      ct.linkedin_url AS contact_linkedin_url,
      ct.city AS contact_city,
      ct.state AS contact_state
    FROM leads l
    LEFT JOIN companies co ON co.id = l.company_id
    LEFT JOIN contacts ct  ON ct.id = l.contact_id
    WHERE l.id = ${id}
  `;
  if (!leads[0]) return null;

  const [activities, drafts, notes] = await Promise.all([
    getActivitiesForLead(id),
    getDraftsForLead(id),
    getNotesForLead(id),
  ]);

  return { ...leads[0], activities, drafts, notes };
}

/* ─── Companies ─── */

export async function createCompany(data: {
  name: string;
  domain?: string;
  website?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  fit_score?: number;
  fit_summary?: string;
  source?: string;
  source_metadata?: Record<string, unknown>;
}) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO companies (
      name, domain, website, industry, city, state, country,
      fit_score, fit_summary, source, source_metadata
    ) VALUES (
      ${data.name},
      ${data.domain ?? null},
      ${data.website ?? null},
      ${data.industry ?? null},
      ${data.city ?? null},
      ${data.state ?? null},
      ${data.country ?? "US"},
      ${data.fit_score ?? 0},
      ${data.fit_summary ?? null},
      ${data.source ?? "manual"},
      ${data.source_metadata ? JSON.stringify(data.source_metadata) : null}
    )
    RETURNING *
  `;
  return rows[0];
}

/* ─── Contacts ─── */

export async function createContact(data: {
  company_id?: number;
  full_name: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  email: string;
  email_status?: string;
  city?: string;
  state?: string;
  country?: string;
  linkedin_url?: string;
  source?: string;
  source_contact_id?: string;
  persona_type?: string;
}) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO contacts (
      company_id, full_name, first_name, last_name, title,
      email, email_status, city, state, country,
      linkedin_url, source, source_contact_id, persona_type
    ) VALUES (
      ${data.company_id ?? null},
      ${data.full_name},
      ${data.first_name ?? null},
      ${data.last_name ?? null},
      ${data.title ?? null},
      ${data.email},
      ${data.email_status ?? "valid"},
      ${data.city ?? null},
      ${data.state ?? null},
      ${data.country ?? "US"},
      ${data.linkedin_url ?? null},
      ${data.source ?? "manual"},
      ${data.source_contact_id ?? null},
      ${data.persona_type ?? "other"}
    )
    RETURNING *
  `;
  return rows[0];
}

/* ─── Leads CRUD ─── */

export async function createLead(data: {
  company_id: number;
  contact_id: number;
  fit_score?: number;
  fit_reason?: string;
  pain_point_summary?: string;
  outreach_angle?: string;
  stage?: string;
  owner?: string;
  next_action?: string;
  next_action_at?: string;
  last_contacted_at?: string;
  manual_review_required?: boolean;
  approved_for_send?: boolean;
}) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO leads (
      company_id, contact_id, fit_score, fit_reason,
      pain_point_summary, outreach_angle, stage, owner,
      next_action, next_action_at, last_contacted_at,
      manual_review_required, approved_for_send
    ) VALUES (
      ${data.company_id},
      ${data.contact_id},
      ${data.fit_score ?? 0},
      ${data.fit_reason ?? null},
      ${data.pain_point_summary ?? null},
      ${data.outreach_angle ?? null},
      ${data.stage ?? "candidate"},
      ${data.owner ?? "jordan"},
      ${data.next_action ?? null},
      ${data.next_action_at ?? null},
      ${data.last_contacted_at ?? null},
      ${data.manual_review_required ?? false},
      ${data.approved_for_send ?? false}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function updateLeadStage(id: number, stage: string) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    UPDATE leads
    SET stage = ${stage}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  if (rows[0]) {
    await createActivity({
      lead_id: id,
      contact_id: rows[0].contact_id as number,
      company_id: rows[0].company_id as number,
      type: "stage_change",
      body_preview: `Stage changed to ${stage}`,
    });
  }
  return rows[0] ?? null;
}

export async function updateLead(
  id: number,
  data: Partial<{
    fit_score: number;
    fit_reason: string;
    pain_point_summary: string;
    outreach_angle: string;
    stage: string;
    owner: string;
    next_action: string;
    next_action_at: string;
    last_contacted_at: string;
    manual_review_required: boolean;
    approved_for_send: boolean;
  }>
) {
  await ensureCrmTables();
  const sql = getSQL();

  // Build SET clause dynamically — neon tagged template doesn't support
  // truly dynamic column lists, so we update all fields using COALESCE-style logic.
  const rows = await sql`
    UPDATE leads SET
      fit_score              = COALESCE(${data.fit_score ?? null}, fit_score),
      fit_reason             = COALESCE(${data.fit_reason ?? null}, fit_reason),
      pain_point_summary     = COALESCE(${data.pain_point_summary ?? null}, pain_point_summary),
      outreach_angle         = COALESCE(${data.outreach_angle ?? null}, outreach_angle),
      stage                  = COALESCE(${data.stage ?? null}, stage),
      owner                  = COALESCE(${data.owner ?? null}, owner),
      next_action            = COALESCE(${data.next_action ?? null}, next_action),
      next_action_at         = COALESCE(${data.next_action_at ?? null}::timestamptz, next_action_at),
      last_contacted_at      = COALESCE(${data.last_contacted_at ?? null}::timestamptz, last_contacted_at),
      manual_review_required = COALESCE(${data.manual_review_required ?? null}, manual_review_required),
      approved_for_send      = COALESCE(${data.approved_for_send ?? null}, approved_for_send),
      updated_at             = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0] ?? null;
}

/* ─── Suppression ─── */

export async function suppressContact(contactId: number, reason?: string) {
  await ensureCrmTables();
  const sql = getSQL();

  // Get contact info
  const contacts = await sql`
    SELECT id, email FROM contacts WHERE id = ${contactId}
  `;
  if (!contacts[0]) throw new Error(`Contact ${contactId} not found`);
  const email = contacts[0].email as string;

  // Update contact
  await sql`
    UPDATE contacts
    SET do_not_contact = TRUE,
        email_status = 'opt_out',
        opt_out_at = NOW(),
        updated_at = NOW()
    WHERE id = ${contactId}
  `;

  // Suppress all leads for this contact
  await sql`
    UPDATE leads
    SET stage = 'suppressed', updated_at = NOW()
    WHERE contact_id = ${contactId}
  `;

  // Create suppression record
  await sql`
    INSERT INTO suppressions (contact_id, email_original, reason)
    VALUES (${contactId}, ${email}, ${reason ?? "opt_out"})
  `;

  // Log activity
  const leads = await sql`
    SELECT id FROM leads WHERE contact_id = ${contactId}
  `;
  for (const lead of leads) {
    await createActivity({
      lead_id: lead.id as number,
      contact_id: contactId,
      type: "suppressed",
      body_preview: `Contact suppressed: ${reason ?? "opt_out"}`,
    });
  }
}

export async function isContactSuppressed(contactId: number): Promise<boolean> {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT 1 FROM contacts
    WHERE id = ${contactId} AND do_not_contact = TRUE
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function isEmailSuppressed(email: string): Promise<boolean> {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT 1 FROM contacts
    WHERE email = ${email} AND do_not_contact = TRUE
    LIMIT 1
  `;
  if (rows.length > 0) return true;

  const suppRows = await sql`
    SELECT 1 FROM suppressions
    WHERE email_original = ${email}
    LIMIT 1
  `;
  return suppRows.length > 0;
}

/* ─── Activities ─── */

export async function createActivity(data: {
  lead_id: number;
  contact_id?: number;
  company_id?: number;
  type: string;
  channel?: string;
  body_preview?: string;
  metadata?: Record<string, unknown>;
}) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO activities (
      lead_id, contact_id, company_id, type, channel, body_preview, metadata
    ) VALUES (
      ${data.lead_id},
      ${data.contact_id ?? null},
      ${data.company_id ?? null},
      ${data.type},
      ${data.channel ?? "email"},
      ${data.body_preview ?? null},
      ${data.metadata ? JSON.stringify(data.metadata) : null}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function getActivitiesForLead(leadId: number) {
  await ensureCrmTables();
  const sql = getSQL();
  return sql`
    SELECT * FROM activities
    WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
  `;
}

/* ─── Email Drafts ─── */

export async function saveDraft(data: {
  lead_id: number;
  subject?: string;
  body_text?: string;
  body_html?: string;
  model?: string;
  persona_type?: string;
  approval_status?: string;
  is_ai_generated?: boolean;
  is_manually_edited?: boolean;
}) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO email_drafts (
      lead_id, subject, body_text, body_html, model,
      persona_type, approval_status, is_ai_generated, is_manually_edited
    ) VALUES (
      ${data.lead_id},
      ${data.subject ?? null},
      ${data.body_text ?? null},
      ${data.body_html ?? null},
      ${data.model ?? null},
      ${data.persona_type ?? null},
      ${data.approval_status ?? "draft"},
      ${data.is_ai_generated ?? false},
      ${data.is_manually_edited ?? false}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function getDraftsForLead(leadId: number) {
  await ensureCrmTables();
  const sql = getSQL();
  return sql`
    SELECT * FROM email_drafts
    WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
  `;
}

export async function markDraftSent(draftId: number) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    UPDATE email_drafts
    SET approval_status = 'sent', sent_at = NOW(), updated_at = NOW()
    WHERE id = ${draftId}
    RETURNING *
  `;
  return rows[0] ?? null;
}

/* ─── Notes ─── */

export async function addNote(leadId: number, body: string) {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO notes (lead_id, body)
    VALUES (${leadId}, ${body})
    RETURNING *
  `;
  return rows[0];
}

export async function getNotesForLead(leadId: number) {
  await ensureCrmTables();
  const sql = getSQL();
  return sql`
    SELECT * FROM notes
    WHERE lead_id = ${leadId}
    ORDER BY created_at DESC
  `;
}

/* ─── Pipeline Stats ─── */

export async function getPipelineStats(): Promise<
  { stage: string; count: number }[]
> {
  await ensureCrmTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT stage, COUNT(*)::int AS count
    FROM leads
    GROUP BY stage
    ORDER BY count DESC
  `;
  return rows as unknown as { stage: string; count: number }[];
}

/* ─── Clear All CRM Data ─── */

export async function clearAllCrmData() {
  await ensureCrmTables();
  const sql = getSQL();
  // Delete in dependency order (children first)
  await sql`DELETE FROM notes`;
  await sql`DELETE FROM email_drafts`;
  await sql`DELETE FROM suppressions`;
  await sql`DELETE FROM activities`;
  await sql`DELETE FROM leads`;
  await sql`DELETE FROM contacts`;
  await sql`DELETE FROM companies`;
  return { message: "All CRM data cleared" };
}

/* ─── Seed Data ─── */

export async function seedTestData() {
  await ensureCrmTables();
  const sql = getSQL();

  // Check if data already exists
  const existing = await sql`SELECT COUNT(*)::int AS count FROM leads`;
  if ((existing[0].count as number) > 0) {
    return { message: "Seed data already exists", skipped: true };
  }

  // --- Company 1: SaaS founder lead ---
  const c1 = await createCompany({
    name: "BluffCity Analytics",
    domain: "bluffcityanalytics.com",
    website: "https://bluffcityanalytics.com",
    industry: "B2B SaaS",
    city: "Memphis",
    state: "TN",
    fit_score: 88,
    fit_summary:
      "Series A B2B SaaS in Memphis. Growing fast, no in-house creative team. Website is outdated and conversion-unfriendly.",
    source: "seed",
  });
  const ct1 = await createContact({
    company_id: c1.id as number,
    full_name: "Marcus Johnson",
    first_name: "Marcus",
    last_name: "Johnson",
    title: "Founder & CEO",
    email: "marcus@bluffcityanalytics.com",
    persona_type: "founder",
    city: "Memphis",
    state: "TN",
    linkedin_url: "https://linkedin.com/in/marcusjohnson-bca",
  });
  const l1 = await createLead({
    company_id: c1.id as number,
    contact_id: ct1.id as number,
    fit_score: 88,
    fit_reason:
      "High-growth B2B SaaS with no creative team. Website redesign is a clear need.",
    pain_point_summary:
      "Current site was built by a dev with Bootstrap. Bounce rate is high, demo requests are low.",
    outreach_angle:
      "Mention their recent Series A and how a brand refresh post-funding accelerates pipeline.",
    stage: "qualified",
    next_action: "Draft outreach email",
  });

  // --- Company 2: Consulting founder ---
  const c2 = await createCompany({
    name: "Rivermark Consulting Group",
    domain: "rivermarkconsulting.com",
    website: "https://rivermarkconsulting.com",
    industry: "Management Consulting",
    city: "Germantown",
    state: "TN",
    fit_score: 72,
    fit_summary:
      "Established consulting firm looking to modernize their brand and attract enterprise clients.",
    source: "seed",
  });
  const ct2 = await createContact({
    company_id: c2.id as number,
    full_name: "David Park",
    first_name: "David",
    last_name: "Park",
    title: "Managing Partner",
    email: "david@rivermarkconsulting.com",
    persona_type: "founder",
    city: "Germantown",
    state: "TN",
  });
  await createLead({
    company_id: c2.id as number,
    contact_id: ct2.id as number,
    fit_score: 72,
    fit_reason:
      "Professional services firm with dated brand. Revenue is strong but brand doesn't match caliber of work.",
    pain_point_summary:
      "Losing RFPs to flashier competitors despite better track record.",
    outreach_angle:
      "Position rebrand as a revenue unlock — tie brand perception to win rate on proposals.",
    stage: "candidate",
    next_action: "Research recent RFP wins/losses",
  });

  // --- Company 3: B2B founder, ready to email ---
  const c3 = await createCompany({
    name: "Mainspring Health Tech",
    domain: "mainspringhealthtech.com",
    website: "https://mainspringhealthtech.com",
    industry: "Health Tech",
    city: "Memphis",
    state: "TN",
    fit_score: 91,
    fit_summary:
      "Fast-growing health tech startup. Just raised seed round. No brand designer on team.",
    source: "seed",
  });
  const ct3 = await createContact({
    company_id: c3.id as number,
    full_name: "Aisha Williams",
    first_name: "Aisha",
    last_name: "Williams",
    title: "Co-Founder & CTO",
    email: "aisha@mainspringhealthtech.com",
    persona_type: "founder",
    city: "Memphis",
    state: "TN",
    linkedin_url: "https://linkedin.com/in/aisha-williams-mht",
  });
  const l3 = await createLead({
    company_id: c3.id as number,
    contact_id: ct3.id as number,
    fit_score: 91,
    fit_reason:
      "Highest-fit lead. Health tech with fresh funding, no design hire, and an urgent product launch.",
    pain_point_summary:
      "Launching patient portal in Q2 but have no brand guidelines or marketing site.",
    outreach_angle:
      "Offer a quick-turn brand sprint to support their product launch timeline.",
    stage: "ready_to_email",
    approved_for_send: true,
    next_action: "Send first outreach email",
  });

  // Create a draft for this lead
  await saveDraft({
    lead_id: l3.id as number,
    subject: "Quick thought on the Mainspring launch",
    body_text: `Hi Aisha,

Congrats on the seed round — exciting times at Mainspring Health Tech.

I noticed you're gearing up for a product launch but don't have a dedicated brand/design person on the team yet. That's actually really common at your stage.

I run Cosmic Reach Creative here in Memphis — we do brand identity and web design specifically for founders who need to look credible fast. We recently helped a local SaaS company go from zero brand to investor-ready in 3 weeks.

Would a 15-minute call make sense to see if we could support your Q2 launch?

Best,
Jordan`,
    model: "claude-sonnet-4-20250514",
    persona_type: "founder",
    is_ai_generated: true,
    approval_status: "approved",
  });

  // --- Company 4: Marketing leader persona ---
  const c4 = await createCompany({
    name: "Southern Grit Outdoor Co",
    domain: "southerngritoutdoor.com",
    website: "https://southerngritoutdoor.com",
    industry: "DTC / E-commerce",
    city: "Nashville",
    state: "TN",
    fit_score: 65,
    fit_summary:
      "DTC outdoor brand with solid product but inconsistent creative. Marketing team of 2.",
    source: "seed",
  });
  const ct4 = await createContact({
    company_id: c4.id as number,
    full_name: "Rachel Torres",
    first_name: "Rachel",
    last_name: "Torres",
    title: "Director of Marketing",
    email: "rachel@southerngritoutdoor.com",
    persona_type: "marketing_leader",
    city: "Nashville",
    state: "TN",
  });
  await createLead({
    company_id: c4.id as number,
    contact_id: ct4.id as number,
    fit_score: 65,
    fit_reason:
      "Marketing leader at a growing DTC brand. Needs overflow creative support for campaigns.",
    pain_point_summary:
      "Small marketing team overwhelmed with seasonal campaigns. Inconsistent brand across channels.",
    outreach_angle:
      "Pitch fractional creative director model — brand consistency without a full-time hire.",
    stage: "emailed",
    next_action: "Follow up in 5 days if no reply",
  });

  // --- Company 5: Marketing leader, replied positive ---
  const c5 = await createCompany({
    name: "Orion Wealth Partners",
    domain: "orionwealthpartners.com",
    website: "https://orionwealthpartners.com",
    industry: "Financial Services",
    city: "Memphis",
    state: "TN",
    fit_score: 78,
    fit_summary:
      "RIA firm with strong AUM growth. Needs brand differentiation from commodity competitors.",
    source: "seed",
  });
  const ct5 = await createContact({
    company_id: c5.id as number,
    full_name: "Karen Mitchell",
    first_name: "Karen",
    last_name: "Mitchell",
    title: "VP of Marketing",
    email: "karen@orionwealthpartners.com",
    persona_type: "marketing_leader",
    city: "Memphis",
    state: "TN",
    linkedin_url: "https://linkedin.com/in/karenmitchell-owp",
  });
  const l5 = await createLead({
    company_id: c5.id as number,
    contact_id: ct5.id as number,
    fit_score: 78,
    fit_reason:
      "Marketing VP at a growing RIA. Already expressed interest in brand work.",
    pain_point_summary:
      "Looks like every other wealth management firm. Losing younger clients to modern robo-advisors.",
    outreach_angle:
      "Help them stand out in a sea of navy-and-gold financial brands with a modern identity refresh.",
    stage: "replied_positive",
    last_contacted_at: new Date().toISOString(),
    next_action: "Schedule discovery call",
  });
  await createActivity({
    lead_id: l5.id as number,
    contact_id: ct5.id as number,
    company_id: c5.id as number,
    type: "reply_logged",
    body_preview:
      "Karen replied: 'This is great timing — we've been talking about a rebrand. Let's connect.'",
  });

  // --- Company 6: Suppressed lead (tests red UI) ---
  const c6 = await createCompany({
    name: "Delta Freight Logistics",
    domain: "deltafreightlogistics.com",
    website: "https://deltafreightlogistics.com",
    industry: "Logistics",
    city: "Memphis",
    state: "TN",
    fit_score: 45,
    fit_summary: "Logistics company. Low brand priority. Contact opted out.",
    source: "seed",
  });
  const ct6 = await createContact({
    company_id: c6.id as number,
    full_name: "Brian Caldwell",
    first_name: "Brian",
    last_name: "Caldwell",
    title: "Operations Manager",
    email: "brian@deltafreightlogistics.com",
    persona_type: "other",
    city: "Memphis",
    state: "TN",
  });
  const l6 = await createLead({
    company_id: c6.id as number,
    contact_id: ct6.id as number,
    fit_score: 45,
    fit_reason: "Low fit — logistics company with minimal brand needs.",
    pain_point_summary: "N/A — contact opted out before discovery.",
    outreach_angle: "N/A",
    stage: "candidate",
  });

  // Suppress this contact
  await suppressContact(ct6.id as number, "Replied asking not to be contacted");

  // Add a note on the positive-reply lead
  await addNote(
    l5.id as number,
    "Karen seems very engaged. She mentioned they have budget allocated for Q2. Follow up Monday."
  );

  return { message: "Seed data created", skipped: false };
}
