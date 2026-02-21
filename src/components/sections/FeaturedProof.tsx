import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { MILESTONE_URL } from "@/lib/constants";

export function FeaturedProof() {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-3">
            Featured proof
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-starlight leading-tight mb-4">
            Milestone
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            From spreadsheet drift to a system that holds. A decision surface that structured attention, surfaced critical path signals, and created a consistent language for status.
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
        <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden border border-border">
          <Image
            src="/images/website-image.jpg"
            alt="Milestone project interface showing structured reporting dashboard"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </Section>
  );
}
