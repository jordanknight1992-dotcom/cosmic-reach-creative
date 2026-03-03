import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Labs",
  description:
    "Cosmic Reach Labs is where we prototype marketing tools, test reporting frameworks, and build systems before they ship to clients.",
  path: "/labs",
  heroImage: "/images/hero/labs.jpg",
});

export default function LabsPage() {
  return (
    <>
      <PageHero
        title="Cosmic Reach Labs"
        lead="Where we prototype tools and test ideas before they ship."
        imageSrc="/images/hero/labs.jpg"
        imageAlt="Cosmic Reach Labs"
      />

      <Section background="surface">
        <div className="max-w-3xl">
          <p className="text-muted text-lg leading-relaxed mb-4">
            Labs is where we build and stress-test the systems that eventually become client deliverables. Marketing dashboards, reporting frameworks, workflow prototypes - everything starts here.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Some remain experiments.<br />
            Some become products.<br />
            All sharpen how we build performance infrastructure for marketing teams.
          </p>
        </div>
      </Section>

      <Section>
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-8">
            Systems Currently in Orbit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/parallax" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Parallax
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Marketing performance dashboard - GA4, Search Console, social, ads in one view.
                </p>
              </Card>
            </Link>
            <Link href="/work/milestone" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Milestone
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Project visibility system for tracking dependencies and status.
                </p>
              </Card>
            </Link>
            <Link href="/work/clear-enough" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Clear Enough
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  Personal clarity system - same design principles at individual scale.
                </p>
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
