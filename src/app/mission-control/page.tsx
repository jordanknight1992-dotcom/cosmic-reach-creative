import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";
import { StripeBuyButton } from "@/components/StripeBuyButton";
import { DashboardPreview } from "@/components/DashboardPreview";

export const metadata: Metadata = {
  title: "Mission Control | A Clear View of What Your Website Is Doing",
  description:
    "Mission Control is included with every rebuild. It captures leads, shows where they came from, and highlights which pages are driving action.",
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
              A clear view of what your website is doing.
            </h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3 max-w-[560px] mx-auto">
              After a site launches, most businesses lose visibility. Mission Control changes that.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/mission-control/demo"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-8 py-3 text-base font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
              >
                Try the Live Demo
              </Link>
            </div>
            <div className="mt-3 text-center">
              <Link
                href="/mission-control/login"
                className="text-sm text-starlight/60 hover:text-starlight/80 transition-colors underline underline-offset-2"
              >
                Already a member? Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dashboard Preview ──────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-navy/40" aria-label="Dashboard preview">
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px" }}>
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-starlight mb-2">
              Everything in one place.
            </h2>
            <p style={{ color: "rgba(232,223,207,0.5)", fontSize: 14 }}>
              Leads, traffic, performance, and meetings. Visible the moment you log in.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* ─── Three Pillars ──────────────────────────────────────── */}
      <section className="py-14 sm:py-20" aria-label="What Mission Control handles">
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl text-starlight mb-2">
              Three systems. One dashboard.
            </h2>
            <p style={{ color: "rgba(232,223,207,0.5)", fontSize: 14 }}>
              No switching between Google Analytics, PageSpeed, and spreadsheets.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              {
                icon: "network" as const,
                title: "Lead Tracking",
                desc: "Every inquiry captured and organized with source attribution.",
              },
              {
                icon: "signal" as const,
                title: "Performance",
                desc: "PageSpeed, Core Web Vitals, uptime, and response times. Updated continuously.",
              },
              {
                icon: "eye" as const,
                title: "Traffic Intelligence",
                desc: "See where visitors come from and which pages drive action.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/30"
                style={{
                  background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
                  borderRadius: 12, padding: "20px 16px", textAlign: "center",
                }}
              >
                <Icon name={item.icon} size={20} className="opacity-50 mx-auto mb-2" />
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dfcf", marginBottom: 4, fontFamily: "var(--font-display)" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 12, color: "rgba(232,223,207,0.45)", lineHeight: 1.5 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing / CTA ──────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-navy/40" aria-label="Get started">
        <div className="max-w-[var(--container-max)] mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-display font-bold mb-2 text-starlight">
            Included with every rebuild. Available standalone.
          </h2>
          <p style={{ color: "rgba(232,223,207,0.5)", fontSize: 14, maxWidth: 480, margin: "0 auto 16px" }}>
            Mission Control is part of every Cosmic Reach Creative rebuild at no extra cost. For others, it is available as a standalone subscription.
          </p>
          <div style={{ maxWidth: 320, margin: "0 auto" }}>
            <div style={{
              background: "#111827", border: "1px solid rgba(212,165,116,0.2)",
              borderRadius: 14, padding: "20px 24px", marginBottom: 12,
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#d4a574", fontFamily: "var(--font-display)", marginBottom: 2 }}>$150/month</div>
              <div style={{ fontSize: 12, color: "rgba(232,223,207,0.4)", marginBottom: 16 }}>Standalone subscription</div>
              <StripeBuyButton buyButtonId="buy_btn_1THvGV0vGBLnj72kN97MqFHS" />
            </div>
            <p style={{ fontSize: 11, color: "rgba(232,223,207,0.3)" }}>
              Free for all Cosmic Reach Creative-built websites.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/mission-control/demo"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] border-2 border-starlight/20 text-starlight px-6 py-2.5 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/40 hover:text-copper"
            >
              Try the Live Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
