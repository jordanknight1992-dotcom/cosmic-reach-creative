import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Labs",
  description:
    "Cosmic Reach Labs explores clarity systems in action. Projects that test ideas, tools, and frameworks that turn complexity into forward motion.",
  path: "/labs",
  heroImage: "/images/hero/labs.jpg",
});

export default function LabsPage() {
  return (
    <>
      <PageHero
        title="Cosmic Reach Labs"
        lead="Cosmic Reach Labs explores clarity systems in action."
        imageSrc="/images/hero/labs.jpg"
        imageAlt="Cosmic Reach Labs"
      />

      <Section background="surface">
        <div className="max-w-3xl">
          <p className="text-muted text-lg leading-relaxed mb-4">
            These projects test ideas, tools, and frameworks that turn complexity into forward motion.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Some remain experiments.<br />
            Some become products.<br />
            All help us refine how systems create signal.
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-8">
            Systems Currently in Orbit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/work/milestone" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Milestone
                </h3>
              </Card>
            </Link>
            <Link href="/work/clear-enough" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Clear Enough
                </h3>
              </Card>
            </Link>
          </div>
          <p className="text-muted text-base mt-8">
            More tools coming as they reach orbit.
          </p>
        </div>
      </Section>
    </>
  );
}
