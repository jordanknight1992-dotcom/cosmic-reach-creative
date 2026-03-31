import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "How We Think About the Work | Cosmic Reach Creative",
  description:
    "Most websites underperform because of four things: unclear messaging, a weak offer, a broken path to action, or no visibility into what is working. We evaluate and fix all four.",
  alternates: { canonical: `${siteConfig.domain}/framework` },
};

const areas = [
  {
    name: "Messaging",
    question: "Is it clear what you do and who it is for?",
    description:
      "Most websites lead with what the business does rather than the problem the buyer is experiencing. When visitors have to work to understand why it matters to them, they leave.",
    whatWeCheck: [
      "Whether the headline connects with the buyer's situation",
      "Whether the language is clear or full of jargon",
      "Whether visitors can quickly tell if this is for them",
    ],
  },
  {
    name: "Offer",
    question: "Is it obvious what someone gets and what it costs?",
    description:
      "An unclear offer creates hesitation. If visitors cannot quickly understand what they are buying, how long it takes, or what the outcome is, they will not move forward.",
    whatWeCheck: [
      "Whether the offer has a defined scope and deliverable",
      "Whether pricing or next steps are visible",
      "Whether the value is clear before the ask",
    ],
  },
  {
    name: "Path to Action",
    question: "Does the site guide visitors toward one clear next step?",
    description:
      "Multiple navigation paths and competing calls to action dilute momentum. The site should make it easy to take the next step, not force visitors to figure out what to do.",
    whatWeCheck: [
      "Whether each page has one clear call to action",
      "Whether the site reduces friction at decision points",
      "Whether there is a low-commitment entry point for visitors who are not ready to buy",
    ],
  },
  {
    name: "Visibility",
    question: "Do you know what is working and what is not?",
    description:
      "After launch, most businesses lose sight of what their website is doing. Without visibility, decisions are based on guesswork instead of evidence.",
    whatWeCheck: [
      "Whether leads are being captured and tracked",
      "Whether you know where inquiries are coming from",
      "Whether you can tell which pages are driving results",
    ],
  },
];

export default function FrameworkPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "How We Think", item: "https://cosmicreachcreative.com/framework" },
        ]
      })}} />
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="framework-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/02-framework-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 id="framework-hero" className="text-copper">How we think about the work.</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              Most websites underperform for predictable reasons. We look at four things.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-intro">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="framework-intro" className="mb-4">Four areas. One system.</h2>
            <p className="text-starlight/70 text-base">
              A website that converts has clear messaging, a defined offer, a straightforward path to action, and visibility into what is working. When any of these break down, leads stop coming in.
            </p>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-label="What we evaluate">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {areas.map((area) => (
              <article
                key={area.name}
                className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <div className="mb-3">
                  <span className="text-copper font-display font-bold text-lg">{area.name}</span>
                </div>
                <p className="text-starlight font-display font-semibold text-sm mb-3">
                  {area.question}
                </p>
                <p className="text-starlight/70 text-sm leading-relaxed mb-5 flex-1">{area.description}</p>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-3">
                    What we check
                  </p>
                  <ul className="space-y-2">
                    {area.whatWeCheck.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/60">
                        <span className="text-copper mt-1 text-[8px] shrink-0" aria-hidden="true">&#9670;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="framework-cta" className="mb-3">Start with the audit.</h2>
            <p className="text-starlight/70 text-base mb-6">
              The $150 audit evaluates all four areas and shows you exactly what is not working and what to fix first.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3&ndash;5 day turnaround &middot; Written report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
