import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/mc-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { brandedEmailShell, emailCard, emailSectionLabel, emailParagraph, emailButton } from "@/lib/email-template";

export async function POST(request: Request) {
  try {
    const rateLimitResult = checkRateLimit(request, 3, 15 * 60 * 1000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await requestPasswordReset(email);

    // Always return success to prevent email enumeration
    if ("error" in result) {
      return NextResponse.json({ success: true });
    }

    const { token, user } = result;
    const resetUrl = `${new URL(request.url).origin}/mission-control/reset-password?token=${token}`;

    // Send reset email via Resend
    if (process.env.RESEND_API_KEY) {
      const html = brandedEmailShell(
        emailCard(`
          ${emailSectionLabel("Password Reset")}
          ${emailParagraph(`Hi ${user.full_name},`)}
          ${emailParagraph("We received a request to reset your Mission Control password. Click the button below to set a new one.")}
          ${emailButton("Reset Password", resetUrl)}
          ${emailParagraph("This link expires in 1 hour. If you did not request this, you can safely ignore this email.")}
        `)
      );

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Mission Control <noreply@cosmicreachcreative.com>",
          to: [user.email],
          subject: "Reset your Mission Control password",
          html,
        }),
      });
    } else {
      console.error("RESEND_API_KEY not set - password reset email skipped");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
