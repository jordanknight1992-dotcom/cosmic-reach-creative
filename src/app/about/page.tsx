import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Built for marketing teams that know something is off but can't see where. We design the systems that make performance visible.",
  path: "/about",
  heroImage: "/images/hero/about.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Why Cosmic Reach Exists"
        lead="Built for marketing teams that know something is off but can't see where."
        imageSrc="/images/hero/about.jpg"
        imageAlt="About Cosmic Reach Creative"
      />

      {/* The Origin of the Signal */}
      <Section background="surface">
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-6">
            The Origin of the Signal
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            I built Cosmic Reach after seeing the same pattern inside marketing teams repeatedly.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Smart people. Strong campaigns. Real budget. But the team can&#39;t tell you what&#39;s working without pulling four reports from four platforms and spending half a day stitching them together.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-4">
            The tools exist. The data exists. What&#39;s missing is the system that connects them - the reporting infrastructure, the workflows, and the dashboards that make performance visible without a fire drill.
          </p>
          <p className="text-starlight text-lg font-medium mb-4">
            Marketing teams do not need more tools.<br />
            They need the infrastructure that makes their tools useful.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            Cosmic Reach exists to build that infrastructure.
          </p>
        </div>
      </Section>

      {/* What We Hold Constant */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="text-starlight leading-tight mb-12">
            What We Hold Constant
          </h2>
          <div className="space-y-10">
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Clarity over noise
              </h3>
              <p className="text-muted text-base leading-relaxed">
                If your team can&#39;t read the dashboard in 10 seconds and know what to do next, the dashboard is wrong.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Systems over trends
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We build reporting infrastructure and workflows that outlast the next platform update or algorithm change.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Execution over theory
              </h3>
              <p className="text-muted text-base leading-relaxed">
                Every engagement ends with working tools your team uses on Monday. If it doesn&#39;t run in production, it doesn&#39;t count.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Closing */}
      <Section background="surface">
        <div className="max-w-3xl">
          <p className="text-starlight text-xl md:text-2xl font-display font-semibold leading-relaxed">
            We do not design for appearances.<br />
            We design for movement.
          </p>
        </div>
      </Section>
    </>
  );
}
