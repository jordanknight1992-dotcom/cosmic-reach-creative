import { Metadata } from "next";
import Image from "next/image";
import { GlassCard } from "@/components/GlassCard";
import { SectionTag } from "@/components/SectionTag";
import { MacBookBeforeAfter } from "@/components/MacBookBeforeAfter";
import { MacBookFrame } from "@/components/MacBookFrame";
import { ArticleSchema } from "@/components/schema/ArticleSchema";
import { CTAButton } from "@/components/CTAButton";
import { CaseStudyDownloadForm } from "@/components/CaseStudyDownloadForm";

export const metadata: Metadata = {
  title:
    "La Chérie Weddings Case Study | Trust Gap to Premium Positioning | Cosmic Reach Creative",
  description:
    "A luxury wedding planner in Memphis was already booked through referrals. New visitors could not tell why. We rebuilt the brand, the site, and the positioning. System Momentum Score went from 1.6 to 7.0 in 30 days.",
  alternates: {
    canonical: "https://cosmicreachcreative.com/work/la-cherie",
  },
};

const auditLayers = [
  {
    name: "Signal",
    before: 2,
    after: 7,
    label: "Messaging",
    description:
      "The site read like every other wedding planner in the region. Nothing communicated what made the experience different. New visitors had no reason to trust what they were seeing.",
  },
  {
    name: "Gravity",
    before: 1,
    after: 7,
    label: "Offer",
    description:
      "No visible services. No pricing structure. No tiers. The inquiry form was the only way to learn anything, and it was buried four clicks deep.",
  },
  {
    name: "Orbit",
    before: 2,
    after: 8,
    label: "Path to Action",
    description:
      "The site looked like a placeholder for a business that did not need one. Visitors arriving from Google had no guided path to an inquiry.",
  },
  {
    name: "Thrust",
    before: 1,
    after: 6,
    label: "Visibility",
    description:
      "No search schema. No meta strategy. No local SEO. The business was invisible to anyone outside the existing referral network.",
  },
];

