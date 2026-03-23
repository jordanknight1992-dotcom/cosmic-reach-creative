import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { StripeBuyButton } from "@/components/StripeBuyButton";

export const metadata: Metadata = {
  title: "Pricing | Mission Control, Clarity Audits & Strategy Sprints",
  description:
    "Mission Control at $149/month — daily operator intelligence, decision engine, revenue-focused prioritization. Business Clarity Audit at $150. Implementation Sprints from $2,000-$6,000. Flight Support advisory at $750/month. Retainer clients get full Mission Control access included.",
  alternates: { canonical: `${siteConfig.domain}/pricing` },
};

const sprintTiers = [
  {
    name: "Direction Sprint",
    price: "$2,000",
    description:
      "Signal and Gravity. Messaging architecture and offer design: the foundation that determines whether attention converts.",
    icon: "compass",
    coverage: ["Signal", "Gravity"],
    outcome: "Messaging and offer architecture blueprint.",
    buyButtonId: "buy_btn_1TDtS80vGBLnj72k4YEwjj3R",
  },
  {
    name: "Alignment Sprint",
    price: "$4,000",
    description:
      "Orbit focus. Customer journey mapping, marketing workflows, and the infrastructure that moves prospects from awareness to close.",
    icon: "orbit",
    coverage: ["Signal", "Gravity", "Orbit"],
    outcome: "Operational workflows and marketing infrastructure installed.",
    buyButtonId: "buy_btn_1TDtU50vGBLnj72ksYLVCc2v",
  },
  {
    name: "Execution Sprint",
    price: "$6,000",
    description:
      "Full framework. Complete system build across all four forces, with Thrust dashboards that make performance visible and the system self-correcting.",
    icon: "gears",
    coverage: ["Signal", "Gravity", "Orbit", "Thrust"],
    outcome: "Complete system build plus Thrust dashboards.",
    buyButtonId: "buy_btn_1TDtXV0vGBLnj72kMJCDBceX",
  },
];

const advisoryTier = {
  name: "Flight Support Retainer",
  price: "$750/mo",
  description:
    "Ongoing advisory to maintain the system, prevent operational drift, and recalibrate as the business evolves.",
  icon: "network",
};

const missionControlTier = {
  name: "Mission Control",
  price: "$149/mo",
  description:
    "Daily operator intelligence that directs execution. Surfaces what's slipping, what's being ignored, and where attention should shift. Not a CRM — a decision engine for revenue teams.",
  icon: "compass",
};

