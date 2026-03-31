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

## Positioning and Messaging

We review how your business communicates and fix what is not landing with the right people.

- Messaging audit and positioning refinement
- Voice and tone alignment across your site
- Audience alignment assessment

ICON: signal

---

## Website Rebuild

We rebuild the site so it communicates what you do and guides visitors toward action.

- Website structure and page architecture
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
- Site performance monitoring
- Search visibility improvements
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
