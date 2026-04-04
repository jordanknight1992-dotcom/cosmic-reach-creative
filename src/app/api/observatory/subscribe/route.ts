import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/blog-db";
import { buildWelcomeEmail } from "@/lib/blog-email-template";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const subscriber = await addSubscriber(email);

    try {
      const unsubscribeUrl = `https://cosmicreachcreative.com/api/observatory/unsubscribe?token=${subscriber.unsubscribe_token}`;
      const html = buildWelcomeEmail(unsubscribeUrl);

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Cosmic Reach Creative <hello@cosmicreachcreative.com>",
          to: subscriber.email,
          subject: "Welcome to The Observatory",
          html,
          text: "Welcome to The Observatory. You'll receive new articles as they're published.",
        }),
      });
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ success: true });
  }
}
