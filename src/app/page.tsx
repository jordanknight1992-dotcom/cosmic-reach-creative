import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { CTASection } from "@/components/sections/CTASection";
import { JsonLd } from "@/components/ui/JsonLd";
import { SITE } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          founder: {
            "@type": "Person",
            name: SITE.founder,
            jobTitle: SITE.founderTitle,
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
        }}
      />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/home.jpg"
            alt=""
            fill
            className="object-cover opacity-60"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/30 via-deep-space/50 to-deep-space" />
        </div>
        <Container className="relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-starlight leading-[1.1] mb-6">
              Your marketing team is busy.<br />
              But is it aligned?
            </h1>
            <p className="text-muted text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              Cosmic Reach designs the dashboards, reporting infrastructure, and operational workflows that help marketing teams see what&#39;s working, kill what isn&#39;t, and move faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/signal-session" size="lg" chevron>
                Book a Free Strategy Call
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                See the Work
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Alignment Block */}
      <Section background="surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-starlight leading-tight mb-6">
            Most marketing teams do not struggle with effort.<br />
            They struggle with visibility.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Your team runs campaigns across six platforms, pulls reports from four dashboards, and still can&#39;t answer &ldquo;what&#39;s actually working?&rdquo; without a fire drill. Data is scattered. Reporting is manual. Decisions are slow because the information to make them is buried.
          </p>
          <p className="text-starlight text-lg font-medium mb-4">
            Cosmic Reach exists to fix that.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            We build the performance infrastructure that makes marketing results visible, measurable, and actionable - so your team spends less time pulling numbers and more time making decisions.
          </p>
        </div>
      </Section>

      {/* How We Bring Signal Into Focus */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-starlight leading-tight mb-12">
            How We Bring Signal Into Focus
          </h2>
          <div className="space-y-10">
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Audit Your Operations
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We map where your marketing team loses time: disconnected platforms, manual reporting, unclear attribution, and metrics that don&#39;t connect to decisions.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Design the System
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We build the dashboards, reporting workflows, and tooling that make performance visible across channels - GA4, Search Console, paid media, social - one view, one truth.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Ship It
              </h3>
              <p className="text-muted text-base leading-relaxed">
                Not a slide deck. Working tools your team uses on Monday. Connected platforms, automated reports, and processes that hold when the quarter gets loud.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Who This Is For */}
      <Section background="surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-starlight leading-tight mb-8">
            Who This Orbit Fits
          </h2>
          <ul className="space-y-4" role="list">
            {[
              "Marketing teams of 5-20 that have outgrown spreadsheet reporting",
              "Marketing ops leaders drowning in platform-switching and manual data pulls",
              "VPs of Marketing who can't answer \"what's working?\" without a 3-day fire drill",
              "Growth teams that need reporting infrastructure, not another agency retainer",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span className="text-muted text-lg leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Systems in Motion */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-starlight leading-tight mb-6">
            Systems in Motion
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            Real tools built for real teams. Not mockups.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/parallax" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Parallax
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  A marketing dashboard that pulls GA4, Search Console, social, and ad data into one clean report.
                </p>
              </Card>
            </Link>
            <Link href="/work/milestone" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Milestone
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  A project tracking system that turns scattered data into visible progress and decision-ready reporting.
                </p>
              </Card>
            </Link>
            <Link href="/work/clear-enough" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Clear Enough
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  A personal clarity system that proves the same design principles work at every scale.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      {/* Where Momentum Begins */}
      <CTASection
        title="Where Momentum Begins"
        description="Stop guessing what's working. Let's build the system that shows you."
        buttonLabel="Book a Free Strategy Call"
        buttonHref="/signal-session"
      />
    </>
  );
}
