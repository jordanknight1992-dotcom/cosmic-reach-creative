import { NextRequest, NextResponse } from "next/server";
import {
  getPostById,
  getActiveSubscribers,
  markEmailSent,
} from "@/lib/blog-db";
import { buildNewPostEmail } from "@/lib/blog-email-template";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);

    const post = await getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.status !== "published") {
      return NextResponse.json(
        { error: "Post must be published before sending email" },
        { status: 400 }
      );
    }

    if (post.publish_email_sent) {
      return NextResponse.json(
        { error: "Email already sent" },
        { status: 400 }
      );
    }

    const subscribers = await getActiveSubscribers();
    if (subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active subscribers",
        sent: 0,
      });
    }

    const articleUrl = `https://cosmicreachcreative.com/observatory/${post.slug}`;
    const plainText = [
      post.title,
      "",
      post.excerpt ?? "",
      "",
      `Read the full article: ${articleUrl}`,
    ].join("\n");

    const BATCH_SIZE = 100;
    let totalSent = 0;
    let lastMessageId = "";

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const emails = batch.map((sub) => {
        const unsubscribeUrl = `https://cosmicreachcreative.com/api/observatory/unsubscribe?token=${sub.unsubscribe_token}`;
        const html = buildNewPostEmail(post, unsubscribeUrl);
        return {
          from: "Cosmic Reach Creative <hello@cosmicreachcreative.com>",
          to: sub.email,
          subject: `New from The Observatory: ${post.title}`,
          html,
          text: plainText,
        };
      });

      const res = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emails),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend batch error:", detail);
        return NextResponse.json(
          { error: "Failed to send emails", detail },
          { status: 500 }
        );
      }

      const result = await res.json();
      totalSent += batch.length;

      if (result.data && result.data.length > 0) {
        lastMessageId = result.data[0].id;
      }
    }

    await markEmailSent(postId, lastMessageId);

    return NextResponse.json({
      success: true,
      sent: totalSent,
      messageId: lastMessageId,
    });
  } catch (err) {
    console.error("Failed to send post email:", err);
    return NextResponse.json(
      { error: "Failed to send email notification" },
      { status: 500 }
    );
  }
}
