import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "How It Works | Diagnose, Rebuild, Monitor | Cosmic Reach Creative",
  description:
    "Every engagement follows the same structured path. Start with a $150 Clarity Audit to find where growth stalls. Then a 30-Day Rebuild to fix the infrastructure. Then continued optimization. We score four layers: Signal, Gravity, Orbit, and Thrust.",
  alternates: { canonical: `${siteConfig.domain}/how-it-works` },
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

export default function HowItWorksPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "How It Works", item: "https://cosmicreachcreative.com/how-it-works" },
        ]
      })}} />

      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="how-it-works-title">
        <div className="absolute inset-0">
          <Image
            src="/images/07-clarity-section.jpg"
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
            <h1 id="how-it-works-title" className="text-copper mb-4">
              Find the break. Fix the system. Keep it visible.
            </h1>
            <p className="text-starlight/70 text-lg sm:text-xl" style={{ textWrap: "pretty" }}>
              Every engagement follows the same structured path. Diagnosis first, then a full rebuild, then ongoing performance tracking so you always know what is working.
            </p>
          </div>
        </div>
      </section>

      {/* The Three Stages */}
      <section className="py-16 sm:py-24 bg-navy" aria-labelledby="steps-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 id="steps-heading" className="mb-3 text-starlight">
              One structured path. Measurable outcomes at every stage.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Clarity Audit",
                price: "$150",
                description: "A structured diagnostic that evaluates messaging, offer, site structure, and visibility. Identifies the root constraint and delivers a prioritized implementation path. 3-5 day turnaround.",
              },
              {
                step: "2",
                title: "30-Day Rebuild",
                price: "Custom scoped",
                description: "The complete growth infrastructure rebuilt from a single strategic foundation. Positioning, messaging, website, sales materials, lead capture, and Mission Control. Scope defined after the audit.",
              },
              {
                step: "3",
                title: "Continued Optimization",
                price: "$750/mo",
                description: "Ongoing performance monitoring, search visibility, lead tracking, and strategic recommendations. The system gets better over time. Mission Control included.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-deep-space p-6 shadow-subtle text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-copper text-deep-space text-sm font-display font-bold mb-3 mx-auto">{item.step}</span>
                <h3 className="font-display font-semibold text-base mb-0.5 text-starlight">
                  {item.title}
                </h3>
                <p className="text-xs text-copper font-display font-medium mb-3">
                  {item.price}
                </p>
                <p className="text-sm text-starlight/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Framework — Four Layers */}
      <section className="py-16 sm:py-24" aria-labelledby="framework-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-4">
            <h2 id="framework-heading" className="mb-4">How we think about the work.</h2>
            <p className="text-starlight/70 text-base mb-3">
              A website that converts makes the value obvious, presents a compelling offer, guides visitors toward action, and gives you evidence of what is performing. When any of those fail, leads stop coming in.
            </p>
            <p className="text-starlight/60 text-sm">
              Every audit and ongoing performance report includes these scores so you can see exactly where your site stands and what to improve.
            </p>
          </div>

          {/* Scoring Legend */}
          <div className="flex justify-center gap-8 mb-10">
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

          {/* Layer Cards */}
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

      {/* Where You See These Scores */}
      <section className="py-16 sm:py-24 bg-navy/30" aria-labelledby="scoring-heading">
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
            <div className="text-center mt-6">
              <Link
                href="/clarity-report-example"
                className="inline-block text-sm font-display font-semibold text-copper hover:text-copper/80 transition-colors underline underline-offset-2"
              >
                See a scored example audit report &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What the Clarity Audit Evaluates */}
      <section className="py-16 sm:py-24 bg-navy" aria-labelledby="audit-details-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <div className="mb-3">
              <Icon name="document" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="audit-details-heading" className="mb-3">
              What the Clarity Audit evaluates.
            </h2>
            <p className="text-starlight/70 text-base mb-6">
              Four layers. Scored 0-10. The report identifies the root constraint and gives you a prioritized path forward.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
            {[
              { layer: "Signal", desc: "Can the right people tell what you do and why it matters within 10 seconds?" },
              { layer: "Gravity", desc: "Is your offer strong enough to convert without pressure?" },
              { layer: "Orbit", desc: "Does your site guide visitors toward action without friction?" },
              { layer: "Thrust", desc: "Do you have visibility into what is working and what is not?" },
            ].map((item) => (
              <div
                key={item.layer}
                className="rounded-xl border border-starlight/8 bg-navy/50 px-5 py-4 flex items-start gap-3 transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <span className="text-copper font-display font-bold text-sm mt-0.5 shrink-0">{item.layer}</span>
                <span className="text-starlight/70 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-navy/60" aria-labelledby="how-it-works-cta-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="how-it-works-cta-heading" className="mb-4 text-starlight">
              Start with the Clarity Audit.
            </h2>
            <p className="text-starlight/70 text-base mb-6" style={{ textWrap: "pretty" }}>
              $150. Scored across four layers. You get a written report showing where growth is stalling and what needs to change first.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3-5 day turnaround &middot; Scored report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
