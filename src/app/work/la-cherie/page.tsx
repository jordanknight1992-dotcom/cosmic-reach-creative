import { Metadata } from "next";
import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { SectionTag } from "@/components/SectionTag";
import { MacBookBeforeAfter } from "@/components/MacBookBeforeAfter";
import { MacBookFrame } from "@/components/MacBookFrame";
import { ArticleSchema } from "@/components/schema/ArticleSchema";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title:
    "La Chérie Weddings Case Study | Making the Work Visible | Cosmic Reach Creative",
  description:
    "How Cosmic Reach Creative rebuilt the brand system for La Chérie Weddings, a luxury wedding planner in Memphis already booked through word of mouth. We made the work visible to everyone. System Momentum Score went from 1.6 to 7.0 in 30 days.",
  alternates: {
    canonical: "https://cosmicreachcreative.com/work/la-cherie",
  },
};

const auditLayers = [
  {
    name: "Signal",
    before: 2,
    after: 7,
    description:
      "Brand messaging did not reflect the real experience. Copy was generic and interchangeable with any planner in the region. The work itself was anything but.",
  },
  {
    name: "Gravity",
    before: 1,
    after: 7,
    description:
      "No structured offer. No service tiers. The inquiry form was the only conversion path, and it sat behind four clicks.",
  },
  {
    name: "Orbit",
    before: 2,
    after: 8,
    description:
      "The website was a visual placeholder. It did not reflect the caliber of work La Chérie was already known for.",
  },
  {
    name: "Thrust",
    before: 1,
    after: 6,
    description:
      "Zero visibility infrastructure. No schema, no meta strategy, no local search presence. The work existed, but only for people who already knew about it.",
  },
];

