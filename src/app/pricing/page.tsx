import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Cosmic Reach is designed to be clear, scoped, and decision-ready from the start. Structured engagements with fixed outcomes.",
  alternates: { canonical: `${siteConfig.domain}/pricing` },
};

const tiers = [
  {
    name: "Free Intro Call",
    price: "Free",
    description:
      "A short call to confirm whether there's a real problem worth solving.",
    icon: "signal",
  },
  {
    name: "Clarity Session",
    price: "$250",
    description:
      "A 90-minute working session. Includes a Clarity Report delivered within one week.",
    icon: "map",
  },
  {
    name: "30 Day Sprint",
    price: "$2,000",
    description:
      "Diagnose the system and deliver a clear priority map.",
    icon: "compass",
  },
  {
    name: "60 Day Sprint",
    price: "$4,000",
    description:
      "Align ownership, messaging, and operating structure.",
    icon: "orbit",
  },
  {
    name: "90 Day Sprint",
    price: "$6,000",
    description:
      "Build the full system across direction, alignment, execution, and visibility.",
    icon: "gears",
  },
  {
    name: "Ongoing Strategy Support",
    price: "$750/mo",
    description:
      "Monthly sessions designed to keep the system functioning and evolving as your environment changes.",
    icon: "network",
  },
];

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
              Cosmic Reach is designed to be clear, scoped, and decision-ready from the start.
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-10 sm:py-16" aria-label="Pricing tiers">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <Icon name={tier.icon} size={26} className="mb-3 opacity-70" />
                <h2 className="font-display font-semibold text-lg mb-1">
                  {tier.name}
                </h2>
                <p className="text-copper font-display font-semibold text-xl mb-2">
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
    </main>
  );
}
