import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { AuditIntakeForm } from "@/components/AuditIntakeForm";

export const metadata: Metadata = {
  title: "Audit Intake Form",
  description:
    "Complete the Business Clarity Audit intake form so we can begin your diagnostic.",
  alternates: { canonical: `${siteConfig.domain}/audit-intake` },
};

export default function AuditIntakePage() {
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
            <h1 className="text-copper">Business Clarity Audit Intake</h1>
            <p className="text-starlight/80 text-base sm:text-lg mt-3">
              Complete this form so we can begin your diagnostic. The more context you provide, the more precise your Clarity Report will be.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-10 sm:py-16">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Icon name="document" size={24} className="opacity-80" />
              <h2>Tell Us About Your Business</h2>
            </div>
            <p className="text-starlight/70 text-base text-center mb-10">
              This information is used exclusively to conduct your Business Clarity Audit. We review every submission personally.
            </p>
            <AuditIntakeForm />
          </div>
        </div>
      </section>
    </main>
  );
}
