/**
 * Blog-specific email templates for The Observatory newsletter.
 * Builds on the shared branded email template system.
 */

import {
  brandedEmailShell,
  emailCard,
  emailSectionLabel,
  emailParagraph,
  emailButton,
} from "@/lib/email-template";

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string | null;
  category?: string | null;
  reading_time_minutes?: number | null;
  feature_image?: string | null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unsubscribeFooter(unsubscribeUrl: string): string {
  return `
          <tr>
            <td style="padding:20px 0 0; text-align:center;">
              <p style="font-size:12px; color:rgba(232,223,207,0.4); margin:0; line-height:1.6;">
                You're receiving this because you subscribed to The Observatory.<br />
                <a href="${unsubscribeUrl}" style="color:rgba(212,165,116,0.5); text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>`;
}

/**
 * Builds the HTML email sent when a new blog post is published.
 */
export function buildNewPostEmail(
  post: BlogPost,
  unsubscribeUrl: string
): string {
  const titleHtml = escapeHtml(post.title);
  const articleUrl = `https://cosmicreachcreative.com/observatory/${post.slug}`;

  let metaLine = "";

  if (post.category) {
    metaLine += `<span style="display:inline-block; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; color:#d4a574; background-color:rgba(212,165,116,0.08); border:1px solid rgba(212,165,116,0.2); border-radius:4px; padding:3px 10px; margin:0 0 4px;">${escapeHtml(post.category)}</span>`;
  }

  if (post.reading_time_minutes) {
    const spacing = post.category ? ' style="margin-left:10px;"' : "";
    metaLine += `<span${spacing} style="font-size:12px; color:rgba(232,223,207,0.5);">${post.reading_time_minutes} min read</span>`;
  }

  const metaRow = metaLine
    ? `<p style="margin:8px 0 14px;">${metaLine}</p>`
    : "";

  const cardContent = `
              ${emailSectionLabel("New from The Observatory")}
              <h2 style="font-family:'Space Grotesk',-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; font-weight:700; color:#e8dfcf; margin:8px 0 4px; line-height:1.3;">${titleHtml}</h2>
              ${metaRow}
              ${emailParagraph(post.excerpt ?? "")}
              ${emailButton("Read the full article", articleUrl)}`;

  const bodyRows = `
          ${emailCard(cardContent)}
          ${unsubscribeFooter(unsubscribeUrl)}`;

  return brandedEmailShell(bodyRows);
}

/**
 * Builds the HTML welcome email sent when a user subscribes.
 */
export function buildWelcomeEmail(unsubscribeUrl: string): string {
  const cardContent = `
              ${emailSectionLabel("The Observatory")}
              <h2 style="font-family:'Space Grotesk',-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif; font-size:22px; font-weight:700; color:#e8dfcf; margin:8px 0 12px; line-height:1.3;">You're in.</h2>
              ${emailParagraph("You'll get an email when we publish something new. Essays on positioning, conversion systems, and what actually moves the needle for growing businesses.")}
              ${emailParagraph("No spam. No fluff. Just sharp signal.")}
              ${emailButton("Browse The Observatory", "https://cosmicreachcreative.com/observatory")}`;

  const bodyRows = `
          ${emailCard(cardContent)}
          ${unsubscribeFooter(unsubscribeUrl)}`;

  return brandedEmailShell(bodyRows);
}
