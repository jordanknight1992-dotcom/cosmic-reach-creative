import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "About | Jordan Knight, Founder of Cosmic Reach Creative",
  description:
    "Cosmic Reach Creative focuses on identifying where website performance breaks down, then rebuilding the system so it works. Founded by Jordan Knight in Memphis, TN.",
  alternates: { canonical: `${siteConfig.domain}/about` },
};

export default function AboutPage() {
  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://cosmicreachcreative.com" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://cosmicreachcreative.com/about" },
        ]
      })}} />
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="about-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/05-about-hero.jpg"
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
            <h1 id="about-hero" className="text-copper">A focus on what is<br />actually working.</h1>
          </div>
        </div>
      </section>

      {/* Origin */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="origin-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="origin-heading" className="mb-4 text-navy">Improve website performance by fixing what is broken.</h2>
            <p className="text-navy/70 text-base mb-3">
              Most websites are built once and rarely evaluated properly.
            </p>
            <p className="text-navy/70 text-base mb-3">
              Over time, messaging drifts and performance declines.
            </p>
            <p className="text-navy/70 text-base">
              Cosmic Reach Creative focuses on identifying where that breakdown occurs, then rebuilding the system so it performs with more precision.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-labelledby="founder-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-full max-w-[240px] sm:max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden shrink-0">
                <Image
                  src="/images/founder/jordan-knight-cosmic-reach-operator.jpg"
                  alt="Jordan Knight, founder of Cosmic Reach Creative in Memphis, TN"
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 id="founder-heading" className="mb-4">The work is grounded in experience.</h2>
                <p className="text-starlight/70 text-base mb-3">
                  Jordan Knight founded Cosmic Reach Creative in Memphis, Tennessee, after years leading programs where performance and structured reporting were not optional.
                </p>
                <p className="text-starlight/70 text-base mb-3">
                  That experience shaped the approach:
                </p>
                <ul className="space-y-2 text-left">
                  {[
                    "What visitors see first",
                    "What they understand",
                    "What leads them to act",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/70">
                      <span className="text-copper mt-0.5 shrink-0">&#9670;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page image break */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 py-4">
        <div className="relative w-full h-40 sm:h-56 rounded-2xl overflow-hidden">
          <Image
            src="/images/11-case-header.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-deep-space/40" />
        </div>
      </div>

      {/* Testimonial */}
      <section className="py-12 sm:py-16 bg-navy/30" aria-label="What clients say">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <blockquote className="rounded-2xl border border-starlight/8 bg-navy/60 p-6 sm:p-8">
              <p className="text-starlight/80 text-base italic leading-relaxed mb-4">
                &ldquo;I have spent decades leading infrastructure and network programs where milestone visibility and structured reporting were critical to success. Cosmic Reach translated that same disciplined framework into a modern, intuitive platform.&rdquo;
              </p>
              <footer className="text-sm text-copper font-display font-medium">
                Licensed PMO, Texas
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-section-light" aria-labelledby="about-cta">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="about-cta" className="mb-3 text-navy">Start with the audit.</h2>
            <p className="text-navy/70 text-base mb-6">
              A focused $150 review of your website and messaging. You will see what is working, what is not, and where to begin.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
          </div>
        </div>
      </section>
    </main>
  );
}
