import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { MILESTONE_URL, CLEAR_ENOUGH_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Work",
  description:
    "This is what systems design looks like when it leaves the whiteboard. Real systems. Real clarity. Real outcomes.",
  path: "/work",
  heroImage: "/images/hero/work.jpg",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        title="Systems in Motion"
        lead="This is what systems design looks like when it leaves the whiteboard."
        imageSrc="/images/hero/work.jpg"
        imageAlt="Systems in motion"
      />

      {/* Milestone */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-4">
            Milestone
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            A clarity system designed to make progress visible across complex work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/work/milestone" chevron>
              Read Case Study
            </Button>
            <Button href={MILESTONE_URL} variant="secondary" external>
              View Live Tool
            </Button>
          </div>
        </div>
      </Section>

      {/* Clear Enough */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-4">
            Clear Enough
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            A grounding clarity system designed to help individuals move forward in sobriety and daily life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/work/clear-enough" chevron>
              Read Case Study
            </Button>
            <Button href={CLEAR_ENOUGH_URL} variant="secondary" external>
              View Live App
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
