import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name}. How we collect, use, and protect your information.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Section className="pt-32 md:pt-40">
      <div className="max-w-3xl">
        <h1 className="font-display font-bold text-3xl md:text-4xl text-starlight mb-8">
          Privacy Policy
        </h1>
        <p className="text-muted text-sm mb-8">Last updated: February 2026</p>

        <div className="prose-custom space-y-8">
          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              Introduction
            </h2>
            <p className="text-muted text-base leading-relaxed">
              {SITE.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy. This policy explains how we collect, use, and protect information when you visit our website or use our services.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              Information We Collect
            </h2>
            <p className="text-muted text-base leading-relaxed mb-3">
              We collect information you voluntarily provide through our forms, including:
            </p>
            <ul className="space-y-2 text-muted text-base" role="list">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span>Name and email address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span>Company and role information</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span>Project details and challenges you share</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-spark-red shrink-0" aria-hidden="true" />
                <span>Interest segment preferences</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              How We Use Your Information
            </h2>
            <p className="text-muted text-base leading-relaxed">
              We use the information you provide to respond to your inquiries, schedule Clarity Sessions, and send relevant communications based on your selected interests. We do not sell your personal information.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              Data Storage
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Form submissions are stored securely on our servers. We implement reasonable security measures to protect your information from unauthorized access.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              Your Rights
            </h2>
            <p className="text-muted text-base leading-relaxed">
              You may request to view, update, or delete your personal information at any time by contacting us at{" "}
              <a href={`mailto:${SITE.email}`} className="text-copper hover:text-starlight transition-colors duration-200">
                {SITE.email}
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              Changes to This Policy
            </h2>
            <p className="text-muted text-base leading-relaxed">
              We may update this policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-starlight mb-3">
              Contact
            </h2>
            <p className="text-muted text-base leading-relaxed">
              Questions about this policy? Reach out to{" "}
              <a href={`mailto:${SITE.email}`} className="text-copper hover:text-starlight transition-colors duration-200">
                {SITE.email}
              </a>.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
