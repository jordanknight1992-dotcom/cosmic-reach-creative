import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { StripeBuyButton } from "@/components/StripeBuyButton";

export const metadata: Metadata = {
  title: "Pricing | Website Audit, Brand Rebuild & Ongoing Performance",
  description:
    "Start with a $150 website audit. Full brand and website rebuilds from $4K to $8K. Ongoing performance and lead tracking at $750/month. Defined outcomes at every step.",
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
          </div>
        </div>
      </section>

      {/* $150 Audit */}
      <section className="pt-12 sm:pt-16 pb-6 sm:pb-8" aria-label="Website Audit">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border-2 border-copper/40 bg-navy/70 p-6 sm:p-8 flex flex-col transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/60 hover:shadow-soft">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="map" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    $150 Audit
                  </h2>
                  <p className="text-starlight/50 text-sm">A focused review of your website and messaging.</p>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-5">
                You will see:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Where visitors get stuck",
                  "What is unclear",
                  "What is limiting inquiries",
                  "What to fix first",
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
                3-5 day turnaround &middot; Written report included
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Rebuild */}
      <section className="py-8 sm:py-10 bg-navy/20" aria-label="Brand and website rebuild">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="gears" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Full Rebuild
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-copper font-display font-semibold text-2xl">$4,000&ndash;$8,000</p>
                  </div>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-2">
                A complete overhaul of how your business shows up and converts.
                Completed in about 30 days.
              </p>
              <p className="text-starlight/50 text-sm mb-5">
                For businesses that are ready to fix what is holding their site back.
              </p>
              <p className="text-starlight/70 text-sm font-display font-semibold mb-3">Includes:</p>
              <ul className="space-y-2 mb-6">
                {[
                  "A full brand system and guidelines that define how your business communicates",
                  "Positioning and messaging that make the business clear on first pass",
                  "A rebuilt website designed to guide visitors toward action",
                  "Sales materials that stay aligned across every conversation",
                  "Lead capture built directly into the site",
                  "Visibility into what is driving inquiries",
                  "A structure that supports long-term search visibility",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-starlight/40">
                Scope is defined after the audit. The audit fee is applied toward the rebuild.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Ongoing */}
      <section className="py-8 sm:py-10" aria-label="Ongoing performance">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <article className="rounded-[var(--radius-lg)] border border-copper/20 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/40">
              <div className="flex items-start gap-4 mb-5">
                <Icon name="network" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display font-semibold text-xl text-starlight mb-1">
                    Ongoing Performance
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <p className="text-copper font-display font-semibold text-2xl">$750/month</p>
                  </div>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-5">
                Ongoing performance and visibility after the rebuild.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Track leads and sources",
                  "Site speed, uptime, and health monitoring",
                  "Search visibility and keyword tracking",
                  "Exportable monthly performance reports",
                  "Small updates and recommendations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <StripeBuyButton buyButtonId="buy_btn_1TDtJg0vGBLnj72k4vWaSa7F" label="Subscribe" />
            </article>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-10 sm:py-14 bg-navy/20" aria-label="What clients say">
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
