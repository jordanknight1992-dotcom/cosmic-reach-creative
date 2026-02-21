import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MILESTONE_URL, SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Milestone Case Study",
  description:
    "From spreadsheet drift to a system that holds. How Cosmic Reach designed a decision surface that structured attention and surfaced critical path signals.",
  path: "/work/milestone",
});

const interference = [
  "Updates created drift across tabs, owners, and dates",
  "Dependencies were easy to miss after changes",
  "Reporting required manual translation for stakeholders",
  "The same data created different interpretations",
  "The system did not guide attention to the next decision",
];

const successCriteria = [
  "Make status obvious within seconds",
  "Reduce manual reporting time",
  "Highlight dependencies and risk before they surface",
  "Create a repeatable pattern that scales across projects",
];

const components = [
  "Timeline logic that adapts to change",
  "Dependency visibility baked into the workflow",
  "Status signals that prioritize what matters next",
  "A clean executive view that reads fast",
  "A system that can be reused across teams",
];

const designRules = [
  "One primary focus per screen",
  "Clear typography hierarchy",
  "Red reserved for action and attention",
  "Consistent spacing that keeps the mind steady",
];

const outcomes = [
  "Faster decisions because status is visible",
  "Less friction updating plans after change",
  "Reduced reporting noise for stakeholders",
  "A reusable system structure, not a one off file",
];

export default function MilestonePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-deep-space">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
          <div className="max-w-3xl">
            <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-4">
              Case Study
            </p>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-starlight leading-[1.1] mb-4">
              Milestone
            </h1>
            <p className="text-muted text-xl md:text-2xl leading-relaxed mb-6">
              From spreadsheet drift to a system that holds.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-surface border border-border text-muted text-xs font-display font-semibold">
                Systems design
              </span>
              <span className="px-3 py-1 rounded-full bg-surface border border-border text-muted text-xs font-display font-semibold">
                Reporting workflow
              </span>
              <span className="px-3 py-1 rounded-full bg-surface border border-border text-muted text-xs font-display font-semibold">
                Product prototype
              </span>
            </div>
            <p className="text-muted text-sm mb-8">
              Role: Strategy, UX, interface design, build direction
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/clarity-session" chevron>
                Request a Similar Build
              </Button>
              <Button href={MILESTONE_URL} variant="secondary" external>
                View the Live Tool
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Signal */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            The Signal
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            A spreadsheet can track tasks. It cannot hold a system when reality shifts.
          </p>
          <p className="text-muted text-base leading-relaxed">
            Milestone started as a simple tracking file used by a working PMP managing real dependencies across locations. The moment timelines moved, the file still functioned, but clarity broke down. The signal was buried. Decisions slowed. Confidence dropped.
          </p>
          <p className="text-starlight text-base font-medium mt-6">
            This was not a tooling problem. It was a system problem.
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
            {interference.map((item) => (
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
            Design a lightweight system that preserved the simplicity of a spreadsheet while adding structure, visibility, and decision readiness.
          </p>
          <h3 className="font-display font-semibold text-lg text-starlight mb-4">
            Success criteria
          </h3>
          <ul className="space-y-3" role="list">
            {successCriteria.map((item) => (
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
            Instead of tracking tasks, it structured attention. It separated planning from execution, surfaced critical path signals, and created a consistent language for status that stakeholders could trust.
          </p>
          <h3 className="font-display font-semibold text-lg text-starlight mb-4">
            Components
          </h3>
          <ul className="space-y-3" role="list">
            {components.map((item) => (
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
            {designRules.map((rule) => (
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
          <ul className="space-y-3 mb-8" role="list">
            {outcomes.map((item) => (
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
          <blockquote className="border-l-2 border-spark-red pl-6">
            <p className="text-starlight text-lg leading-relaxed italic mb-4">
              &ldquo;This application takes the disciplined framework we&apos;ve used in real-world projects and transforms it into a modern, intuitive platform. It preserves the governance backbone while making updates simple and reporting clean. It&apos;s a powerful tool for project leaders who want clarity, control, and professional-grade reporting without overcomplicating the process.&rdquo;
            </p>
            <footer className="text-muted text-sm">
              Senior PMP, Texas
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
            Tools do not create clarity. Systems do.
          </p>
          <p className="text-muted text-base leading-relaxed">
            When teams can see the same reality, they move together. When the signal is clean, decisions feel obvious.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-brand-navy-alt">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-starlight leading-tight mb-4">
              Want a system like this inside your business?
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-10">
              We start with a free Clarity Session. We map the signal, locate the interference, and design the simplest system that will hold.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/clarity-session" size="lg" chevron>
                Book a Clarity Session
              </Button>
              <Button href={MILESTONE_URL} variant="secondary" size="lg" external>
                View the Live Tool
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
