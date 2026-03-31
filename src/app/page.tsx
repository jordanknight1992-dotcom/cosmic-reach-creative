import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cosmic Reach Creative | Website Not Converting? We Fix That.",
  description:
    "Your website should be generating leads. If it is not, there is usually a deeper issue. Cosmic Reach Creative reviews your message, site, and lead flow, then rebuilds what is not working. Start with a $150 audit.",
  alternates: { canonical: siteConfig.domain },
};

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0">
          <Image
            src="/images/01-home-hero.jpg"
            alt="Cosmic Reach Creative: small business website help"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 id="hero-title" className="mb-4 text-copper">
              Your website should be<br />
              bringing you business.
            </h1>
            <p className="text-starlight/80 text-base sm:text-lg mb-2" style={{ textWrap: "pretty" }}>
              If it is not, there is usually a deeper issue behind it. I review what is happening across your message, site, and lead flow, then show you what needs to change.
            </p>
            <p className="text-starlight/60 text-sm mb-6">
              Start with a focused $150 audit. From there, full rebuilds are completed in about 30 days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton label="Start with the Audit" variant="primary" />
              <CTAButton label="How It Works" variant="secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 bg-section-light"
        aria-labelledby="problem-heading"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 50% 26%, rgba(40,49,73,0.14) 0%, rgba(40,49,73,0.07) 18%, rgba(40,49,73,0.00) 48%),
              linear-gradient(to bottom, rgba(40,49,73,0.03), rgba(40,49,73,0.00) 18%, rgba(40,49,73,0.00) 82%, rgba(40,49,73,0.03))
            `,
          }}
        />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0" />

        <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3">
              <Icon name="spark" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="problem-heading" className="mb-4 text-navy">
              Most websites look polished but underperform.
            </h2>
            <p className="text-navy/70 text-base mb-8">
              The issue is usually not design. It is something deeper.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "compass", text: "Unclear messaging" },
                { icon: "orbit", text: "Weak structure" },
                { icon: "signal", text: "No path to action" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="rounded-xl border border-navy/10 bg-white p-5 flex flex-col items-center text-center shadow-subtle transition-all duration-[var(--duration-base)] hover:border-copper/20"
                >
                  <Icon name={item.icon} size={26} className="mb-3 opacity-70" />
                  <p className="text-navy/80 text-sm font-display font-semibold leading-snug">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-navy/70 text-base">
              Visitors hesitate and leave. The site looks fine, but leads do not come in.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Do ── */}
      <section
        className="relative py-16 sm:py-24 bg-navy/40 overflow-hidden"
        aria-labelledby="what-we-do-heading"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/07-clarity-section.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-deep-space/85" />
        </div>

        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3">
              <Icon name="eye" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="what-we-do-heading" className="mb-3">
              Rebuild what is holding growth back.
            </h2>
            <p className="text-starlight/70 text-base mb-8">
              Cosmic Reach Creative helps businesses fix the parts of their brand and website that are limiting results.
            </p>
          </div>

          <div className="mx-auto max-w-2xl grid gap-3 sm:grid-cols-3">
            {[
              "How the business is positioned",
              "How it communicates",
              "How the site guides action",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-starlight/8 bg-navy/50 px-5 py-4 text-center transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <span className="text-starlight/70 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Process ── */}
      <section className="py-16 sm:py-24 bg-section-light" aria-labelledby="process-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="process-heading" className="mb-3 text-navy">How it works</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Audit",
                description: "A focused review of what is not working. You see where visitors get stuck, what is unclear, and what to fix first.",
              },
              {
                step: "2",
                title: "Rebuild",
                description: "Brand, messaging, website, and sales materials are rebuilt to work together. Completed in about 30 days.",
              },
              {
                step: "3",
                title: "Launch + Visibility",
                description: "The site goes live with lead capture and performance visibility built in. You see where inquiries come from.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-navy/10 bg-white p-5 shadow-subtle text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-copper text-deep-space text-sm font-display font-bold mb-3">{item.step}</span>
                <h3 className="font-display font-semibold text-base mb-2 text-navy">{item.title}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission Control (Short) ── */}
      <section
        className="py-16 sm:py-24 bg-deep-space"
        aria-labelledby="mc-cta-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-copper mb-3">
              Included with every rebuild
            </div>
            <h2 id="mc-cta-heading" className="mb-3">
              See where your leads come from.
            </h2>
            <p className="text-starlight/70 text-base mb-8" style={{ textWrap: "pretty" }}>
              Every rebuild includes a system that captures leads and shows what is working across the site. You can see where inquiries come from and what needs attention.
            </p>
            <Link
              href="/mission-control"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3 font-display font-semibold text-base bg-copper text-deep-space transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 bg-section-light"
        aria-label="What clients say"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="relative max-w-4xl mx-auto">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 sm:-left-16 md:-left-24 top-[-56px] sm:top-[-72px] md:top-[-92px] select-none font-display text-[220px] sm:text-[280px] md:text-[360px] leading-none text-copper/[0.10] z-0"
            >
              &ldquo;
            </div>

            <div className="relative z-10 grid gap-6 md:grid-cols-2">
              <blockquote className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6 sm:p-8">
                <p className="text-navy/75 text-base italic leading-relaxed mb-4">
                  Cosmic Reach brings a level of imagination and strategic thinking that is rare to find. Jordan has a way of seeing the system underneath a business and identifying where momentum is breaking down. The result is direction you would not arrive at on your own.
                </p>
                <footer className="text-sm text-copper font-display font-medium">
                  Fractional Sales &amp; Marketing Director, California
                </footer>
              </blockquote>

              <blockquote className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6 sm:p-8">
                <p className="text-navy/75 text-base italic leading-relaxed mb-4">
                  I have spent decades leading infrastructure programs where milestone visibility and structured reporting were critical to success. Cosmic Reach translated that same disciplined framework into a modern, intuitive platform.
                </p>
                <footer className="text-sm text-copper font-display font-medium">
                  Licensed PMO, Texas
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-24 bg-navy/60 border-t border-copper/15" aria-labelledby="final-cta-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3">
              <Icon name="rocket" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="final-cta-heading" className="mb-4">Start with the Audit</h2>
            <p className="text-starlight/70 text-base mb-6" style={{ textWrap: "pretty" }}>
              A focused $150 review of your website and messaging. You will see where visitors get stuck, what is unclear, and what to fix first.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3-5 day turnaround &middot; Written report included
            </p>
          </div>
        </div>
      </section>

      {/* ── Homepage FAQ (SEO + AI Searchability) ── */}
      <section className="py-16 sm:py-24 bg-section-light" aria-labelledby="home-faq-heading">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Cosmic Reach Creative?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Cosmic Reach Creative is a brand and website rebuild consultancy founded by Jordan Knight in Memphis, TN. We help small businesses improve website performance, generate more leads, and build sites that actually convert."
                }
              },
              {
                "@type": "Question",
                name: "My website is not converting. Can you help?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Most websites underperform because of unclear messaging, weak structure, or no path to action. We start with a $150 audit to identify the specific issues, then rebuild the site in about 30 days."
                }
              },
              {
                "@type": "Question",
                name: "What does the $150 audit include?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The audit is a focused review of your website and messaging. You will see where visitors get stuck, what is unclear, what is limiting inquiries, and what to fix first. Delivered in 3-5 business days."
                }
              },
              {
                "@type": "Question",
                name: "Do you only work with businesses in Memphis?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Cosmic Reach Creative is headquartered in Memphis, TN, but we work with small businesses nationwide. All engagements are delivered remotely."
                }
              },
              {
                "@type": "Question",
                name: "What does a full rebuild include?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A full rebuild includes positioning, messaging, website design and development, sales materials, a lead capture system, and performance visibility. Completed in about 30 days. Pricing ranges from $4,000 to $8,000."
                }
              },
            ]
          })}}
        />
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 id="home-faq-heading" className="text-navy mb-3">Common Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {[
              { q: "What is Cosmic Reach Creative?", a: "A brand and website rebuild consultancy founded by Jordan Knight in Memphis, TN. We help small businesses fix websites that are not converting and start generating consistent leads." },
              { q: "My website is not converting. Can you help?", a: "Yes. Most websites underperform because of unclear messaging, weak structure, or no path to action. We start with a $150 audit to identify the specific issues, then rebuild the site in about 30 days." },
              { q: "What does the $150 audit include?", a: "A focused review of your website and messaging. You will see where visitors get stuck, what is unclear, what is limiting inquiries, and what to fix first. Delivered in 3-5 business days." },
              { q: "Do you only work with businesses in Memphis?", a: "We are headquartered in Memphis, TN, but we work with small businesses nationwide. All engagements are delivered remotely." },
              { q: "What does a full rebuild include?", a: "Positioning, messaging, website design and development, sales materials, a lead capture system, and performance visibility. Completed in about 30 days. Pricing ranges from $4,000 to $8,000." },
            ].map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-navy/10 bg-white shadow-subtle">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-display font-semibold text-sm text-navy list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="text-copper ml-2 group-open:rotate-45 transition-transform text-lg shrink-0" aria-hidden="true">+</span>
                </summary>
                <p className="px-5 pb-4 text-navy/70 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
