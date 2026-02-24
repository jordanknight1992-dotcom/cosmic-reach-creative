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
          <h1 className="mb-8">Terms of Service</h1>

          <div className="space-y-6 text-starlight/70">
            <p>
              By using the {siteConfig.siteName} website, you agree to these terms.
            </p>

            <h2 className="text-xl mt-8">Use of This Site</h2>
            <p>
              This website is provided for informational purposes. The content describes our services and approach to operational consulting. It is not a substitute for professional advice specific to your situation.
            </p>

            <h2 className="text-xl mt-8">Intellectual Property</h2>
            <p>
              All content, design, and materials on this website are owned by {siteConfig.siteName}. You may not reproduce, distribute, or modify site content without written permission.
            </p>

            <h2 className="text-xl mt-8">External Links</h2>
            <p>
              This site links to third-party services like Calendly. We are not responsible for the content or practices of external sites.
            </p>

            <h2 className="text-xl mt-8">Limitation of Liability</h2>
            <p>
              {siteConfig.siteName} provides this website as-is. We make no guarantees about the accuracy or completeness of the information presented.
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
