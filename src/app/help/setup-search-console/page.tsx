import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "How to Find Your Search Console Site URL | Setup Guide",
  description:
    "Step-by-step instructions on how to find your Google Search Console site URL for Mission Control setup.",
  alternates: { canonical: `${siteConfig.domain}/help/setup-search-console` },
};

export default function SetupSearchConsolePage() {
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
              How to Find Your Search Console Site URL
            </h1>
            <p className="text-navy/60 text-base mb-10">
              Your Search Console site URL connects Mission Control to your keyword and search performance data. Here is how to find it.
            </p>

            <div className="space-y-8">
              <Step
                number={1}
                title="Sign in to Google Search Console"
                description="Go to search.google.com/search-console and sign in with the Google account that has access to your website's search data."
              />

              <Step
                number={2}
                title="Select Your Property"
                description="If you have multiple properties, use the dropdown at the top-left to select the correct website."
              />

              <Step
                number={3}
                title="Open Settings"
                description='Click "Settings" in the bottom-left sidebar.'
              />

              <Step
                number={4}
                title="Find Your Property Type"
                description='Under "Property type," you will see either a Domain property (like sc-domain:yoursite.com) or a URL prefix property (like https://yoursite.com). Copy this value exactly as shown.'
              />

              <Step
                number={5}
                title="Enter It in Mission Control"
                description="Paste the value into the Search Console field during setup. Use the exact format — either sc-domain:yoursite.com for domain properties or the full URL for URL prefix properties."
              />
            </div>

            <div className="mt-12 rounded-xl border border-navy/10 bg-white p-6">
              <h3 className="font-display font-semibold text-sm text-navy mb-2">
                Which format should I use?
              </h3>
              <div className="space-y-3 text-sm text-navy/60">
                <div className="flex gap-3">
                  <span className="shrink-0 font-mono text-copper text-xs bg-copper/10 rounded px-2 py-1">sc-domain:yoursite.com</span>
                  <span>Domain property. Covers all subdomains and protocols. This is the recommended format.</span>
                </div>
                <div className="flex gap-3">
                  <span className="shrink-0 font-mono text-copper text-xs bg-copper/10 rounded px-2 py-1">https://yoursite.com/</span>
                  <span>URL prefix property. Only covers one specific protocol and subdomain.</span>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-xl border border-copper/20 bg-copper/5 p-6">
              <h3 className="font-display font-semibold text-sm text-navy mb-2">
                Do not have Search Console yet?
              </h3>
              <p className="text-navy/60 text-sm leading-relaxed mb-3">
                If your website is not set up in Search Console, here is how to add it.
              </p>
              <ol className="text-navy/60 text-sm space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-copper hover:underline">search.google.com/search-console</a></li>
                <li>Click &quot;Add property&quot;</li>
                <li>Choose &quot;Domain&quot; (recommended) and enter your domain</li>
                <li>Verify ownership via DNS record (your domain registrar will have instructions)</li>
                <li>Once verified, keyword data will start appearing within a few days</li>
                <li>Come back and enter the property value in Mission Control</li>
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
