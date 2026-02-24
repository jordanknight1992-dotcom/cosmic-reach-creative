import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.siteName}.`,
  alternates: { canonical: `${siteConfig.domain}/privacy` },
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="pt-32 pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-starlight/70">
            <p>
              {siteConfig.siteName} respects your privacy. This policy describes how we handle information when you visit our website.
            </p>

            <h2 className="text-xl mt-8">Information We Collect</h2>
            <p>
              We use Google Analytics (GA4) with anonymized IP addresses to understand how visitors use our site. This helps us improve the experience. We do not collect personal information through the site itself.
            </p>

            <h2 className="text-xl mt-8">Cookies</h2>
            <p>
              Google Analytics may set cookies to distinguish unique users and sessions. These cookies do not personally identify you. You can control cookie behavior through your browser settings.
            </p>

            <h2 className="text-xl mt-8">Third-Party Services</h2>
            <p>
              Our site links to Calendly for scheduling. When you use Calendly, their own privacy policy applies. We do not control or store information submitted through Calendly on our website.
            </p>

            <h2 className="text-xl mt-8">Contact</h2>
            <p>
              If you have privacy-related questions, contact us at{" "}
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
