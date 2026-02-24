import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Framework",
  description:
    "The Cosmic Reach Framework moves through four layers designed to restore signal, reduce friction, and make progress repeatable.",
  alternates: { canonical: `${siteConfig.domain}/framework` },
};

const content = `# The Cosmic Reach Framework

We don't begin with tactics.
We begin with the system underneath the work.

Cosmic Reach engagements move through four layers designed to restore signal, reduce friction, and make progress repeatable.

IMAGE: 02-framework-hero.jpg

---

## Direction

Define what matters and what to fix first.

ICON: compass

---

## Alignment

Make strategy, teams, and tools pull the same way.

ICON: orbit

---

## Execution

Build structure that makes progress repeatable.

ICON: gears

---

## Visibility

Translate activity into decision-ready insight.

ICON: signal`;

export default function FrameworkPage() {
  return <MarkdownPage content={content} />;
}
