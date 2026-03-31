import { requireTenantAccess } from "@/lib/mc-session";
import { LeadsView } from "./LeadsView";
import { getContactSubmissions, getAuditSubmissions } from "@/lib/db";

interface Submission {
  id: number;
  type: "contact" | "audit";
  name: string;
  email: string;
  company: string | null;
  message: string | null;
  website: string | null;
  status: string;
  notes: string;
  created_at: string;
}

async function getLeadsData() {
  const [contacts, audits] = await Promise.all([
    getContactSubmissions().catch(() => []),
    getAuditSubmissions().catch(() => []),
  ]);

  const submissions: Submission[] = [
    ...(contacts as Record<string, unknown>[]).map((c) => ({
      id: c.id as number,
      type: "contact" as const,
      name: c.name as string,
      email: c.email as string,
      company: (c.company as string) || null,
      message: (c.message as string) || null,
      website: null,
      status: (c.status as string) || "new",
      notes: (c.notes as string) || "",
      created_at: String(c.created_at),
    })),
    ...(audits as Record<string, unknown>[]).map((a) => ({
      id: a.id as number,
      type: "audit" as const,
      name: a.name as string,
      email: a.email as string,
      company: (a.company as string) || null,
      message: (a.what_is_stuck as string) || null,
      website: (a.website as string) || null,
      status: (a.status as string) || "new",
      notes: (a.notes as string) || "",
      created_at: String(a.created_at),
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return { submissions };
}

export default async function LeadsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  await requireTenantAccess(tenantSlug);
  const data = await getLeadsData();

  return <LeadsView tenantSlug={tenantSlug} submissions={data.submissions} />;
}
