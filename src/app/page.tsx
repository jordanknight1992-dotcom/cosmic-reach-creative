import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | Operational Clarity for Teams`,
  description:
    "Cosmic Reach Creative helps founders identify where growth is getting stuck and build systems that move the business forward.",
  alternates: { canonical: siteConfig.domain },
};

const diagnosticSignals = [
  "Marketing activity is happening but revenue doesn't move the way it should",
  "Your team works hard but priorities constantly shift",
  "Customers seem interested but hesitate before buying",
  "Messaging changes frequently because nothing feels quite right",
  "Decisions take longer than they should because the real constraint isn't clear",
  "Progress depends on heroic effort instead of reliable systems",
];

const frameworkLayers = [
  { title: "Signal", description: "Messaging clarity", icon: "compass" },
  { title: "Gravity", description: "Offer strength", icon: "orbit" },
  { title: "Orbit", description: "Customer journey", icon: "gears" },
  { title: "Thrust", description: "Growth opportunities", icon: "signal" },
];

const fitSignals = [
  "A business that has traction but feels stuck",
  "A team that's working hard but lacks structural clarity",
  "An early-stage founder shaping the right system from the beginning",
  "A company where marketing, operations, and execution aren't fully aligned",
];

const notFitSignals = [
  "You're looking for quick marketing hacks",
  "You're not open to adjusting how the business is structured",
  "You're expecting a tactical execution agency",
];

export default function HomePage() {
  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0">
          <Image
            src="/images/01-home-hero.jpg"
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
            <h1 id="hero-title" className="mb-4 text-copper" style={{ textWrap: "balance" }}>
              Sharpen the Message. Install the System.
            </h1>
            <p className="text-starlight/80 text-base sm:text-lg mb-6">
              We work with Marketing Directors and Founders to sharpen brand messaging and install the marketing systems that make growth repeatable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton label="Start The Clarity Audit" variant="primary" />
              <CTAButton label="Explore the Clarity Framework" variant="secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Where Momentum Breaks Down ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 bg-section-light"
        aria-labelledby="momentum-heading"
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

        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[72px] h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-navy/[0.05] z-0"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[110px] h-[380px] w-[380px] -translate-x-1/2 rounded-full border border-navy/[0.04] z-0"
        />

        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0"
        />

        <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3">
              <Icon name="spark" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="momentum-heading" className="mb-5 text-navy">
              Where Momentum Breaks Down
            </h2>
            <p className="text-navy/70 text-base mb-3">
              Most businesses don&apos;t have a marketing problem.
            </p>
            <p className="text-navy/70 text-base mb-3">
              The website exists. The services are clear internally. The team is working.
            </p>
            <p className="text-navy/70 text-base mb-3">
              But something still isn&apos;t converting.
            </p>
            <p className="text-navy/70 text-base mb-3">
              Customers hesitate. Leads stall. Effort doesn&apos;t translate into momentum.
            </p>
            <p className="text-navy text-base font-display font-semibold mt-6 mb-2">
              They have a clarity problem.
            </p>
            <p className="text-navy/70 text-base">
              Cosmic Reach identifies exactly where that breakdown happens.
            </p>
          </div>
        </div>
      </section>

      {/* ── Diagnostic Signals ── */}
      <section
        className="relative py-16 sm:py-24 bg-navy/40 overflow-hidden"
        aria-labelledby="signals-heading"
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
              <Icon name="signal" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="signals-heading" className="mb-3">
              Signals That Your Business Needs a Clarity Audit
            </h2>
            <p className="text-starlight/70 text-base mb-8">
              If any of these feel familiar, the system underneath your business may be working against you.
            </p>
          </div>

          <div className="mx-auto max-w-2xl grid gap-3 sm:grid-cols-2">
            {diagnosticSignals.map((signal, i) => (
              <div
                key={i}
                className="rounded-xl border border-starlight/8 bg-navy/50 px-5 py-4 flex items-start gap-3 transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">
                  &#9670;
                </span>
                <span className="text-starlight/70 text-sm">{signal}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-3xl text-center mt-8">
            <p className="text-starlight/80 text-base font-display font-semibold mb-2">
              These are not effort problems. They are clarity problems.
            </p>
            <p className="text-starlight/70 text-sm mb-6">
              A Business Clarity Audit identifies exactly where momentum is breaking down and what to fix first.
            </p>
            <CTAButton label="See the Clarity Audit" variant="primary" />
          </div>
        </div>
      </section>

      {/* ── The Cosmic Reach Framework ── */}
      <section className="py-16 sm:py-24 bg-section-light" aria-labelledby="framework-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-heading" className="mb-3 text-navy">The Cosmic Reach Framework</h2>
            <p className="text-navy/70 text-base">
              We don&apos;t start with tactics. We map the operating system underneath your business.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {frameworkLayers.map((layer) => (
              <div
                key={layer.title}
                className="rounded-[var(--radius-lg)] border border-navy/10 bg-white p-5 text-center shadow-subtle transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <Icon name={layer.icon} size={26} className="mb-2 opacity-70 mx-auto" />
                <h3 className="font-display font-semibold text-base mb-1 text-navy">{layer.title}</h3>
                <p className="text-sm text-navy/60">{layer.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inside the Clarity Report ── */}
      <section className="py-16 sm:py-24 bg-navy/40" aria-labelledby="report-preview-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-8">
            <div className="mb-3">
              <Icon name="map" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="report-preview-heading" className="mb-3">Inside the Clarity Report</h2>
            <p className="text-starlight/70 text-base">
              Every Business Clarity Audit delivers a structured written report — not a call, not a deck. Here&apos;s what&apos;s inside.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mb-8">
            {[
              { label: "Executive Readout", detail: "System Momentum Score and highest-leverage shift at a glance." },
              { label: "System Map", detail: "How the four framework forces interact in your specific business." },
              { label: "Layer-by-Layer Scorecard", detail: "Scored analysis of Signal, Gravity, Orbit, and Thrust." },
              { label: "Deep Friction Analysis", detail: "What's creating drag in each layer and exactly why it matters." },
              { label: "Recommended Shifts", detail: "Specific, prioritized actions to restore momentum." },
              { label: "Implementation Path", detail: "Sprint recommendation and a sequenced action plan for what to fix first." },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-starlight/8 bg-navy/50 px-5 py-4 transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <p className="font-display font-semibold text-sm text-copper mb-1">{item.label}</p>
                <p className="text-starlight/60 text-xs leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/clarity-report-example"
              className="inline-flex items-center gap-2 font-display font-semibold text-sm text-starlight/70 hover:text-starlight transition-colors underline underline-offset-2"
            >
              View an example report
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 bg-section-light"
        aria-label="What operators say"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-display font-semibold tracking-widest text-copper uppercase mb-8">
            From the Mission Log
          </p>

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
                  Cosmic Reach brings a level of imagination and strategic clarity that&apos;s rare to find. Jordan has a way of seeing the system underneath a business and identifying where momentum is breaking down. The result is clarity and direction you wouldn&apos;t arrive at on your own.
                </p>
                <footer className="text-sm text-copper font-display font-medium">
                  &mdash; Fractional Sales &amp; Marketing Director, California
                </footer>
              </blockquote>

              <blockquote className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6 sm:p-8">
                <p className="text-navy/75 text-base italic leading-relaxed mb-4">
                  I&apos;ve spent decades leading infrastructure and network programs where milestone visibility and structured reporting were critical to success. Cosmic Reach translated that same disciplined framework into a modern, intuitive platform. It gives project leaders clarity, control, and professional-grade reporting without unnecessary complexity.
                </p>
                <footer className="text-sm text-copper font-display font-medium">
                  &mdash; Licensed PMO, Texas
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who Cosmic Reach Is For ── */}
      <section className="py-16 sm:py-24" aria-labelledby="fit-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3">
              <Icon name="compass" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="fit-heading" className="mb-3">Who Cosmic Reach Is For</h2>
            <p className="text-starlight/70 text-base mb-8">
              Cosmic Reach works best with founders and teams who know something in their business needs to be clarified before progress can accelerate.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8">
              <h3 className="font-display font-semibold text-base text-copper mb-4">The Right Trajectory</h3>
              <ul className="space-y-3">
                {fitSignals.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-starlight/70 text-sm">
                    <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8">
              <h3 className="font-display font-semibold text-base text-starlight/60 mb-4">Not the Right Fit</h3>
              <ul className="space-y-3">
                {notFitSignals.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-starlight/60 text-sm">
                    <span className="text-starlight/30 mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-starlight/60 text-sm mb-4">
              The common thread is the desire to build the right system before scaling effort.
            </p>
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
            <h2 id="final-cta-heading" className="mb-4">Map Your Path to Clarity</h2>
            <p className="text-starlight/70 text-base mb-6" style={{ textWrap: "balance" }}>
              The Clarity Audit is a structured diagnostic that reveals exactly where momentum is breaking down inside your business.
            </p>
            <CTAButton label="Start The Clarity Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3–5 day turnaround &middot; Structured clarity report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
