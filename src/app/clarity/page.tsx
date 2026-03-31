import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Clarity Audit | A Focused Audit of What Is Not Working",
  description:
    "A focused review of your website and messaging. See where your message breaks down, what visitors do not understand, and what to fix first. Delivered in a few days.",
  alternates: { canonical: `${siteConfig.domain}/clarity` },
};

const content = `# A focused audit of what is not working.

If your website is not bringing in consistent business, there is usually a clear reason.

IMAGE: 07-clarity-section.jpg

---

## What the Audit Shows You

This audit identifies the specific issues limiting results:

- Where your message breaks down
- What visitors do not understand
- What is limiting inquiries
- What to fix first

Delivered in a few days.

ICON: document

---

## Start With the Audit

If the site is not working the way it should, this is the first step.

[CTA: Start with the Audit]`;

export default function ClarityPage() {
  return <MarkdownPage content={content} />;
}
