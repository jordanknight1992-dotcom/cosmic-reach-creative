import { NextResponse } from "next/server";
import {
  brandedEmailShell,
  emailCard,
  emailSectionLabel,
  emailParagraph,
  emailButton,
  emailField,
  emailInfoBlock,
} from "@/lib/email-template";

/**
 * Temporary endpoint — sends test versions of all branded emails.
 * DELETE THIS after verifying templates.
 *
 * GET /api/mc/test-emails?to=jordan@cosmicreachcreative.com
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to");

  if (!to) {
    return NextResponse.json({ error: "?to= param required" }, { status: 400 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const results: Record<string, string> = {};

  // 1. Password Reset
  const resetHtml = brandedEmailShell(
    emailCard(`
      ${emailSectionLabel("Password Reset")}
      ${emailParagraph("Hi Jordan,")}
      ${emailParagraph("We received a request to reset your Mission Control password. Click the button below to set a new one.")}
      ${emailButton("Reset Password", "https://www.cosmicreachcreative.com/mission-control/reset-password?token=sample")}
      ${emailParagraph("This link expires in 1 hour. If you did not request this, you can safely ignore this email.")}
    `)
  );

  const r1 = await sendEmail(to, "[TEST] Password Reset", resetHtml);
  results["password_reset"] = r1;

  // 2. Contact Form Notification
  const contactHtml = brandedEmailShell(
    emailCard(`
      ${emailSectionLabel("New Contact Inquiry")}
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${emailField("Name", "Sarah Chen")}
        ${emailField("Email", "sarah@example.com")}
        ${emailField("Company", "Brightline Consulting")}
      </table>
      <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(232,223,207,0.06);">
        <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600; margin:0 0 8px;">Message</p>
        <p style="font-size:14px; color:rgba(232,223,207,0.7); line-height:1.6; margin:0;">Hi, I found your site through a Google search. Our website is not generating any leads and we are considering a full rebuild. Can we talk about what that would look like?</p>
      </div>
    `)
  );

  const r2 = await sendEmail(to, "[TEST] Contact Form Inquiry", contactHtml);
  results["contact_form"] = r2;

  // 3. Audit Intake Notification
  const auditHtml = brandedEmailShell(
    emailCard(`
      ${emailSectionLabel("New Clarity Audit Intake")}
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        ${emailField("Name", "Marcus Rivera")}
        ${emailField("Email", "marcus@routefreight.com")}
        ${emailField("Company", "Route Freight")}
        ${emailField("Website", "https://routefreight.com")}
      </table>
    `) +
    emailCard(`
      ${emailSectionLabel("Business Context")}
      ${emailInfoBlock(`
        <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600; margin:0 0 6px;">What does your business do?</p>
        <p style="font-size:13px; color:rgba(232,223,207,0.65); line-height:1.5; margin:0;">We are a regional freight logistics company serving the mid-south. We help manufacturers and distributors move product between warehouses and retail locations.</p>
      `)}
      ${emailInfoBlock(`
        <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600; margin:0 0 6px;">What feels stuck right now?</p>
        <p style="font-size:13px; color:rgba(232,223,207,0.65); line-height:1.5; margin:0;">Our website gets traffic from trade shows but almost zero conversions. People visit but do not reach out. We think the site does not explain what we do clearly enough.</p>
      `)}
      ${emailInfoBlock(`
        <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600; margin:0 0 6px;">Primary goal (6-12 months)</p>
        <p style="font-size:13px; color:rgba(232,223,207,0.65); line-height:1.5; margin:0;">Generate 10-15 qualified inbound leads per month from the website instead of relying entirely on trade shows and referrals.</p>
      `)}
    `)
  );

  const r3 = await sendEmail(to, "[TEST] Audit Intake", auditHtml);
  results["audit_intake"] = r3;

  return NextResponse.json({ sent: true, results });
}

async function sendEmail(to: string, subject: string, html: string): Promise<string> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cosmic Reach <noreply@cosmicreachcreative.com>",
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return `error: ${JSON.stringify(err)}`;
    }
    return "sent";
  } catch (err) {
    return `error: ${String(err)}`;
  }
}
