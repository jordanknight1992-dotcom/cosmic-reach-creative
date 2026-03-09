import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Business Clarity Audit & Sprints",
  description:
    "Structured engagements with fixed outcomes. Every engagement starts with a diagnostic. From there, you choose how far to go.",
  alternates: { canonical: `${siteConfig.domain}/pricing` },
};

const sprintTiers = [
  {
    name: "30 Day Direction Sprint",
    price: "$1,000",
    description:
      "Focused implementation of the highest-impact improvements identified in the audit.",
    icon: "compass",
    coverage: ["Signal", "Thrust"],
  },
  {
    name: "60 Day Alignment Sprint",
    price: "$2,000",
    description:
      "A deeper sprint to align messaging, customer journey, and execution.",
    icon: "orbit",
    coverage: ["Signal", "Gravity", "Orbit"],
  },
  {
    name: "90 Day Systems Sprint",
    price: "$3,000",
    description:
      "A full systems build designed to create repeatable, sustainable progress.",
    icon: "gears",
    coverage: ["Signal", "Gravity", "Orbit", "Thrust"],
  },
];

const advisoryTier = {
  name: "Mission Control Advisory",
  price: "$750/mo",
  description:
    "Ongoing strategic support to refine systems, priorities, and growth decisions over time.",
  icon: "network",
};

export default function PricingPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="pricing-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/06-systems-section.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 id="pricing-hero" className="text-copper">Structured Engagements.<br />Fixed Outcomes.</h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3">
              Every engagement starts with a diagnostic. From there, you choose your trajectory.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Audit Card */}
      <section className="pt-12 sm:pt-16 pb-6 sm:pb-8" aria-label="Business Clarity Audit">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex justify-center mb-3">
              <span className="inline-block text-xs font-display font-semibold tracking-wide text-copper border border-copper/40 rounded-full px-3 py-1">
                Best Place to Start
              </span>
            </div>
            <article className="rounded-[var(--radius-lg)] border-2 border-copper/40 bg-navy/70 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/60 hover:shadow-soft">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="map" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Business Clarity Audit
                  </h2>
                  <p className="text-copper font-display font-semibold text-3xl">$150</p>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-5">
                A structured diagnostic designed to show where your business is losing momentum and what to fix first.
              </p>
              <p className="text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-3">
                Includes
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Messaging clarity review",
                  "Offer positioning analysis",
                  "Customer journey friction diagnosis",
                  "Growth opportunity insights",
                  "Prioritized improvement roadmap",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={siteConfig.stripeAuditUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Start the Clarity Audit
              </a>
              <p className="mt-3 text-center text-xs text-starlight/60">
                3&ndash;5 day turnaround &middot; Structured clarity report included
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Sprint Cards */}
      <section className="py-8 sm:py-10" aria-label="Implementation sprints">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-5">
            Implementation Sprints
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {sprintTiers.map((tier) => (
              <article
                key={tier.name}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <Icon name={tier.icon} size={24} className="mb-3 opacity-70" />
                <h3 className="font-display font-semibold text-base mb-1">
                  {tier.name}
                </h3>
                <p className="text-copper font-display font-semibold text-xl mb-3">
                  {tier.price}
                </p>
                <p className="text-sm text-starlight/60 mb-4 flex-1">
                  {tier.description}
                </p>
                <div>
                  <p className="text-xs font-display font-medium tracking-wide text-starlight/60 uppercase mb-2">
                    Framework coverage
                  </p>
                  <ul className="space-y-1">
                    {tier.coverage.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-starlight/60">
                        <span className="text-copper text-[8px]" aria-hidden="true">&#9670;</span>
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

      {/* Advisory Card */}
      <section className="py-6 sm:py-8" aria-label="Mission Control Advisory">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle">
              <Icon name={advisoryTier.icon} size={24} className="opacity-70 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-base mb-0.5">
                  {advisoryTier.name}
                </h3>
                <p className="text-sm text-starlight/60">{advisoryTier.description}</p>
              </div>
              <p className="text-copper font-display font-semibold text-xl shrink-0">
                {advisoryTier.price}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-10 sm:py-14 bg-navy/20" aria-label="What operators say">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <blockquote className="rounded-2xl border border-starlight/8 bg-navy/60 p-6 sm:p-8">
              <p className="text-starlight/80 text-base italic leading-relaxed mb-4">
                &ldquo;Cosmic Reach brings a level of imagination and strategic clarity that&apos;s rare to find. Jordan has a way of seeing the system underneath a business and identifying where momentum is breaking down. The result is clarity and direction you wouldn&apos;t arrive at on your own.&rdquo;
              </p>
              <footer className="text-sm text-copper font-display font-medium">
                &mdash; Fractional Sales &amp; Marketing Director, California
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* De-emphasized Free Intro Call */}
      <section className="pb-12 sm:pb-16" aria-label="Free intro call">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-starlight/60">
            Not sure where to start?{" "}
            <a
              href={siteConfig.calendlySignalCheckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-starlight/60 hover:text-copper transition-colors underline underline-offset-2"
            >
              Book a free 30-minute intro call
            </a>{" "}
            to check the signal first.
          </p>
        </div>
      </section>
    </main>
  );
}
