import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${siteConfig.siteName} | Strategic Marketing Architecture`,
  description:
    "Cosmic Reach Creative designs the strategic architecture behind scalable marketing. Diagnosis before prescription — for founders and marketing leaders who need structure, not more activity.",
  alternates: { canonical: siteConfig.domain },
};

const diagnosticSignals = [
  "Messaging doesn't land with the right buyers",
  "Offers create hesitation instead of urgency",
  "Leads stall somewhere in the journey without a clear reason",
  "Teams lack visibility into what's actually driving results",
  "Marketing activity increases without producing proportional revenue",
  "Growth depends on individual effort rather than a repeatable system",
];

const frameworkLayers = [
  {
    title: "Signal",
    description: "The clarity of your message. Who it reaches, what it says, and whether it creates immediate recognition in the right buyer.",
    icon: "compass",
  },
  {
    title: "Gravity",
    description: "The structural strength of your offer. How well it reduces friction, creates pull, and converts attention into action.",
    icon: "orbit",
  },
  {
    title: "Orbit",
    description: "The infrastructure moving prospects from first contact to close. Workflows, touchpoints, and the handoffs between them.",
    icon: "gears",
  },
  {
    title: "Thrust",
    description: "The performance data that tells you what's working. KPI visibility that recalibrates Signal and keeps the system compounding.",
    icon: "signal",
  },
];

const fitSignals = [
  "A business with traction that hasn't translated into predictable growth",
  "A team that works hard but keeps shifting priorities without clear returns",
  "A founder building the right foundation before scaling spend",
  "A company where marketing, offers, and follow-through aren't working together",
];

const notFitSignals = [
  "You're looking for quick marketing hacks",
  "You're not open to adjusting how the business is structured",
  "You're expecting a hands-on production team",
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
            <p className="text-starlight/80 text-base sm:text-lg mb-2" style={{ textWrap: "balance" }}>
              We design the strategic architecture behind scalable marketing — the structure that allows messaging, offers, and systems to compound rather than compete.
            </p>
            <p className="text-starlight/60 text-sm mb-6">
              Diagnosis before prescription.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <CTAButton label="Start The Clarity Audit" variant="primary" />
              <CTAButton label="Explore the Launch Sequence" variant="secondary" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Symptoms of a Structural Problem ── */}
      <section
        className="relative overflow-hidden py-16 sm:py-24 bg-section-light"
        aria-labelledby="symptoms-heading"
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
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0" />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent z-0" />

        <div className="relative z-10 mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3">
              <Icon name="spark" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="symptoms-heading" className="mb-8 text-navy">
              Symptoms of a Structural Problem
            </h2>

            <ul className="space-y-4 text-left mb-10 max-w-lg mx-auto">
              {[
                "Messaging doesn't land with the right buyers.",
                "Offers create hesitation instead of urgency.",
                "Leads stall somewhere in the journey.",
                "Teams lack visibility into what's actually working.",
              ].map((symptom, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-copper mt-0.5 shrink-0 font-display font-semibold text-sm">0{i + 1}</span>
                  <span className="text-navy/80 text-base font-display font-semibold">{symptom}</span>
                </li>
              ))}
            </ul>

            <p className="text-navy text-xl sm:text-2xl font-display font-bold mb-2 leading-snug">
              This is not a marketing problem.
              <br />
              It is a systems problem.
            </p>
            <p className="text-navy/70 text-base">
              Cosmic Reach identifies the exact friction points and installs the architecture to resolve them.
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
              Signs the Architecture Needs Attention
            </h2>
            <p className="text-starlight/70 text-base mb-8">
              If any of these are present, the growth infrastructure may be working against itself.
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
              These aren&apos;t effort problems. They&apos;re architectural ones.
            </p>
            <p className="text-starlight/70 text-sm mb-6">
              The Business Clarity Audit is a structural diagnostic that identifies the exact friction points — and what to address first.
            </p>
            <CTAButton label="Start the Clarity Audit" variant="primary" />
          </div>
        </div>
      </section>

      {/* ── The Growth Engine ── */}
      <section className="py-16 sm:py-24 bg-section-light" aria-labelledby="framework-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-heading" className="mb-3 text-navy">The Growth Engine</h2>
            <p className="text-navy/70 text-base mb-3" style={{ textWrap: "balance" }}>
              The Launch Sequence operates as a continuous feedback loop.
            </p>
            <p className="text-navy/60 text-sm leading-relaxed max-w-xl mx-auto">
              Signal shapes what the market sees. Gravity converts attention into demand. Orbit moves prospects through the journey. Thrust provides the performance data that recalibrates Signal — and the cycle compounds.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {frameworkLayers.map((layer) => (
              <div
                key={layer.title}
                className="rounded-[var(--radius-lg)] border border-navy/10 bg-white p-5 shadow-subtle transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:shadow-soft"
              >
                <Icon name={layer.icon} size={26} className="mb-2 opacity-70" />
                <h3 className="font-display font-semibold text-base mb-2 text-navy">{layer.title}</h3>
                <p className="text-sm text-navy/60 leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-navy/50 text-xs tracking-wide">
              Signal → Gravity → Orbit → Thrust → Signal
            </p>
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
              { label: "Deep-Dive Analysis", detail: "What's slowing each layer and exactly why it matters." },
              { label: "Recommended Shifts", detail: "Specific, prioritized actions to accelerate growth." },
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
              Cosmic Reach works best with founders and teams who sense something in their business isn&apos;t converting the way it should.
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
              The common thread: a willingness to fix the foundation before scaling the spend.
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
            <h2 id="final-cta-heading" className="mb-4">See What&apos;s Holding You Back</h2>
            <p className="text-starlight/70 text-base mb-6" style={{ textWrap: "balance" }}>
              The Business Clarity Audit evaluates your messaging, offers, customer journey, and growth levers — then tells you exactly what to address first.
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
