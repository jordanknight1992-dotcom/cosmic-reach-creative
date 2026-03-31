import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "How It Works | Website Audit, Rebuild & Launch",
  description:
    "A simple process: audit what is not working, rebuild the brand and website, then launch with lead capture and performance visibility built in. Full rebuilds completed in about 30 days.",
  alternates: { canonical: `${siteConfig.domain}/how-it-works` },
};

export default function HowItWorksPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "How It Works", item: "https://cosmicreachcreative.com/how-it-works" },
        ]
      })}} />
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
              A simple process.
            </h1>
            <p
              className="text-starlight/70 text-lg sm:text-xl"
              style={{ textWrap: "pretty" }}
            >
              Identify what is not working. Rebuild it. Launch with visibility built in.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Three Steps ── */}
      <section
        className="py-16 sm:py-24 bg-section-light"
        aria-labelledby="steps-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 id="steps-heading" className="mb-3 text-navy">
              How we improve website performance.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Audit",
                description: "Identify what is not working. A focused review of your website, messaging, and lead flow. You see where visitors get stuck and what to fix first.",
                price: "$150",
              },
              {
                step: "2",
                title: "Rebuild",
                description: "Build a brand system, rebuild the website, and align everything so it works together. Includes positioning, visual identity, site design, sales materials, and lead capture. Completed in about 30 days.",
                price: "$4K - $8K",
              },
              {
                step: "3",
                title: "Launch",
                description: "Deploy with lead capture, site health monitoring, and performance visibility built in. You see where inquiries come from, how your site is performing, and what needs attention.",
                price: "Included",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-navy/10 bg-white p-6 shadow-subtle text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-copper text-deep-space text-sm font-display font-bold mb-3 mx-auto">{item.step}</span>
                <h3 className="font-display font-semibold text-base mb-0.5 text-navy">
                  {item.title}
                </h3>
                <p className="text-xs text-copper font-display font-medium mb-3">
                  {item.price}
                </p>
                <p className="text-sm text-navy/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What the Audit Includes ── */}
      <section
        className="py-16 sm:py-24 bg-navy/40"
        aria-labelledby="audit-details-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <div className="mb-3">
              <Icon name="document" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="audit-details-heading" className="mb-3">
              What the $150 audit covers.
            </h2>
            <p className="text-starlight/70 text-base mb-6">
              A written report delivered in 3-5 business days. You will know exactly where the issues are and what to address first.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
            {[
              "Where visitors get stuck on your site",
              "What is unclear in your messaging",
              "What is limiting inquiries",
              "What to fix first and why",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-starlight/8 bg-navy/50 px-5 py-4 flex items-start gap-3 transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                <span className="text-starlight/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section
        className="py-16 sm:py-24 bg-section-light border-t border-copper/15"
        aria-labelledby="how-it-works-cta-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="how-it-works-cta-heading" className="mb-4 text-navy">
              Start with the audit.
            </h2>
            <p
              className="text-navy/70 text-base mb-6"
              style={{ textWrap: "pretty" }}
            >
              A focused $150 review of your website and messaging. From there, you will know exactly what needs to change.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-navy/40">
              3-5 day turnaround &middot; Written report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
