import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Services | Marketing Strategy, Messaging & Growth Systems",
  description:
    "Cosmic Reach Creative offers marketing strategy services including messaging and positioning, offer design, customer journey optimization, and growth system architecture for founders and growing businesses.",
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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://cosmicreachcreative.com/services" },
        ]
      })}} />
      <MarkdownPage content={content} />
    </>
  );
}
