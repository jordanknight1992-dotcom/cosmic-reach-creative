import { NextResponse } from "next/server";
import { saveAuditSubmission } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { brandedEmailShell, emailCard, emailSectionLabel, emailField, emailInfoBlock } from "@/lib/email-template";

const NOTIFY_EMAIL = "jordan@cosmicreachcreative.com";

export async function POST(request: Request) {
  try {
    const rateLimitResult = checkRateLimit(request, 3, 60 * 60 * 1000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      company,
      website,
      businessDescription,
      whatIsStuck,
      primaryGoal,
      keyOffers,
      idealCustomer,
      anythingElse,
      supportingLinks,
    } = body;

    if (!name || !email || !businessDescription || !whatIsStuck) {
      return NextResponse.json(
        { error: "Name, email, business description, and what is stuck are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");

    const contextFields = [
      { label: "What does your business do?", value: businessDescription },
      { label: "What feels stuck right now?", value: whatIsStuck },
      { label: "Primary goal (6-12 months)", value: primaryGoal || "N/A" },
      { label: "Key offers or services", value: keyOffers || "N/A" },
      { label: "Ideal customer", value: idealCustomer || "N/A" },
      { label: "Anything else to review", value: anythingElse || "N/A" },
      { label: "Supporting links", value: supportingLinks || "N/A" },
    ];

    const emailHtml = brandedEmailShell(
      emailCard(`
        ${emailSectionLabel("New Clarity Audit Intake")}
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          ${emailField("Name", name)}
          ${emailField("Email", email)}
          ${emailField("Company", company || "N/A")}
          ${emailField("Website", website || "N/A")}
        </table>
      `) +
      emailCard(`
        ${emailSectionLabel("Business Context")}
        ${contextFields.map((f) =>
          emailInfoBlock(`
            <p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:rgba(232,223,207,0.3); font-weight:600; margin:0 0 6px;">${f.label}</p>
            <p style="font-size:13px; color:rgba(232,223,207,0.65); line-height:1.5; margin:0; white-space:pre-wrap;">${esc(f.value)}</p>
          `)
        ).join("")}
      `)
    );

    /* Save to DB regardless of email status */
    await saveAuditSubmission({
      name, email, company, website,
      businessDescription: businessDescription,
      whatIsStuck: whatIsStuck,
      primaryGoal: primaryGoal,
      keyOffers: keyOffers,
      idealCustomer: idealCustomer,
      anythingElse: anythingElse,
      supportingLinks: supportingLinks,
    }).catch(console.error);

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set - email not sent.");
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
        subject: `New Clarity Audit Intake: ${name}${company ? ` (${company})` : ""}`,
        html: emailHtml,
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
