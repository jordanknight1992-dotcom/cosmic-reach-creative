import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";
import { StripeBuyButton } from "@/components/StripeBuyButton";

export const metadata: Metadata = {
  title: "Mission Control | See What's Happening. Know What to Do Next.",
  description:
    "Mission Control is the operating layer that sits above your tools, your data, and your reporting. It turns activity into direction so decisions move faster and with confidence.",
  alternates: { canonical: `${siteConfig.domain}/mission-control` },
};

const FEATURES = [
  "Daily Briefing + Next Move recommendation",
  "5 Key Daily Targets (priority-ranked)",
  "Operational CRM with pipeline stages",
  "AI-powered email drafts (your voice, your strategy)",
  "Lead generation with ICP scoring (PDL)",
  "Pipeline Signal dashboard",
  "GA4 website analytics integration",
  "Meeting scheduling + booking link",
  "Google Calendar sync",
  "Brand strategy & voice configuration",
  "Guided onboarding",
  "Two-factor authentication",
  "Encrypted credential storage",
  "1 user",
];

export default function MissionControlLanding() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="mc-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/mission-control-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/80 via-deep-space/70 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-copper mb-4">
              Mission Control
            </div>
            <h1 id="mc-hero" className="text-copper mb-4">
              See what&apos;s happening.<br />Know what to do next.
            </h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3 max-w-[560px] mx-auto">
              The operating layer that sits above your tools, your data, and your reporting.
              It turns activity into direction so decisions move faster and with confidence.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-8 py-3 text-base font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Access
              </a>
              <Link
                href="/mission-control/demo"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-starlight/20 text-starlight/70 px-7 py-3 text-base font-display font-semibold transition-all duration-[var(--duration-base)] hover:border-starlight/40 hover:text-starlight"
              >
                Try the Demo
              </Link>
            </div>
            <div className="mt-3 text-center">
              <Link
                href="/mission-control/login"
                className="text-sm text-starlight/40 hover:text-starlight/60 transition-colors underline underline-offset-2"
              >
                Already a member? Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-14 sm:py-20" aria-label="The problem">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
            The problem
          </p>
          <h2 className="font-display font-bold text-2xl text-starlight mb-5">
            More data than ever. Still uncertain when it&apos;s time to act.
          </h2>
          <div className="space-y-4 text-starlight/60 text-base leading-relaxed">
            <p>
              Dashboards update constantly. Reports get generated on schedule. Metrics shift across platforms.
            </p>
            <p>
              The connection between those signals and real decisions is missing. Time gets spent interpreting instead of moving.
            </p>
            <p className="text-starlight/80 font-display font-medium">
              Momentum slows quietly.
            </p>
          </div>
        </div>
      </section>

      {/* What Mission Control Does */}
      <section className="py-14 sm:py-20 bg-navy/20" aria-label="What Mission Control does">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
            What Mission Control does
          </p>
          <h2 className="font-display font-bold text-2xl text-starlight mb-5">
            Connect your systems. See the pattern. Move.
          </h2>
          <div className="space-y-4 text-starlight/60 text-base leading-relaxed">
            <p>
              Mission Control reads changes across your pipeline, marketing activity, and performance data. Patterns surface. Friction points become visible. Opportunities show up earlier.
            </p>
            <p className="text-starlight/80 font-display font-medium">
              You open it and understand where attention should go.
            </p>
          </div>
        </div>
      </section>

      {/* Daily Briefing + Recommendations */}
      <section className="py-14 sm:py-20" aria-label="Daily Briefing and Recommendations">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30 hover:shadow-subtle">
              <Icon name="compass" size={28} className="mb-4 opacity-80" />
              <h3 className="font-display font-bold text-lg text-starlight mb-3">
                Daily Briefing
              </h3>
              <p className="text-starlight/60 text-sm leading-relaxed">
                Each day starts with a briefing built from live system data. It highlights movement across your business and focuses attention on what deserves it. No digging. No switching between tools.
              </p>
              <p className="text-starlight/50 text-sm leading-relaxed mt-3">
                The briefing evolves as your systems evolve, so the signal stays relevant as conditions change.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30 hover:shadow-subtle">
              <Icon name="signal" size={28} className="mb-4 opacity-80" />
              <h3 className="font-display font-bold text-lg text-starlight mb-3">
                Recommendations
              </h3>
              <p className="text-starlight/60 text-sm leading-relaxed">
                When conversion shifts, the pressure point becomes visible. When pipeline slows, the constraint is identified. When something gains traction, you see how to expand it.
              </p>
              <p className="text-starlight/50 text-sm leading-relaxed mt-3">
                Each recommendation leads into a next move so execution stays consistent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities — 6 feature cards */}
      <section className="py-14 sm:py-20 bg-navy/20" aria-label="Capabilities">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4 text-center">
            Inside Mission Control
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: "compass", title: "Daily Briefing", desc: "Your biggest issue, what's working, and one clear next move. Every morning." },
              { icon: "orbit", title: "5 Key Targets", desc: "The highest-leverage leads to work today, ranked by urgency and fit." },
              { icon: "gears", title: "Operational CRM", desc: "Pipeline, contacts, and email outreach. Built for daily use, not data entry." },
              { icon: "signal", title: "Pipeline Signal", desc: "Real-time pipeline health, GA4 analytics, and recommendations that adapt." },
              { icon: "rocket", title: "Strategy Engine", desc: "Define your voice, goals, and offers. AI drafts emails that sound like you." },
              { icon: "network", title: "Meetings", desc: "Booking links, Google Calendar sync, and scheduling from one place." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <div className="mb-3"><Icon name={item.icon} size={26} className="mx-auto" /></div>
                <div className="font-display font-bold text-sm mb-1.5 text-starlight">{item.title}</div>
                <div className="text-sm text-starlight/50 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for Operators + System Integration */}
      <section className="py-14 sm:py-20" aria-label="Built for operators">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
                Built for operators
              </p>
              <p className="text-starlight/70 text-base leading-relaxed">
                Founders, marketing leads, and operators who need clarity without building it manually every day. You open it, understand the current state, and move forward with intention.
              </p>
            </div>
            <div>
              <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
                System integration
              </p>
              <p className="text-starlight/70 text-base leading-relaxed mb-4">
                Mission Control connects to the tools already in place.
              </p>
              <div className="flex flex-wrap gap-3">
                {["CRM", "Analytics", "Campaign platforms", "Scheduling systems"].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-starlight/10 bg-navy/40 px-4 py-1.5 text-xs font-display font-medium text-starlight/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <p className="text-starlight/50 text-sm leading-relaxed mt-4">
                The value comes from how everything is interpreted together, creating a single layer of understanding across the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Changes */}
      <section className="py-14 sm:py-20 bg-navy/20" aria-label="What changes">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-6">
            What changes
          </p>
          <div className="grid gap-4 sm:grid-cols-3 max-w-xl mx-auto">
            {[
              "Visibility becomes immediate",
              "Decisions become faster",
              "Execution becomes consistent",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[var(--radius-lg)] border border-copper/20 bg-navy/50 p-5 transition-all duration-[var(--duration-base)] hover:border-copper/40"
              >
                <p className="text-sm font-display font-semibold text-starlight">
                  {item}.
                </p>
              </div>
            ))}
          </div>
          <p className="text-starlight/50 text-sm mt-6">
            The system improves as more data flows through it and patterns become clearer.
          </p>
        </div>
      </section>

      {/* Pricing — Single Tier */}
      <section id="pricing" className="py-14 sm:py-20" aria-label="Pricing">
        <div className="max-w-[var(--container-max)] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold mb-2 text-starlight">
              One plan. Everything included.
            </h2>
            <p className="text-starlight/40 text-sm">
              No tiers to compare. No features locked behind upgrades. You get the full operating system.
            </p>
          </div>

          <div className="max-w-[480px] mx-auto">
            <div className="rounded-[var(--radius-lg)] border-2 border-copper/40 bg-navy/70 p-7 sm:p-8 relative overflow-hidden transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/60 hover:shadow-subtle">
              <div className="flex items-baseline gap-0.5 mb-2">
                <span className="text-5xl font-display font-bold text-copper">$299</span>
                <span className="text-sm text-starlight/40">/mo</span>
              </div>

              <p className="text-sm text-starlight/50 leading-relaxed mb-6">
                For founders who want pipeline clarity, daily targets, and one clear next move.
                Includes guided onboarding. You bring your own API keys.
              </p>

              <div className="mb-6">
                <StripeBuyButton buyButtonId="buy_btn_1TDtF70vGBLnj72k5a2Q3awc" />
              </div>

              {/* Features in two columns */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-starlight/80">
                    <span className="text-copper text-sm mt-0.5 shrink-0">&#9670;</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-starlight/30 mb-3">
              Includes a guided 90-minute onboarding call. Integrations use your own API keys, so you control your costs.
            </p>
            <p className="text-xs text-starlight/40">
              Also available as part of the{" "}
              <Link href="/pricing" className="text-copper/70 hover:text-copper underline underline-offset-2">
                Execution Sprint
              </Link>{" "}
              for teams building their full system.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
