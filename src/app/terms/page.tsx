import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${siteConfig.siteName}.`,
  alternates: { canonical: `${siteConfig.domain}/terms` },
};

export default function TermsPage() {
  return (
    <main id="main-content" className="pt-32 pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="mb-4">Terms of Service</h1>
          <p className="text-starlight/40 text-sm mb-8">Last updated: March 22, 2026</p>

          <div className="space-y-6 text-starlight/70">
            <p>
              By using the {siteConfig.siteName} website or purchasing our services, you agree to these terms.
            </p>

            <h2 className="text-xl mt-8">Services</h2>
            <p>
              {siteConfig.siteName} provides marketing strategy consulting services including Business Clarity Audits, implementation sprints, and ongoing advisory retainers. All services are delivered remotely. Specific deliverables, timelines, and scope are defined at the time of engagement.
            </p>

            <h2 className="text-xl mt-8">Use of This Site</h2>
            <p>
              This website is provided for informational purposes. The content describes our services and approach to marketing strategy consulting. It is not a substitute for professional advice specific to your situation.
            </p>

            <h2 className="text-xl mt-8">Bookings &amp; Payments</h2>
            <p>
              Session bookings are subject to availability. Paid sessions (such as the Business Clarity Audit) require payment via Stripe prior to or at the time of booking. The $150 audit fee is credited toward any Sprint engagement purchased within 60 days of audit delivery.
            </p>
            <p>
              Free introductory calls (Signal Check) do not require payment. You may reschedule or cancel a booking by contacting us at least 24 hours in advance.
            </p>

            <h2 className="text-xl mt-8">Deliverables &amp; Intellectual Property</h2>
            <p>
              Reports, audits, and strategy documents delivered to you as part of a paid engagement are for your internal business use. You may share them within your organization but may not resell, redistribute, or publish them without written permission.
            </p>
            <p>
              All content, design, frameworks (including the Launch Sequence), and materials on this website are owned by {siteConfig.siteName}. You may not reproduce, distribute, or modify site content without written permission.
            </p>

            <h2 className="text-xl mt-8">Refunds</h2>
            <p>
              If we are unable to deliver the agreed-upon service, you will receive a full refund. Once a Business Clarity Audit report has been delivered, the fee is non-refundable. Sprint engagement refunds are handled on a case-by-case basis based on work completed.
            </p>

            <h2 className="text-xl mt-8">External Links &amp; Third-Party Services</h2>
            <p>
              This site integrates with third-party services including Google Calendar, Google Meet, and Stripe. We are not responsible for the content, practices, or availability of external services. Your use of those services is governed by their respective terms.
            </p>

            <h2 className="text-xl mt-8">Limitation of Liability</h2>
            <p>
              {siteConfig.siteName} provides this website and its services on an as-is basis. While we strive for accuracy and quality in all deliverables, we make no guarantees about specific business outcomes resulting from our recommendations. Our liability is limited to the fees paid for the specific service in question.
            </p>

            <h2 className="text-xl mt-8">Governing Law</h2>
            <p>
              These terms are governed by the laws of the State of Tennessee. Any disputes will be resolved in the courts of Shelby County, Tennessee.
            </p>

            <h2 className="text-xl mt-8">Contact</h2>
            <p>
              Questions about these terms can be directed to{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-copper hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
