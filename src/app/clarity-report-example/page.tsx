import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { CTAButton } from "@/components/CTAButton";
import { PrintButton } from "@/components/PrintButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Example Business Clarity Report | See What You Receive",
  description:
    "See a real example of what the Business Clarity Audit delivers — a structured diagnostic showing where growth momentum is being lost and what to fix first.",
  alternates: { canonical: `${siteConfig.domain}/clarity-report-example` },
};

/* ─── Report data ─── */

const layerScores = [
  {
    name: "Signal",
    score: 6,
    description: "How clearly the business communicates the problem it solves.",
    scorecard:
      "Messaging focuses on operational expertise but does not immediately identify the business problem experienced by SaaS founders and leadership teams.",
    opportunity: "Lead messaging with the operational confusion experienced during scaling.",
  },
  {
    name: "Gravity",
    score: 7,
    description: "How compelling the offer is to the right buyer.",
    scorecard:
      "AtlasOps offers valuable consulting but presents it as an open-ended service rather than a defined transformation.",
    opportunity: "Package consulting into a structured engagement with a clear outcome.",
  },
  {
    name: "Orbit",
    score: 6,
    description: "How smoothly prospects move from awareness to engagement.",
    scorecard:
      "The website explains services but does not guide visitors toward a single clear next step.",
    opportunity: "Introduce a diagnostic entry offer.",
  },
  {
    name: "Thrust",
    score: 8,
    description: "Where the highest leverage growth opportunities exist.",
    scorecard:
      "AtlasOps has strong expertise and significant growth potential if positioning improves.",
    opportunity: "Turn consulting knowledge into structured engagements.",
  },
];

const deepAnalyses = [
  {
    layer: "Signal",
    score: 6,
    observed:
      "AtlasOps messaging describes operational consulting capabilities but does not quickly identify the operational pain experienced by scaling SaaS companies.",
    why: "When messaging leads with expertise instead of the buyer's problem, recognition takes longer and trust builds more slowly.",
    shift:
      "Lead messaging with the operational confusion and reporting challenges experienced during SaaS growth, then position AtlasOps as the system that restores clarity.",
  },
  {
    layer: "Gravity",
    score: 7,
    observed:
      "The consulting engagement is described broadly, forcing buyers to imagine the scope and outcomes.",
    why: "Undefined consulting engagements increase perceived risk.",
    shift:
      "Package the consulting service into a defined operational clarity engagement with a clear transformation outcome.",
  },
  {
    layer: "Orbit",
    score: 6,
    observed:
      "The website explains services but does not guide visitors toward a single conversion action.",
    why: "Multiple navigation paths dilute momentum and reduce conversions.",
    shift:
      "Introduce a diagnostic entry offer such as an Operational Clarity Assessment to simplify the buying decision.",
  },
  {
    layer: "Thrust",
    score: 8,
    observed:
      "AtlasOps has strong expertise that can support scalable growth if packaged correctly.",
    why: "Consulting expertise often remains constrained by time unless it is structured into repeatable engagements.",
    shift:
      "Develop a growth system consisting of a diagnostic entry product followed by deeper implementation engagements.",
  },
];

const priorityActions = [
  "Lead messaging with the operational pain experienced by SaaS leadership teams.",
  "Package consulting services into defined engagements.",
  "Simplify the website conversion path.",
  "Introduce a diagnostic entry product.",
];

const implementationPath = [
  {
    name: "30 Day Direction Sprint",
    focus: "Messaging clarity and offer positioning.",
  },
  {
    name: "60 Day Alignment Sprint",
    focus: "Improving the customer journey and conversion flow.",
  },
  {
    name: "90 Day Systems Sprint",
    focus: "Implementing scalable operational systems.",
  },
  {
    name: "Mission Control Advisory",
    focus: "Ongoing strategic clarity and system optimization as the business grows.",
  },
];

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
      className={`rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-6 sm:p-8 ${className}`}
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
        className="relative overflow-hidden bg-deep-space print:hidden"
        aria-labelledby="report-hero-title"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-navy/60 via-deep-space to-deep-space" />
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
              style={{ textWrap: "balance" }}
            >
              See how the Cosmic Reach Clarity Framework identifies where growth momentum is being
              lost and what to fix first.
            </p>
            <PrintButton />
          </div>
        </div>
      </section>

      {/* ── Print-only header ── */}
      <div className="hidden print:block print:px-0 print:pt-8 print:pb-4 print:border-b print:border-gray-200">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">
          Cosmic Reach Creative
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Business Clarity Report — AtlasOps</h1>
        <p className="text-sm text-gray-500 mt-1">cosmicreachcreative.com</p>
      </div>

      {/* ── Intro explanation (screen only) ── */}
      <div className="print:hidden py-6 sm:py-8">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-copper/25 bg-navy/50 px-6 py-5 flex gap-4 items-start">
              <span className="text-copper text-sm mt-0.5 shrink-0" aria-hidden="true">
                &#9670;
              </span>
              <p className="text-starlight/70 text-sm leading-relaxed">
                <strong className="text-starlight font-display font-semibold">
                  This is a sanitized example report
                </strong>{" "}
                using a fictional company called AtlasOps. It demonstrates the exact structure,
                depth, and format your Business Clarity Audit will deliver — prepared within 3–5
                business days of your submission.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Report Body ── */}
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pb-16 sm:pb-24 print:px-0 print:pb-0">
        <div className="max-w-3xl mx-auto space-y-5 print:space-y-6">

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
            <p className="text-starlight/60 text-sm leading-relaxed mb-5">
              The Clarity Report identifies where momentum is being lost. The next step is
              implementing the highest-impact improvements revealed in the analysis.
            </p>
            <div className="space-y-3">
              {implementationPath.map((step) => (
                <div
                  key={step.name}
                  className="rounded-xl border border-starlight/8 bg-deep-space/40 p-4 flex gap-4 items-start"
                >
                  <span className="text-copper text-xs mt-0.5 shrink-0" aria-hidden="true">
                    &#9670;
                  </span>
                  <div>
                    <p className="font-display font-semibold text-starlight text-sm mb-0.5">
                      {step.name}
                    </p>
                    <p className="text-starlight/60 text-sm">{step.focus}</p>
                  </div>
                </div>
              ))}
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
        className="print:hidden py-14 sm:py-20 bg-navy/30"
        aria-labelledby="report-cta-heading"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="report-cta-heading" className="mb-4">
              Start Your Clarity Audit
            </h2>
            <p className="text-starlight/70 text-base mb-8" style={{ textWrap: "balance" }}>
              If your business feels like it should be working better than it is, the Clarity Audit
              reveals exactly where momentum is being lost and what to fix first.
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
