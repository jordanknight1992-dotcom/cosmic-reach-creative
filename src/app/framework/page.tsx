import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "The Launch Sequence | 4-Force Marketing Strategy Framework",
  description:
    "The Launch Sequence evaluates four forces driving every business: messaging clarity (Signal), offer strength (Gravity), customer journey (Orbit), and growth opportunities (Thrust). A systematic approach to marketing strategy.",
  alternates: { canonical: `${siteConfig.domain}/framework` },
};

const layers = [
  {
    name: "Signal",
    subtitle: "Messaging Clarity",
    icon: "compass",
    description:
      "Where is messaging falling short? This layer diagnoses positioning gaps, identifies where value isn’t landing with the right audience, and reveals why the story of the business isn’t translating into action.",
    deliverables: [
      "A clear diagnosis of current messaging across channels",
      "Positioning refinement tied to the right audience",
      "Focused recommendations on what to clarify first",
    ],
  },
  {
    name: "Gravity",
    subtitle: "Offer Strength",
    icon: "orbit",
    description:
      "Is the offer strong enough to convert on its own? This layer evaluates how offers are framed, priced, and perceived, identifying where hesitation is outweighing perceived value.",
    deliverables: [
      "Offer positioning and framing analysis",
      "Value perception insights",
      "Recommendations for structuring offers that convert",
    ],
  },
  {
    name: "Orbit",
    subtitle: "Customer Journey",
    icon: "gears",
    description:
      "What happens between first touch and purchase? This layer maps the customer journey, surfaces drop-off points, and identifies the steps that move prospects toward a decision.",
    deliverables: [
      "Customer journey mapping and friction diagnosis",
      "Conversion flow analysis",
      "Practical improvements that reduce hesitation and shorten time to purchase",
    ],
  },
  {
    name: "Thrust",
    subtitle: "Growth Opportunities",
    icon: "signal",
    description:
      "Where should you invest next? This layer translates business activity into actionable insight so growth decisions are driven by evidence, not assumptions.",
    deliverables: [
      "Growth opportunity analysis tied to business outcomes",
      "Prioritized improvement roadmap",
      "A decision framework for what to build, fix, or deprioritize",
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
          { "@type": "ListItem", position: 2, name: "Framework", item: "https://cosmicreachcreative.com/framework" },
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
            <h1 id="framework-hero" className="text-copper">The Four Forces Behind Every Business</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              We don&apos;t begin with tactics. We evaluate the forces that make tactics succeed or fail.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-intro">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-intro" className="mb-4">Four Layers. One System.</h2>
            <p className="text-starlight/70 text-base">
              The Launch Sequence evaluates four forces: sharpening positioning, strengthening offers, streamlining the customer journey, and building performance visibility. Every layer builds on the last.
            </p>
          </div>
        </div>
      </section>

      {/* Framework Layers */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-label="Framework layers">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {layers.map((layer) => (
              <article
                key={layer.name}
                className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <div className="mb-4">
                  <Icon name={layer.icon} size={32} className="opacity-80" />
                </div>
                <div className="mb-3">
                  <span className="text-copper font-display font-bold text-lg">{layer.name}</span>
                  <span className="text-starlight/50 text-sm font-display ml-2">{layer.subtitle}</span>
                </div>
                <p className="text-starlight/70 text-sm leading-relaxed mb-5 flex-1">{layer.description}</p>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-3">
                    Clients get
                  </p>
                  <ul className="space-y-2">
                    {layer.deliverables.map((item) => (
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
            <div className="mb-3">
              <Icon name="rocket" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-cta" className="mb-3">Ready to Evaluate the System?</h2>
            <p className="text-starlight/70 text-base mb-6">
              The Business Clarity Audit applies all four layers to your business and delivers a prioritized action plan.
            </p>
            <CTAButton label="Start the Clarity Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3&ndash;5 day turnaround &middot; Structured clarity report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
