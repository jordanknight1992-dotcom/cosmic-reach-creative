import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { SignalSessionForm } from "./SignalSessionForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Signal Session",
  description:
    "A free strategy call for marketing teams. We audit where your reporting breaks down and outline what a working system looks like. No pitch. Just signal.",
  path: "/signal-session",
  heroImage: "/images/hero/signal-session.jpg",
});

export default function SignalSessionPage() {
  return (
    <>
      <PageHero
        title="Begin a Signal Session"
        lead="A free strategy call for marketing teams ready to stop guessing."
        imageSrc="/images/hero/signal-session.jpg"
        imageAlt="Book a free strategy call"
      />

      <Section background="surface">
        <div className="max-w-3xl mb-12">
          <p className="text-starlight text-lg font-medium mb-4">
            This is not a sales call.<br />
            It is a working conversation about your marketing operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <h2 className="font-display font-bold text-xl text-starlight mb-6">
              Who This Orbit Fits
            </h2>
            <ul className="space-y-3 mb-8" role="list">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Marketing ops leaders spending more time pulling reports than acting on them.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Teams running campaigns across platforms with no unified view of performance.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">VPs of Marketing who need to prove ROI but the data is scattered across tools.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Growth teams ready for reporting infrastructure, not another agency retainer.</span>
              </li>
            </ul>

            <h2 className="font-display font-bold text-xl text-starlight mb-6">
              What Happens
            </h2>
            <p className="text-muted text-base leading-relaxed mb-4">
              In one session we:
            </p>
            <ul className="space-y-3 mb-8" role="list">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Audit where your marketing reporting breaks down</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Map the gaps between your platforms, your data, and your decisions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Outline what a working system looks like for your team specifically</span>
              </li>
            </ul>
            <p className="text-starlight text-base font-medium">
              You leave with a clear picture of what&#39;s broken and how to fix it, whether we work together or not.
            </p>
          </div>

          <Card>
            <SignalSessionForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
