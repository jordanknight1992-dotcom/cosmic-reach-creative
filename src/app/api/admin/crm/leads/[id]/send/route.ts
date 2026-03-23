import { NextRequest, NextResponse } from "next/server";
import {
  getLeadById,
  isContactSuppressed,
  markDraftSent,
  updateLead,
  createActivity,
} from "@/lib/crm-db";

const DOMAIN = "https://www.cosmicreachcreative.com";
const LOGO_URL = "https://cosmicreachcreative.com/logo/logo-primary-dark.png";
const FROM = "Jordan at Cosmic Reach <jordan@cosmicreachcreative.com>";
const REPLY_TO = "jordan@cosmicreachcreative.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function outreachEmailShell(bodyHtml: string, contactEmail: string): string {
  const unsubscribeUrl = `${DOMAIN}/unsubscribe?email=${encodeURIComponent(contactEmail)}`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <style>
    body, table, td { font-family: -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#0b1120;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1120;"><tr><td><![endif]-->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#0b1120;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="520" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px; width:100%;">
          <!-- Logo Header -->
          <tr>
            <td style="padding:0 0 28px; text-align:center;">
              <a href="${DOMAIN}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="Cosmic Reach Creative" width="180" style="display:inline-block; max-width:180px; height:auto;" />
              </a>
            </td>
          </tr>
          <!-- Email Body -->
          <tr>
            <td style="background-color:#111827; border-radius:12px; border:1px solid rgba(212,165,116,0.15); padding:28px 24px;">
              <div style="font-size:15px; line-height:1.6; color:#e8dfcf;">
                ${bodyHtml}
              </div>
            </td>
          </tr>
          <!-- Compliance Footer -->
          <tr>
            <td style="padding:24px 0 0; text-align:center;">
              <p style="font-size:12px; color:rgba(232,223,207,0.25); margin:0; line-height:1.5;">
                Cosmic Reach Creative | 169 Mysen Cir, Cordova, TN 38018
              </p>
              <p style="font-size:12px; color:rgba(232,223,207,0.25); margin:6px 0 0; line-height:1.5;">
                <a href="${unsubscribeUrl}" style="color:rgba(212,165,116,0.5); text-decoration:underline;">Unsubscribe</a>
                &nbsp;·&nbsp;
                <a href="${DOMAIN}" style="color:rgba(212,165,116,0.5); text-decoration:none;">cosmicreachcreative.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso]></td></tr></table><![endif]-->
</body>
</html>`.trim();
}

async function resendSend(payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
}): Promise<{ id: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const errMsg = `Resend error (${res.status}): ${JSON.stringify(err)}`;
    console.error(errMsg);
    throw new Error(errMsg);
  }
  const result = await res.json().catch(() => ({}));
  console.log("Resend email sent:", result.id, "to:", payload.to);
  return result;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id, 10);
    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "RESEND_API_KEY not configured" },
        { status: 500 }
      );
    }

    const lead = await getLeadById(leadId) as Record<string, unknown> | null;
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Check suppression before sending
    const suppressed = await isContactSuppressed(lead.contact_id as number);
    if (suppressed) {
      return NextResponse.json(
        { error: "Contact is suppressed. Cannot send email." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { draft_id, subject, body_text, body_html } = body;

    if (!subject || !body_text) {
      return NextResponse.json(
        { error: "subject and body_text are required" },
        { status: 400 }
      );
    }

    const contactEmail = lead.contact_email as string;
    const htmlContent = body_html || `<p>${escapeHtml(body_text).replace(/\n/g, "<br/>")}</p>`;
    const fullHtml = outreachEmailShell(htmlContent, contactEmail);

    const result = await resendSend({
      from: FROM,
      to: [contactEmail],
      reply_to: REPLY_TO,
      subject,
      html: fullHtml,
    });

    // Mark draft as sent if draft_id provided
    if (draft_id) {
      await markDraftSent(draft_id);
    }

    // Update lead stage to emailed and last_contacted_at
    await updateLead(leadId, {
      stage: "emailed",
      last_contacted_at: new Date().toISOString(),
    });

    // Create activity record
    await createActivity({
      lead_id: leadId,
      contact_id: lead.contact_id as number,
      company_id: lead.company_id as number,
      type: "email_sent",
      channel: "email",
      body_preview: `Subject: ${subject}`,
      metadata: { resend_id: result.id, draft_id },
    });

    return NextResponse.json({
      success: true,
      email_id: result.id,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
