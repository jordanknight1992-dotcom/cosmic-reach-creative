import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/sections/PageHero";
import { SITE } from "@/lib/constants";
import { ContactForm } from "./ContactForm";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "If your organization feels busy but not aligned, that is the moment we step in. Tell us what you are navigating.",
  path: "/contact",
  heroImage: "/images/hero/contact.jpg",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Cosmic Reach"
        lead="If your organization feels busy but not aligned, that is the moment we step in."
        imageSrc="/images/hero/contact.jpg"
        imageAlt="Contact Cosmic Reach Creative"
      />

      <Section background="surface">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="text-muted text-lg leading-relaxed mb-6">
              Tell us what you&#39;re navigating and we&#39;ll help you determine whether a Signal Session makes sense.
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
