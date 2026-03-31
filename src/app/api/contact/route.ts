import { NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { brandedEmailShell, emailCard, emailSectionLabel, emailField } from "@/lib/email-template";

const NOTIFY_EMAIL = "jordan@cosmicreachcreative.com";

export async function POST(request: Request) {
  try {
    const rateLimitResult = checkRateLimit(request, 5, 15 * 60 * 1000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Send notification email via mailto-style approach:
    // In production, integrate with a transactional email service
    // (Resend, SendGrid, Postmark, etc). For now, we log and return success.
    // The Vercel deployment can be connected to any email provider.
    /* Save to DB regardless of email status */
    await saveContactSubmission({ name, email, company, message }).catch(console.error);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set -email not sent.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cosmic Reach <noreply@cosmicreachcreative.com>",
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject: `New inquiry from ${name}`,
        html: brandedEmailShell(
          emailCard(`
            ${emailSectionLabel("New Contact Inquiry")}
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              ${emailField("Name", name)}
              ${emailField("Email", email)}
              ${emailField("Company", company || "N/A")}
            </table>
            <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(232,223,207,0.06);">
              <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600; margin:0 0 8px;">Message</p>
              <p style="font-size:14px; color:rgba(232,223,207,0.7); line-height:1.6; margin:0; white-space:pre-wrap;">${message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />")}</p>
            </div>
          `)
        ),
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.json().catch(() => ({}));
      console.error("Resend error:", JSON.stringify(err));
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process submission." },
      { status: 500 }
    );
  }
}
