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

We do not begin with tactics.
We begin with the system underneath the work.

Cosmic Reach engagements move through four layers designed to restore clarity, reduce friction, and make progress repeatable.

IMAGE: 02-framework-hero.jpg

---

## Signal: Messaging Clarity

We identify where messaging is breaking down and what to clarify first.

We diagnose where positioning is unclear, where value isn't landing with the right audience, and where the story of the business isn't translating into action so founders can move forward with a message that works.

**Clients get:**
- A clear diagnosis of current messaging across channels
- Positioning refinement tied to the right audience
- Focused recommendations on what to clarify first

ICON: compass

---

## Gravity: Offer Strength

We make sure the offer is structured to create genuine pull.

We bring clarity to how offers are framed, priced, and perceived so the right customers see clear value and hesitation before buying is reduced.

**Clients get:**
- Offer positioning and framing analysis
- Value perception insights
- Recommendations for structuring offers that convert

ICON: orbit

---

## Orbit: Customer Journey

We design the path from first contact to conversion so it works as a system.

We map the customer journey, identify friction points, and clarify the steps that move prospects toward a decision — intentionally instead of accidentally.

**Clients get:**
- Customer journey mapping and friction diagnosis
- Conversion flow analysis
- Practical improvements that reduce hesitation and increase momentum

ICON: gears

---

## Thrust: Growth Opportunities

We give founders a clear view of where growth potential exists and what to act on first.

We translate business activity into actionable insight so decisions about where to invest effort are driven by impact, not assumptions.

**Clients get:**
- Growth opportunity analysis tied to business outcomes
- Prioritized improvement roadmap
- Clarity on what to build, fix, or remove to accelerate momentum

ICON: signal`;

export default function FrameworkPage() {
  return <MarkdownPage content={content} />;
}
