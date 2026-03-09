import { NextResponse } from "next/server";

const NOTIFY_EMAIL = "jordan@cosmicreachcreative.com";

export async function POST(request: Request) {
  try {
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

    const emailText = [
      "=== NEW BUSINESS CLARITY AUDIT INTAKE ===",
      "",
      `Name:        ${name}`,
      `Email:       ${email}`,
      `Company:     ${company || "N/A"}`,
      `Website:     ${website || "N/A"}`,
      "",
      "--- Business Context ---",
      `What does your business do?\n${businessDescription}`,
      "",
      `What feels stuck right now?\n${whatIsStuck}`,
      "",
      `Primary goal (6–12 months):\n${primaryGoal || "N/A"}`,
      "",
      `Key offers or services:\n${keyOffers || "N/A"}`,
      "",
      `Ideal customer:\n${idealCustomer || "N/A"}`,
      "",
      `Anything else to review:\n${anythingElse || "N/A"}`,
      "",
      `Supporting links:\n${supportingLinks || "N/A"}`,
      "",
      "==========================================",
    ].join("\n");

    console.log(emailText);

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
          subject: `New Clarity Audit Intake — ${name}${company ? ` (${company})` : ""}`,
          text: emailText,
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
