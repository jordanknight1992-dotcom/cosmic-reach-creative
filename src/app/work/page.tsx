import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { WorkGrid } from "./WorkGrid";

export const metadata: Metadata = {
  title: "Case Studies | Cosmic Reach Creative",
  description:
    "Case studies and speculative builds from Cosmic Reach Creative. Real brand systems, rebuilt from the foundation up.",
  alternates: { canonical: `${siteConfig.domain}/work` },
};

export default function WorkPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="work-hero-title">
        <div className="absolute inset-0">
          <Image
            src="/images/04-work-hero.jpg"
            alt="Cosmic Reach Creative featured projects"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-2xl">
            <p className="text-copper font-display text-xs font-semibold tracking-widest uppercase mb-4">
              Case Studies
            </p>
            <h1 id="work-hero-title" className="font-display font-semibold text-3xl sm:text-4xl text-starlight mb-4 tracking-tight">
              Work that makes the difference visible.
            </h1>
            <p className="text-starlight/60 text-base leading-relaxed max-w-lg">
              A mix of real client rebuilds and strategic concept builds
              designed to show what clearer positioning actually changes.
            </p>
          </div>
        </div>
      </section>

      <WorkGrid />

      {/* CTA */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-starlight mb-3">
              Your system has the same gap.
            </h2>
            <p className="text-starlight/50 text-sm mb-6">
              The Clarity Audit scores your messaging, offer, site, and visibility.
              You get a written report showing exactly where momentum is stalling.
            </p>
            <Link
              href="/book/signal-check"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-8 py-3
                font-display font-semibold text-base
                bg-copper text-deep-space hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]"
            >
              Book a Signal Check
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
