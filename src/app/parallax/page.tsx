import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";
import { ParallaxSignupForm } from "./ParallaxSignupForm";

export const metadata: Metadata = createMetadata({
  title: "Parallax",
  description:
    "Cosmic Reach Parallax. One clean report from GA4, Search Console, and LinkedIn. Coming soon.",
  path: "/parallax",
});

const capabilities = [
  {
    title: "GA4, Search Console, LinkedIn",
    description:
      "Pull performance data from the platforms that matter into a single view. No tab switching. No stitching spreadsheets.",
  },
  {
    title: "One clean report",
    description:
      "A focused dashboard that surfaces what changed, what is working, and what needs attention. Built for decision makers, not analysts.",
  },
  {
    title: "Signal over noise",
    description:
      "We filter the metrics that matter from the ones that just look busy. You get clarity, not a wall of charts.",
  },
];

export default function ParallaxPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Parallax"
          title="Cosmic Reach Parallax"
          description="A reporting dashboard that pulls GA4, Search Console, and LinkedIn data into one clean report. Currently in development."
        />
      </Section>

      <Section background="surface">
        <div className="max-w-3xl">
          <p className="text-starlight text-lg font-medium mb-6">
            Marketing data is scattered across platforms. Parallax brings it together.
          </p>
          <div className="space-y-4 text-muted text-base leading-relaxed">
            <p>
              Most teams spend hours pulling numbers from GA4, Search Console, and LinkedIn into slide decks that are outdated by the time they are presented.
            </p>
            <p>
              Parallax is a reporting layer that connects to your existing platforms and delivers a single, readable report. No dashboards that require a data science degree. No vanity metrics. Just the signal your team needs to make decisions.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          label="What it does"
          title="Built for clarity"
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-[var(--radius-md)] border border-border bg-surface p-6 md:p-8"
            >
              <h3 className="font-display font-bold text-xl text-starlight mb-3">
                {cap.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section background="surface">
        <SectionHeading
          label="Coming soon"
          title="Be the first to know"
          align="center"
        />
        <ParallaxSignupForm />
      </Section>
    </>
  );
}
