import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Services | Signal, Gravity, Orbit & Thrust",
  description:
    "From messaging and positioning to offer design, customer journey optimization, and performance tracking — see how each layer of the Launch Sequence translates into action.",
  alternates: { canonical: `${siteConfig.domain}/services` },
};

const content = `# What We Do

IMAGE: 03-services-hero.jpg

---

## Signal

We sharpen your positioning so the right people understand what you do and why it matters.

- Messaging audit and positioning refinement
- Voice and tone alignment across channels
- Audience alignment assessment

ICON: signal

---

## Gravity

We strengthen your offer structure so interest converts to action without friction.

- Offer framing and value proposition clarity
- CTA architecture and conversion point mapping
- Lead pathway design from awareness to decision

ICON: compass

---

## Orbit

We install the repeatable workflows that keep your marketing moving without manual effort.

- Content and nurture system design
- Tool and channel integration
- Playbook development for consistent execution

ICON: orbit

---

## Thrust

We build the measurement layer that turns activity into decision-ready insight.

- KPI selection tied to business outcomes
- Dashboard design and reporting cadence
- Performance review structure for ongoing optimization

ICON: signal`;

export default function ServicesPage() {
  return <MarkdownPage content={content} />;
}
