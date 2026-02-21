import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { ClarityForm } from "./ClarityForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Clarity Session",
  description:
    "Book a free Clarity Session. A focused working session to find what is working, what is missing, and what to do next.",
  path: "/clarity-session",
});

const outcomes = [
  "Diagnosis summary",
  "Priority map",
  "Reporting recommendations",
  "Next step plan",
];

export default function ClaritySessionPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Clarity Session"
          title="The Clarity Session"
          description="A focused working session to find what is working, what is missing, and what to do next."
        />
      </Section>

      <Section background="surface">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <h2 className="font-display font-bold text-xl text-starlight mb-6">
              You leave with
            </h2>
            <ul className="space-y-3" role="list">
              {outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                  <span className="text-muted text-base">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 rounded-[var(--radius-sm)] bg-deep-space border border-border">
              <p className="text-copper text-sm font-display font-semibold mb-1">
                Free consultation
              </p>
              <p className="text-muted text-xs">
                We assess the terrain, identify interference, and determine the correct orbit.
              </p>
            </div>
          </div>

          <Card>
            <ClarityForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
