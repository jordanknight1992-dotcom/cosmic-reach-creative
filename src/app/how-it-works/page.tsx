import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works | Cosmic Reach Creative",
  description:
    "See how the Launch Sequence evaluates your business across four forces, identifies what's holding growth back, and maps the path forward.",
  alternates: { canonical: `${siteConfig.domain}/how-it-works` },
};

const frameworkLayers = [
  {
    name: "Signal",
    subtitle: "Messaging Clarity",
    icon: "compass",
    description:
      "Where positioning is unclear and value isn't landing with the right audience.",
  },
  {
    name: "Gravity",
    subtitle: "Offer Strength",
    icon: "orbit",
    description:
      "How offers are structured, framed, and perceived — and whether they create genuine pull.",
  },
  {
    name: "Orbit",
    subtitle: "Customer Journey",
    icon: "gears",
    description:
      "The path from first contact to conversion — and what's slowing it down.",
  },
  {
    name: "Thrust",
    subtitle: "Growth Opportunities",
    icon: "signal",
    description:
      "Where the highest-leverage growth potential exists and what to act on first.",
  },
];

const engagementPath = [
  {
    name: "Business Clarity Audit",
    price: "$150",
    description:
      "The starting point. A diagnostic that evaluates your messaging, offers, customer journey, and growth levers — then tells you exactly what to address first.",
    isEntry: true,
  },
  {
    name: "30 Day Direction Sprint",
    price: "$1,000",
    description:
      "A focused engagement that addresses the highest-impact issues from the Audit — messaging, positioning, and conversion flow.",
    isEntry: false,
  },
  {
    name: "60 Day Alignment Sprint",
    price: "$2,000",
    description:
      "Messaging, offer design, and the customer journey aligned into one coordinated system — so every piece reinforces the rest.",
    isEntry: false,
  },
  {
    name: "90 Day Systems Sprint",
    price: "$3,000",
    description:
      "The full build. Brand messaging, marketing systems, and performance tracking installed end to end.",
    isEntry: false,
  },
  {
    name: "Mission Control Advisory",
    price: "$750 / mo",
    description:
      "Ongoing advisory to refine positioning, strengthen offers, and optimize systems as the business evolves.",
    isEntry: false,
  },
];

export default function HowItWorksPage() {
  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="how-it-works-title"
      >
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
              How Cosmic Reach Works
            </h1>
            <p
              className="text-starlight/70 text-lg sm:text-xl"
              style={{ textWrap: "balance" }}
            >
              We evaluate the four forces that drive every business — then
              build a prioritized plan to get growth moving.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Framework ── */}
      <section
        className="py-16 sm:py-24 bg-section-light"
        aria-labelledby="framework-overview-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2
              id="framework-overview-heading"
              className="mb-3 text-navy"
            >
              The Launch Sequence
            </h2>
            <p className="text-navy/70 text-base">
              Every business runs on four forces. We evaluate each one before
              recommending where to focus.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {frameworkLayers.map((layer) => (
              <div
                key={layer.name}
                className="rounded-[var(--radius-lg)] border border-navy/10 bg-white p-5 shadow-subtle transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <Icon
                  name={layer.icon}
                  size={26}
                  className="mb-2 opacity-70 mx-auto"
                />
                <h3 className="font-display font-semibold text-base mb-0.5 text-navy text-center">
                  {layer.name}
                </h3>
                <p className="text-xs text-copper font-display font-medium text-center mb-2">
                  {layer.subtitle}
                </p>
                <p className="text-sm text-navy/60 text-center">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/framework"
              className="inline-flex items-center gap-2 font-display font-semibold text-sm text-navy/60 hover:text-navy transition-colors underline underline-offset-2"
            >
              Explore the full Framework
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Engagement Path ── */}
      <section
        className="py-16 sm:py-24 bg-navy/40"
        aria-labelledby="engagement-path-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="mb-3">
              <Icon name="rocket" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="engagement-path-heading" className="mb-3">
              The Engagement Path
            </h2>
            <p className="text-starlight/70 text-base">
              Every engagement starts with a Clarity Audit. From there, you
              choose the depth of implementation that fits your business.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-3 mb-8">
            {engagementPath.map((step, i) => (
              <div
                key={step.name}
                className={`rounded-xl border px-5 py-4 flex items-start gap-4 transition-all duration-[var(--duration-base)] ${
                  step.isEntry
                    ? "border-copper/30 bg-navy/70 hover:border-copper/50"
                    : "border-starlight/8 bg-navy/50 hover:border-copper/20"
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold mt-0.5 ${
                    step.isEntry
                      ? "bg-copper text-deep-space"
                      : "bg-starlight/10 text-starlight/50"
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
                    <p
                      className={`font-display font-semibold text-sm ${
                        step.isEntry ? "text-copper" : "text-starlight"
                      }`}
                    >
                      {step.name}
                    </p>
                    <p className="text-xs text-starlight/40 font-display font-medium shrink-0">
                      {step.price}
                    </p>
                  </div>
                  <p className="text-starlight/60 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-display font-semibold text-sm text-starlight/60 hover:text-starlight transition-colors underline underline-offset-2"
            >
              View full Services page
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Example Report ── */}
      <section
        className="py-16 sm:py-24 bg-section-light"
        aria-labelledby="example-report-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <div className="mb-3">
              <Icon name="map" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="example-report-heading" className="mb-3 text-navy">
              What You Receive
            </h2>
            <p className="text-navy/70 text-base mb-6">
              The audit delivers a written report with scored analysis across
              all four layers, root-cause findings, and a step-by-step
              implementation plan.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 text-left max-w-2xl mx-auto mb-8">
              {[
                { label: "Executive Readout", detail: "System Momentum Score and the single highest-leverage shift." },
                { label: "Layer Scorecard", detail: "Signal, Gravity, Orbit, and Thrust — each scored and diagnosed." },
                { label: "Implementation Path", detail: "A prioritized sequence of what to address first." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-navy/10 bg-white p-4 shadow-subtle"
                >
                  <p className="font-display font-semibold text-sm text-copper mb-1">
                    {item.label}
                  </p>
                  <p className="text-navy/60 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/clarity-report-example"
              className="inline-flex items-center gap-2 font-display font-semibold text-sm text-navy/60 hover:text-navy transition-colors underline underline-offset-2"
            >
              View Example Report
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-16 sm:py-24 bg-navy/60 border-t border-copper/15"
        aria-labelledby="how-it-works-cta-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3">
              <Icon name="spark" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="how-it-works-cta-heading" className="mb-4">
              Ready to Find the Constraint?
            </h2>
            <p
              className="text-starlight/70 text-base mb-6"
              style={{ textWrap: "balance" }}
            >
              The Clarity Audit evaluates the four forces driving your business
              and delivers a prioritized plan for what to address first.
            </p>
            <CTAButton label="Get Your Clarity Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3–5 day turnaround &middot; Structured clarity report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
