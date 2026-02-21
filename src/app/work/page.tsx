import type { Metadata } from "next";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { MILESTONE_URL } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Work",
  description:
    "Signal in action. Real systems. Real clarity. Real outcomes. See how Cosmic Reach Creative builds decision ready systems.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Work"
          title="Signal in Action"
          description="Real systems. Real clarity. Real outcomes."
        />
      </Section>

      <Section background="surface">
        <Card className="overflow-hidden !p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto min-h-[300px]">
              <Image
                src="/images/website-image.jpg"
                alt="Milestone project interface"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="text-spark-red font-display font-semibold text-xs tracking-wide uppercase mb-3">
                Featured
              </p>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-starlight mb-4">
                Milestone
              </h2>
              <p className="text-muted text-base leading-relaxed mb-8">
                From spreadsheet drift to a system that holds. A lightweight system that preserved the simplicity of a spreadsheet while adding structure, visibility, and decision readiness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/work/milestone" chevron>
                  View Case Study
                </Button>
                <Button href={MILESTONE_URL} variant="secondary" external>
                  View Live Tool
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <FinalCTA />
    </>
  );
}
