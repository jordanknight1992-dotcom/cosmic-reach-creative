import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Approach",
  description:
    "We audit your marketing operations, design the reporting and workflow systems your team actually needs, and build them. No slide decks. Working tools.",
  path: "/approach",
  heroImage: "/images/hero/approach.jpg",
});

export default function ApproachPage() {
  return (
    <>
      <PageHero
        title="How We Bring Systems Into Alignment"
        lead="Most consultants hand you a deck. We hand you a working system."
        imageSrc="/images/hero/approach.jpg"
        imageAlt="Approach to marketing systems design"
      />

      {/* Clarity is not a presentation */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-6">
            Clarity is not a presentation.<br />
            It is an operational condition.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            When your marketing team shares the same dashboard, reads the same metrics, and knows which campaigns are driving results - decisions get faster, alignment gets stronger, and execution becomes predictable.
          </p>
          <p className="text-starlight text-lg font-medium">
            We design for that outcome.
          </p>
        </div>
      </Section>

      {/* The Signal Framework */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-12">
            The Signal Framework
          </h2>
          <div className="space-y-10">
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Diagnose the noise
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We audit your marketing stack, reporting workflows, and team processes. Where are people switching between platforms? Where does data get lost between tools? Where are decisions stalling because the right number isn&#39;t visible?
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Design the signal
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We architect the dashboards, reporting infrastructure, and workflow systems that connect your GA4, Search Console, ad platforms, and social data into a single source of truth your team can act on.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Make it real
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We build and ship working tools - automated reports, custom dashboards, connected platforms, and documented processes your team uses starting day one. Not a recommendation. A running system.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* What You Get */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-8">
            What You Walk Away With
          </h2>
          <ul className="space-y-4" role="list">
            {[
              "A unified marketing dashboard that pulls from every platform your team uses",
              "Automated reporting that replaces your monthly data-pull fire drill",
              "Process documentation so your ops don't live in one person's head",
              "Workflow redesigns that cut the time between insight and action",
              "Custom tools built around how your team actually works",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Where Intelligence Meets Signal */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-6">
            Where Intelligence Meets Signal
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            We use AI to surface patterns in your marketing data, automate reporting workflows, and accelerate the build process - so your team gets working systems in weeks, not quarters.
          </p>
          <p className="text-starlight text-lg font-medium">
            Technology only matters when it makes your team&#39;s work clearer.
          </p>
        </div>
      </Section>

      <CTASection
        title="Book a Signal Session"
        description="We start with a working conversation about your marketing operations. No pitch. No deck. Just a clear-eyed look at what's slowing your team down."
        buttonLabel="Book a Free Strategy Call"
        buttonHref="/signal-session"
      />
    </>
  );
}
