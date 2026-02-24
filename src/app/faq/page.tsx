import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Clear expectations make better partnerships. Common questions about Cosmic Reach Creative.",
  alternates: { canonical: `${siteConfig.domain}/faq` },
};

const faqs = [
  {
    question: "Is this marketing consulting?",
    answer:
      "No. Marketing is often where operational issues show up first, but the work focuses on the system underneath performance.",
  },
  {
    question: "Do I need a Sprint after the Clarity Session?",
    answer:
      "No. Many clients use the Clarity Session alone and implement internally.",
  },
  {
    question: "How quickly can we start?",
    answer: "Intro calls can usually be scheduled within a week.",
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
            <h1 id="faq-hero" className="text-copper">Questions From Mission Control</h1>
            <p className="text-starlight/80 text-lg sm:text-xl mt-3">
              Clear expectations make better partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ items */}
      <section className="py-10 sm:py-16" aria-label="Frequently asked questions">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {faqs.map((faq, i) => (
              <article
                key={i}
                className="border-b border-starlight/8 pb-6 last:border-0"
              >
                <h2 className="font-display font-semibold text-xl mb-2">
                  {faq.question}
                </h2>
                <p className="text-starlight/70">{faq.answer}</p>
              </article>
            ))}
            <div className="pt-2 flex items-center gap-2">
              <Icon name="spark" size={18} className="opacity-60" />
              <p className="text-sm text-starlight/50">
                More questions? Reach out directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
