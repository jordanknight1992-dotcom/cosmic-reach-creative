import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Whether you're exploring a system redesign or just need clarity, the first step is simple.",
  alternates: { canonical: `${siteConfig.domain}/contact` },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/12-contact-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-copper">Open a Channel</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              Whether you&apos;re exploring a system redesign or just need clarity, the first step is simple.
            </p>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Icon name="rocket" size={24} className="opacity-80" />
              <h2>Start the Conversation</h2>
            </div>
            <p className="text-starlight/70 text-base text-center mb-8">
              Tell us a bit about what you&apos;re working through. We&apos;ll follow up within one business day.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
