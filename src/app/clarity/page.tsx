import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "The Clarity Session",
  description:
    "A structured working session designed to diagnose what's slowing growth and give leaders usable direction immediately.",
  alternates: { canonical: `${siteConfig.domain}/clarity` },
};

const content = `# The Clarity Session

A structured working session designed to diagnose what's slowing growth and give leaders usable direction immediately.

IMAGE: 07-clarity-section.jpg

---

## What Happens in the Session

We map current priorities, identify decision bottlenecks, and highlight the system gaps affecting progress.

You leave with a prioritized view of what to address first and why it matters.

ICON: map

---

## Your Clarity Report

Within one week, you receive a structured report outlining:

- Mission Context
- Observed Friction Points
- System Map Snapshot
- Priority Shift Recommendations
- What Improvement Looks Like
- Recommended Next Step

ICON: document
IMAGE: 08-results-section.jpg

---

## Start With Insight

If the forces driving your business feel misaligned, the next step is simple.

[CTA: Book Your Clarity Session]`;

export default function ClarityPage() {
  return <MarkdownPage content={content} />;
}
