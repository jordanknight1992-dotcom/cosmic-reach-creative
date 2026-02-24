import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cosmic Reach engagements follow a deliberate progression designed to diagnose problems before building solutions.",
  alternates: { canonical: `${siteConfig.domain}/services` },
};

const content = `# Structured Paths to Operational Clarity

Cosmic Reach engagements follow a deliberate progression designed to diagnose problems before building solutions.

IMAGE: 03-services-hero.jpg

---

## Step One: The First Signal

A free 30-minute intro call to understand your environment and confirm whether there's a real operational issue worth solving.

No pitch. Just signal.

ICON: signal
CTA: Book Intro Call

---

## Step Two: The Clarity Session

A 90-minute working session where we map what's breaking down and identify the highest-impact fixes.

You leave with usable direction immediately.

ICON: map
CTA: Book Clarity Session

---

## Step Three: The Sprints

If we decide to move forward, we implement the solution through structured Sprints.

**30 Day Sprint** - diagnosing the system and delivering a clear priority map
ICON: compass

**60 Day Sprint** - aligning ownership, messaging, and operating structure
ICON: orbit

**90 Day Sprint** - building the full system across direction, alignment, execution, and visibility
ICON: gears

CTA: Discuss Sprint Options

---

## Ongoing Operational Strategy

Monthly sessions designed to keep the system functioning and evolving as your environment changes.

ICON: network`;

export default function ServicesPage() {
  return <MarkdownPage content={content} />;
}
