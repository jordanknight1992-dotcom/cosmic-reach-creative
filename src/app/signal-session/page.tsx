import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { SignalSessionForm } from "./SignalSessionForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Signal Session",
  description:
    "Every engagement begins with a Signal Session. This is not a sales call. It is a working conversation.",
  path: "/signal-session",
  heroImage: "/images/hero/signal-session.jpg",
});

export default function SignalSessionPage() {
  return (
    <>
      <PageHero
        title="Begin a Signal Session"
        lead="Every engagement begins with a Signal Session."
        imageSrc="/images/hero/signal-session.jpg"
        imageAlt="Start a Signal Session"
      />

      <Section background="surface">
        <div className="max-w-3xl mb-12">
          <p className="text-starlight text-lg font-medium mb-4">
            This is not a sales call.<br />
            It is a working conversation.
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
                <span className="text-muted text-base">Leaders who feel decisions take too long.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Teams moving without shared direction.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Organizations overwhelmed by tools and data.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">Businesses ready to replace noise with clarity.</span>
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
                <span className="text-muted text-base">identify where signal is breaking down</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">map the core clarity problem</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-copper shrink-0" aria-hidden="true" />
                <span className="text-muted text-base">outline what a working system could look like</span>
              </li>
            </ul>
            <p className="text-starlight text-base font-medium">
              You leave with insight, whether we work together or not.
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
