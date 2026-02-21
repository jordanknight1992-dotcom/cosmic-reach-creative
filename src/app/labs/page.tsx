import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Labs",
  description:
    "Cosmic Reach Labs. Designing solutions through systems thinking and digital experimentation. Structured curiosity meets real world friction.",
  path: "/labs",
});

export default function LabsPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Labs"
          title="Cosmic Reach Labs"
          description="Designing solutions to complex company problems through systems thinking and digital experimentation."
        />
      </Section>

      <Section background="surface">
        <div className="max-w-3xl">
          <p className="text-starlight text-lg font-medium mb-6">
            Labs is where structured curiosity meets real world friction.
          </p>
          <div className="space-y-4 text-muted text-base leading-relaxed">
            <p>We prototype internal tools.</p>
            <p>We design clarity systems.</p>
            <p>We test frameworks before they enter orbit.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-muted text-base leading-relaxed">
              Some ideas become products.
              <br />
              Some remain internal experiments.
              <br />
              All are built with intent.
            </p>
          </div>
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
