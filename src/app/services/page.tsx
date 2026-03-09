import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services & Implementation Sprints",
  description:
    "Cosmic Reach engagements follow a deliberate progression designed to diagnose problems before building solutions.",
  alternates: { canonical: `${siteConfig.domain}/services` },
};

const sprintTiers = [
  {
    name: "30 Day Direction Sprint",
    price: "$1,000",
    description:
      "A focused 30-day engagement designed to address the highest-impact issues identified in the Business Clarity Audit.",
    icon: "compass",
    work: [
      "Refining messaging and positioning",
      "Improving website conversion flow",
      "Restructuring offers",
      "Clarifying priorities and decision paths",
    ],
    coverage: ["Signal", "Thrust"],
  },
  {
    name: "60 Day Alignment Sprint",
    price: "$2,000",
    description:
      "A structured engagement focused on aligning strategy, messaging, and execution so the business operates as a coordinated system.",
    icon: "orbit",
    work: [
      "Positioning and messaging refinement",
      "Improving customer journey flow",
      "Simplifying operational workflows",
      "Aligning ownership and decision structures",
    ],
    coverage: ["Signal", "Gravity", "Orbit"],
  },
  {
    name: "90 Day Systems Sprint",
    price: "$3,000",
    description:
      "A comprehensive engagement designed to build the operational systems required for sustainable growth.",
    icon: "gears",
    work: [
      "Designing operational workflows",
      "Establishing planning and execution rhythms",
      "Building measurement and reporting structures",
      "Implementing systems that support repeatable progress",
    ],
    coverage: ["Signal", "Gravity", "Orbit", "Thrust"],
  },
];

export default function ServicesPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="services-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/03-services-hero.jpg"
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
            <h1 id="services-hero" className="text-copper">Structured Paths to Operational Clarity</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              Every engagement follows a deliberate trajectory: diagnose, then build.
            </p>
          </div>
        </div>
      </section>

      {/* Step 1: First Signal */}
      <section className="py-12 sm:py-16" aria-labelledby="step1-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="signal" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="step1-heading" className="mb-3">
              <span className="text-copper">Step One</span> — First Signal
            </h2>
            <p className="text-starlight/70 text-base mb-2">
              A free 30-minute intro call to confirm whether the Business Clarity Audit is the right next step for your business.
            </p>
            <p className="text-starlight/60 text-sm mb-6">No pitch. Just signal.</p>
            <p className="text-starlight/80 text-sm font-display font-semibold mb-6">
              Outcome: Clear next step, or a clean no
            </p>
            <CTAButton label="Book Intro Call" variant="primary" />
          </div>
        </div>
      </section>

      {/* Mid-page image break */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <div className="relative w-full h-40 sm:h-56 rounded-2xl overflow-hidden">
          <Image
            src="/images/09-data-texture.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-deep-space/40" />
        </div>
      </div>

      {/* Step 2: Business Clarity Audit */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="step2-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="map" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="step2-heading" className="mb-3">
              <span className="text-copper">Step Two</span> — Business Clarity Audit
            </h2>
            <p className="text-starlight/70 text-base mb-3">
              A focused diagnostic of your business using the Cosmic Reach Clarity Framework.
            </p>
            <p className="text-starlight/70 text-base mb-6">
              The audit evaluates messaging clarity, offer strength, customer journey friction, and growth opportunities.
            </p>
          </div>
          <div className="max-w-lg mx-auto rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
            <h3 className="font-display font-semibold text-copper text-sm uppercase tracking-widest mb-4 text-center">
              Deliverables include
            </h3>
            <ul className="space-y-3">
              {[
                "Messaging analysis",
                "Offer positioning insights",
                "Website conversion friction diagnosis",
                "Prioritized improvement roadmap",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-starlight/70 text-sm">
                  <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center mt-6">
            <CTAButton label="Start the Clarity Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3&ndash;5 day turnaround &middot; Structured clarity report included
            </p>
          </div>
        </div>
      </section>

      {/* Step 3: Sprints */}
      <section className="py-12 sm:py-16" aria-labelledby="step3-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="mb-3">
              <Icon name="rocket" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="step3-heading" className="mb-3">
              <span className="text-copper">Step Three</span> — The Sprints
            </h2>
            <p className="text-starlight/70 text-base">
              If we decide to move forward, we implement the solution through structured Sprints built on the Cosmic Reach Clarity Framework.
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {sprintTiers.map((tier) => (
              <article
                key={tier.name}
                className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30 hover:shadow-subtle"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon name={tier.icon} size={28} className="opacity-70 shrink-0" />
                  <div>
                    <h3 className="font-display font-semibold text-lg">{tier.name}</h3>
                    <p className="text-copper font-display font-semibold text-xl">{tier.price}</p>
                  </div>
                </div>
                <p className="text-starlight/70 text-base mb-5">{tier.description}</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-3">
                      Typical work includes
                    </p>
                    <ul className="space-y-2">
                      {tier.work.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/70">
                          <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-3">
                      Framework coverage
                    </p>
                    <ul className="space-y-2">
                      {tier.coverage.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-starlight/70">
                          <span className="text-copper text-xs shrink-0" aria-hidden="true">&#9670;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-8">
            <CTAButton label="See the Clarity Audit" variant="primary" />
          </div>
        </div>
      </section>

      {/* Mission Control Advisory */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="advisory-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="network" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="advisory-heading" className="mb-3">Mission Control Advisory</h2>
            <p className="text-copper font-display font-semibold text-2xl mb-4">$750/mo</p>
            <p className="text-starlight/70 text-base mb-6">
              Monthly sessions designed to keep the system functioning and evolving as your environment changes.
            </p>
          </div>
          <div className="max-w-lg mx-auto rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
            <h3 className="font-display font-semibold text-copper text-sm uppercase tracking-widest mb-4 text-center">
              Clients get
            </h3>
            <ul className="space-y-3">
              {[
                "Continued prioritization as conditions shift",
                "System maintenance across workflow, messaging, and tools",
                "Ongoing clarity as your business grows and shifts",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-starlight/70 text-sm">
                  <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
