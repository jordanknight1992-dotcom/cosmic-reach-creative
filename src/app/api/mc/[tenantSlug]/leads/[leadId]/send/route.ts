import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateTenantAccess, getSessionCookieName, resolveCredential } from "@/lib/mc-auth";
import { getSQL, logAudit } from "@/lib/mc-db";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function outreachEmailHtml(bodyText: string, senderName: string, businessName: string): string {
  const bodyHtml = `<p>${escapeHtml(bodyText).replace(/\n/g, "<br/>")}</p>`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body, table, td { font-family: -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px; width:100%;">
          <tr>
            <td style="background-color:#ffffff; border-radius:8px; border:1px solid #e5e7eb; padding:28px 24px;">
              <div style="font-size:15px; line-height:1.7; color:#1f2937;">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 0 0; text-align:center;">
              <p style="font-size:12px; color:#9ca3af; margin:0;">
                Sent by ${escapeHtml(senderName)} at ${escapeHtml(businessName)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tenantSlug: string; leadId: string }> }
) {
  try {
    const { tenantSlug, leadId } = await params;
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(getSessionCookieName())?.value;
    if (!sessionId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await validateTenantAccess(sessionId, tenantSlug);
    if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

    const tenantId = result.ctx.tenantId;
    const leadIdNum = parseInt(leadId, 10);
    if (isNaN(leadIdNum)) return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });

    // Resolve Resend API key
    const resendCred = await resolveCredential(tenantId, "resend");
    if (!resendCred) {
      return NextResponse.json({ error: "Resend API key not configured. Add it in Settings > Integrations." }, { status: 400 });
    }

    const sql = getSQL();

    // Get lead with contact info
    const leads = await sql`
      SELECT l.id, l.stage, ct.email AS contact_email, ct.full_name AS contact_name,
             co.name AS company_name
      FROM leads l
      LEFT JOIN contacts ct ON ct.id = l.contact_id
      LEFT JOIN companies co ON co.id = l.company_id
      WHERE l.id = ${leadIdNum} AND l.tenant_id = ${tenantId}
      LIMIT 1
    `;

    if (leads.length === 0) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    const lead = leads[0];
    if (!lead.contact_email) return NextResponse.json({ error: "Lead has no email address" }, { status: 400 });

    // Get tenant goals for sender info
    const { getTenantGoals } = await import("@/lib/mc-db");
    const goals = await getTenantGoals(tenantId);
    const senderName = goals?.sender_name || goals?.business_name || result.ctx.user.full_name;
    const businessName = goals?.business_name || "Mission Control";
    const senderEmail = result.ctx.user.email;

    const body = await request.json();
    const { subject, body_text } = body;

    if (!subject || !body_text) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 });
    }

    const html = outreachEmailHtml(body_text, senderName, businessName);

    // Send via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendCred.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${senderName} <${senderEmail}>`,
        to: [lead.contact_email],
        reply_to: senderEmail,
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.json().catch(() => ({}));
      console.error("Resend error:", err);
      return NextResponse.json({ error: `Email send failed: ${(err as Record<string, unknown>)?.message || resendRes.status}` }, { status: 500 });
    }

    const resendResult = await resendRes.json();

    // Update lead stage to emailed
    await sql`
      UPDATE leads SET stage = 'emailed', last_contacted_at = NOW()
      WHERE id = ${leadIdNum} AND tenant_id = ${tenantId}
    `.catch(() => {});

    // Activity log
    await sql`
      INSERT INTO activities (lead_id, contact_id, company_id, type, channel, body_preview, tenant_id)
      SELECT l.id, l.contact_id, l.company_id, 'email_sent', 'email',
             ${'Subject: ' + subject}, ${tenantId}
      FROM leads l WHERE l.id = ${leadIdNum}
    `.catch(() => {});

    await logAudit({
      user_id: result.ctx.user.id,
      tenant_id: tenantId,
      action: "email_sent",
      resource: "leads",
      metadata: { lead_id: leadIdNum, resend_id: resendResult.id, to: lead.contact_email },
    });

    return NextResponse.json({
      success: true,
      email_id: resendResult.id,
    });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
