import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Clarity Audit | A $150 Diagnostic of Where Growth Breaks Down",
  description:
    "The Clarity Audit evaluates your business across four layers: messaging clarity, offer strength, site structure, and visibility. You receive a scored report with root-cause findings and a prioritized implementation path. $150. 3-5 day turnaround.",
  alternates: { canonical: `${siteConfig.domain}/clarity` },
};

export default function ClarityPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "Clarity Audit", item: "https://cosmicreachcreative.com/clarity" },
        ]
      })}} />

      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="clarity-hero">
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
            <h1 id="clarity-hero" className="text-copper mb-4">The Clarity Audit.</h1>
            <p className="text-starlight/80 text-base sm:text-lg" style={{ textWrap: "pretty" }}>
              A structured diagnostic that identifies where your growth system breaks and what to fix first. $150. Delivered in 3-5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="clarity-problem">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="clarity-problem" className="mb-4 text-navy">Something feels off. You cannot name it. The audit can.</h2>
            <p className="text-navy/70 text-base mb-3">
              You have a business that works. Customers exist. Revenue comes in. But growth has flattened and you are not sure why. The instinct is to try something new. A new channel. A new campaign. A redesign.
            </p>
            <p className="text-navy/70 text-base">
              The Clarity Audit diagnoses the actual constraint before you spend money fixing the wrong thing. It evaluates four forces that drive every business and shows you exactly where the system is breaking down.
            </p>
          </div>
        </div>
      </section>

      {/* What It Evaluates */}
      <section className="py-12 sm:py-16" aria-labelledby="clarity-layers">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 id="clarity-layers" className="mb-3">Four layers. Scored 0-10.</h2>
            <p className="text-starlight/70 text-base">
              The audit evaluates each layer and identifies the root constraint holding growth back.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
            {[
              { name: "Signal", subtitle: "Messaging", desc: "Is your message reaching the right people? Can they understand what you do and why it matters in under 10 seconds?" },
              { name: "Gravity", subtitle: "Offer", desc: "Is the offer strong enough to convert without pressure? Is the value clear before the ask?" },
              { name: "Orbit", subtitle: "Path to Action", desc: "Does the site guide visitors toward a clear next step? Are there friction points slowing conversion?" },
              { name: "Thrust", subtitle: "Visibility", desc: "Do you know what is working? Are leads tracked? Can you see which pages drive results?" },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-starlight/10 bg-navy/40 p-5 text-left transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-copper font-display font-bold text-sm">{item.name}</span>
                  <span className="text-starlight/30 text-xs">{item.subtitle}</span>
                </div>
                <p className="text-starlight/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Receive */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="clarity-deliverable">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Icon name="document" size={36} className="opacity-80 mx-auto mb-3" />
              <h2 id="clarity-deliverable" className="mb-3">What you receive.</h2>
              <p className="text-starlight/70 text-base">
                A written report delivered in 3-5 business days.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
              {[
                "Scored evaluation across all four layers",
                "Root-cause analysis of the primary constraint",
                "Specific findings with supporting evidence",
                "Prioritized implementation path",
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
            <div className="text-center mt-6">
              <Link
                href="/clarity-report-example"
                className="text-sm font-display font-semibold text-copper hover:text-copper/80 transition-colors underline underline-offset-2"
              >
                See a full example report &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="clarity-audience">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="clarity-audience" className="mb-4 text-navy">Built for businesses with traction and friction.</h2>
            <p className="text-navy/70 text-base mb-6">
              The audit is most useful when the business is working but growth has plateaued. Common patterns:
            </p>
            <ul className="space-y-3 max-w-md mx-auto text-left">
              {[
                "The site looks fine but leads have slowed",
                "Messaging feels unclear or unfocused",
                "Marketing activity is happening but results are flat",
                "There is no visibility into what is actually working",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy/70">
                  <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What Happens After */}
      <section className="py-12 sm:py-16" aria-labelledby="clarity-after">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="clarity-after" className="mb-3">What happens after the audit.</h2>
            <p className="text-starlight/70 text-base mb-3">
              You receive the report and can act on it independently. Many businesses do.
            </p>
            <p className="text-starlight/70 text-base">
              If the findings reveal deeper structural work, the next step is a 30-Day Rebuild. The audit fee is applied toward the rebuild. There is no obligation to continue.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-navy/60 border-t border-copper/15" aria-labelledby="clarity-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="clarity-cta" className="mb-4">$150. Clear answers. No obligation.</h2>
            <p className="text-starlight/70 text-base mb-6">
              Stop guessing where the problem is. The Clarity Audit maps the system and shows you what to fix first.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3-5 day turnaround &middot; Scored report included &middot; Audit fee credited toward rebuild
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
