import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "How It Works | Diagnose, Rebuild, Monitor",
  description:
    "Every engagement follows the same structured path. Start with a $150 Clarity Audit to diagnose where growth breaks. Then a 30-Day Rebuild to fix the infrastructure. Then continued optimization to keep it improving.",
  alternates: { canonical: `${siteConfig.domain}/how-it-works` },
};

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
              Diagnose. Rebuild. Monitor.
            </h1>
            <p className="text-starlight/70 text-lg sm:text-xl" style={{ textWrap: "pretty" }}>
              Every engagement follows the same structured path. Clarity first, then execution, then ongoing visibility into what is working.
            </p>
          </div>
        </div>
      </section>

      {/* The Three Stages */}
      <section className="py-16 sm:py-24 bg-section-light" aria-labelledby="steps-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 id="steps-heading" className="mb-3 text-navy">
              Three stages. Clear outcomes at every step.
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
                price: "$4K\u2013$8K",
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
                className="rounded-[var(--radius-lg)] border border-navy/10 bg-white p-6 shadow-subtle text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-copper text-deep-space text-sm font-display font-bold mb-3 mx-auto">{item.step}</span>
                <h3 className="font-display font-semibold text-base mb-0.5 text-navy">
                  {item.title}
                </h3>
                <p className="text-xs text-copper font-display font-medium mb-3">
                  {item.price}
                </p>
                <p className="text-sm text-navy/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the Audit Covers */}
      <section className="py-16 sm:py-24 bg-navy/40" aria-labelledby="audit-details-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <div className="mb-3">
              <Icon name="document" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="audit-details-heading" className="mb-3">
              What the Clarity Audit evaluates.
            </h2>
            <p className="text-starlight/70 text-base mb-6">
              Four layers. Scored 0-10. The report identifies the root constraint and shows you what to fix first.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
            {[
              { layer: "Signal", desc: "Is your message clear enough to reach the right people?" },
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
      <section className="py-16 sm:py-24 bg-section-light border-t border-copper/15" aria-labelledby="how-it-works-cta-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="how-it-works-cta-heading" className="mb-4 text-navy">
              Start with the Clarity Audit.
            </h2>
            <p className="text-navy/70 text-base mb-6" style={{ textWrap: "pretty" }}>
              A $150 diagnostic that scores your business across four layers and gives you a clear read on where the system breaks.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-navy/40">
              3-5 day turnaround &middot; Scored report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
