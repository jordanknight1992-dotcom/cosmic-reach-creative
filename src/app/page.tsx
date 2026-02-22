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
              Turn organizational noise into operational clarity.
            </h1>
            <p className="text-muted text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              Cosmic Reach designs systems that help teams see clearly, decide faster, and move forward with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/signal-session" size="lg" chevron>
                Start a Signal Session
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
            Most organizations do not struggle with ideas.<br />
            They struggle with alignment.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-4">
            Teams use different tools, speak different languages, and measure progress in different ways. Decisions slow down. Work becomes reactive. Momentum fades.
          </p>
          <p className="text-starlight text-lg font-medium mb-4">
            Cosmic Reach exists to fix that.
          </p>
          <p className="text-muted text-lg leading-relaxed">
            We design the systems, structures, and communication patterns that turn complexity into coordinated motion.
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
                Diagnose the noise
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We map where clarity breaks down across teams, tools, and workflows.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Design the signal
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We build the structure, language, and systems that create alignment.
              </p>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-starlight mb-2">
                Make it real
              </h3>
              <p className="text-muted text-base leading-relaxed">
                We implement tools, prototypes, and workflows that sustain momentum.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Systems in Motion */}
      <Section background="surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-starlight leading-tight mb-6">
            Systems in Motion
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-8">
            This work is not theoretical.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/work/milestone" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Milestone
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  A platform designed to turn scattered project data into visible progress.
                </p>
              </Card>
            </Link>
            <Link href="/work/clear-enough" className="group">
              <Card hover className="h-full">
                <h3 className="font-display font-semibold text-xl text-starlight mb-2 group-hover:text-copper transition-colors duration-200">
                  Clear Enough
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  A grounding clarity system that helps people move forward with intention.
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </Section>

      {/* Where Momentum Begins */}
      <CTASection
        title="Where Momentum Begins"
        description="Clarity creates momentum. Momentum creates results."
        buttonLabel="Start a Signal Session"
        buttonHref="/signal-session"
      />
    </>
  );
}
