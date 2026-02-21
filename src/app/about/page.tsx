import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Meet Jordan Knight, Managing Partner at Cosmic Reach. Systems thinking for growing companies. Not just creative. Not just campaigns. Systems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="About"
          title="Not just creative. Not just campaigns. Systems."
        />
      </Section>

      <Section background="surface">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="relative aspect-[3/4] rounded-[var(--radius-lg)] overflow-hidden border border-border">
            <Image
              src="/images/jordan-knight-headshot.png"
              alt="Jordan Knight, Managing Partner at Cosmic Reach Creative"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-2">
              {SITE.founder}
            </h2>
            <p className="text-copper font-display font-semibold text-sm mb-6">
              {SITE.founderTitle}
            </p>
            <div className="space-y-4 text-muted text-base leading-relaxed">
              <p>
                Jordan built Cosmic Reach after leading marketing strategy and analytics inside a scaling life sciences organization, where clarity was operational necessity.
              </p>
              <p>
                Inside high growth environments, he built reporting systems, aligned cross functional teams, and translated performance data into executive level decisions.
              </p>
              <p>
                Cosmic Reach was launched to bring that same structured thinking to growing companies.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
