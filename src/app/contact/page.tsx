import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { SITE } from "@/lib/constants";
import { ContactForm } from "./ContactForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Open channel. Let us assess your orbit. Reach out to Cosmic Reach Creative for consulting, reporting, or systems work.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Section className="pt-32 md:pt-40">
        <SectionHeading
          label="Contact"
          title="Open Channel"
          description="Let's assess your orbit."
        />
      </Section>

      <Section background="surface">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <h2 className="font-display font-bold text-xl text-starlight mb-4">
              Get in touch
            </h2>
            <p className="text-muted text-base mb-6">
              Whether you need consulting, reporting automation, or a systems framework, we are ready to listen.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="text-copper font-display font-semibold text-sm hover:text-starlight transition-colors duration-200"
            >
              {SITE.email}
            </a>
          </div>

          <Card>
            <ContactForm />
          </Card>
        </div>
      </Section>
    </>
  );
}
