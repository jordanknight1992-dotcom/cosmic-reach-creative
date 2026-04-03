import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";
import { Credentials } from "@/components/Credentials";

export const metadata: Metadata = {
  title: "Cosmic Reach Creative | Growth Systems for Businesses With Traction",
  description:
    "Businesses stall when their systems break under pressure. Cosmic Reach identifies the friction across your messaging, offer, site, and visibility, then rebuilds the infrastructure so growth compounds. Start with a $150 Clarity Audit.",
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
            alt="Cosmic Reach Creative: growth systems for businesses with traction"
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
              We build the infrastructure<br />
              of growth.
            </h1>
            <p className="text-starlight/80 text-base sm:text-lg mb-2" style={{ textWrap: "pretty" }}>
              Systems design for businesses with traction and friction. When your messaging, offer, site, or visibility breaks under pressure, growth stalls. We find the break and fix the system.
            </p>
            <p className="text-starlight/60 text-sm mb-6">
              Start with a $150 Clarity Audit. Rebuilds completed in 30 days.
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
              Businesses do not stall because of effort.
            </h2>
            <p className="text-navy/70 text-base mb-8">
              They stall when the system underneath breaks under pressure. The messaging drifts. The offer loses clarity. The site stops converting. Visibility disappears. More effort does not fix a structural problem.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
              {[
                { icon: "signal", label: "Signal", text: "Messaging unclear" },
                { icon: "compass", label: "Gravity", text: "Offer too weak to convert" },
                { icon: "orbit", label: "Orbit", text: "Site creates friction" },
                { icon: "signal", label: "Thrust", text: "No visibility into results" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-navy/10 bg-white p-5 flex items-center gap-4 shadow-subtle transition-all duration-[var(--duration-base)] hover:border-copper/20"
                >
                  <Icon name={item.icon} size={22} className="opacity-70 shrink-0" />
                  <div className="text-left">
                    <p className="text-copper text-xs font-display font-semibold tracking-wider uppercase">{item.label}</p>
                    <p className="text-navy/70 text-sm leading-snug">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-navy/70 text-base">
              The Clarity Audit maps where the system breaks. The rebuild fixes the infrastructure. Growth compounds from there.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Process ── */}
      <section
        className="relative py-16 sm:py-24 bg-navy/40 overflow-hidden"
        aria-labelledby="process-heading"
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
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="process-heading" className="mb-3">
              Diagnose. Rebuild. Monitor.
            </h2>
            <p className="text-starlight/70 text-base">
              Every engagement follows the same structured path. Clarity first. Then execution. Then ongoing visibility.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              {
                step: "1",
                title: "Clarity Audit",
                price: "$150",
                description: "A diagnostic that evaluates your messaging, offer, site structure, and visibility. Identifies the root constraint and shows you what to fix first.",
              },
              {
                step: "2",
                title: "30-Day Rebuild",
                price: "$4K\u2013$8K",
                description: "The entire growth system is rebuilt. Positioning, messaging, website, sales materials, and lead capture. All aligned. Completed in 30 days.",
              },
              {
                step: "3",
                title: "Continued Optimization",
                price: "$750/mo",
                description: "Ongoing performance monitoring, search visibility, lead tracking, and strategic recommendations. The system improves over time.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-starlight/8 bg-navy/50 p-5 text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-soft"
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-copper text-deep-space text-sm font-display font-bold mb-3">{item.step}</span>
                <h3 className="font-display font-semibold text-base mb-0.5">{item.title}</h3>
                <p className="text-xs text-copper font-display font-medium mb-3">{item.price}</p>
                <p className="text-sm text-starlight/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Framework Preview ── */}
      <section className="py-16 sm:py-24 bg-section-light" aria-labelledby="framework-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="mb-3">
              <Icon name="eye" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-heading" className="mb-3 text-navy">Four forces drive every business.</h2>
            <p className="text-navy/70 text-base">
              When one force is weak, the others compensate. That is how &ldquo;working harder&rdquo; becomes the default strategy. We evaluate and score all four.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto mb-8">
            {[
              { name: "Signal", subtitle: "Messaging", desc: "Can the right people understand what you do and why it matters in under 10 seconds?" },
              { name: "Gravity", subtitle: "Offer", desc: "Is the offer strong enough to convert without pressure or a lengthy sales conversation?" },
              { name: "Orbit", subtitle: "Path to Action", desc: "Does the site guide visitors toward a clear next step without friction?" },
              { name: "Thrust", subtitle: "Visibility", desc: "Do you have evidence of what is working and what needs attention?" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-navy/10 bg-white p-5 shadow-subtle transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-copper font-display font-bold text-sm">{item.name}</span>
                  <span className="text-navy/30 text-xs">{item.subtitle}</span>
                </div>
                <p className="text-navy/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/framework"
              className="text-sm font-display font-semibold text-copper hover:text-copper/80 transition-colors"
            >
              See the full framework &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mission Control ── */}
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
              Every rebuild includes Mission Control. It captures leads, tracks sources, monitors site health, and gives you a real-time view of what your site is doing. Available standalone for $150/mo.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3 font-display font-semibold text-base bg-copper text-deep-space transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
            >
              See Pricing
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
                  Certified PMP, Texas
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credentials ── */}
      <Credentials />

      {/* ── Final CTA ── */}
      <section className="py-16 sm:py-24 bg-navy/60 border-t border-copper/15" aria-labelledby="final-cta-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3">
              <Icon name="rocket" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="final-cta-heading" className="mb-4">Start with the Clarity Audit.</h2>
            <p className="text-starlight/70 text-base mb-6" style={{ textWrap: "pretty" }}>
              A $150 diagnostic that scores your business across four layers and shows you exactly where the system breaks and what to fix first.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3-5 day turnaround &middot; Scored report included
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
                  text: "Cosmic Reach Creative is a growth systems consultancy founded by Jordan Knight in Memphis, TN. We help businesses diagnose where their growth infrastructure breaks and rebuild it so the system works. We evaluate four forces: messaging clarity, offer strength, site structure, and performance visibility."
                }
              },
              {
                "@type": "Question",
                name: "My website is not converting. Can you help?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Most websites underperform because of a deeper structural issue: unclear messaging, a weak offer, friction in the site experience, or no visibility into what is working. We start with a $150 Clarity Audit to diagnose the root constraint, then rebuild the system in about 30 days."
                }
              },
              {
                "@type": "Question",
                name: "What does the $150 Clarity Audit include?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The Clarity Audit is a structured diagnostic that scores your business across four layers: Signal (messaging), Gravity (offer), Orbit (site structure), and Thrust (visibility). You receive a written report with root-cause findings and a prioritized implementation path. Delivered in 3-5 business days."
                }
              },
              {
                "@type": "Question",
                name: "Do you only work with businesses in Memphis?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. Cosmic Reach Creative is headquartered in Memphis, TN, but we work with businesses nationwide. All engagements are delivered remotely."
                }
              },
              {
                "@type": "Question",
                name: "What does a full rebuild include?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A full 30-Day Rebuild includes positioning, messaging, brand system, website design and development, sales materials, lead capture, and performance visibility through Mission Control. Pricing ranges from $4,000 to $8,000 depending on scope. The audit fee is applied toward the rebuild."
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
              { q: "What is Cosmic Reach Creative?", a: "A growth systems consultancy founded by Jordan Knight in Memphis, TN. We help businesses diagnose where their growth infrastructure breaks and rebuild it so the system works." },
              { q: "My website is not converting. Can you help?", a: "Yes. Most websites underperform because of a deeper structural issue: unclear messaging, a weak offer, friction in the site experience, or no visibility into what is working. The $150 Clarity Audit diagnoses the root constraint. The 30-Day Rebuild fixes it." },
              { q: "What does the $150 Clarity Audit include?", a: "A structured diagnostic that scores your business across four layers: Signal (messaging), Gravity (offer), Orbit (site structure), and Thrust (visibility). You receive a written report with root-cause findings and a prioritized implementation path. Delivered in 3-5 business days." },
              { q: "Do you only work with businesses in Memphis?", a: "We are headquartered in Memphis, TN, but work with businesses nationwide. All engagements are delivered remotely." },
              { q: "What does a full rebuild include?", a: "Positioning, messaging, brand system, website design and development, sales materials, lead capture, and performance visibility through Mission Control. Completed in about 30 days. Pricing ranges from $4,000 to $8,000 depending on scope." },
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
