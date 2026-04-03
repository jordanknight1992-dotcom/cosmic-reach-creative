import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Growth Systems Design for Small Businesses",
  description:
    "Cosmic Reach Creative diagnoses where business growth breaks down and rebuilds the infrastructure: positioning, messaging, website, sales materials, lead capture, and performance visibility.",
  alternates: { canonical: `${siteConfig.domain}/services` },
};

export default function ServicesPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "Services", item: "https://cosmicreachcreative.com/services" },
        ]
      })}} />

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
            <h1 id="services-hero" className="text-copper">What we build.</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              The full growth infrastructure. Diagnosed, designed, and delivered as one connected system.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="services-intro">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="services-intro" className="mb-4 text-navy">Every part of the system is built to work together.</h2>
            <p className="text-navy/70 text-base">
              Most businesses accumulate disconnected assets over time. A logo from one designer. A website from another. Copy that does not match the sales conversation. Cosmic Reach rebuilds the entire system from a single strategic foundation so every piece reinforces the same message, the same offer, and the same path to action.
            </p>
          </div>
        </div>
      </section>

      {/* Service Blocks */}
      <section className="py-12 sm:py-16" aria-label="Service details">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Clarity Audit */}
            <article className="rounded-2xl border border-copper/20 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/40">
              <div className="flex items-start gap-4 mb-4">
                <Icon name="map" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-xl text-starlight mb-1">Clarity Audit</h3>
                  <p className="text-copper text-sm font-display font-medium">$150</p>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-4">
                A structured diagnostic that evaluates your business across four layers: messaging clarity, offer strength, site structure, and visibility. The report identifies the root constraint and delivers a prioritized implementation path.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Scored evaluation across Signal, Gravity, Orbit, and Thrust",
                  "Root-cause analysis of where the system breaks",
                  "Prioritized recommendations with clear next steps",
                  "Written deliverable in 3-5 business days",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/70">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-starlight/40">
                The audit fee is applied toward any rebuild engagement.
              </p>
            </article>

            {/* 30-Day Rebuild */}
            <article className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
              <div className="flex items-start gap-4 mb-4">
                <Icon name="gears" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-xl text-starlight mb-1">30-Day Rebuild</h3>
                  <p className="text-copper text-sm font-display font-medium">$4,000 - $8,000</p>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-4">
                The complete growth infrastructure, rebuilt from a single strategic foundation. Every component is aligned to the same positioning, the same voice, and the same conversion logic.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-3">Brand System</p>
                  <ul className="space-y-2">
                    {[
                      "Positioning and messaging strategy",
                      "Brand voice and tone direction",
                      "Visual identity and color system",
                      "Brand guidelines document",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-starlight/60">
                        <span className="text-copper/50 mt-0.5 shrink-0 text-[8px]">&#9670;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-3">Website</p>
                  <ul className="space-y-2">
                    {[
                      "Page architecture and site structure",
                      "Messaging aligned to brand system",
                      "Conversion points and lead capture",
                      "Search-ready structure and content",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-starlight/60">
                        <span className="text-copper/50 mt-0.5 shrink-0 text-[8px]">&#9670;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-3">Sales Materials</p>
                  <ul className="space-y-2">
                    {[
                      "Sales deck and presentation template",
                      "One-page overview for outreach",
                      "Email templates for follow-up",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-starlight/60">
                        <span className="text-copper/50 mt-0.5 shrink-0 text-[8px]">&#9670;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-3">Mission Control</p>
                  <ul className="space-y-2">
                    {[
                      "Lead capture and source tracking",
                      "Site health and performance scoring",
                      "Search visibility monitoring",
                      "Real-time dashboard access",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-starlight/60">
                        <span className="text-copper/50 mt-0.5 shrink-0 text-[8px]">&#9670;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-xs text-starlight/40">
                Scope is defined after the Clarity Audit. Completed in approximately 30 days.
              </p>
            </article>

            {/* Continued Optimization */}
            <article className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
              <div className="flex items-start gap-4 mb-4">
                <Icon name="signal" size={28} className="opacity-80 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-semibold text-xl text-starlight mb-1">Continued Optimization</h3>
                  <p className="text-copper text-sm font-display font-medium">$750/month</p>
                </div>
              </div>
              <p className="text-starlight/70 text-base mb-4">
                Ongoing performance monitoring and strategic improvement after the rebuild. The system gets better over time.
              </p>
              <ul className="space-y-2 mb-4">
                {[
                  "Lead tracking and conversion source visibility",
                  "Site performance, uptime, and health monitoring",
                  "Search visibility and keyword tracking",
                  "Monthly performance reports",
                  "Strategic recommendations and small updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/70">
                    <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-starlight/40">
                Mission Control is also available standalone at $150/month for businesses that want dashboard access without the full optimization service.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="services-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="services-cta" className="mb-3 text-navy">Start with the Clarity Audit.</h2>
            <p className="text-navy/70 text-base mb-6">
              The audit diagnoses where the system breaks. Everything else follows from there.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-4 text-sm text-navy/40">
              Not sure yet?{" "}
              <Link href="/connect" className="text-copper hover:underline">
                Book a free intro call
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
