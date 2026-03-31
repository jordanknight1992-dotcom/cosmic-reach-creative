import { requireTenantAccess } from "@/lib/mc-session";
import { LeadsView } from "./LeadsView";
import { getContactSubmissions, getAuditSubmissions } from "@/lib/db";
import { getSQL, ensureMcTables } from "@/lib/mc-db";

interface Lead {
  id: number;
  source: "contact" | "audit" | "manual";
  name: string;
  email: string;
  company: string | null;
  website: string | null;
  status: string;
  revenue: number | null;
  notes: string;
  created_at: string;
}

async function getManualLeads(tenantId: number): Promise<Lead[]> {
  try {
    await ensureMcTables();
    const sql = getSQL();
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS manual_leads (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id) NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        website TEXT,
        status TEXT DEFAULT 'lead',
        revenue NUMERIC(10,2),
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    const rows = await sql`SELECT * FROM manual_leads WHERE tenant_id = ${tenantId} ORDER BY created_at DESC`;
    return (rows as unknown as Record<string, unknown>[]).map((r) => ({
      id: r.id as number,
      source: "manual" as const,
      name: r.name as string,
      email: r.email as string,
      company: (r.company as string) || null,
      website: (r.website as string) || null,
      status: (r.status as string) || "lead",
      revenue: r.revenue != null ? Number(r.revenue) : null,
      notes: (r.notes as string) || "",
      created_at: String(r.created_at),
    }));
  } catch {
    return [];
  }
}

async function getLeadsData(tenantId: number) {
  const [contacts, audits, manual] = await Promise.all([
    getContactSubmissions().catch(() => []),
    getAuditSubmissions().catch(() => []),
    getManualLeads(tenantId),
  ]);

  const leads: Lead[] = [
    ...(contacts as Record<string, unknown>[]).map((c) => ({
      id: c.id as number,
      source: "contact" as const,
      name: c.name as string,
      email: c.email as string,
      company: (c.company as string) || null,
      website: null,
      status: (c.status as string) || "lead",
      revenue: null,
      notes: (c.notes as string) || "",
      created_at: String(c.created_at),
    })),
    ...(audits as Record<string, unknown>[]).map((a) => ({
      id: a.id as number,
      source: "audit" as const,
      name: a.name as string,
      email: a.email as string,
      company: (a.company as string) || null,
      website: (a.website as string) || null,
      status: (a.status as string) || "audit_purchased",
      revenue: null,
      notes: (a.notes as string) || "",
      created_at: String(a.created_at),
    })),
    ...manual,
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return { leads };
}

export default async function LeadsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getLeadsData(tenant.id);

  return <LeadsView tenantSlug={tenantSlug} leads={data.leads} />;
}
