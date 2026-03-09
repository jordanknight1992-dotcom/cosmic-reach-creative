import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "The Clarity Framework | 4-Layer Business System",
  description:
    "The Cosmic Reach Framework moves through four layers designed to restore signal, reduce friction, and make progress repeatable.",
  alternates: { canonical: `${siteConfig.domain}/framework` },
};

const layers = [
  {
    name: "Signal",
    subtitle: "Messaging Clarity",
    icon: "compass",
    description:
      "We identify where messaging is breaking down and what to clarify first. We diagnose where positioning is unclear, where value isn’t landing with the right audience, and where the story of the business isn’t translating into action.",
    deliverables: [
      "A clear diagnosis of current messaging across channels",
      "Positioning refinement tied to the right audience",
      "Focused recommendations on what to clarify first",
    ],
  },
  {
    name: "Gravity",
    subtitle: "Offer Strength",
    icon: "orbit",
    description:
      "We make sure the offer is structured to create genuine pull. We bring clarity to how offers are framed, priced, and perceived so the right customers see clear value and hesitation is reduced.",
    deliverables: [
      "Offer positioning and framing analysis",
      "Value perception insights",
      "Recommendations for structuring offers that convert",
    ],
  },
  {
    name: "Orbit",
    subtitle: "Customer Journey",
    icon: "gears",
    description:
      "We design the path from first contact to conversion so it works as a system. We map the customer journey, identify friction points, and clarify the steps that move prospects toward a decision.",
    deliverables: [
      "Customer journey mapping and friction diagnosis",
      "Conversion flow analysis",
      "Practical improvements that reduce hesitation and increase momentum",
    ],
  },
  {
    name: "Thrust",
    subtitle: "Growth Opportunities",
    icon: "signal",
    description:
      "We give founders a clear view of where growth potential exists and what to act on first. We translate business activity into actionable insight so decisions about where to invest effort are driven by impact, not assumptions.",
    deliverables: [
      "Growth opportunity analysis tied to business outcomes",
      "Prioritized improvement roadmap",
      "Clarity on what to build, fix, or remove to accelerate momentum",
    ],
  },
];

export default function FrameworkPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="framework-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/02-framework-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 id="framework-hero" className="text-copper">The Operating System Underneath Your Business</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              We don&apos;t begin with tactics. We map the system that makes tactics succeed or fail.
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-intro">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="orbit" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-intro" className="mb-4">Four Layers. One System.</h2>
            <p className="text-starlight/70 text-base">
              Cosmic Reach engagements move through four layers designed to restore clarity, reduce friction, and make progress repeatable. Every layer builds on the last.
            </p>
          </div>
        </div>
      </section>

      {/* Framework Layers */}
      {layers.map((layer, i) => (
        <section
          key={layer.name}
          className={`py-12 sm:py-16 ${i % 2 === 0 ? "bg-navy/30" : ""}`}
          aria-labelledby={`layer-${layer.name.toLowerCase()}`}
        >
          <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-3">
                <Icon name={layer.icon} size={36} className="opacity-80 mx-auto" />
              </div>
              <h2 id={`layer-${layer.name.toLowerCase()}`} className="mb-3">
                <span className="text-copper">{layer.name}</span> — {layer.subtitle}
              </h2>
              <p className="text-starlight/70 text-base mb-6">{layer.description}</p>
            </div>
            <div className="max-w-lg mx-auto rounded-2xl border border-starlight/10 bg-navy/50 p-6 sm:p-8 transition-all duration-[var(--duration-base)] hover:border-copper/30">
              <h3 className="font-display font-semibold text-copper text-sm uppercase tracking-widest mb-4 text-center">
                Clients get
              </h3>
              <ul className="space-y-3">
                {layer.deliverables.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-starlight/70 text-sm">
                    <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* Mid-page image break */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 py-4">
        <div className="relative w-full h-40 sm:h-56 rounded-2xl overflow-hidden">
          <Image
            src="/images/08-results-section.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-deep-space/40" />
        </div>
      </div>

      {/* Final CTA */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-3">
              <Icon name="rocket" size={36} className="opacity-80 mx-auto" />
            </div>
            <h2 id="framework-cta" className="mb-3">Ready to Map the Path?</h2>
            <p className="text-starlight/70 text-base mb-6">
              The Business Clarity Audit applies the full framework to your business and delivers a prioritized roadmap for improvement.
            </p>
            <CTAButton label="Start the Clarity Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/60">
              3&ndash;5 day turnaround &middot; Structured clarity report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
