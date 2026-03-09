import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Cosmic Reach is designed to be clear, scoped, and decision-ready from the start. Structured engagements with fixed outcomes.",
  alternates: { canonical: `${siteConfig.domain}/pricing` },
};

const sprintTiers = [
  {
    name: "30 Day Direction Sprint",
    price: "$1,000",
    description:
      "Focused implementation of the highest-impact improvements identified in the audit.",
    icon: "compass",
  },
  {
    name: "60 Day Alignment Sprint",
    price: "$2,000",
    description:
      "A deeper sprint to align messaging, customer journey, and execution.",
    icon: "orbit",
  },
  {
    name: "90 Day Systems Sprint",
    price: "$3,000",
    description:
      "A full systems build designed to create repeatable, sustainable progress.",
    icon: "gears",
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
              Every engagement starts with a diagnostic. From there, you choose how far to go.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Audit Card */}
      <section className="pt-10 sm:pt-16 pb-6 sm:pb-8" aria-label="Business Clarity Audit">
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
              <p className="text-xs font-display font-semibold tracking-widest text-starlight/50 uppercase mb-3">
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
                    <span className="text-copper mt-0.5 shrink-0">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
              <CTAButton
                label="Start With a Business Clarity Audit"
                variant="primary"
                className="w-full justify-center"
              />
            </article>
          </div>
        </div>
      </section>

      {/* Sprint Cards */}
      <section className="py-6 sm:py-8" aria-label="Implementation sprints">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-5">
            Implementation Sprints
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {sprintTiers.map((tier) => (
              <article
                key={tier.name}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <Icon name={tier.icon} size={24} className="mb-3 opacity-70" />
                <h2 className="font-display font-semibold text-base mb-1">
                  {tier.name}
                </h2>
                <p className="text-copper font-display font-semibold text-xl mb-3">
                  {tier.price}
                </p>
                <p className="text-sm text-starlight/60 flex-1">
                  {tier.description}
                </p>
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
                <h2 className="font-display font-semibold text-base mb-0.5">
                  {advisoryTier.name}
                </h2>
                <p className="text-sm text-starlight/60">{advisoryTier.description}</p>
              </div>
              <p className="text-copper font-display font-semibold text-xl shrink-0">
                {advisoryTier.price}
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* De-emphasized Free Intro Call */}
      <section className="pb-10 sm:pb-16" aria-label="Free intro call">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-starlight/40">
            Not sure where to start?{" "}
            <a
              href={siteConfig.calendlySignalCheckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-starlight/60 hover:text-copper transition-colors underline underline-offset-2"
            >
              Book a free 30-minute intro call
            </a>{" "}
            first.
          </p>
        </div>
      </section>
    </main>
  );
}
