import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | Find Where Your Business Is Losing Momentum`,
  description:
    "Cosmic Reach Creative helps founders identify where growth is getting stuck and build systems that move the business forward.",
  alternates: { canonical: siteConfig.domain },
};

const content = `# Find Where Your Business Is Losing Momentum

Cosmic Reach Creative helps founders identify where growth is getting stuck and build systems that move the business forward.

[Primary CTA: Start With a Business Clarity Audit]
[Secondary CTA: Explore the Clarity Framework]

IMAGE: 01-home-hero.jpg

---

## Where Momentum Breaks Down

Most businesses don't have a marketing problem.

The website exists.
The services are clear internally.
The team is working.

But something still isn't converting.

Customers hesitate.
Leads stall.
Effort doesn't translate into momentum.

Most businesses don't have a marketing problem.
They have a clarity problem.

Cosmic Reach identifies exactly where that breakdown happens.

ICON: spark

---

## Signals That Your Business Needs a Clarity Audit

If any of these feel familiar, the system underneath your business may be working against you.

• Marketing activity is happening but revenue doesn't move the way it should
• Your team works hard but priorities constantly shift
• Customers seem interested but hesitate before buying
• Messaging changes frequently because nothing feels quite right
• Decisions take longer than they should because the real constraint isn't clear
• Progress depends on heroic effort instead of reliable systems

These are not effort problems.
They are clarity problems.

A Business Clarity Audit identifies exactly where momentum is breaking down and what to fix first.

[CTA: Request a Clarity Audit]

---

## The Cosmic Reach Framework

We don't start with tactics.
We start by fixing the system that makes tactics succeed or fail.

Every engagement moves through four layers.

**Signal** - Messaging clarity
ICON: compass

**Gravity** - Offer strength
ICON: orbit

**Orbit** - Customer journey
ICON: gears

**Thrust** - Growth opportunities
ICON: signal

---

## Who Cosmic Reach Is For

Cosmic Reach works best with founders and teams who know something in their business needs to be clarified before progress can accelerate.

That might mean:

• a business that has traction but feels stuck
• a team that's working hard but lacks structural clarity
• an early-stage founder shaping the right system from the beginning
• a company where marketing, operations, and execution aren't fully aligned

The common thread is the desire to build the right system before scaling effort.

**Not the Right Fit**

Cosmic Reach may not be the right solution if:

• you're looking for quick marketing hacks
• you're not open to adjusting how the business is structured
• you're expecting a tactical execution agency

The focus is clarity, structure, and systems so progress becomes repeatable.

[CTA: Start With a Business Clarity Audit]

---

## Start With a Business Clarity Audit

The first step is a structured diagnostic of your business — not a sales call.

The Business Clarity Audit identifies exactly where momentum is breaking down and what to fix first.

[CTA: Book a Business Clarity Audit]`;

export default function HomePage() {
  return <MarkdownPage content={content} />;
}
