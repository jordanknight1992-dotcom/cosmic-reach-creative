import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";
import { ParallaxSignupForm } from "./ParallaxSignupForm";

export const metadata: Metadata = createMetadata({
  title: "Parallax",
  description:
    "A marketing performance dashboard that connects GA4, Search Console, Google Ads, social platforms, and keyword tracking into one clean view. Built for marketing teams.",
  path: "/parallax",
});

const capabilities = [
  {
    title: "Google Full Suite",
    description:
      "GA4, Search Console, Google Ads, Business Profile, and Tag Manager in one view. No more pulling from six tabs into a slide deck.",
  },
  {
    title: "Social + Ads Performance",
    description:
      "LinkedIn, Meta, and X analytics alongside your ad spend and conversion data. See which channels actually drive results.",
  },
  {
    title: "Keyword Tracking + Recommendations",
    description:
      "Track target keywords over time, see ranking movement, and get AI-powered recommendations for what to prioritize next.",
  },
];

export default function ParallaxPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Parallax"
          title="Cosmic Reach Parallax"
          description="A marketing performance dashboard that connects every platform your team uses into one clean, actionable report."
        />
      </Section>

      <Section background="surface">
        <div className="max-w-3xl">
          <p className="text-starlight text-lg font-medium mb-6">
            Your marketing data is scattered across platforms. Parallax brings it together.
          </p>
          <div className="space-y-4 text-muted text-base leading-relaxed">
            <p>
              Most marketing teams spend hours every week pulling numbers from GA4, Search Console, Google Ads, LinkedIn, and Meta into slide decks that are outdated by the time they&#39;re presented. The data exists. The problem is it lives in six different places with six different interfaces.
            </p>
            <p>
              Parallax connects to your existing platforms and delivers a single, readable dashboard. Each client gets their own portal with the metrics that matter to their business - not a wall of vanity charts. Just the signal your team needs to make decisions.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          label="What it does"
          title="Built for Marketing Teams"
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-[var(--radius-md)] border border-border bg-surface p-6 md:p-8"
            >
              <h3 className="font-display font-bold text-xl text-starlight mb-3">
                {cap.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section background="surface">
        <SectionHeading
          label="Early access"
          title="Currently onboarding first clients"
          align="center"
        />
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-muted text-base text-center leading-relaxed">
            Parallax is live with three initial clients. Drop your email to get on the list for early access.
          </p>
        </div>
        <ParallaxSignupForm />
      </Section>
    </>
  );
}
