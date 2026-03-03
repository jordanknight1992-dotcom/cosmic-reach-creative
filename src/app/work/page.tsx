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
    "Real tools built for real teams. Dashboards, reporting systems, and operational workflows designed for marketing teams that need to move faster.",
  path: "/work",
  heroImage: "/images/hero/work.jpg",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        title="Systems in Motion"
        lead="Real tools built for real teams. Not slide decks."
        imageSrc="/images/hero/work.jpg"
        imageAlt="Systems in motion"
      />

      {/* Parallax */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-4">
            Parallax
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            A marketing performance dashboard that connects GA4, Search Console, Google Ads, and social platforms into a single, readable report. Built for marketing teams that are tired of pulling numbers from six tabs into a slide deck.
          </p>
          <p className="text-muted text-base leading-relaxed mb-8">
            Currently in development with three live clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/parallax" chevron>
              Learn More
            </Button>
          </div>
        </div>
      </Section>

      {/* Milestone */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-4">
            Milestone
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            A project tracking system that replaced spreadsheet drift with structured visibility. Built for a PMP managing dependencies across locations - designed to make status obvious within seconds and cut manual reporting time.
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
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-4">
            Clear Enough
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            A personal clarity system that proves the same design principles scale from enterprise teams to individual users. Designed to reduce cognitive overload and surface one clear next step.
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
