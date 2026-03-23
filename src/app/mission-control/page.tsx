import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";
import { StripeBuyButton } from "@/components/StripeBuyButton";

export const metadata: Metadata = {
  title: "Mission Control | Daily Operator Intelligence. Decisions That Move Revenue.",
  description:
    "Mission Control is the decision engine for revenue teams. It directs daily execution by surfacing what needs attention and where momentum is dying. A system that tells you what to do next.",
  alternates: { canonical: `${siteConfig.domain}/mission-control` },
};

const FEATURES = [
  "Daily Briefing: what matters today, delivered every morning",
  "Next Move: one clear action, always visible",
  "5 Key Daily Targets, ranked by urgency, fit, and stage",
  "ICP scoring: deterministic fit scoring against your ideal profile",
  "Import from any source (CSV, Apollo, LinkedIn, exports)",
  "Smart field mapping: messy columns cleaned automatically",
  "AI-powered email drafts (your voice, your strategy)",
  "Digital Signal: recommendation-first performance view",
  "GA4 website analytics integration",
  "Meeting scheduling + Google Calendar sync",
  "Team workspaces with Owner, Admin & Member roles",
  "Two-factor authentication + encrypted credential storage",
  "Retainer clients: full access included at no extra cost",
  "Guided onboarding included",
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
              The system that tells you<br />what to do next.
            </h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3 max-w-[560px] mx-auto">
              Mission Control is the decision engine for revenue teams. Every morning it surfaces what&apos;s slipping, what&apos;s being ignored, and exactly where your attention should shift. Direction without prompting.
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
            Every day starts without direction.
          </h2>
          <div className="space-y-4 text-starlight/60 text-base leading-relaxed">
            <p>
              Leads go cold because nobody noticed. Meetings don&apos;t get booked because priorities aren&apos;t clear. Follow-ups slip because there&apos;s no system tracking what matters.
            </p>
            <p>
              The information exists across tools and spreadsheets. But connecting it to a decision (what to do first, who needs attention, where momentum is dying) is the gap.
            </p>
            <p className="text-starlight/80 font-display font-medium">
              Revenue teams don&apos;t need another dashboard. They need direction.
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
            Direction. Every morning. Without asking.
          </h2>
          <div className="space-y-4 text-starlight/60 text-base leading-relaxed">
            <p>
              Mission Control reads your lead data, scores fit against your ICP, and surfaces what needs attention. Overdue follow-ups. High-fit leads going cold. Empty calendars when deals are warm. It tells you what&apos;s slipping before you notice.
            </p>
            <p>
              Every day starts with a briefing and one clear Next Move. Your team sees the same priorities, works from the same targets, and executes without guessing.
            </p>
            <p className="text-starlight/80 font-display font-medium">
              Not a dashboard. A decision engine.
            </p>
          </div>
        </div>
      </section>

      {/* Daily Briefing + Next Move */}
      <section className="py-14 sm:py-20" aria-label="Daily Briefing and Next Move">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30 hover:shadow-subtle">
              <Icon name="compass" size={28} className="mb-4 opacity-80" />
              <h3 className="font-display font-bold text-lg text-starlight mb-3">
                Daily Briefing
              </h3>
              <p className="text-starlight/60 text-sm leading-relaxed">
                Every morning, Mission Control tells you what changed, what&apos;s slipping, and what needs attention. Overdue follow-ups. High-fit leads stalling. Empty calendars when warm replies are waiting.
              </p>
              <p className="text-starlight/50 text-sm leading-relaxed mt-3">
                No prompting. No digging. You open it and know where to focus.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30 hover:shadow-subtle">
              <Icon name="signal" size={28} className="mb-4 opacity-80" />
              <h3 className="font-display font-bold text-lg text-starlight mb-3">
                Next Move
              </h3>
              <p className="text-starlight/60 text-sm leading-relaxed">
                Every insight leads to an action. The system recommends the move. Work overdue targets. Book a meeting with a warm reply. Advance a high-fit lead stuck in qualification.
              </p>
              <p className="text-starlight/50 text-sm leading-relaxed mt-3">
                One clear action, always visible. Execution stays consistent because the system directs it.
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
              { icon: "compass", title: "Daily Briefing", desc: "What needs attention and where momentum is dying. Every morning." },
              { icon: "signal", title: "Next Move", desc: "Every insight leads to an action. One clear recommendation, always visible." },
              { icon: "orbit", title: "5 Key Targets", desc: "The highest-leverage leads to work today, ranked by urgency and fit." },
              { icon: "gears", title: "ICP Scoring", desc: "Deterministic fit scoring against your ideal profile. Explainable. No guessing." },
              { icon: "rocket", title: "AI Outreach", desc: "Email drafts in your voice and strategy. The system writes, you review and send." },
              { icon: "network", title: "Team Workspace", desc: "Shared priorities, role-based access, and meetings in one place." },
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

      {/* Built for Operators + Retainer Clients */}
      <section className="py-14 sm:py-20" aria-label="Built for operators">
        <div className="max-w-2xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
                Built for operators
              </p>
              <p className="text-starlight/70 text-base leading-relaxed">
                Founders, revenue leads, and operators who need daily clarity without building it manually. You open Mission Control and know where your attention should go. No prompting. No configuring. The system directs execution.
              </p>
            </div>
            <div>
              <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
                Included for retainer clients
              </p>
              <p className="text-starlight/70 text-base leading-relaxed mb-4">
                Every Cosmic Reach Creative retainer client gets full Mission Control access at no additional cost. It&apos;s the operating layer that keeps Sprint outcomes alive and execution on track.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Flight Support clients", "Sprint graduates", "Advisory retainers"].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-starlight/10 bg-navy/40 px-4 py-1.5 text-xs font-display font-medium text-starlight/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              <p className="text-starlight/50 text-sm leading-relaxed mt-4">
                Your data stays in your workspace. Import from Apollo, LinkedIn, HubSpot, Salesforce, or any CSV export.
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
              "Decisions become immediate",
              "Attention goes where it matters",
              "Execution stays consistent",
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
            The more data flows through the system, the sharper the recommendations become.
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
                <span className="text-5xl font-display font-bold text-copper">$149</span>
                <span className="text-sm text-starlight/40">/mo</span>
              </div>

              <p className="text-sm text-starlight/50 leading-relaxed mb-6">
                Daily operator intelligence that directs execution and sharpens decision-making.
                Includes guided onboarding. Retainer clients: included at no extra cost.
              </p>

              <div className="mb-6">
                <StripeBuyButton buyButtonId="buy_btn_1TEEoc0vGBLnj72kYikUQLBs" />
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
