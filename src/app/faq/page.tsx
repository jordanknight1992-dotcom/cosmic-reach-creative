import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Business Clarity Audit Questions",
  description:
    "Clear expectations make better partnerships. Common questions about Cosmic Reach Creative.",
  alternates: { canonical: `${siteConfig.domain}/faq` },
};

const faqs = [
  {
    question: "What is a Business Clarity Audit?",
    answer:
      "A Business Clarity Audit is a structured diagnostic of the system underneath your business. We analyze your messaging, offer positioning, customer journey, and growth signals using the Cosmic Reach Clarity Framework. The goal is to identify exactly where momentum is breaking down and what to fix first.\n\nYou receive a clear diagnosis and a prioritized improvement roadmap. Even if you never work with Cosmic Reach again, you’ll walk away knowing exactly where your business is losing momentum and what to fix first.",
  },
  {
    question: "How long does the audit take?",
    answer:
      "Most Business Clarity Audits are completed within 3–5 business days after the intake form is submitted. You’ll receive a structured clarity report outlining where momentum is breaking down and the highest-impact improvements to make first.",
  },
  {
    question: "Is the audit just advice?",
    answer:
      "No. The audit identifies the structural issues slowing growth and delivers a clear roadmap for improvement.\n\nSome teams implement the recommendations internally. Others choose to move into implementation sprints where Cosmic Reach helps rebuild the underlying systems. Either way, the audit gives you immediate clarity on what to fix first.",
  },
  {
    question: "Is this marketing consulting?",
    answer:
      "Not exactly. Marketing issues often surface first, but the real constraint is usually in the structure beneath them. Messaging, offer design, the customer journey, and performance visibility all interact as a system.\n\nCosmic Reach diagnoses where that system is breaking down and identifies what to fix first.",
  },
  {
    question: "Do I need a Sprint after the Business Clarity Audit?",
    answer:
      "No. Many teams use the audit alone and implement the roadmap internally.\n\nIf deeper support is needed, implementation happens through structured Sprints designed to fix the highest-impact issues identified in the audit. You decide whether to move forward after the audit.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Cosmic Reach works best with founders and leadership teams who know something in their business isn’t converting the way it should.",
    signals: [
      "Marketing activity that isn’t producing momentum",
      "Teams working hard but priorities constantly shifting",
      "Customers showing interest but hesitating before buying",
      "Messaging or offers that feel unclear",
    ],
    closing:
      "If those patterns sound familiar, the Business Clarity Audit is designed to diagnose exactly why.",
  },
];

export default function FAQPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="faq-hero">
        <div className="absolute inset-0">
          <Image
            src="/images/10-network-texture.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <h1 id="faq-hero" className="text-copper">Transmissions From Mission Control</h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3">
              Clear expectations make better partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ items */}
      <section className="py-12 sm:py-20" aria-label="Frequently asked questions">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-8">
            {faqs.map((faq, i) => (
              <article
                key={i}
                className="rounded-2xl border border-starlight/8 bg-navy/40 p-6 sm:p-8 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/20"
              >
                <h3 className="font-display font-semibold text-xl text-starlight mb-3">
                  {faq.question}
                </h3>
                {faq.answer.split("\n\n").map((para, j) => (
                  <p key={j} className="text-starlight/70 text-base mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
                {"signals" in faq && faq.signals && (
                  <ul className="mt-4 space-y-2.5 mb-4">
                    {faq.signals.map((signal, j) => (
                      <li key={j} className="flex items-start gap-3 text-starlight/70 text-sm">
                        <span className="text-copper mt-1 text-xs shrink-0" aria-hidden="true">&#9670;</span>
                        {signal}
                      </li>
                    ))}
                  </ul>
                )}
                {"closing" in faq && faq.closing && (
                  <p className="text-starlight/70 text-base">{faq.closing}</p>
                )}
              </article>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Icon name="spark" size={18} className="opacity-60" />
              <p className="text-sm text-starlight/60">
                Still have questions?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="text-copper hover:underline text-sm font-display font-medium"
              >
                Reach out directly
              </Link>
              <span className="text-starlight/20 hidden sm:inline">|</span>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-5 py-2.5 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
              >
                Start the Clarity Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
