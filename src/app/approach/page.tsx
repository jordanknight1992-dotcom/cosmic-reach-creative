import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Approach",
  description:
    "Most consulting stops at recommendations. Cosmic Reach exists to build systems that actually work.",
  path: "/approach",
  heroImage: "/images/hero/approach.jpg",
});

export default function ApproachPage() {
  return (
    <>
      <PageHero
        title="How We Bring Systems Into Alignment"
        lead="Most consulting stops at recommendations. Cosmic Reach exists to build systems that actually work."
        imageSrc="/images/hero/approach.jpg"
        imageAlt="Approach to systems alignment"
      />

      {/* Clarity is not a presentation */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-6">
            Clarity is not a presentation.<br />
            It is an operational condition.
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            When teams share the same signals, decisions accelerate, alignment strengthens, and execution becomes predictable.
          </p>
          <p className="text-starlight text-lg font-medium mt-4">
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
                Where is clarity breaking down? What signals are teams missing?
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Design the signal
              </h3>
              <p className="text-muted text-base leading-relaxed">
                What structure, language, and system would make alignment inevitable?
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Make it real
              </h3>
              <p className="text-muted text-base leading-relaxed">
                What tools, workflows, or prototypes turn this into daily practice?
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Where Intelligence Meets Signal */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-6">
            Where Intelligence Meets Signal
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            We use AI to surface patterns, build workflows, and accelerate system implementation.
          </p>
          <p className="text-starlight text-lg font-medium">
            Technology only matters when it makes people&#39;s work clearer.
          </p>
        </div>
      </Section>

      <CTASection
        title="Book a Signal Session"
        description="We start with a working conversation. No pitch. Just signal."
        buttonLabel="Book a Signal Session"
        buttonHref="/signal-session"
      />
    </>
  );
}
