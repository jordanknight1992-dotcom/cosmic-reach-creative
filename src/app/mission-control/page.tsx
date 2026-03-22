import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Mission Control | Daily Operating System for Founders",
  description:
    "The daily operating system for founders who want pipeline clarity, daily targets, and one clear next move. Built by Cosmic Reach Creative.",
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
      {/* Hero with background image */}
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
              Know what to fix today.
            </h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3 max-w-[540px] mx-auto">
              The daily operating system for founders who want pipeline clarity,
              daily targets, and one clear next move, all in one place.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-8 py-3 text-base font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
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

      {/* What you get — 6 feature cards */}
      <section className="py-12 sm:py-16" aria-label="Features">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "compass", title: "Daily Briefing", desc: "Your biggest issue, what's working, and one clear next move. Every morning." },
              { icon: "compass", title: "5 Key Targets", desc: "The highest-leverage leads to work today, ranked by urgency and fit." },
              { icon: "compass", title: "Operational CRM", desc: "Pipeline, contacts, and email outreach. Built for daily use, not data entry." },
              { icon: "compass", title: "Pipeline Signal", desc: "Real-time pipeline health, GA4 analytics, and recommendations that adapt." },
              { icon: "compass", title: "Strategy Engine", desc: "Define your voice, goals, and offers. AI drafts emails that sound like you." },
              { icon: "compass", title: "Meetings", desc: "Booking links, Google Calendar sync, and scheduling from one place." },
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

      {/* Pricing — Single Tier */}
      <section id="pricing" className="py-12 sm:py-16 bg-navy/20" aria-label="Pricing">
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

              <a
                href="https://buy.stripe.com/5kQfZ98fzbDyeEM6i4fbq08"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3.5 rounded-[var(--radius-md)] font-display font-bold text-sm text-center mb-6 bg-copper text-deep-space transition-all duration-[var(--duration-base)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Get Started
              </a>

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
            <p className="text-xs text-starlight/30">
              Includes a guided 90-minute onboarding call. Integrations use your own API keys — you control your costs.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