export default function LaCherieCase() {
  return (
    <main id="main-content">
      <ArticleSchema
        headline="La Chérie Weddings. Closing the Trust Gap Between Referrals and the Website"
        description="A luxury wedding planner in Memphis was fully booked through referrals. New visitors could not tell why. We rebuilt the brand, the site, and the positioning. System Momentum Score: 1.6 to 7.0."
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
            <p className="text-xl sm:text-2xl text-starlight/80 font-display font-semibold mb-4" style={{ textWrap: "pretty" }}>
              She delivered a premium experience. Anyone who hadn&rsquo;t spoken to her had no way to know.
            </p>
            <p
              className="text-starlight/60 text-base sm:text-lg max-w-xl mx-auto"
              style={{ textWrap: "pretty" }}
            >
              Referrals trusted her immediately. Everyone else landed on a website that gave them nothing to go on. The gap between reputation and online presence was costing the business leads it had already earned.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-starlight/60">
              <span>Luxury Weddings</span>
              <span className="text-copper">|</span>
              <span>Memphis, TN</span>
              <span className="text-copper">|</span>
              <span>Full Brand System</span>
              <span className="text-copper">|</span>
              <span>30 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section
        className="py-16 sm:py-24 bg-deep-space"
        aria-labelledby="problem-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <SectionTag label="The Problem" className="mb-6" />
              <h2
                id="problem-heading"
                className="font-display font-semibold mb-6 text-starlight"
              >
                The work was already premium.
                <br />
                The website made it invisible.
              </h2>
            </div>
            <div className="space-y-4 text-starlight/70 text-base leading-relaxed">
              <p>
                La Chérie Weddings is a luxury wedding planning studio in
                Memphis. The founder was consistently booked through word of mouth.
                The events were editorial-quality. Couples were deeply loyal. None
                of that was visible to anyone discovering the business online.
              </p>
              <p>
                The website looked like a placeholder. There was no brand language
                that reflected the real experience. No offer structure. No way
                for a new visitor to understand what La Chérie actually delivers
                or why it costs what it costs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                {
                  label: "Weak trust for new visitors",
                  detail: "The site gave no evidence of the premium experience behind it. First impressions were working against the business.",
                },
                {
                  label: "No visible offer structure",
                  detail: "Visitors could not see what services existed, what they included, or what to expect. The only path was a buried inquiry form.",
                },
                {
                  label: "Generic positioning",
                  detail: "The messaging could have belonged to any wedding planner in any city. Nothing communicated why La Chérie was different.",
                },
                {
                  label: "Friction in the inquiry path",
                  detail: "The inquiry form sat behind four clicks. Couples who were ready to act had to work to find it.",
                },
              ].map((item) => (
                <GlassCard key={item.label} className="p-5">
                  <p className="text-copper font-display font-semibold text-sm mb-2">
                    {item.label}
                  </p>
                  <p className="text-starlight/60 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </GlassCard>
              ))}
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
              System Momentum Score: 1.6 out of 10.
            </h2>
            <p className="text-starlight/70 text-base leading-relaxed">
              The audit scored four layers of the business system. Every layer
              was underperforming relative to the quality of the work behind it.
              The gap between what La Chérie delivered in person and what the
              website communicated was the largest we had measured.
            </p>
          </div>

          {/* Score cards */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {auditLayers.map((layer) => (
              <GlassCard key={layer.name} className="p-8">
                <div className="flex items-baseline justify-between mb-1">
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
                <p className="text-starlight/40 text-xs font-display mb-3">{layer.label}</p>
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
                    Operating at 16% of potential. The business had earned trust
                    through years of in-person experience. The website reflected
                    almost none of it. Every new visitor was starting from zero.
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

      {/* ── The Transformation (Visual) ── */}
      <section
        className="py-16 sm:py-24 bg-deep-space"
        aria-labelledby="transformation-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <SectionTag label="The Transformation" className="mb-6" />
            <h2
              id="transformation-heading"
              className="font-display font-semibold mb-4 text-starlight"
            >
              This is a shift in perceived trust.
            </h2>
            <p className="text-starlight/70 text-base leading-relaxed">
              The same business. The same quality of work. A completely different
              first impression. Drag the slider to compare.
            </p>
          </div>

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

      {/* ── What We Built ── */}
      <section
        className="py-16 sm:py-24 bg-navy"
        aria-labelledby="solution-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionTag label="What We Built" className="mb-6" />
            <h2
              id="solution-heading"
              className="font-display font-semibold mb-6 text-starlight"
            >
              38 pages of brand infrastructure.
              <br />
              Built from the work, not invented for it.
            </h2>
            <div className="space-y-4 text-starlight/70 text-base leading-relaxed mb-8">
              <p>
                The brand system was built around four pillars drawn
                directly from the way La Chérie already works with couples.
                Everything from voice to visual identity to conversion logic
                was designed to make new visitors feel the same confidence
                that referrals already had.
              </p>
            </div>

            <div className="mb-8">
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

            <div className="grid sm:grid-cols-2 gap-5">
              {[
                {
                  outcome: "Faster understanding",
                  detail: "New visitors can tell what La Chérie does, who it is for, and what makes the experience different within seconds of landing.",
                },
                {
                  outcome: "Stronger trust signals",
                  detail: "The visual identity, tone, and content now reflect the same standard couples experience in person. The site earns trust before a conversation happens.",
                },
                {
                  outcome: "Visible offer structure",
                  detail: "Service tiers, pricing context, and the inquiry flow are all accessible from the homepage. Couples can self-qualify before reaching out.",
                },
                {
                  outcome: "Reduced inquiry friction",
                  detail: "The path from landing to inquiry went from four clicks to one. The form asks only what matters. The response sets expectations immediately.",
                },
              ].map((item) => (
                <GlassCard key={item.outcome} className="p-6 text-left">
                  <h3 className="font-display font-semibold text-copper mb-2 text-sm">
                    {item.outcome}
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
              The site now supports the positioning the business earned years ago.
            </h2>
            <div className="space-y-4 text-starlight/70 text-base leading-relaxed">
              <p>
                La Chérie Weddings now operates with a brand system that matches
                the studio behind it. Couples arriving from Google get the same
                feeling they get when they meet the founder in person. Confidence
                that the process is already being handled.
              </p>
              <p>
                Non-referral visitors can now understand the value, see the work,
                and begin the conversation without needing someone to vouch for
                the experience first. The website does what the reputation always did.
              </p>
            </div>

            {/* Deliverables */}
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
                    "Inquiry flow redesign (4 clicks to 1)",
                    "SEO foundation with schema and sitemap",
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

            {/* Testimonial */}
            <blockquote className="mt-10 py-8 sm:py-10">
              <p className="text-xs font-display font-semibold tracking-widest text-copper uppercase mb-4">
                Founder Perspective
              </p>
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
          </div>
        </div>
      </section>

      {/* ── Primary CTA ── */}
      <section className="py-16 sm:py-24 bg-navy" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              id="cta-heading"
              className="font-display font-semibold mb-4 text-starlight"
            >
              If your work is ahead of your website, the gap is costing you.
            </h2>
            <p className="text-starlight/60 text-base mb-8 max-w-lg mx-auto">
              The Clarity Audit scores your messaging, offer, site, and visibility
              and tells you exactly where trust is breaking down. $150. Delivered in 3 to 5
              business days.
            </p>
            <CTAButton label="Get your Clarity Audit" variant="primary" />
          </div>
        </div>
      </section>

      {/* ── Case Study Download ── */}
      <section className="py-16 sm:py-24 bg-deep-space" aria-labelledby="download-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <CaseStudyDownloadForm />
          </div>
        </div>
      </section>
    </main>
  );
}
