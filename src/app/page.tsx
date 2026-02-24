import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | Operational Clarity for Teams`,
  description:
    "Cosmic Reach helps organizations diagnose friction, align execution, and build operational systems that make progress sustainable.",
  alternates: { canonical: siteConfig.domain },
};

const content = `# Mission Control for Operational Clarity

Most teams don't fail because they lack effort.
They fail because the system underneath their work isn't built to support progress.

Cosmic Reach helps organizations diagnose friction, align execution, and build operational systems that make progress sustainable.

[Primary CTA: Schedule Free Intro Call]
[Secondary CTA: Explore How It Works]

IMAGE: 01-home-hero.jpg

---

## Where Momentum Breaks Down

Marketing looks busy.
Teams look productive.
Reports keep going out.

But beneath the surface, priorities conflict, ownership is unclear, and progress depends on individual heroics instead of reliable systems.

That's where Cosmic Reach begins.

ICON: spark

---

## The Cosmic Reach Framework

We don't start with tactics.
We start by fixing the system that makes tactics succeed or fail.

Every engagement moves through four layers.

**Direction** - what matters and what to fix first
ICON: compass

**Alignment** - making strategy, teams, and tools pull the same way
ICON: orbit

**Execution** - building structure that makes progress repeatable
ICON: gears

**Visibility** - translating activity into decision-ready insight
ICON: signal

---

## Start With Clarity

The first step isn't a contract.
It's a conversation.

Schedule a free 30-minute intro call to determine whether there's a real operational issue worth solving.

[CTA: Book Free Intro Call]`;

export default function HomePage() {
  return <MarkdownPage content={content} />;
}
