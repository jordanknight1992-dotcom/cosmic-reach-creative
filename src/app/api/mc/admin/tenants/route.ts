import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/mc-auth";
import {
  createTenant,
  getTenantBySlug,
  addUserToTenant,
  getUserByEmail,
  logAudit,
} from "@/lib/mc-db";

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("mc_session")?.value;
  if (!sessionId) return null;

  const session = await validateSession(sessionId);
  if (!session || !session.user.is_super_admin) return null;

  return session;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const session = await requireSuperAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { name, ownerEmail, industry, timezone, domain, isRetainer } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Company name is required (min 2 chars)" }, { status: 400 });
  }

  const slug = slugify(name.trim());
  if (!slug) {
    return NextResponse.json({ error: "Could not generate a valid URL slug from that name" }, { status: 400 });
  }

  // Check slug isn't taken
  const existing = await getTenantBySlug(slug);
  if (existing) {
    return NextResponse.json({ error: `Slug "${slug}" is already taken` }, { status: 409 });
  }

  // Create the tenant
  const tenant = await createTenant({
    name: name.trim(),
    slug,
    domain: domain?.trim() || null,
    industry: industry?.trim() || null,
    timezone: timezone?.trim() || "America/Chicago",
  });

  // If is_retainer, update the flag
  if (isRetainer) {
    const { getSQL } = await import("@/lib/mc-db");
    const sql = getSQL();
    await sql`UPDATE tenants SET is_retainer_client = TRUE WHERE id = ${tenant.id}`;
  }

  // If an owner email was provided, link that user to the tenant
  let ownerLinked = false;
  if (ownerEmail && typeof ownerEmail === "string") {
    const user = await getUserByEmail(ownerEmail.trim().toLowerCase());
    if (user) {
      await addUserToTenant(tenant.id, user.id, "owner");
      ownerLinked = true;
    }
  }

  await logAudit({
    user_id: session.user.id,
    tenant_id: tenant.id,
    action: "tenant_created_by_admin",
    resource: "tenants",
    metadata: { name: tenant.name, slug: tenant.slug, ownerEmail, ownerLinked, isRetainer: !!isRetainer },
  });

  return NextResponse.json({
    ok: true,
    tenant: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      url: `/mission-control/${tenant.slug}`,
    },
    ownerLinked,
  });
}
