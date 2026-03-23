import { NextRequest, NextResponse } from "next/server";
import { validateSession, getSessionCookieName } from "@/lib/mc-auth";
import {
  getTenantBySlug,
  isUserInTenant,
  createImportJob,
  updateImportJob,
  getImportJobs,
  logAudit,
} from "@/lib/mc-db";
import { ensureCrmTables } from "@/lib/crm-db";
import {
  parseCSV,
  suggestFieldMappings,
  normalizeRecord,
  isUsableRecord,
  type StandardField,
} from "@/lib/import-mapper";

/**
 * GET /api/mc/imports?tenantSlug=xxx
 * Get import history
 */
export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tenantSlug = request.nextUrl.searchParams.get("tenantSlug");
  if (!tenantSlug) return NextResponse.json({ error: "Tenant slug required" }, { status: 400 });

  const tenant = await getTenantBySlug(tenantSlug);
  if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
  if (!hasAccess && !ctx.user.is_super_admin) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const jobs = await getImportJobs(tenant.id);
  return NextResponse.json({ imports: jobs });
}

/**
 * POST /api/mc/imports
 * Actions: preview, import
 */
export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(getSessionCookieName())?.value;
  if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ctx = await validateSession(sessionId);
  if (!ctx) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";
  const ipAddress = request.headers.get("x-forwarded-for") || "unknown";

  // Handle multipart form data (file upload for preview)
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const tenantSlug = formData.get("tenantSlug") as string;

    if (!file || !tenantSlug) {
      return NextResponse.json({ error: "File and tenant required" }, { status: 400 });
    }

    const tenant = await getTenantBySlug(tenantSlug);
    if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
    if (!hasAccess && !ctx.user.is_super_admin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Parse CSV/TSV
    const text = await file.text();
    const rows = parseCSV(text);
    if (rows.length < 2) {
      return NextResponse.json({ error: "File must have at least a header row and one data row" }, { status: 400 });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1, 6); // Preview first 5 rows
    const mappingSuggestions = suggestFieldMappings(headers, dataRows);

    return NextResponse.json({
      preview: {
        filename: file.name,
        totalRows: rows.length - 1,
        headers,
        sampleRows: dataRows,
        suggestedMapping: mappingSuggestions,
      },
    });
  }

  // Handle JSON body (confirm import)
  const body = await request.json();
  const { action } = body;

  if (action === "import") {
    const { tenantSlug, csvData, mapping, filename } = body;
    if (!tenantSlug || !csvData || !mapping) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const tenant = await getTenantBySlug(tenantSlug);
    if (!tenant) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const hasAccess = await isUserInTenant(ctx.user.id, tenant.id);
    if (!hasAccess && !ctx.user.is_super_admin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await ensureCrmTables();
    const { getSQL } = await import("@/lib/mc-db");
    const sql = getSQL();

    const rows = parseCSV(csvData);
    if (rows.length < 2) {
      return NextResponse.json({ error: "No data rows found" }, { status: 400 });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Create import job
    const job = await createImportJob({
      tenant_id: tenant.id,
      user_id: ctx.user.id,
      filename: filename || "import.csv",
      source_type: "csv",
      row_count: dataRows.length,
      field_mapping: mapping,
    });

    let imported = 0;
    let duplicates = 0;
    let failed = 0;
    const errors: unknown[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      try {
        // Build record from row
        const rowData: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowData[h] = dataRows[i][idx] || "";
        });

        const normalized = normalizeRecord(rowData, mapping as Record<string, StandardField>);

        if (!isUsableRecord(normalized)) {
          failed++;
          errors.push({ row: i + 2, reason: "Missing required fields (name or email)" });
          continue;
        }

        // Check for duplicate by email within tenant
        const existingContacts = await sql`
          SELECT id FROM contacts
          WHERE email = ${normalized.email} AND tenant_id = ${tenant.id}
          LIMIT 1
        `;

        if (existingContacts.length > 0) {
          duplicates++;
          continue;
        }

        // Insert or find company
        let companyId: number | null = null;
        if (normalized.company) {
          const existingCompany = await sql`
            SELECT id FROM companies
            WHERE (name = ${normalized.company} OR domain = ${normalized.domain})
              AND tenant_id = ${tenant.id}
            LIMIT 1
          `;

          if (existingCompany.length > 0) {
            companyId = existingCompany[0].id as number;
          } else {
            const newCompany = await sql`
              INSERT INTO companies (name, domain, website, industry, city, state, country, source, tenant_id)
              VALUES (
                ${normalized.company}, ${normalized.domain || null},
                ${normalized.website || null}, ${normalized.industry || null},
                ${normalized.city || null}, ${normalized.state || null},
                ${normalized.country || "US"}, 'import', ${tenant.id}
              )
              RETURNING id
            `;
            companyId = newCompany[0].id as number;
          }
        }

        // Insert contact
        const newContact = await sql`
          INSERT INTO contacts (
            company_id, full_name, first_name, last_name, title, email,
            city, state, country, linkedin_url, source, persona_type, tenant_id
          )
          VALUES (
            ${companyId}, ${normalized.full_name}, ${normalized.first_name || null},
            ${normalized.last_name || null}, ${normalized.title || null},
            ${normalized.email}, ${normalized.city || null}, ${normalized.state || null},
            ${normalized.country || "US"}, ${normalized.linkedin_url || null},
            'import', 'other', ${tenant.id}
          )
          RETURNING id
        `;

        // Create lead
        await sql`
          INSERT INTO leads (company_id, contact_id, stage, owner, source, tenant_id)
          VALUES (${companyId}, ${newContact[0].id}, 'candidate', ${ctx.user.full_name}, 'import', ${tenant.id})
        `;

        imported++;
      } catch (err) {
        failed++;
        errors.push({ row: i + 2, reason: String(err) });
      }
    }

    // Update job
    await updateImportJob(job.id, {
      imported,
      duplicates,
      failed,
      status: "completed",
      error_log: errors.slice(0, 50), // Cap error log
      completed_at: new Date().toISOString(),
    });

    await logAudit({
      user_id: ctx.user.id,
      tenant_id: tenant.id,
      action: "leads_imported",
      resource: "import_job",
      resource_id: String(job.id),
      metadata: { imported, duplicates, failed, filename: filename || "import.csv" },
      ip_address: ipAddress,
    });

    return NextResponse.json({
      result: {
        jobId: job.id,
        imported,
        duplicates,
        failed,
        total: dataRows.length,
        errors: errors.slice(0, 10),
      },
    });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
