import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/sections/PageHero";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Cosmic Reach exists for organizations that know something is off but cannot see where.",
  path: "/about",
  heroImage: "/images/hero/about.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="Why Cosmic Reach Exists"
        lead="Cosmic Reach exists for organizations that know something is off but cannot see where."
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
            I built Cosmic Reach after seeing the same pattern repeatedly.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Strong teams. Smart leaders. Real effort.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-4">
            But progress slowed by unclear systems, disconnected tools, and communication that obscured more than it revealed.
          </p>
          <p className="text-starlight text-lg font-medium mb-4">
            Most organizations do not need more ideas.<br />
            They need better signal.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            Cosmic Reach exists to design that signal.
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
                If something cannot be understood, it cannot be executed.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Systems over trends
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We build structures that last longer than tactics.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Execution over theory
              </h3>
              <p className="text-muted text-base leading-relaxed">
                If it does not work in the real world, it does not count.
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
