import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About Cosmic Reach | Built From the Operator's Seat",
  description:
    "Built from years inside real delivery environments. Cosmic Reach helps founders diagnose what's holding growth back and install the structure to fix it.",
  alternates: { canonical: `${siteConfig.domain}/about` },
};

const principles = [
  { label: "A clear message is a system advantage", icon: "compass" },
  { label: "Strong offers reduce friction before the conversation begins", icon: "orbit" },
  { label: "Repeatable workflows outlast individual effort", icon: "gears" },
  { label: "Decisions without data are guesses", icon: "signal" },
];

export default function AboutPage() {
  return (
    <main id="main-content">
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
            <h1 id="about-hero" className="text-copper">Built From the Operator&apos;s Seat</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              Cosmic Reach wasn&apos;t built from theory. It was forged inside real delivery environments.
            </p>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="py-12 sm:py-16" aria-labelledby="origin-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="spark" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="origin-heading" className="mb-4">The Mission Behind the Work</h2>
            <p className="text-starlight/70 text-base mb-3">
              Cosmic Reach was built to answer one question: why isn&apos;t this working?
            </p>
            <p className="text-starlight/70 text-base mb-3">
              Most businesses don&apos;t fail from lack of effort. They stall because the forces driving growth, messaging, offer strength, the customer journey, and performance visibility, aren&apos;t working together.
            </p>
            <p className="text-starlight/70 text-base">
              Built from years inside real delivery environments where these forces determined whether growth stuck or stalled. Cosmic Reach was designed to bring that same discipline to founders and marketing teams.
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
                  alt="Jordan Knight"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 id="founder-heading" className="mb-4">The Perspective Behind the Work</h2>
                <p className="text-starlight/70 text-base mb-3">
                  Jordan Knight has led infrastructure programs, marketing initiatives, and delivery systems where clarity wasn&apos;t optional.
                </p>
                <p className="text-starlight/70 text-base mb-3">
                  That experience shaped a simple belief:
                </p>
                <p className="text-starlight/80 text-base font-display font-semibold mb-3">
                  When the system works, teams don&apos;t need constant rescue.
                </p>
                <p className="text-starlight/70 text-base">
                  Cosmic Reach exists to design those systems.
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

      {/* Principles */}
      <section className="py-12 sm:py-16" aria-labelledby="principles-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="mb-3">
              <Icon name="gears" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="principles-heading">Systems Over Guesswork</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
            {principles.map((p) => (
              <div
                key={p.label}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <Icon name={p.icon} size={26} className="mb-2 opacity-70 mx-auto" />
                <p className="font-display font-semibold text-sm text-starlight/80">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-label="What operators say">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-6">
            From the Mission Log
          </p>
          <div className="max-w-2xl mx-auto">
            <blockquote className="rounded-2xl border border-starlight/8 bg-navy/60 p-6 sm:p-8">
              <p className="text-starlight/80 text-base italic leading-relaxed mb-4">
                &ldquo;I&apos;ve spent decades leading infrastructure and network programs where milestone visibility and structured reporting were critical to success. Cosmic Reach translated that same disciplined framework into a modern, intuitive platform. It gives project leaders clarity, control, and professional-grade reporting without unnecessary complexity.&rdquo;
              </p>
              <footer className="text-sm text-copper font-display font-medium">
                Licensed PMO, Texas
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Mission Log: Building Cosmic Reach */}
      <section className="py-12 sm:py-16" aria-labelledby="mission-log-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-3">
              <Icon name="map" size={36} className="opacity-80 mx-auto" />
            </div>
            <div className="text-center mb-8">
              <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-2">
                Case Study
              </p>
              <h2 id="mission-log-heading" className="mb-3">Mission Log: Building Cosmic Reach</h2>
              <p className="text-starlight/70 text-base leading-relaxed max-w-2xl mx-auto">
                Before applying the Launch Sequence to clients, we applied it here. Every layer of Cosmic Reach Creative was built through the same structured process we bring to every engagement.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  layer: "Signal",
                  heading: "Defining the Architecture Positioning",
                  body: "The firm's positioning was built around a single differentiating concept: strategic marketing architecture. Not consulting. Not agency work. The architecture that makes marketing scale without breaking.",
                },
                {
                  layer: "Gravity",
                  heading: "Designing the Audit → Sprint Ladder",
                  body: "The engagement model was structured as a diagnostic-first ladder. The Clarity Audit reduces risk for the client, delivers immediate value, and creates a natural path to Sprint engagement. Each tier has a defined scope and outcome.",
                },
                {
                  layer: "Orbit",
                  heading: "Building the Website, Framework, and Workflow",
                  body: "Every touchpoint, from the website structure to the intake workflow to the report format, was designed as an integrated system. Each piece has a defined role in moving a prospect from awareness to decision.",
                },
                {
                  layer: "Thrust",
                  heading: "Defining the Metrics That Matter",
                  body: "Before scaling any channel, the measurement baseline was established: audit conversion rate, sprint pipeline value, and referral cadence. Decisions are made against data, not intuition.",
                },
              ].map(({ layer, heading, body }) => (
                <div
                  key={layer}
                  className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-5 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
                >
                  <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-2">
                    {layer}
                  </p>
                  <p className="font-display font-semibold text-starlight text-sm mb-2">{heading}</p>
                  <p className="text-starlight/60 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="about-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="about-cta" className="mb-3">Ready to Find the Constraint?</h2>
            <p className="text-starlight/70 text-base mb-6">
              The Business Clarity Audit evaluates the four forces driving your business and delivers a structural diagnostic, so you know exactly where to focus.
            </p>
            <CTAButton label="Start the Clarity Audit" variant="primary" />
          </div>
        </div>
      </section>
    </main>
  );
}
