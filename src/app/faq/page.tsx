import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Business Clarity Audit & Marketing Strategy Questions",
  description:
    "Answers to common questions about the Business Clarity Audit, implementation sprints, marketing strategy consulting, and how Cosmic Reach Creative works with founders and growing businesses.",
  alternates: { canonical: `${siteConfig.domain}/faq` },
};

const faqs = [
  {
    question: "What is a Business Clarity Audit?",
    answer:
      "A Business Clarity Audit is a structured diagnostic that evaluates your messaging, offer positioning, customer journey, and growth levers using the Launch Sequence framework. The goal is to identify what’s working, what isn’t, and what to address first.\n\nYou receive a scored diagnosis and a prioritized action plan. Even if you never work with Cosmic Reach again, you’ll walk away knowing exactly where your business is getting stuck and what to change.",
  },
  {
    question: "How long does the audit take?",
    answer:
      "Most Business Clarity Audits are completed within 3–5 business days after the intake form is submitted. You’ll receive a scored report covering all four layers of the Launch Sequence, with prioritized recommendations you can act on immediately.",
  },
  {
    question: "Is the audit just advice?",
    answer:
      "No. The audit identifies the structural issues slowing growth and delivers a prioritized roadmap for improvement.\n\nSome teams implement the recommendations internally. Others move into Sprints where Cosmic Reach helps rebuild the underlying structure. Either way, the audit gives you immediate direction on what to address first.",
  },
  {
    question: "Is this marketing consulting?",
    answer:
      "Not exactly. Marketing issues often surface first, but the real constraint is usually in the structure beneath them. Messaging, offer design, the customer journey, and performance visibility all interact as connected forces.\n\nCosmic Reach diagnoses which force is weakest and identifies what to address first.",
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
      "Marketing activity that isn’t producing results",
      "Teams working hard but priorities constantly shifting",
      "Customers showing interest but hesitating before buying",
      "Messaging or offers that feel unclear",
    ],
    closing:
      "If those patterns sound familiar, the Business Clarity Audit is designed to diagnose exactly why.",
  },
  {
    question: "Where is Cosmic Reach Creative located?",
    answer:
      "Cosmic Reach Creative is headquartered in Memphis, Tennessee. We work with founders and growing businesses nationwide through remote engagements including structured audits, strategy sprints, and ongoing advisory retainers.",
  },
  {
    question: "What's the difference between a marketing consultant and a marketing agency?",
    answer:
      "A marketing agency typically executes tactics: running ads, managing social media, creating content. A marketing consultant, like Cosmic Reach Creative, works at the strategic level, designing the systems and architecture that make those tactics effective.\n\nWe focus on messaging clarity, offer design, customer journey optimization, and growth visibility. The goal is to build the foundation that makes every marketing dollar and effort more productive.",
  },
];

export default function FAQPage() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer.replace(/\n\n/g, " "),
            }
          }))
        })}}
      />
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
