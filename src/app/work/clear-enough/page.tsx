import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CaseStudyHeader } from "@/components/sections/CaseStudyHeader";
import { CTASection } from "@/components/sections/CTASection";
import { CLEAR_ENOUGH_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Clear Enough Case Study",
  description:
    "From mental noise to a system that grounds the next step. A clarity system designed to help individuals move forward in sobriety and daily life.",
  path: "/work/clear-enough",
});

export default function ClearEnoughPage() {
  return (
    <>
      <CaseStudyHeader
        title="Clear Enough"
        subtitle="From mental noise to a system that grounds the next step"
        tags={["Clarity system design", "Behavioral workflow", "Product prototype"]}
        role="Role: Concept, UX, interaction design, build direction"
        links={[
          { label: "View the Live App", href: CLEAR_ENOUGH_URL, external: true },
        ]}
      />

      {/* The Signal */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            The Signal - Where clarity breaks down
          </h2>
          <p className="text-muted text-base leading-relaxed mb-4">
            For many people navigating sobriety, the hardest part of the day is not motivation.
          </p>
          <p className="text-starlight text-lg font-medium mb-4">
            It is knowing where to begin when everything feels loud.
          </p>
          <p className="text-muted text-base leading-relaxed mb-4">
            Thoughts compete for attention. Emotions overlap. The future feels too large. The next step disappears.
          </p>
          <p className="text-starlight text-base font-medium">
            The issue is not discipline.<br />
            It is signal.
          </p>
        </div>
      </Section>

      {/* The Interference */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            The Interference
          </h2>
          <ul className="space-y-3 mb-6" role="list">
            {[
              "Too many inputs competing for focus",
              "Emotional states changing faster than plans",
              "No structure for grounding decisions in the present",
              "Progress defined by intention, not action",
              "The next step unclear even when the goal is known",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-starlight text-base font-medium">
            Without a visible signal, movement stalls.
          </p>
        </div>
      </Section>

      {/* Mission Objective */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-6">
            Mission Objective
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            Design a lightweight system that helps users ground themselves, identify one meaningful next step, and move forward with intention.
          </p>
          <h3 className="font-display font-semibold text-lg text-starlight mb-4">
            Success criteria
          </h3>
          <ul className="space-y-3" role="list">
            {[
              "Reduce cognitive overload in moments of uncertainty",
              "Create a repeatable grounding pattern users can trust",
              "Focus attention on the present action, not the entire journey",
              "Support momentum without demanding perfection",
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
            Clear Enough became a decision surface for the individual.
          </p>
          <p className="text-muted text-base leading-relaxed mb-8">
            Instead of tracking goals, it structures attention. It turns emotional noise into a visible next step and creates a consistent rhythm for reflection, grounding, and forward motion.
          </p>
          <h3 className="font-display font-semibold text-lg text-starlight mb-4">
            Components
          </h3>
          <ul className="space-y-3" role="list">
            {[
              "Guided prompts that translate emotion into action",
              "A structured flow that centers attention on the present",
              "A calm interface that reduces friction during use",
              "A repeatable pattern users can return to daily",
              "A system designed to support momentum, not pressure",
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
            The interface was designed to feel steady and supportive. Navigation is minimal. Motion is subtle. Visual hierarchy keeps the mind anchored.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "One clear interaction at a time",
              "Calm typography and spacing",
              "Limited color used as signal, not stimulation",
              "Interaction patterns that reinforce presence and control",
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
              "Users move from overwhelm to grounded action",
              "Decisions become smaller, clearer, and more manageable",
              "Momentum builds through repetition, not force",
              "The system supports forward motion even on difficult days",
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
              &ldquo;I don&#39;t use Clear Enough to plan my life. I use it to make one grounded decision when I need it most.&rdquo;
            </p>
            <footer className="text-muted text-sm">
              <strong>Clear Enough user, 520 days sober</strong>
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
            Clarity systems are not just organizational tools.<br />
            They are human ones.
          </p>
          <p className="text-muted text-base leading-relaxed mb-4">
            When people can see one clear next step, movement becomes possible again.
          </p>
          <p className="text-muted text-base leading-relaxed">
            That same principle applies everywhere:<br />
            when the signal is visible, progress follows.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <CTASection
        title="Want clarity like this inside your organization?"
        description="We start with a Clarity Session. We map the signal, locate the interference, and design the simplest system that will hold."
        buttonLabel="Book a Clarity Session"
        buttonHref="/signal-session"
      />
    </>
  );
}
