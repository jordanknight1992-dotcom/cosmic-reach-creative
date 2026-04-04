import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About | Jordan Knight, Founder of Cosmic Reach Creative",
  description:
    "Cosmic Reach Creative is a growth systems consultancy founded by Jordan Knight in Memphis, TN. We identify where business growth infrastructure breaks down and rebuild the system so it performs.",
  alternates: { canonical: `${siteConfig.domain}/about` },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://cosmicreachcreative.com/about" },
        ]
      })}} />
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="about-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/05-about-hero.jpg"
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
            <h1 id="about-hero" className="text-copper">Systems design for<br />businesses that have outgrown<br />their infrastructure.</h1>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="py-12 sm:py-16 bg-navy" aria-labelledby="origin-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="origin-heading" className="mb-4 text-starlight">The problem is rarely what it looks like on the surface.</h2>
            <p className="text-starlight/70 text-base mb-3">
              Most businesses that stall have revenue. They have customers. They have a product that works. What they lack is the infrastructure to sustain momentum at the next level.
            </p>
            <p className="text-starlight/70 text-base mb-3">
              Messaging drifts. The website stops converting. Leads slow down. The team works harder, but results flatten.
            </p>
            <p className="text-starlight/70 text-base">
              Cosmic Reach identifies the structural constraint and rebuilds the system so growth compounds instead of stalling.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="founder-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shrink-0">
                <Image
                  src="/images/founder/jordan-knight-cosmic-reach-operator.jpg"
                  alt="Jordan Knight, founder of Cosmic Reach Creative in Memphis, TN"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 id="founder-heading" className="mb-4">Built from program delivery, not marketing theory.</h2>
                <p className="text-starlight/70 text-base mb-3">
                  Jordan Knight founded Cosmic Reach Creative in Memphis, Tennessee, after years leading complex programs where performance, structured reporting, and milestone visibility were not optional. That background shaped every part of this practice.
                </p>
                <p className="text-starlight/70 text-base mb-3">
                  The approach is diagnostic. Every engagement starts by mapping friction across four forces: how the business communicates, how the offer converts, how the site guides action, and whether there is visibility into what is working.
                </p>
                <p className="text-starlight/70 text-base">
                  The output is a system that works together. Positioning, website, sales materials, lead capture, and performance monitoring. All aligned. All measurable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page image break */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 py-4">
        <div className="relative w-full h-40 sm:h-56 rounded-2xl overflow-hidden">
          <Image
            src="/images/11-case-header.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-deep-space/40" />
        </div>
      </div>

      {/* What makes this different */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="difference-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="difference-heading" className="mb-6">The work is structured around a real operating model.</h2>
            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              {[
                { label: "Diagnostic-first", desc: "Every engagement begins with the Clarity Audit. Recommendations come from evidence, not assumptions." },
                { label: "Systems-oriented", desc: "Messaging, website, sales materials, and visibility are built as one connected system." },
                { label: "Measurable", desc: "Four scored layers. Real data. You see exactly where you stand and what changed." },
                { label: "Founder-led", desc: "One point of contact. One person accountable for the outcome. No handoffs." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-starlight/8 bg-navy/50 p-5 text-left transition-all duration-[var(--duration-base)] hover:border-copper/20"
                >
                  <p className="text-copper text-sm font-display font-semibold mb-1">{item.label}</p>
                  <p className="text-starlight/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 sm:py-16" aria-label="What clients say">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <blockquote className="rounded-2xl border border-starlight/8 bg-navy/60 p-6 sm:p-8">
              <p className="text-starlight/80 text-base italic leading-relaxed mb-4">
                &ldquo;I have spent decades leading infrastructure and network programs where milestone visibility and structured reporting were critical to success. Cosmic Reach translated that same disciplined framework into a modern, intuitive platform.&rdquo;
              </p>
              <footer className="text-sm text-copper font-display font-medium">
                Licensed PMO, Texas
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-navy" aria-labelledby="about-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="about-cta" className="mb-3 text-starlight">Start with the Clarity Audit.</h2>
            <p className="text-starlight/70 text-base mb-6">
              A $150 diagnostic that scores your business across four layers and gives you a clear read on what is holding growth back.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
          </div>
        </div>
      </section>
    </main>
  );
}
