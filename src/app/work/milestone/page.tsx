import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CaseStudyHeader } from "@/components/sections/CaseStudyHeader";
import { CTASection } from "@/components/sections/CTASection";
import { MILESTONE_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Milestone Case Study",
  description:
    "From spreadsheet drift to a system that holds. How Cosmic Reach designed a decision surface that structured attention and surfaced critical path signals.",
  path: "/work/milestone",
});

export default function MilestonePage() {
  return (
    <>
      <CaseStudyHeader
        title="Milestone"
        subtitle="From spreadsheet drift to a system that holds"
        tags={["Systems design", "Reporting workflow", "Product prototype"]}
        role="Role: Strategy, UX, interface design, build direction"
        links={[
          { label: "Request a Similar Build", href: "/signal-session" },
          { label: "View the Live Tool", href: MILESTONE_URL, external: true },
        ]}
      />

      {/* The Signal */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            The Signal - Where clarity broke down
          </h2>
          <p className="text-starlight text-lg font-medium mb-4">
            A spreadsheet can track tasks.<br />
            It cannot hold a system when reality shifts.
          </p>
          <p className="text-muted text-base leading-relaxed mb-4">
            Milestone started as a simple tracking file used by a working PMP managing real dependencies across locations. The moment timelines moved, the file still functioned, but clarity broke down. The signal was buried. Decisions slowed. Confidence dropped.
          </p>
          <p className="text-starlight text-base font-medium">
            This was not a tooling problem.<br />
            It was a system problem.
          </p>
        </div>
      </Section>

      {/* The Interference */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            The Interference
          </h2>
          <ul className="space-y-3" role="list">
            {[
              "Updates created drift across tabs, owners, and dates",
              "Dependencies were easy to miss after changes",
              "Reporting required manual translation for stakeholders",
              "The same data created different interpretations",
              "The system did not guide attention to the next decision",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Mission Objective */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            Mission Objective
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            Design a lightweight system that preserves the simplicity of a spreadsheet while adding structure, visibility, and decision readiness.
          </p>
          <h3 className="font-display font-semibold text-lg text-starlight mb-4">
            Success criteria
          </h3>
          <ul className="space-y-3" role="list">
            {[
              "Make status obvious within seconds",
              "Reduce manual reporting time",
              "Highlight dependencies and risk before they surface",
              "Create a repeatable pattern that scales across projects",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Solution Architecture */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            Solution Architecture
          </h2>
          <p className="text-starlight text-lg font-medium mb-4">
            Milestone became a decision surface.
          </p>
          <p className="text-muted text-base leading-relaxed mb-8">
            Instead of tracking tasks, it structures attention. It separates planning from execution, surfaces critical path signals, and creates a consistent language for status that stakeholders can trust.
          </p>
          <h3 className="font-display font-semibold text-lg text-starlight mb-4">
            Components
          </h3>
          <ul className="space-y-3" role="list">
            {[
              "Timeline logic that adapts to change",
              "Dependency visibility baked into the workflow",
              "Status signals that prioritize what matters next",
              "A clean executive view that reads fast",
              "A system that can be reused across teams",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Design Treatment */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            Design Treatment
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            The interface was designed to feel calm under pressure. Navigation is minimal. Visual hierarchy is strict. Movement is subtle. Color is used as signal, not decoration.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "One primary focus per screen",
              "Clear typography hierarchy",
              "Red reserved for action and attention",
              "Consistent spacing that keeps the mind steady",
            ].map((rule) => (
              <Card key={rule}>
                <p className="text-starlight text-sm font-medium">{rule}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Results */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            Results
          </h2>
          <ul className="space-y-3" role="list">
            {[
              "Faster decisions because status is visible",
              "Less friction updating plans after change",
              "Reduced reporting noise for stakeholders",
              "A reusable system structure, not a one-off file",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Testimonial */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            Perspective from the Field
          </h2>
          <blockquote className="border-l-2 border-spark-red pl-6">
            <p className="text-starlight text-lg leading-relaxed italic mb-4">
              &ldquo;This tool preserves the governance backbone while making updates simple and reporting clean. It gives project leaders clarity and control without overcomplicating the process.&rdquo;
            </p>
            <footer className="text-muted text-sm">
              <strong>Senior PMP, Texas</strong>
            </footer>
          </blockquote>
        </div>
      </Section>

      {/* What We Learned */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            What We Learned
          </h2>
          <p className="text-starlight text-lg font-medium mb-4">
            Tools do not create clarity.<br />
            Systems do.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When teams can see the same reality, they move together. When the signal is clean, decisions feel obvious.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <CTASection
        title="Want a system like this for your marketing team?"
        description="We start with a free strategy call. We audit where your reporting breaks down, map the gaps, and design the system that makes performance visible."
        buttonLabel="Book a Free Strategy Call"
        buttonHref="/signal-session"
        secondaryLabel="View the Live Tool"
        secondaryHref={MILESTONE_URL}
        secondaryExternal
      />
    </>
  );
}