export default function PricingPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "Pricing", item: "https://cosmicreachcreative.com/pricing" },
        ]
      })}} />
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
              Every engagement starts with a structural diagnostic. From there, you choose how far to build.
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
                Diagnosis Before Prescription
              </span>
            </div>
            <article className="rounded-[var(--radius-lg)] border-2 border-copper/40 bg-navy/70 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/60 hover:shadow-soft">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="map" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Business Clarity Audit
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-copper font-display font-semibold text-3xl">$150</p>
                    <p className="text-starlight/50 text-xs">credited toward any Sprint engagement</p>
                  </div>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-5">
                A structural diagnostic that evaluates each layer of the Launch Sequence, then delivers a scored report, a system map, and a prioritized roadmap for what to address first.
              </p>
              <p className="text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-3">
                Deliverables
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Business Clarity Score across all four forces",
                  "Signal: Messaging and positioning analysis",
                  "Gravity: Offer structure and conversion strength",
                  "Orbit: Customer journey and infrastructure review",
                  "Thrust: KPI visibility and growth lever identification",
                  "System map showing how the forces interact",
                  "Prioritized implementation roadmap",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <StripeBuyButton buyButtonId="buy_btn_1TDtGA0vGBLnj72kaNhC423Y" label="Start the Clarity Audit" />
              <p className="mt-3 text-center text-xs text-starlight/60">
                3&ndash;5 day turnaround &middot; Structured clarity report included
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Task 7 — System Health Summary */}
      <section className="pb-2 sm:pb-4" aria-label="System Health Summary">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/30 px-6 py-5"
            >
              <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
                Example System Health Summary
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {[
                  { layer: "Signal", score: 6.2, color: "text-amber-400" },
                  { layer: "Gravity", score: 5.8, color: "text-amber-400" },
                  { layer: "Orbit", score: 4.9, color: "text-red-400" },
                  { layer: "Thrust", score: 3.7, color: "text-red-400" },
                ].map(({ layer, score, color }) => (
                  <div
                    key={layer}
                    className="rounded-lg border border-starlight/8 bg-deep-space/40 px-3 py-3 text-center"
                  >
                    <p className="text-xs font-display font-semibold text-starlight/50 uppercase mb-1">{layer}</p>
                    <p className={`text-xl font-display font-bold ${color}`}>{score}</p>
                    <p className="text-xs text-starlight/30">/ 10</p>
                  </div>
                ))}
              </div>
              <p className="text-starlight/60 text-xs leading-relaxed">
                Most organizations operating below a 6.0 in any layer struggle to convert marketing activity into revenue. The Clarity Audit identifies the exact friction points driving those scores and what to fix first.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sprint Cards */}
      <section className="py-8 sm:py-10" aria-label="Implementation sprints">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <p className="text-xs font-display font-semibold tracking-widest text-starlight/60 uppercase mb-3">
              Implementation Sprints
            </p>
            <p className="text-starlight/60 text-sm leading-relaxed">
              Once the audit identifies the constraint, a Sprint installs the architecture. Each tier is scoped to a specific layer of the Launch Sequence, with a defined outcome and a fixed engagement.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto" style={{ gridTemplateRows: "subgrid" }}>
            {sprintTiers.map((tier) => (
              <article
                key={tier.name}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 grid transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
                style={{ gridTemplateRows: "subgrid", gridRow: "span 7" }}
              >
                {/* Row 1: Icon + Title */}
                <div>
                  <Icon name={tier.icon} size={24} className="mb-3 opacity-70" />
                  <h3 className="font-display font-semibold text-base">
                    {tier.name}
                  </h3>
                </div>
                {/* Row 2: Price */}
                <p className="text-copper font-display font-semibold text-xl">
                  {tier.price}
                </p>
                {/* Row 3: Description */}
                <p className="text-sm text-starlight/60">
                  {tier.description}
                </p>
                {/* Row 4: Framework Coverage Header */}
                <p className="text-xs font-display font-medium tracking-wide text-starlight/50 uppercase self-end">
                  Framework coverage
                </p>
                {/* Row 5: Coverage List */}
                <ul className="space-y-1">
                  {tier.coverage.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-starlight/60">
                      <span className="text-copper text-[8px]" aria-hidden="true">&#9670;</span>
                      {item}
                    </li>
                  ))}
                </ul>
                {/* Row 6: Outcome */}
                <div className="pt-2 border-t border-starlight/8">
                  <p className="text-xs font-display font-medium tracking-wide text-starlight/50 uppercase mb-1">
                    Outcome
                  </p>
                  <p className="text-xs text-copper/80">{tier.outcome}</p>
                </div>
                {/* Row 7: Button */}
                <div className="pt-2 self-end">
                  <StripeBuyButton buyButtonId={tier.buyButtonId} label={`Start ${tier.name}`} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Card */}
      <section className="py-6 sm:py-8" aria-label="Flight Support Retainer">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-copper/20 bg-navy/50 p-5 flex flex-col sm:flex-row sm:items-start gap-4 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-subtle">
              <Icon name={advisoryTier.icon} size={24} className="opacity-70 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-base mb-0.5">
                  {advisoryTier.name}
                </h3>
                <p className="text-sm text-starlight/60">{advisoryTier.description}</p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2 w-40">
                <p className="text-copper font-display font-semibold text-xl">
                  {advisoryTier.price}
                </p>
                <StripeBuyButton buyButtonId="buy_btn_1TDtJg0vGBLnj72k4vWaSa7F" label="Subscribe" />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Mission Control SaaS Card */}
      <section className="py-6 sm:py-8" aria-label="Mission Control">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-copper/20 bg-navy/50 p-5 flex flex-col sm:flex-row sm:items-start gap-4 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-subtle hover:-translate-y-0.5">
              <Icon name={missionControlTier.icon} size={24} className="opacity-70 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-base mb-0.5">
                  {missionControlTier.name}
                </h3>
                <p className="text-sm text-starlight/60">{missionControlTier.description}</p>
                <p className="text-xs text-copper/70 mt-2 font-display font-medium">
                  Included at no extra cost for all Flight Support retainer clients.
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-2 w-40">
                <p className="text-copper font-display font-semibold text-xl">
                  {missionControlTier.price}
                </p>
                <StripeBuyButton buyButtonId="buy_btn_1TEEoc0vGBLnj72kYikUQLBs" label="Subscribe" />
                <Link
                  href="/mission-control"
                  className="inline-flex items-center rounded-[var(--radius-sm)] text-starlight/50 hover:text-copper px-4 py-1 text-xs font-display transition-colors"
                >
                  Try the demo first →
                </Link>
              </div>
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
                Fractional Sales &amp; Marketing Director, California
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
              href={siteConfig.signalCheckUrl}
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
