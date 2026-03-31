import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { DownloadReportButton } from "@/components/DownloadReportButton";
import Link from "next/link";
import {
  reportMeta,
  businessContext,
  layerScores,
  siteBreakdowns,
  leadLimiters,
  priorityFixes,
  afterFixing,
  recommendedNextStep,
} from "@/lib/clarity-report-data";
import { getScoreColor } from "@/lib/site-scoring";

export const metadata: Metadata = {
  title: "Example Audit Report | See What You Receive",
  description:
    "See a real example of the Clarity Audit report: a direct assessment of what is not working on a website and what to fix first.",
  alternates: { canonical: `${siteConfig.domain}/clarity-report-example` },
};

/* ─── Sub-components ─── */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase whitespace-nowrap">
        {label}
      </p>
      <div className="flex-1 h-px bg-starlight/8" aria-hidden="true" />
    </div>
  );
}

function ReportCard({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-7 sm:p-9 ${className}`}
      aria-label={label}
    >
      <SectionLabel label={label} />
      {children}
    </section>
  );
}

/* ─── Page ─── */

export default function ClarityReportExamplePage() {
  return (
    <main id="main-content">
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden print:hidden"
        aria-labelledby="report-hero-title"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/04-work-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-4">
              Sample Deliverable
            </span>
            <h1 id="report-hero-title" className="text-starlight mb-4">
              Example Audit Report
            </h1>
            <p
              className="text-starlight/70 text-lg sm:text-xl mb-8"
              style={{ textWrap: "pretty" }}
            >
              See how the Clarity Audit identifies what is not working and what to fix first.
            </p>
            <DownloadReportButton />
          </div>
        </div>
      </section>

      {/* ── Print Cover Page ── */}
      <div className="hidden print:block" id="print-cover">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/01-home-hero.jpg"
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(11, 17, 32, 0.82)",
            }}
          />
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "60px 48px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/logo-primary-dark.svg"
              alt="Cosmic Reach Creative"
              style={{ width: "220px", marginBottom: "56px" }}
            />
            <div style={{ marginBottom: "32px" }}>
              <p
                style={{
                  color: "rgba(232, 223, 207, 0.55)",
                  fontSize: "0.6875rem",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Website Audit
              </p>
              <h1
                style={{
                  color: "#d4a574",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: "2.75rem",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  margin: "0 0 10px 0",
                }}
              >
                Clarity Audit Report
              </h1>
              <p
                style={{
                  color: "#e8dfcf",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {reportMeta.business}
              </p>
            </div>
            <div
              style={{
                width: "64px",
                height: "1px",
                backgroundColor: "rgba(212, 165, 116, 0.45)",
                marginBottom: "32px",
              }}
            />
            <div>
              <p
                style={{
                  color: "rgba(232, 223, 207, 0.70)",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  marginBottom: "6px",
                }}
              >
                Prepared by Cosmic Reach Creative
              </p>
              <p
                style={{
                  color: "rgba(232, 223, 207, 0.40)",
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: "0.8125rem",
                  margin: 0,
                }}
              >
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Intro explanation (screen only) ── */}
      <div className="print:hidden py-8 sm:py-10 bg-section-light">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-copper/30 bg-white shadow-subtle px-6 py-5 flex gap-4 items-start">
              <span className="text-copper text-sm mt-0.5 shrink-0" aria-hidden="true">
                &#9670;
              </span>
              <p className="text-navy/70 text-sm leading-relaxed">
                <strong className="text-navy font-display font-semibold">
                  This is a sanitized example report
                </strong>{" "}
                using a fictional company called AtlasOps. It shows the exact structure
                and format your audit will deliver, prepared within 3–5
                business days of your submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report Body ── */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24 print:px-0 print:pb-0">
        <div className="max-w-3xl mx-auto space-y-6 print:space-y-6">

          {/* ── Business Context ── */}
          <ReportCard label="Business Context">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-0.5">
                  Business
                </p>
                <p className="text-starlight font-display font-semibold text-base">{reportMeta.business}</p>
              </div>
              <div>
                <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-0.5">
                  Industry
                </p>
                <p className="text-starlight/80 text-sm">{reportMeta.industry}</p>
              </div>
              <div>
                <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-0.5">
                  Primary Offer
                </p>
                <p className="text-starlight/80 text-sm">{reportMeta.primaryOffer}</p>
              </div>
            </div>
            <div className="border-t border-starlight/8 pt-5">
              <p className="text-starlight/70 text-sm leading-relaxed">{businessContext}</p>
            </div>
          </ReportCard>

          {/* ── Layer Scores ── */}
          <ReportCard label="Layer Scores">
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase">
                  Overall Health
                </span>
                <span
                  className="font-display font-bold text-2xl"
                  style={{ color: getScoreColor(layerScores.overall) }}
                >
                  {layerScores.overall}
                </span>
                <span className="text-xs font-display font-semibold" style={{ color: getScoreColor(layerScores.overall) }}>
                  / 10
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {([layerScores.signal, layerScores.gravity, layerScores.orbit, layerScores.thrust] as const).map((layer) => (
                <div key={layer.label} className="rounded-xl border border-starlight/8 bg-deep-space/40 p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-display font-bold text-starlight text-base">{layer.label}</span>
                      <span className="text-starlight/30 text-sm ml-2">{layer.area}</span>
                    </div>
                    <span className="font-display font-bold text-xl" style={{ color: getScoreColor(layer.score) }}>
                      {layer.score}
                    </span>
                  </div>
                  <p className="text-starlight/40 text-xs mb-3">{layer.question}</p>
                  {/* Score bar */}
                  <div className="h-2 rounded-full bg-starlight/6 overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(layer.score / 10) * 100}%`,
                        backgroundColor: getScoreColor(layer.score),
                      }}
                    />
                  </div>
                  {/* Factors */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {layer.factors.map((f) => (
                      <div key={f.name} className="text-xs">
                        <span className="text-starlight/35">{f.name}</span>
                        <span className="text-starlight/55 ml-1">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-5 mt-5 pt-4 border-t border-starlight/6">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                <span className="text-xs text-starlight/40">8–10 Good</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#eab308" }} />
                <span className="text-xs text-starlight/40">5–7 Be Aware</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
                <span className="text-xs text-starlight/40">0–4 Warning</span>
              </div>
            </div>
          </ReportCard>

          {/* ── Where the Site Breaks Down ── */}
          <ReportCard label="Where the Site Breaks Down">
            <div className="space-y-4">
              {siteBreakdowns.map((item) => (
                <div
                  key={item.area}
                  className="rounded-xl border border-starlight/8 bg-deep-space/40 p-5"
                >
                  <h3 className="font-display font-semibold text-starlight mb-3">
                    {item.area}
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4">
                      <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-1.5">
                        What We Observed
                      </p>
                      <p className="text-starlight/70 text-sm leading-relaxed">{item.observation}</p>
                    </div>
                    <div className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4">
                      <p className="text-xs font-display font-semibold tracking-widest text-copper/70 uppercase mb-1.5">
                        Impact
                      </p>
                      <p className="text-starlight/70 text-sm leading-relaxed">{item.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* ── What Is Limiting Leads ── */}
          <ReportCard label="What Is Limiting Leads">
            <ol className="space-y-3" aria-label="Lead limiters">
              {leadLimiters.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-display font-bold text-copper text-sm w-5 shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-starlight/80 text-sm leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </ReportCard>

          {/* ── Priority Fixes ── */}
          <ReportCard label="Priority Fixes">
            <div className="space-y-4">
              {priorityFixes.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-starlight/8 bg-deep-space/40 p-5"
                >
                  <div className="flex items-start gap-4 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-copper text-deep-space text-xs font-display font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="font-display font-semibold text-starlight text-sm">
                      {item.fix}
                    </p>
                  </div>
                  <p className="text-starlight/60 text-sm leading-relaxed ml-10">
                    {item.why}
                  </p>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* ── What Changes After Fixing ── */}
          <ReportCard label="What Changes After Fixing">
            <ul className="space-y-3">
              {afterFixing.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-starlight/80 text-sm leading-relaxed">
                  <span className="text-copper/60 text-xs mt-1 shrink-0" aria-hidden="true">&#9670;</span>
                  {item}
                </li>
              ))}
            </ul>
          </ReportCard>

          {/* ── Recommended Next Step ── */}
          <ReportCard label="Recommended Next Step">
            <div className="rounded-xl border border-copper/25 bg-copper/5 p-5 mb-4">
              <p className="font-display font-bold text-copper text-lg mb-2">
                {recommendedNextStep.name}
              </p>
              <p className="text-starlight/70 text-sm leading-relaxed">
                {recommendedNextStep.description}
              </p>
            </div>
            <div className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4">
              <p className="text-xs font-display font-semibold tracking-widest text-copper/60 uppercase mb-1.5">
                Next Step
              </p>
              <p className="text-starlight/80 text-sm leading-relaxed">
                {recommendedNextStep.nextStep}
              </p>
            </div>
          </ReportCard>

          {/* ── Report Footer ── */}
          <div className="rounded-[var(--radius-lg)] border border-starlight/8 bg-navy/30 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-display font-semibold tracking-widest text-copper/60 uppercase mb-1">
                Prepared by
              </p>
              <p className="font-display font-semibold text-starlight">Cosmic Reach Creative</p>
            </div>
            <Link
              href="/pricing"
              className="print:hidden text-sm font-display font-semibold text-copper hover:text-copper/80 transition-colors underline underline-offset-2"
            >
              View engagement options →
            </Link>
          </div>

        </div>
      </div>

      {/* ── CTA Section (screen only) ── */}
      <section
        className="print:hidden py-16 sm:py-24 bg-navy/60 border-t border-copper/15"
        aria-labelledby="report-cta-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="report-cta-heading" className="mb-4">
              Start with the Audit
            </h2>
            <p className="text-starlight/70 text-base mb-2" style={{ textWrap: "pretty" }}>
              A focused review of your website and messaging that shows you what is not working and what to fix first.
            </p>
            <p className="text-starlight/60 text-sm mb-8" style={{ textWrap: "pretty" }}>
              If your website is not bringing in consistent business, this is where to start.
            </p>
            <CTAButton label="Start with the Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/50">
              3&ndash;5 day turnaround &middot; Written report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
