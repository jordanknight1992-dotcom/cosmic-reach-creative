import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Approach",
  description:
    "Orbital mechanics. How clarity moves from idea to impact through discovery, design, and deployment.",
  path: "/approach",
});

const phases = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We listen before we build. We identify gravitational pull. We locate interference.",
    deliverables: ["Signal Map", "Narrative Architecture", "Strategic Coordinates"],
  },
  {
    number: "02",
    title: "Design",
    description: "We translate signal into structure.",
    deliverables: ["Identity Systems", "Digital Interfaces", "Motion Framework"],
  },
  {
    number: "03",
    title: "Deployment",
    description: "We transmit with precision.",
    deliverables: [
      "Web Experience",
      "Platform Implementation",
      "Performance Tracking",
    ],
  },
];

export default function ApproachPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Approach"
          title="Orbital Mechanics"
          description="How clarity moves from idea to impact."
        />
      </Section>

      <Section background="surface">
        <div className="space-y-8">
          {phases.map((phase) => (
            <Card key={phase.number} className="relative overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full border-2 border-spark-red text-spark-red font-display font-bold text-lg shrink-0">
                    {phase.number}
                  </div>
                </div>
                <div>
                  <h2 className="font-display font-bold text-2xl text-starlight mb-3">
                    {phase.title}
                  </h2>
                  <p className="text-muted text-base leading-relaxed mb-6">
                    {phase.description}
                  </p>
                  <div>
                    <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-copper mb-3">
                      Deliverables
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {phase.deliverables.map((d) => (
                        <span
                          key={d}
                          className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-deep-space border border-border text-muted text-xs font-display font-semibold"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