export default function LaCherieCase() {
  return (
    <main id="main-content">
      <ArticleSchema
        headline="La Chérie Weddings. From Beautiful Work to a System That Shows It"
        description="How Cosmic Reach Creative rebuilt the brand system for La Chérie Weddings. Already booked through word of mouth, now visible to everyone. System Momentum Score went from 1.6 to 7.0 in 30 days."
        datePublished="2026-03-15"
        image="https://cosmicreachcreative.com/images/work/image-asset-11.jpeg"
        about={{
          name: "La Chérie Weddings",
          type: "LocalBusiness",
          industry: "Wedding Planning",
          addressLocality: "Memphis",
          addressRegion: "TN",
        }}
      />

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="case-hero-title"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/work/image-asset-11.jpeg"
            alt="The founder of La Chérie Weddings"
            fill
            className="object-cover"
            style={{ objectPosition: "center 35%" }}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <SectionTag label="Case Study" className="mb-6" />
            <h1 id="case-hero-title" className="mb-4 text-copper">
              La Chérie Weddings
            </h1>
            <p className="text-xl sm:text-2xl text-starlight/80 font-display font-semibold mb-4">
              From beautiful work to a system that shows it.
            </p>
            <p
              className="text-starlight/60 text-base sm:text-lg max-w-xl"
              style={{ textWrap: "pretty" }}
            >
              A luxury wedding planner already booked through word of mouth
              with no system to show the world why. We rebuilt the brand, the
              site, and the infrastructure to make the work visible to everyone.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-starlight/60">
              <span>Luxury Weddings</span>
              <span className="text-copper">|</span>
              <span>Memphis</span>
              <span className="text-copper">|</span>
              <span>30 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Situation ── */}
      <section
        className="py-16 sm:py-24 bg-deep-space"
        aria-labelledby="situation-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTag label="The Situation" className="mb-6" />
            <h2
              id="situation-heading"
              className="font-display font-semibold mb-6 text-starlight"
            >
              The work was already exceptional.
              <br />
              Nobody outside their network could see it.
            </h2>
            <div className="space-y-4 text-starlight/70 text-base leading-relaxed">
              <p>
                La Chérie Weddings is a luxury wedding planning studio in
                Memphis. The founder was already booking consistently
                through word of mouth and referrals. The events were
                editorial-quality. The couples were deeply loyal. The work spoke
                for itself.
              </p>
              <p>
                But none of that was visible online. The website looked like a
                placeholder. There was no brand language, no offer structure, and
                no way for anyone outside the existing network to understand what
                La Chérie actually delivers. The site told visitors almost
                nothing about what makes working with La Chérie different.
              </p>
              <p>
                Referrals were already coming in. The work was never the problem.
                But the website was not converting anyone on its own. We wanted
                a system that brings in couples organically, so every visitor
                gets the same confidence the referrals already had.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Clarity Audit ── */}
      <section
        className="py-16 sm:py-24 bg-navy"
        aria-labelledby="audit-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <SectionTag label="The Clarity Audit" className="mb-6" />
            <h2
              id="audit-heading"
              className="font-display font-semibold mb-4 text-starlight"
            >
              System Momentum Score. 1.6 out of 10.
            </h2>
            <p className="text-starlight/70 text-base leading-relaxed">
              We started with the Clarity Audit, a scored diagnostic across four
              layers of the business system. Each layer received a score from 1
              to 10 based on how well it was functioning relative to the quality
              of work behind it.
            </p>
          </div>

          {/* Score cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {auditLayers.map((layer) => (
              <GlassCard key={layer.name} className="p-8">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg text-copper">
                    {layer.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold" style={{ color: "#ef5350" }}>
                      {layer.before}
                    </span>
                    <span className="text-starlight/60">&rarr;</span>
                    <span className="text-green-400 font-semibold">
                      {layer.after}
                    </span>
                  </div>
                </div>
                <p className="text-starlight/60 text-sm leading-relaxed">
                  {layer.description}
                </p>
              </GlassCard>
            ))}
          </div>

          {/* Overall score */}
          <div className="mt-10 max-w-4xl mx-auto">
            <GlassCard className="p-8 border-copper/20">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <p className="text-sm uppercase tracking-[0.15em] text-copper mb-2 font-display font-semibold">
                    Overall System Momentum Score
                  </p>
                  <p className="text-starlight/70 text-sm leading-relaxed">
                    The system was operating at 16% of its potential. Every layer
                    was underbuilt relative to the quality of the work. La Chérie
                    was already booked. The gap between reputation and
                    visibility was the largest we had measured.
                  </p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-display font-bold text-spark-red">
                      1.6
                    </p>
                    <p className="text-xs text-starlight/60 mt-1">Before</p>
                  </div>
                  <span className="text-2xl text-starlight/60">&rarr;</span>
                  <div className="text-center">
                    <p className="text-3xl sm:text-4xl font-display font-bold text-green-400">
                      7.0
                    </p>
                    <p className="text-xs text-starlight/60 mt-1">After</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── The Brand Update ── */}
      <section
        className="py-16 sm:py-24 bg-deep-space"
        aria-labelledby="brand-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTag label="The Brand Update" className="mb-6" />
            <h2
              id="brand-heading"
              className="font-display font-semibold mb-6 text-starlight"
            >
              38 pages of brand infrastructure.
              <br />
              Built from the work, not invented for it.
            </h2>
            <div className="space-y-4 text-starlight/70 text-base leading-relaxed">
              <p>
                We produced a 38-page Brand Guidelines document that codified
                everything from color palette to voice principles to typography
                ratios. The guidelines were structured around four pillars drawn
                directly from the way La Chérie already works with their couples.
              </p>
            </div>

            <div className="mt-6">
              <a
                href="/images/work/LaCherie-Brand-Guidelines-Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-display font-semibold text-copper hover:text-starlight transition-colors duration-[var(--duration-fast)]"
              >
                See the full Brand Guidelines
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 1.5h5.5V7" />
                  <path d="M12.5 1.5L6 8" />
                  <path d="M10.5 8v4.5h-9v-9H6" />
                </svg>
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              {[
                {
                  pillar: "Personally Guided",
                  detail:
                    "Every couple gets direct access to the founder. This is not a team-of-coordinators operation. The pillar shaped how we wrote the services page and structured the inquiry flow.",
                },
                {
                  pillar: "Beautifully Considered",
                  detail:
                    "The visual identity reflects the same level of intention La Chérie brings to floral design, venue styling, and day-of coordination. Nothing in the brand is incidental.",
                },
                {
                  pillar: "Calmly Led",
                  detail:
                    "The tone is confident without being loud. The site speaks the way the founder speaks to couples. Clear, warm, grounded, and quietly authoritative.",
                },
                {
                  pillar: "Deeply Personal",
                  detail:
                    "The brand centers the relationship between planner and couple. Every section of the site answers the same question. What will this feel like to work with La Chérie?",
                },
              ].map((item) => (
                <GlassCard key={item.pillar} className="p-6">
                  <h3 className="font-display font-semibold text-copper mb-3">
                    {item.pillar}
                  </h3>
                  <p className="text-starlight/60 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Transformation ── */}
      <section
        className="py-16 sm:py-24 bg-navy"
        aria-labelledby="transformation-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <SectionTag label="The Transformation" className="mb-6" />
            <h2
              id="transformation-heading"
              className="font-display font-semibold mb-4 text-starlight"
            >
              Side by side.
            </h2>
            <p className="text-starlight/70 text-base leading-relaxed">
              The before and after captures the shift from a site that existed to
              a system that works. Drag the slider to compare.
            </p>
          </div>

          {/* Before/after comparisons — one MacBook per page */}
          <div className="space-y-8 max-w-4xl mx-auto">
            <MacBookBeforeAfter
              beforeSrc="/images/work/la-cherie/before-homepage.png"
              afterSrc="/images/work/la-cherie/after-homepage.png"
              beforeAlt="La Chérie Weddings homepage before the rebuild"
              afterAlt="La Chérie Weddings homepage after the rebuild"
              label="Homepage"
            />

            <MacBookBeforeAfter
              beforeSrc="/images/work/la-cherie/before-portfolio.png"
              afterSrc="/images/work/la-cherie/after-portfolio.png"
              beforeAlt="La Chérie Weddings portfolio before the rebuild"
              afterAlt="La Chérie Weddings portfolio after the rebuild"
              label="Portfolio"
            />

            <MacBookBeforeAfter
              beforeSrc="/images/work/la-cherie/before-inquire.png"
              afterSrc="/images/work/la-cherie/after-inquire.png"
              beforeAlt="La Chérie Weddings inquiry page before the rebuild"
              afterAlt="La Chérie Weddings inquiry page after the rebuild"
              label="Inquire"
            />
          </div>

          {/* After-only pages in MacBook frames */}
          <div className="mt-8 max-w-4xl mx-auto space-y-8">
              <MacBookFrame
                src="/images/work/la-cherie/after-services.png"
                alt="La Chérie Weddings services page after the rebuild"
                label="Services"
              />
              <MacBookFrame
                src="/images/work/la-cherie/after-about.png"
                alt="La Chérie Weddings about page after the rebuild"
                label="About"
              />
          </div>
        </div>
      </section>

      {/* ── The Result ── */}
      <section
        className="py-16 sm:py-24 bg-deep-space"
        aria-labelledby="result-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTag label="The Result" className="mb-6" />
            <h2
              id="result-heading"
              className="font-display font-semibold mb-6 text-starlight"
            >
              A system that matches the quality of the work.
            </h2>
            <div className="space-y-4 text-starlight/70 text-base leading-relaxed">
              <p>
                La Chérie Weddings now operates with a brand system that reflects
                the studio behind it. The website communicates who La Chérie is,
                what the experience includes, and how to begin. Not just to
                referrals who already know the brand, but to every couple discovering
                La Chérie for the first time.
              </p>
              <p>
                The inquiry path is direct. The service structure is visible. The
                brand voice is consistent from the first page load to the last
                form field. Couples arriving at the site get the same feeling
                they get when they meet the founder in person. Confidence that the
                process is already being handled.
              </p>
            </div>

            {/* Testimonial */}
            <blockquote className="mt-10 py-8 sm:py-10">
              <p className="text-starlight/80 text-base sm:text-lg italic leading-relaxed mb-4">
                &ldquo;Jordan took what felt overwhelming and turned it into
                something clear, beautiful, and genuinely easy to trust. Seeing the site
                come together made me feel as proud of my business online as I do
                when everything comes together on a wedding day. Having a clear
                path for couples to understand what to expect and how to get
                started is going to make a huge difference.&rdquo;
              </p>
              <footer className="text-sm text-copper font-display font-semibold">
                Founder, La Chérie Weddings
              </footer>
            </blockquote>

            {/* Deliverables list */}
            <div className="mt-8">
              <GlassCard className="p-8 text-left">
                <h3 className="font-display font-semibold text-copper mb-4">
                  What we delivered
                </h3>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-starlight/70">
                  {[
                    "38-page Brand Guidelines document",
                    "Full website redesign and build",
                    "Brand voice and messaging framework",
                    "Service tier structure and pricing model",
                    "Portfolio gallery with editorial layout",
                    "Inquiry flow with reduced friction",
                    "SEO foundation with schema, meta, and sitemap",
                    "Mobile-first responsive implementation",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-copper mt-2 shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-24 bg-navy" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              id="cta-heading"
              className="font-display font-semibold mb-4 text-starlight"
            >
              Your system has the same gap.
              <br />
              We can find it.
            </h2>
            <p className="text-starlight/60 text-base mb-8 max-w-lg mx-auto">
              The Clarity Audit scores your business across four layers and shows
              you exactly where the system breaks. $150. Delivered in 3 to 5
              business days.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
          </div>
        </div>
      </section>
    </main>
  );
}
