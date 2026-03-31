import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Audit, Rebuild & Ongoing Performance",
  description:
    "Answers to common questions about the $150 website audit, 30-day rebuild process, ongoing performance at $750/month, and how Cosmic Reach Creative works with small businesses.",
  alternates: { canonical: `${siteConfig.domain}/faq` },
};

const faqs: { question: string; answer: string; signals?: string[]; closing?: string }[] = [
  {
    question: "What does the $150 audit include?",
    answer:
      "A focused review of your website and messaging. You will see where visitors get stuck, what is unclear, what is limiting inquiries, and what to fix first.\n\nDelivered as a written report in 3–5 business days. Even if you never work with us again, you will know exactly what needs to change.",
  },
  {
    question: "What happens after the audit?",
    answer:
      "You receive a report with clear findings and priority fixes. If deeper work is needed, the next step is a full rebuild. The audit fee is credited toward any rebuild engagement.\n\nMany businesses use the audit alone and make changes on their own. There is no obligation to move forward.",
  },
  {
    question: "What does a full rebuild include?",
    answer:
      "A full rebuild includes a brand system (positioning, voice, visual identity, and guidelines), website design and development, sales materials, lead capture, and performance visibility. Everything is built to work together.\n\nRebuilds are completed in about 30 days and range from $4,000 to $8,000 depending on scope.",
  },
  {
    question: "What is Mission Control?",
    answer:
      "Mission Control is included with every rebuild. It captures leads from your website, shows where those leads came from, and highlights which pages are driving action.\n\nIt gives you a clear view of what your site is doing after launch, without digging through multiple tools.",
  },
  {
    question: "What does the $750/month ongoing service include?",
    answer:
      "Ongoing performance monitoring and improvement after the rebuild. This includes tracking leads and sources, monitoring site performance, improving search visibility, making small updates, and recommending what to focus on next.\n\nIt is designed for businesses that want continued visibility and improvement without managing it themselves.",
  },
  {
    question: "Do I need the ongoing service after a rebuild?",
    answer:
      "No. The rebuild is designed to stand on its own. Mission Control is included at launch so you have visibility from day one.\n\nThe ongoing service is for businesses that want continued improvement, SEO progress, and someone keeping an eye on performance over time.",
  },
  {
    question: "Who is this best for?",
    answer:
      "Cosmic Reach works best with small businesses and founders who know their website is not converting the way it should.",
    signals: [
      "The site looks fine but leads are not coming in",
      "Messaging feels unclear or unfocused",
      "There is no visibility into what is working",
      "Marketing activity is not producing results",
    ],
    closing:
      "If those patterns sound familiar, the $150 audit is designed to show you exactly what is going on and what to fix first.",
  },
  {
    question: "How long does the audit take?",
    answer:
      "Most audits are completed within 3–5 business days after the intake form is submitted. You receive a written report with clear findings and prioritized recommendations.",
  },
  {
    question: "Is this marketing consulting?",
    answer:
      "Not exactly. The issue is usually not marketing tactics. It is something deeper — unclear messaging, weak site structure, or no path to action.\n\nCosmic Reach identifies what is actually holding the site back and fixes it. The result is a website that works as a system, not just a set of pages.",
  },
  {
    question: "Do you only work with businesses in Memphis?",
    answer:
      "No. Cosmic Reach Creative is headquartered in Memphis, Tennessee, but we work with small businesses nationwide. All engagements are delivered remotely.",
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
