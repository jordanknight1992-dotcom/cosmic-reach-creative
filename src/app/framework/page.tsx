import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How We Think About the Work | Cosmic Reach Creative",
  description:
    "Most websites underperform because of four things: unclear messaging, a weak offer, a broken path to action, or no visibility into what is working. We evaluate and score all four.",
  alternates: { canonical: `${siteConfig.domain}/framework` },
};

const layers = [
  {
    layer: "Signal",
    name: "Messaging",
    question: "Is your message reaching the right people?",
    description:
      "Most websites lead with what the business does rather than the problem the buyer is experiencing. When visitors have to work to understand why it matters to them, they leave.",
    whatWeCheck: [
      "Whether the headline connects with the buyer's situation",
      "Whether the language resonates with buyers or sounds like internal jargon",
      "Whether visitors can quickly tell if this is for them",
    ],
    whatWeMeasure: [
      "SEO structure score",
      "Average search position",
      "Search impressions",
      "Organic traffic share",
    ],
  },
  {
    layer: "Gravity",
    name: "Offer",
    question: "Is your offer converting visitors into leads?",
    description:
      "An unclear offer creates hesitation. If visitors cannot quickly understand what they are buying, how long it takes, or what the outcome is, they will not move forward.",
    whatWeCheck: [
      "Whether the offer has a defined scope and deliverable",
      "Whether pricing or next steps are visible",
      "Whether visitors understand the value before being asked to act",
    ],
    whatWeMeasure: [
      "Engagement rate",
      "Bounce rate",
      "Search click-through rate",
      "Conversion rate",
    ],
  },
  {
    layer: "Orbit",
    name: "Path to Action",
    question: "Is your site guiding visitors toward action?",
    description:
      "Multiple navigation paths and competing calls to action dilute momentum. The site should make it easy to take the next step, not force visitors to figure out what to do.",
    whatWeCheck: [
      "Whether each page has one clear call to action",
      "Whether the site reduces friction at decision points",
      "Whether there is a low-commitment entry point for visitors who are not ready to buy",
    ],
    whatWeMeasure: [
      "Accessibility score",
      "Layout stability (CLS)",
      "Page load speed (LCP)",
      "Responsiveness (TBT)",
    ],
  },
  {
    layer: "Thrust",
    name: "Visibility",
    question: "Can you see what is working?",
    description:
      "After launch, most businesses lose sight of what their website is doing. Without visibility, decisions are based on guesswork instead of evidence.",
    whatWeCheck: [
      "Whether leads are being captured and tracked",
      "Whether you know where inquiries are coming from",
      "Whether you can tell which pages are driving results",
    ],
    whatWeMeasure: [
      "Performance score",
      "Uptime and response time",
      "Analytics connected",
      "Traffic trend",
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
              Most websites underperform for predictable reasons. We evaluate four areas and score each one.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-intro">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="framework-intro" className="mb-4">Four layers. Scored 0&ndash;10.</h2>
            <p className="text-starlight/70 text-base mb-3">
              A website that converts makes the value obvious, presents a compelling offer, guides visitors toward action, and gives you evidence of what is performing. When any of those fail, leads stop coming in.
            </p>
            <p className="text-starlight/60 text-sm">
              Every audit and ongoing performance report includes these scores so you can see exactly where your site stands and what to improve.
            </p>
          </div>
        </div>
      </section>

      {/* Scoring Legend */}
      <section className="pb-8" aria-label="Scoring legend">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span className="text-sm text-starlight/60">8&ndash;10 Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#eab308]" />
              <span className="text-sm text-starlight/60">5&ndash;7 Be Aware</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-sm text-starlight/60">0&ndash;4 Warning</span>
            </div>
          </div>
        </div>
      </section>

      {/* Layers */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-label="What we evaluate">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {layers.map((area) => (
              <article
                key={area.layer}
                className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="text-copper font-display font-bold text-lg">{area.layer}</span>
                  <span className="text-starlight/60 text-sm">{area.name}</span>
                </div>
                <p className="text-starlight font-display font-semibold text-sm mb-3">
                  {area.question}
                </p>
                <p className="text-starlight/70 text-sm leading-relaxed mb-5 flex-1">{area.description}</p>
                <div className="mb-5">
                  <p className="text-xs font-display font-semibold tracking-widest text-copper uppercase mb-3">
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
                <div className="pt-4 border-t border-starlight/6">
                  <p className="text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-3">
                    What we measure
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {area.whatWeMeasure.map((item) => (
                      <span key={item} className="text-xs bg-starlight/5 text-starlight/60 rounded-md px-2.5 py-1">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How Scoring Works */}
      <section className="py-12 sm:py-16" aria-labelledby="scoring-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="scoring-heading" className="text-center mb-8">Where you will see these scores.</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-starlight/10 bg-navy/40 p-5 text-center">
                <div className="text-copper text-2xl mb-3">&#9670;</div>
                <h3 className="font-display font-semibold text-sm text-starlight mb-2">Audit Report</h3>
                <p className="text-starlight/60 text-xs leading-relaxed">
                  Every audit includes a scored breakdown showing where each layer stands and where to focus.
                </p>
              </div>
              <div className="rounded-xl border border-starlight/10 bg-navy/40 p-5 text-center">
                <div className="text-copper text-2xl mb-3">&#9670;</div>
                <h3 className="font-display font-semibold text-sm text-starlight mb-2">Mission Control</h3>
                <p className="text-starlight/60 text-xs leading-relaxed">
                  Live scores update automatically based on real data from your site, analytics, and search performance.
                </p>
              </div>
              <div className="rounded-xl border border-starlight/10 bg-navy/40 p-5 text-center">
                <div className="text-copper text-2xl mb-3">&#9670;</div>
                <h3 className="font-display font-semibold text-sm text-starlight mb-2">Monthly Reports</h3>
                <p className="text-starlight/60 text-xs leading-relaxed">
                  Ongoing clients receive exportable reports showing how scores change over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* See Example */}
      <section className="pb-6" aria-label="Example report link">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="/clarity-report-example"
              className="inline-block text-sm font-display font-semibold text-copper hover:text-copper/80 transition-colors underline underline-offset-2"
            >
              See a scored example audit report &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="framework-cta" className="mb-3">Start with the audit.</h2>
            <p className="text-starlight/70 text-base mb-6">
              The $150 audit scores all four layers and gives you a prioritized report showing exactly where to focus.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3&ndash;5 day turnaround &middot; Scored report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
