import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { CTAButton } from "@/components/CTAButton";
import { DownloadReportButton } from "@/components/DownloadReportButton";
import Link from "next/link";
import {
  layerScores,
  deepAnalyses,
  priorityActions,
  implementationPhases,
  sprintRecommendation,
} from "@/lib/clarity-report-data";

export const metadata: Metadata = {
  title: "Example Business Clarity Report | See What You Receive",
  description:
    "See a real example of the Business Clarity Audit: scored analysis across Signal, Gravity, Orbit, and Thrust with a prioritized implementation plan.",
  alternates: { canonical: `${siteConfig.domain}/clarity-report-example` },
};

/* Report data imported from @/lib/clarity-report-data */

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

function InsightRow({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-display font-semibold tracking-widest text-starlight/50 uppercase mb-1.5">
        {label}
      </p>
      <p className="text-starlight/80 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function AnalysisSubRow({
  label,
  text,
  accent = false,
}: {
  label: string;
  text: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4">
      <p
        className={`text-xs font-display font-semibold tracking-widest uppercase mb-1.5 ${
          accent ? "text-copper/70" : "text-starlight/40"
        }`}
      >
        {label}
      </p>
      <p className="text-starlight/70 text-sm leading-relaxed">{text}</p>
    </div>
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
              Example Business Clarity Report
            </h1>
            <p
              className="text-starlight/70 text-lg sm:text-xl mb-8"
              style={{ textWrap: "pretty" }}
            >
              See how the Cosmic Reach Clarity Framework identifies where growth momentum is being
              lost and what to fix first.
            </p>
            <DownloadReportButton />
          </div>
        </div>
      </section>

      {/* ── Print Cover Page ── */}
      <div className="hidden print:block" id="print-cover">
        {/* Full-bleed wrapper — takes up one full print page */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Background: telescope hero image */}
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

          {/* Dark overlay */}
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

          {/* Centered content */}
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
            {/* Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/logo-primary-dark.svg"
              alt="Cosmic Reach Creative"
              style={{ width: "220px", marginBottom: "56px" }}
            />

            {/* Title block */}
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
                Business Clarity Audit
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
                Business Clarity Report
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
                AtlasOps
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "64px",
                height: "1px",
                backgroundColor: "rgba(212, 165, 116, 0.45)",
                marginBottom: "32px",
              }}
            />

            {/* Prepared by + date */}
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
                using a fictional company called AtlasOps. It demonstrates the exact structure,
                depth, and format your Business Clarity Audit will deliver, prepared within 3–5
                business days of your submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report Body ── */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-10 pb-16 sm:pb-24 print:px-0 print:pb-0">
        <div className="max-w-3xl mx-auto space-y-6 print:space-y-6">

          {/* ── Executive Readout ── */}
          <ReportCard label="Executive Readout">
            {/* Business meta */}
            <div className="grid sm:grid-cols-[1fr_auto] gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-0.5">
                    Business
                  </p>
                  <p className="text-starlight font-display font-semibold text-base">AtlasOps</p>
                </div>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-0.5">
                    Industry
                  </p>
                  <p className="text-starlight/80 text-sm">SaaS Operations Consulting</p>
                </div>
                <div>
                  <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-0.5">
                    Primary Offer
                  </p>
                  <p className="text-starlight/80 text-sm">
                    Operational systems consulting for scaling SaaS companies
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end justify-start">
                <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-2">
                  System Momentum Score
                </p>
                <div className="flex items-end gap-1.5">
                  <span
                    className="font-display font-bold text-copper leading-none"
                    style={{ fontSize: "3.5rem" }}
                  >
                    6.8
                  </span>
                  <span className="text-starlight/40 text-xl font-display mb-1">/ 10</span>
                </div>
              </div>
            </div>

            {/* Layer score bars */}
            <div className="border-t border-starlight/8 pt-5 mb-5">
              <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-4">
                Layer Scores
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {layerScores.map((layer) => (
                  <div key={layer.name} className="flex items-center gap-3">
                    <span className="w-14 text-xs font-display font-semibold text-starlight/60 shrink-0">
                      {layer.name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-starlight/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-copper transition-all"
                        style={{ width: `${layer.score * 10}%` }}
                        role="progressbar"
                        aria-valuenow={layer.score}
                        aria-valuemin={0}
                        aria-valuemax={10}
                        aria-label={`${layer.name}: ${layer.score} out of 10`}
                      />
                    </div>
                    <span className="text-sm font-display font-semibold text-copper w-6 text-right shrink-0">
                      {layer.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Constraint + shift + impact */}
            <div className="border-t border-starlight/8 pt-5 space-y-4">
              <InsightRow
                label="Primary Constraint"
                text="Messaging emphasizes operational expertise before clearly identifying the operational problems experienced by SaaS leadership teams."
              />
              <InsightRow
                label="Highest Leverage Shift"
                text="Reframe the messaging around the operational visibility problems experienced during rapid SaaS growth."
              />
              <div>
                <p className="text-xs font-display font-semibold tracking-widest text-starlight/40 uppercase mb-2">
                  Estimated Momentum Impact
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Signal improvement", level: "High" },
                    { label: "Orbit improvement", level: "High" },
                    { label: "Gravity improvement", level: "Medium" },
                  ].map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-starlight/10 bg-deep-space/50 px-3 py-1 text-xs font-display font-medium text-starlight/60"
                    >
                      {item.label}
                      <span
                        className={
                          item.level === "High" ? "font-semibold text-copper" : "text-starlight/40"
                        }
                      >
                        · {item.level}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ReportCard>

          {/* ── System Map ── */}
          <ReportCard label="System Map">
            <p className="text-starlight/70 text-sm leading-relaxed mb-5">
              The Cosmic Reach Clarity Framework evaluates four structural forces within a business
              system.
            </p>
            <div
              className="flex items-center gap-2 flex-wrap mb-6 text-sm font-display font-semibold"
              aria-label="Framework sequence: Signal, Gravity, Orbit, Thrust"
            >
              {["Signal", "Gravity", "Orbit", "Thrust"].map((layer, i, arr) => (
                <span key={layer} className="flex items-center gap-2">
                  <span className="text-copper">{layer}</span>
                  {i < arr.length - 1 && (
                    <span className="text-starlight/25" aria-hidden="true">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {layerScores.map((layer) => (
                <div
                  key={layer.name}
                  className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4"
                >
                  <p className="text-sm font-display font-semibold text-copper mb-1">
                    {layer.name}
                  </p>
                  <p className="text-sm text-starlight/60">{layer.description}</p>
                </div>
              ))}
            </div>
            <p className="text-starlight/40 text-xs mt-4 leading-relaxed">
              Misalignment between these forces creates friction that slows growth momentum.
            </p>
          </ReportCard>

          {/* ── Mission Context ── */}
          <ReportCard label="Mission Context">
            <div className="space-y-3 text-starlight/70 text-sm leading-relaxed">
              <p>
                AtlasOps provides operational consulting for SaaS companies experiencing rapid
                growth but struggling with internal coordination, reporting clarity, and scalable
                processes.
              </p>
              <p>
                While the firm has strong expertise, inbound leads are inconsistent and the sales
                cycle is longer than expected.
              </p>
              <p>
                Leadership believes the issue is not capability but clarity. The messaging and
                customer journey may not clearly communicate the value of the service.
              </p>
              <p>
                This report analyzes the business using the Cosmic Reach Clarity Framework to
                identify where friction exists in the system and where momentum can be restored.
              </p>
            </div>
          </ReportCard>

          {/* ── System Momentum Scorecard ── */}
          <ReportCard label="System Momentum Scorecard">
            <div className="space-y-4">
              {layerScores.map((layer) => (
                <div
                  key={layer.name}
                  className="rounded-xl border border-starlight/8 bg-deep-space/40 p-5"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-display font-semibold text-starlight">
                      {layer.name}
                    </h3>
                    <span className="text-copper font-display font-bold text-base shrink-0">
                      {layer.score} / 10
                    </span>
                  </div>
                  <p className="text-starlight/60 text-sm leading-relaxed mb-3">
                    {layer.scorecard}
                  </p>
                  <div className="border-t border-starlight/8 pt-3">
                    <p className="text-xs font-display font-semibold tracking-widest text-copper/60 uppercase mb-1">
                      Opportunity
                    </p>
                    <p className="text-starlight/70 text-sm leading-relaxed">{layer.opportunity}</p>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* ── Deep Analyses ── */}
          {deepAnalyses.map((analysis) => (
            <ReportCard key={analysis.layer} label={`${analysis.layer} Analysis`}>
              <div className="flex items-center justify-between gap-3 mb-5">
                <p className="text-starlight/60 text-sm">
                  {layerScores.find((l) => l.name === analysis.layer)?.description}
                </p>
                <span className="text-copper font-display font-bold text-base shrink-0">
                  {analysis.score} / 10
                </span>
              </div>
              <div className="space-y-3">
                <AnalysisSubRow label="Observed Friction" text={analysis.observed} />
                <AnalysisSubRow label="Why It Matters" text={analysis.why} />
                <AnalysisSubRow label="Recommended Shift" text={analysis.shift} accent />
              </div>
            </ReportCard>
          ))}

          {/* ── Priority Actions ── */}
          <ReportCard label="Priority Actions">
            <ol className="space-y-3" aria-label="Prioritized actions">
              {priorityActions.map((action, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="font-display font-bold text-copper text-sm w-5 shrink-0 mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-starlight/80 text-sm leading-relaxed">{action}</p>
                </li>
              ))}
            </ol>
          </ReportCard>

          {/* ── Implementation Path ── */}
          <ReportCard label="Implementation Path">
            <p className="text-starlight/60 text-sm leading-relaxed mb-6">
              The following plan outlines specific actions your team can begin implementing
              immediately. Each phase builds on the last and is designed to be executed
              in sequence over 8 weeks.
            </p>
            <div className="space-y-5">
              {implementationPhases.map((phase) => (
                <div
                  key={phase.phase}
                  className="rounded-xl border border-starlight/8 bg-deep-space/40 p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center rounded-full bg-copper/15 px-2.5 py-0.5 text-xs font-display font-semibold text-copper">
                      {phase.phase}
                    </span>
                    <p className="font-display font-semibold text-starlight text-sm">
                      {phase.title}
                    </p>
                  </div>
                  <ul className="space-y-2 ml-1">
                    {phase.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3 text-starlight/70 text-sm leading-relaxed">
                        <span className="text-copper/60 text-xs mt-1 shrink-0" aria-hidden="true">&#9670;</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ReportCard>

          {/* ── Sprint Recommendation ── */}
          <ReportCard label="Recommended Engagement">
            <div className="rounded-xl border border-copper/25 bg-copper/5 p-5 mb-4">
              <p className="font-display font-bold text-copper text-lg mb-2">
                {sprintRecommendation.name}
              </p>
              <p className="text-starlight/70 text-sm leading-relaxed">
                {sprintRecommendation.reasoning}
              </p>
            </div>
            <div className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4">
              <p className="text-xs font-display font-semibold tracking-widest text-copper/60 uppercase mb-1.5">
                Next Step
              </p>
              <p className="text-starlight/80 text-sm leading-relaxed">
                {sprintRecommendation.nextStep}
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
              <p className="text-starlight/50 text-xs mt-0.5">Clarity creates trajectory.</p>
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
              Start Your Clarity Audit
            </h2>
            <p className="text-starlight/70 text-base mb-2" style={{ textWrap: "pretty" }}>
              The Clarity Audit is a structured diagnostic that reveals exactly where momentum is
              breaking down inside your business.
            </p>
            <p className="text-starlight/60 text-sm mb-8" style={{ textWrap: "pretty" }}>
              If your business feels like it should be working better than it is, this is where to start.
            </p>
            <CTAButton label="Start the Clarity Audit" variant="primary" />
            <p className="mt-3 text-xs text-starlight/50">
              3&ndash;5 day turnaround &middot; Structured clarity report included
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
