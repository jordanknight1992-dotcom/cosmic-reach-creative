import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { MarkdownPage } from "@/components/MarkdownPage";

export const metadata: Metadata = {
  title: "Services | Brand and Website Rebuild for Small Businesses",
  description:
    "Cosmic Reach Creative helps small businesses improve website performance through positioning, messaging, website rebuilds, and ongoing lead tracking. Generate more leads from your website.",
  alternates: { canonical: `${siteConfig.domain}/services` },
};

const content = `# What We Do

IMAGE: 03-services-hero.jpg

---

## Brand System

We build the foundation your business communicates from — positioning, voice, visual identity, and guidelines that hold everything together.

- Positioning and messaging strategy
- Brand voice and tone direction
- Visual identity — logo, color system, typography
- Brand guidelines document

ICON: signal

---

## Website Rebuild

We rebuild the site so it communicates what you do and guides visitors toward action.

- Website structure and page architecture
- Messaging aligned to brand system
- Conversion points and lead capture
- Search-ready structure and content

ICON: compass

---

## Sales Materials

We build the materials that support the conversation after someone reaches out.

- Sales deck and presentation template
- One-page overview for outreach
- Email templates for follow-up

ICON: orbit

---

## Ongoing Performance

We track what is working after launch and recommend what to do next.

- Lead tracking and source visibility
- Site speed, uptime, and health monitoring
- Search visibility and keyword tracking
- Exportable monthly performance reports
- Small updates and recommendations

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
