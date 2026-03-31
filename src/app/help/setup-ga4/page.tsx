import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "How to Find Your GA4 Property ID | Setup Guide",
  description:
    "Step-by-step instructions on how to find your Google Analytics 4 Property ID for Mission Control setup.",
  alternates: { canonical: `${siteConfig.domain}/help/setup-ga4` },
};

export default function SetupGA4Page() {
  return (
    <main id="main-content">
      <section className="py-16 sm:py-24 bg-section-light">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <a
              href="/help"
              className="text-copper text-sm font-display font-medium hover:underline mb-6 inline-block"
            >
              &larr; Back to Help
            </a>

            <h1 className="text-navy mb-2">
              How to Find Your GA4 Property ID
            </h1>
            <p className="text-navy/60 text-base mb-10">
              Your GA4 Property ID connects Mission Control to your Google Analytics data. Here is how to find it.
            </p>

            <div className="space-y-8">
              <Step
                number={1}
                title="Sign in to Google Analytics"
                description="Go to analytics.google.com and sign in with the Google account that has access to your website's analytics."
              />

              <Step
                number={2}
                title="Open Admin Settings"
                description='Click the gear icon labeled "Admin" in the bottom-left corner of the sidebar.'
              />

              <Step
                number={3}
                title="Select Your Property"
                description='In the Property column (middle column), make sure the correct property is selected. If you have multiple websites, use the dropdown to choose the right one.'
              />

              <Step
                number={4}
                title="Go to Property Settings"
                description='Click "Property Settings" in the Property column. You will see your Property ID displayed near the top — it is a number like 123456789.'
              />

              <Step
                number={5}
                title="Copy the Property ID"
                description="Copy just the number (no dashes or extra characters) and paste it into the GA4 Property ID field in Mission Control."
              />
            </div>

            <div className="mt-12 rounded-xl border border-copper/20 bg-copper/5 p-6">
              <h3 className="font-display font-semibold text-sm text-navy mb-2">
                Do not have Google Analytics yet?
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed mb-3">
                If your website does not have Google Analytics set up, you will need to create an account first.
              </p>
              <ol className="text-navy/60 text-sm space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-copper hover:underline">analytics.google.com</a></li>
                <li>Click &quot;Start measuring&quot;</li>
                <li>Create an account name (your business name works)</li>
                <li>Create a property (your website name)</li>
                <li>Add a data stream for your website URL</li>
                <li>Copy the Measurement ID and add the tracking code to your site</li>
                <li>Once data starts flowing, come back and enter your Property ID</li>
              </ol>
            </div>

            <div className="mt-8 text-center">
              <p className="text-navy/40 text-xs">
                This connection is optional. Mission Control tracks form submissions automatically without it.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-copper text-deep-space text-sm font-display font-bold flex items-center justify-center">
        {number}
      </div>
      <div>
        <h3 className="font-display font-semibold text-base text-navy mb-1">{title}</h3>
        <p className="text-navy/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
