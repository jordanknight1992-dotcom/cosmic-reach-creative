import { NextResponse } from "next/server";

const NOTIFY_EMAIL = "jordan@cosmicreachcreative.com";

export async function POST(request: Request) {
  try {
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
    console.log("=== NEW CONTACT FORM SUBMISSION ===");
    console.log(`To: ${NOTIFY_EMAIL}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Company: ${company || "N/A"}`);
    console.log(`Message: ${message}`);
    console.log("===================================");

    // If RESEND_API_KEY is set, send a real email
    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Cosmic Reach <noreply@cosmicreachcreative.com>",
          to: [NOTIFY_EMAIL],
          subject: `New inquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\n\nMessage:\n${message}`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process submission." },
      { status: 500 }
    );
  }
}
