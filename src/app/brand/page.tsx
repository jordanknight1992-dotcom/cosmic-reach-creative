import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Brand Guidelines | Cosmic Reach Creative",
  description:
    "The visual and verbal system behind Cosmic Reach Creative. Colors, typography, voice, framework, and design principles that keep the brand consistent across web, deck, messaging, and client-facing materials.",
  alternates: { canonical: `${siteConfig.domain}/brand` },
};

const colors = [
  { name: "Deep Space", hex: "#0B1120", role: "Primary background. The grounding layer. Used for all dark surfaces and the default canvas.", textLight: true },
  { name: "Surface", hex: "#111827", role: "Elevated surfaces. Cards, modals, and secondary panels that sit on top of Deep Space.", textLight: true },
  { name: "Starlight", hex: "#E8DFCF", role: "Primary text and content on dark backgrounds. Warm, readable, never stark white.", textLight: false },
  { name: "Copper", hex: "#D4A574", role: "Accent and action. Headlines, CTAs, score highlights, and interactive elements. The signal in the system.", textLight: false },
  { name: "Spark Red", hex: "#E04747", role: "Alerts, warnings, and critical scores. Used sparingly to draw attention to friction points.", textLight: true },
];

export default function BrandPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "Brand Guidelines", item: "https://cosmicreachcreative.com/brand" },
        ]
      })}} />

      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="brand-hero">
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
            <h1 id="brand-hero" className="text-copper mb-4">Brand Guidelines</h1>
            <p className="text-starlight/80 text-base sm:text-lg">
              The system behind the signal. Visual and verbal rules that keep Cosmic Reach consistent across web, deck, messaging, and client-facing materials.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Foundation */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="foundation-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="foundation-heading" className="mb-4 text-navy text-center">Brand Foundation</h2>
            <div className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6 sm:p-8 text-center">
              <p className="text-copper font-display font-bold text-xl sm:text-2xl mb-4">
                We build the infrastructure of growth.
              </p>
              <p className="text-navy/70 text-base mb-4">
                Systems design for businesses with traction and friction.
              </p>
              <p className="text-navy/60 text-sm leading-relaxed max-w-xl mx-auto">
                Cosmic Reach exists to serve businesses that have real momentum but are losing it to structural problems they cannot see from the inside. The brand communicates precision, structure, and clarity. Every visual and verbal decision reinforces the idea that growth is systematic, not heroic.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning and Framework */}
      <section className="py-12 sm:py-16" aria-labelledby="framework-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="framework-heading" className="mb-3 text-center">Core Framework</h2>
            <p className="text-starlight/70 text-base text-center mb-8 max-w-xl mx-auto">
              The brand is built around a real operating model. Four forces drive every business. The framework evaluates and scores each one.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Signal", subtitle: "Messaging", desc: "Is the message reaching the right people? Can they understand what you do and why it matters?" },
                { name: "Gravity", subtitle: "Offer", desc: "Is the offer strong enough to convert without pressure? Is the value clear before the ask?" },
                { name: "Orbit", subtitle: "Path to Action", desc: "Does the site guide visitors toward a clear next step? Are there friction points?" },
                { name: "Thrust", subtitle: "Visibility", desc: "Is there evidence of what is working? Are leads tracked? Can decisions be data-informed?" },
              ].map((item) => (
                <div key={item.name} className="rounded-xl border border-starlight/10 bg-navy/40 p-5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-copper font-display font-bold text-sm">{item.name}</span>
                    <span className="text-starlight/30 text-xs">{item.subtitle}</span>
                  </div>
                  <p className="text-starlight/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voice and Language */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="voice-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="voice-heading" className="mb-6 text-navy text-center">Voice and Language</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6">
                <p className="text-copper text-xs font-display font-semibold tracking-widest uppercase mb-4">How we sound</p>
                <ul className="space-y-3">
                  {[
                    "Plain language. Clear coordinates.",
                    "Confident without being loud.",
                    "Technical when the situation calls for it.",
                    "Steady and human. Like an operator thinking clearly.",
                    "Short sentences when possible. Longer when necessary.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-navy/70">
                      <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6">
                <p className="text-navy/40 text-xs font-display font-semibold tracking-widest uppercase mb-4">What we avoid</p>
                <ul className="space-y-3">
                  {[
                    "Jargon-heavy corporate language.",
                    "Empty marketing speak and vague promises.",
                    "Loud or inflated claims.",
                    "Trend-chasing tone or startup cliches.",
                    "Filler transitions and structural narration.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-navy/50">
                      <span className="text-navy/20 mt-0.5 shrink-0">&#9670;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Color System */}
      <section className="py-12 sm:py-16" aria-labelledby="color-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="color-heading" className="mb-3 text-center">Color System</h2>
            <p className="text-starlight/70 text-base text-center mb-8 max-w-xl mx-auto">
              A restrained palette grounded in dark space with warm copper accents. The system communicates depth, precision, and intentionality.
            </p>
            <div className="space-y-3">
              {colors.map((color) => (
                <div
                  key={color.hex}
                  className="rounded-xl border border-starlight/8 overflow-hidden flex flex-col sm:flex-row"
                >
                  <div
                    className="w-full sm:w-32 h-16 sm:h-auto shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className={`text-xs font-mono font-semibold ${color.textLight ? "text-white/80" : "text-deep-space/80"}`}>
                      {color.hex}
                    </span>
                  </div>
                  <div className="bg-navy/40 p-4 flex-1">
                    <p className="text-starlight font-display font-semibold text-sm mb-1">{color.name}</p>
                    <p className="text-starlight/50 text-xs leading-relaxed">{color.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Typography */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="type-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="type-heading" className="mb-6 text-navy text-center">Typography</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6">
                <p className="font-display text-3xl text-navy mb-2">Space Grotesk</p>
                <p className="text-copper text-xs font-display font-semibold tracking-widest uppercase mb-3">Display / Headings</p>
                <p className="text-navy/60 text-sm leading-relaxed">
                  Geometric sans-serif with a technical character. Used for headlines, labels, navigation, buttons, and any element that anchors the visual hierarchy. Bold and semibold weights.
                </p>
              </div>
              <div className="rounded-2xl border border-navy/10 bg-white shadow-subtle p-6">
                <p className="text-3xl text-navy mb-2">Atkinson Hyperlegible</p>
                <p className="text-copper text-xs font-display font-semibold tracking-widest uppercase mb-3">Body / UI</p>
                <p className="text-navy/60 text-sm leading-relaxed">
                  Designed for maximum legibility at all sizes. Used for body copy, descriptions, form labels, and any extended reading. Regular and bold weights. Prioritizes clarity over personality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layout and Structure */}
      <section className="py-12 sm:py-16" aria-labelledby="layout-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="layout-heading" className="mb-3 text-center">Layout Principles</h2>
            <p className="text-starlight/70 text-base text-center mb-8 max-w-xl mx-auto">
              The structural rules behind the visual experience.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Rounded containers", desc: "Soft border radii on all cards and panels. Communicates approachability within a structured system." },
                { label: "Strong spacing rhythm", desc: "Consistent vertical and horizontal spacing. Sections breathe. Content does not feel compressed." },
                { label: "Ordered hierarchy", desc: "One primary action per section. Headlines lead. Supporting copy supports. Structure guides the eye." },
                { label: "Clean grids", desc: "Content aligns to a modular grid. Two-column and three-column layouts at breakpoints. Centered on narrow screens." },
                { label: "Soft depth", desc: "Subtle shadows and layered transparency. Surfaces feel elevated without aggressive drop shadows." },
                { label: "Intentional restraint", desc: "Every element earns its place. No decorative noise. No visual clutter. Calm precision." },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-starlight/10 bg-navy/40 p-5">
                  <p className="text-copper text-sm font-display font-semibold mb-1">{item.label}</p>
                  <p className="text-starlight/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Motion */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="motion-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="motion-heading" className="mb-4 text-navy">Motion and Behavior</h2>
            <p className="text-navy/70 text-base mb-6 max-w-xl mx-auto">
              Transitions are smooth, fast, and understated. Movement supports comprehension. Nothing animates for decoration. Hover states provide feedback. Page transitions are seamless. Loading states communicate progress without distraction.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 max-w-lg mx-auto">
              {[
                { label: "Duration", value: "200-300ms default" },
                { label: "Easing", value: "Ease-out for entrances" },
                { label: "Hover", value: "Subtle border and shadow shift" },
                { label: "Restraint", value: "No bounce, no overshoot" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-navy/10 bg-white px-4 py-3 text-left">
                  <p className="text-xs font-display font-semibold text-copper">{item.label}</p>
                  <p className="text-navy/60 text-xs">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application */}
      <section className="py-12 sm:py-16" aria-labelledby="application-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 id="application-heading" className="mb-3 text-center">Where the system appears.</h2>
            <p className="text-starlight/70 text-base text-center mb-8 max-w-xl mx-auto">
              The brand system is applied consistently across every touchpoint.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Website", desc: "The primary expression of the brand. All pages follow the same visual and verbal system." },
                { label: "Clarity Audit", desc: "The diagnostic report uses the same color system, type hierarchy, and scoring framework." },
                { label: "Sales Decks", desc: "Presentations follow the brand grid, color palette, and voice guidelines." },
                { label: "Mission Control", desc: "The live dashboard uses the dark palette with copper accents for scores and actions." },
                { label: "Client Communications", desc: "Emails, proposals, and follow-ups maintain the same tone and visual identity." },
                { label: "Content", desc: "LinkedIn posts, newsletters, and long-form content follow the voice and positioning." },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-starlight/10 bg-navy/40 p-5">
                  <p className="text-starlight font-display font-semibold text-sm mb-1">{item.label}</p>
                  <p className="text-starlight/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-navy/60 border-t border-copper/15" aria-labelledby="brand-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="brand-cta" className="mb-3">Built on the same rigor we bring to every engagement.</h2>
            <p className="text-starlight/70 text-base mb-6">
              If your business has traction but the system feels fragmented, start with the Clarity Audit.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
          </div>
        </div>
      </section>
    </main>
  );
}
