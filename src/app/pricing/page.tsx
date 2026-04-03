import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { StripeBuyButton } from "@/components/StripeBuyButton";
import { Credentials } from "@/components/Credentials";

export const metadata: Metadata = {
  title: "Pricing | Clarity Audit, 30-Day Rebuild & Continued Optimization",
  description:
    "Start with a $150 Clarity Audit. Full 30-Day Rebuilds from $4K to $8K. Continued optimization at $750/month. Mission Control standalone at $150/month. Defined outcomes at every step.",
  alternates: { canonical: `${siteConfig.domain}/pricing` },
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
            <h1 id="pricing-hero" className="text-copper">Clear pricing.<br />Defined outcomes.</h1>
            <p className="text-starlight/70 text-base sm:text-lg mt-3">
              Every engagement follows the same path. Diagnose. Rebuild. Monitor.
            </p>
          </div>
        </div>
      </section>

      {/* $150 Audit */}
      <section className="pt-12 sm:pt-16 pb-6 sm:pb-8" aria-label="Clarity Audit">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border-2 border-copper/40 bg-navy/70 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/60 hover:shadow-soft">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="map" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-display font-semibold tracking-widest text-copper/60 uppercase mb-1">Stage 1</div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Clarity Audit
                  </h2>
                  <p className="text-starlight/50 text-sm">The diagnostic. Identifies where the system breaks.</p>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-5">
                A structured evaluation of your messaging, offer, site structure, and visibility. You receive a scored report with root-cause findings and a prioritized implementation path.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Scored evaluation across four layers",
                  "Root-cause analysis of the primary constraint",
                  "Prioritized recommendations",
                  "Written report in 3-5 business days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-baseline gap-2 mb-5">
                <p className="text-copper font-display font-semibold text-3xl">$150</p>
              </div>
              <StripeBuyButton buyButtonId="buy_btn_1TDtGA0vGBLnj72kaNhC423Y" label="Start with the Audit" />
              <p className="mt-3 text-center text-xs text-starlight/60">
                Audit fee credited toward any rebuild engagement
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Rebuild */}
      <section className="py-8 sm:py-10 bg-navy/20" aria-label="30-Day Rebuild">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="gears" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-display font-semibold tracking-widest text-starlight/30 uppercase mb-1">Stage 2</div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    30-Day Rebuild
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-copper font-display font-semibold text-2xl">$4,000&ndash;$8,000</p>
                  </div>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-2">
                The complete growth infrastructure, rebuilt from a single strategic foundation. Completed in 30 days.
              </p>
              <p className="text-starlight/50 text-sm mb-5">
                Scope is defined after the Clarity Audit.
              </p>
              <p className="text-starlight/70 text-sm font-display font-semibold mb-3">Includes:</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Brand system: positioning, voice, visual identity, and guidelines",
                  "Website: architecture, messaging, design, and development",
                  "Sales materials: deck, one-pager, email templates",
                  "Lead capture built directly into the site",
                  "Mission Control: live dashboard with performance visibility",
                  "Search-ready structure for long-term organic growth",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/connect"
                className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-6 py-3 font-display font-semibold text-sm transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Request a Consultation
              </Link>
              <p className="mt-3 text-xs text-starlight/40">
                The audit fee is applied toward the rebuild.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Continued Optimization */}
      <section className="py-8 sm:py-10" aria-label="Continued Optimization">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="signal" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-display font-semibold tracking-widest text-starlight/30 uppercase mb-1">Stage 3</div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Continued Optimization
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-copper font-display font-semibold text-2xl">$750/month</p>
                  </div>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-2">
                Ongoing performance monitoring, strategic improvement, and hands-on optimization after the rebuild.
              </p>
              <p className="text-starlight/50 text-sm mb-5">
                For businesses that want continued improvement without managing it themselves.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Lead tracking and conversion source visibility",
                  "Site performance, uptime, and health monitoring",
                  "Search visibility and keyword tracking",
                  "Monthly performance reports",
                  "Strategic recommendations and updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <StripeBuyButton buyButtonId="buy_btn_1TDtJg0vGBLnj72k4vWaSa7F" label="Subscribe — $750/mo" />
            </article>
          </div>
        </div>
      </section>

      {/* Mission Control Standalone */}
      <section className="py-8 sm:py-10 bg-navy/20" aria-label="Mission Control">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-copper/20 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/40">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="network" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Mission Control
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-copper font-display font-semibold text-2xl">$150/month</p>
                  </div>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-2">
                A clear view of website performance, lead activity, and conversion signals in one place. Available to any business as a standalone dashboard.
              </p>
              <p className="text-starlight/50 text-sm mb-5">
                Included free with every Cosmic Reach Creative rebuild.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Live site health scoring across four layers",
                  "PageSpeed, uptime, and Core Web Vitals monitoring",
                  "Lead tracking and conversion signals",
                  "Search visibility and keyword tracking",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <StripeBuyButton buyButtonId="buy_btn_1THvGV0vGBLnj72kN97MqFHS" label="Subscribe — $150/mo" />
              <p className="mt-4 text-center text-xs text-starlight/40">
                Free for all Cosmic Reach Creative-built websites.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <Credentials />

      {/* Testimonial */}
      <section className="py-10 sm:py-14" aria-label="What clients say">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <blockquote className="rounded-2xl border border-starlight/8 bg-navy/60 p-6 sm:p-8">
              <p className="text-starlight/80 text-base italic leading-relaxed mb-4">
                &ldquo;Cosmic Reach brings a level of imagination and strategic thinking that is rare to find. Jordan has a way of seeing the system underneath a business and identifying where momentum is breaking down.&rdquo;
              </p>
              <footer className="text-sm text-copper font-display font-medium">
                Fractional Sales &amp; Marketing Director, California
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Not sure where to start */}
      <section className="pb-12 sm:pb-16" aria-label="Free intro call">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-starlight/60">
            Not sure where to start?{" "}
            <a
              href={siteConfig.signalCheckUrl}
              className="text-starlight/60 hover:text-copper transition-colors underline underline-offset-2"
            >
              Book a free 30-minute intro call
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}
