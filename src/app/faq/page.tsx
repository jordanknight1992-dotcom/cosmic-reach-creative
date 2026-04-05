import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Clarity Audit, 30-Day Rebuild & Continued Optimization",
  description:
    "Answers to common questions about the $150 Clarity Audit, 30-Day Rebuild, continued optimization at $750/month, Mission Control, and how Cosmic Reach Creative works with businesses.",
  alternates: { canonical: `${siteConfig.domain}/faq` },
};

const faqs: { question: string; answer: string; signals?: string[]; closing?: string }[] = [
  {
    question: "What does the $150 Clarity Audit include?",
    answer:
      "A structured diagnostic that evaluates your business across four layers: whether your messaging lands (Signal), whether your offer converts (Gravity), whether your site guides visitors to act (Orbit), and whether you have performance visibility (Thrust). Each layer is scored 0-10.\n\nYou receive a written report with root-cause findings and a prioritized path forward. Delivered in 3-5 business days.",
  },
  {
    question: "What happens after the audit?",
    answer:
      "You receive the report and can act on it independently. Many businesses do.\n\nIf the findings reveal deeper structural work, the next step is a 30-Day Rebuild. The audit fee is credited toward the rebuild. There is no obligation to continue.",
  },
  {
    question: "What does a 30-Day Rebuild include?",
    answer:
      "The complete growth infrastructure rebuilt from a single strategic foundation. This includes a brand system (positioning, voice, visual identity, and guidelines), website design and development, sales materials, lead capture, and Mission Control.\n\nRebuilds are completed in about 30 days and range from $4,000 to $8,000 depending on scope.",
  },
  {
    question: "What is Mission Control?",
    answer:
      "Mission Control is a live dashboard included with every rebuild. It tracks leads, shows where they came from, monitors site health, and gives you a clear view of what your site is doing.\n\nAlso available as a standalone subscription at $150/month for any business. Free for all Cosmic Reach Creative-built websites.",
  },
  {
    question: "What does the $750/month continued optimization include?",
    answer:
      "Hands-on performance monitoring and strategic improvement after the rebuild. This includes tracking leads and sources, monitoring site performance, improving search visibility, making updates, and recommending what to focus on next.\n\nDesigned for businesses that want the system to keep improving without managing it themselves.",
  },
  {
    question: "Do I need continued optimization after a rebuild?",
    answer:
      "No. The rebuild is designed to stand on its own. Mission Control is included at launch so you have visibility from day one.\n\nContinued optimization is for businesses that want ongoing improvement, search visibility growth, and someone keeping the system tuned over time.",
  },
  {
    question: "Who is this built for?",
    answer:
      "Businesses with traction and friction. Revenue exists. Customers exist. But growth has plateaued and the system underneath is not keeping up.",
    signals: [
      "The site looks fine but leads have slowed",
      "People visit but do not understand why you are worth choosing",
      "Marketing activity is happening but results are flat",
      "You cannot tell which pages or channels are producing results",
    ],
    closing:
      "If those patterns sound familiar, the Clarity Audit is designed to find the root constraint and show you where to focus.",
  },
  {
    question: "How long does the audit take?",
    answer:
      "3-5 business days after the intake form is submitted. You receive a written report with scored findings and prioritized recommendations.",
  },
  {
    question: "Is this marketing consulting?",
    answer:
      "The issue is usually not marketing tactics. It is structural. Messaging that has drifted. An offer that creates interest but not action. A site that looks fine but does not convert. No visibility into what is working.\n\nCosmic Reach diagnoses the structural constraint and rebuilds the infrastructure. The result is a system that works together, not a collection of disconnected tactics.",
  },
  {
    question: "Do you only work with businesses in Memphis?",
    answer:
      "No. Cosmic Reach Creative is headquartered in Memphis, Tennessee, but we work with businesses nationwide. All engagements are delivered remotely.",
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
            <h1 id="faq-hero" className="text-copper">Common Questions</h1>
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
            <p className="text-sm text-starlight/60 mb-4">
              Still have questions?
            </p>
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
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-5 py-2.5 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
              >
                Start with the Audit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
