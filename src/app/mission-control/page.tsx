import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Mission Control | Visibility After Launch",
  description:
    "Mission Control is included with every rebuild. It captures leads, tracks sources, and shows what is working across your site. See where inquiries come from and what needs attention.",
  alternates: { canonical: `${siteConfig.domain}/mission-control` },
};

export default function MissionControlLanding() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="mc-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/mission-control-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/80 via-deep-space/70 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-xs font-display font-semibold tracking-[0.14em] uppercase text-copper mb-4">
              Included with every rebuild
            </div>
            <h1 id="mc-hero" className="text-copper mb-4">
              Visibility after launch.
            </h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3 max-w-[560px] mx-auto">
              Most websites go live and become difficult to evaluate. Mission Control changes that.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/mission-control/demo"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-8 py-3 text-base font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Try the Demo
              </Link>
            </div>
            <div className="mt-3 text-center">
              <Link
                href="/mission-control/login"
                className="text-sm text-starlight/40 hover:text-starlight/60 transition-colors underline underline-offset-2"
              >
                Already a member? Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-14 sm:py-20 bg-navy/40" aria-label="The problem">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <Icon name="compass" size={32} className="mx-auto mb-4 opacity-60" />
          <h2 className="font-display font-bold text-2xl text-starlight mb-3">
            It is not always clear what is working.
          </h2>
          <p className="text-starlight/50 text-sm max-w-lg mx-auto mb-10">
            After launch, most business owners lose visibility into their own site.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "Where leads come from",
              "Which pages are performing",
              "What needs attention",
            ].map((signal) => (
              <div
                key={signal}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/40 p-5 text-center transition-all duration-[var(--duration-base)] hover:border-copper/20"
              >
                <span className="text-sm text-starlight/70">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What It Provides */}
      <section className="py-14 sm:py-20" aria-label="What Mission Control provides">
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl text-starlight mb-3">
            What Mission Control provides.
          </h2>
          <p className="text-starlight/50 text-sm max-w-lg mx-auto mb-10">
            The site continues to function as a system, not just a set of pages.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { icon: "compass", title: "Lead capture and intake", desc: "Leads are captured and organized automatically from forms on your site." },
              { icon: "signal", title: "Source tracking", desc: "See where each inquiry comes from so you know which channels are producing." },
              { icon: "eye", title: "Page performance", desc: "Understand which pages are working and which ones visitors leave." },
              { icon: "gears", title: "Follow-up visibility", desc: "A view of what needs attention so leads do not go cold." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 text-center transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30 hover:shadow-subtle"
              >
                <div className="mb-3"><Icon name={item.icon} size={26} className="mx-auto" /></div>
                <div className="font-display font-bold text-sm mb-1.5 text-starlight">{item.title}</div>
                <div className="text-sm text-starlight/50 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-navy/40" aria-label="Get started">
        <div className="max-w-[var(--container-max)] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display font-bold mb-3 text-starlight">
            Included with every rebuild.
          </h2>
          <p className="text-starlight/50 text-sm max-w-lg mx-auto mb-8">
            Mission Control is part of the rebuild process. After launch, you have visibility into what is working and what needs attention.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-8 py-3 text-base font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
          >
            View Pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
