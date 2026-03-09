import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "Clarity Audit Confirmed",
  description:
    "Your Business Clarity Audit is confirmed. Complete the intake form to begin.",
  alternates: { canonical: `${siteConfig.domain}/next-steps` },
};

const steps = [
  { number: 1, label: "Intake Form", active: true },
  { number: 2, label: "Audit Analysis", active: false },
  { number: 3, label: "Clarity Report", active: false },
];

const frameworkAreas = [
  { name: "Signal", description: "Messaging clarity and positioning", icon: "compass" },
  { name: "Gravity", description: "Offer strength and value perception", icon: "orbit" },
  { name: "Orbit", description: "Customer journey and conversion flow", icon: "gears" },
  { name: "Thrust", description: "Growth opportunities and system improvements", icon: "signal" },
];

const reportIncludes = [
  "Messaging clarity insights",
  "Offer positioning improvements",
  "Customer journey friction points",
  "Growth opportunities within the business system",
  "Prioritized recommendations for improvement",
];

const sprintOptions = [
  "30 Day Direction Sprint",
  "60 Day Alignment Sprint",
  "90 Day Systems Sprint",
];

export default function NextStepsPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/01-home-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-12 sm:pb-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-copper">Your Business Clarity Audit Is Confirmed</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              Thank you for purchasing a Business Clarity Audit from Cosmic Reach Creative.
              The next step is providing a few details about your business so the analysis can begin.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8 sm:py-10" aria-label="Audit process steps">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <div className="flex items-start">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-semibold ${
                        step.active
                          ? "bg-copper text-deep-space"
                          : "border border-starlight/20 text-starlight/40"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`mt-2 text-xs font-display font-medium text-center whitespace-nowrap ${
                        step.active ? "text-copper" : "text-starlight/40"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-starlight/10 mx-3 mt-0 mb-5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Step 1 */}
      <section className="py-8 sm:py-10" aria-labelledby="step1-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 id="step1-heading" className="mb-3">
              <span className="text-copper">Step 1</span> — Complete the Intake Form
            </h2>
            <p className="text-starlight/70 mb-4">
              To begin the audit, please provide a few details about your business.
              This information allows us to analyze your messaging, offers, and customer journey before preparing your clarity report.
            </p>
            <p className="text-starlight/70 mb-5">The intake form will ask for:</p>
            <ul className="space-y-2 mb-8">
              {[
                "Your website or product link",
                "A short description of your business",
                "What currently feels stuck or frustrating",
                "Your primary growth goal over the next 6–12 months",
                "Any supporting materials you want us to review",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/80">
                  <span className="text-copper mt-0.5 shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/audit-intake"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
            >
              Complete Intake Form
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <hr className="border-starlight/8" />
      </div>

      {/* Step 2 */}
      <section className="py-8 sm:py-10" aria-labelledby="step2-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 id="step2-heading" className="mb-3">
              <span className="text-starlight/40">Step 2</span> — Analysis and Review
            </h2>
            <p className="text-starlight/70 mb-6">
              Once the intake form is submitted, we begin the Business Clarity Audit.
              During this process we analyze four core areas using the Cosmic Reach Clarity Framework:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {frameworkAreas.map((area) => (
                <div
                  key={area.name}
                  className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-4 text-center"
                >
                  <Icon name={area.icon} size={22} className="opacity-60 mx-auto mb-2" />
                  <p className="font-display font-semibold text-sm text-copper mb-1">{area.name}</p>
                  <p className="text-xs text-starlight/50">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <hr className="border-starlight/8" />
      </div>

      {/* Step 3 */}
      <section className="py-8 sm:py-10" aria-labelledby="step3-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 id="step3-heading" className="mb-3">
              <span className="text-starlight/40">Step 3</span> — Clarity Report Delivery
            </h2>
            <p className="text-starlight/70 mb-4">You will receive a structured report outlining:</p>
            <ul className="space-y-2 mb-5">
              {reportIncludes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/70">
                  <span className="text-copper/60 mt-0.5 shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-starlight/50">
              Typical delivery time is{" "}
              <strong className="text-starlight/70 font-semibold">3–5 business days</strong>{" "}
              after the intake form is submitted.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <hr className="border-starlight/8" />
      </div>

      {/* What Happens Next */}
      <section className="py-8 sm:py-10" aria-labelledby="whats-next-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 id="whats-next-heading" className="mb-3">What Happens Next</h2>
            <p className="text-starlight/70 mb-4">
              After reviewing the Clarity Report, we will discuss the recommended improvements
              and determine whether a focused implementation sprint would accelerate progress.
            </p>
            <p className="text-starlight/70 mb-4">Many clients choose to move forward with a:</p>
            <ul className="space-y-2 mb-4">
              {sprintOptions.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-starlight/70">
                  <span className="text-copper/60 mt-0.5 shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-starlight/50">
              These sprints focus on implementing the highest-impact improvements identified during the audit.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        <hr className="border-starlight/8" />
      </div>

      {/* Questions */}
      <section className="py-8 sm:py-14" aria-labelledby="questions-heading">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="spark" size={20} className="opacity-60" />
              <h2 id="questions-heading">Questions</h2>
            </div>
            <p className="text-starlight/70 mb-3">
              If you have questions before submitting the intake form, feel free to reach out.
            </p>
            <a
              href="mailto:jordan@cosmicreachcreative.com"
              className="text-copper hover:underline text-base"
            >
              jordan@cosmicreachcreative.com
            </a>
            <p className="mt-6 text-starlight/50 text-sm">
              We look forward to helping you restore momentum and build a system that supports real progress.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
