import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Setup Guides | Mission Control Help",
  description:
    "Step-by-step guides for connecting Google Analytics, Search Console, and other data sources to Mission Control.",
  alternates: { canonical: `${siteConfig.domain}/help` },
};

const GUIDES = [
  {
    title: "Google Analytics (GA4)",
    description: "How to find your GA4 Property ID and connect traffic data.",
    href: "/help/setup-ga4",
    icon: "📊",
  },
  {
    title: "Google Search Console",
    description: "How to find your Search Console site URL for keyword data.",
    href: "/help/setup-search-console",
    icon: "🔍",
  },
];

export default function HelpPage() {
  return (
    <main id="main-content">
      <section className="py-16 sm:py-24 bg-section-light">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-navy mb-2">Setup Guides</h1>
            <p className="text-navy/60 text-base mb-10">
              Step-by-step instructions for connecting your data sources to Mission Control.
            </p>

            <div className="space-y-4">
              {GUIDES.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="block rounded-xl border border-navy/10 bg-white p-5 shadow-subtle transition-all duration-200 hover:border-copper/40 hover:shadow-soft"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{guide.icon}</span>
                    <div>
                      <h2 className="font-display font-semibold text-base text-navy mb-1">
                        {guide.title}
                      </h2>
                      <p className="text-navy/60 text-sm">{guide.description}</p>
                    </div>
                    <span className="ml-auto text-copper shrink-0">&rarr;</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-navy/40 text-sm">
                Need help with something else?{" "}
                <a href="/connect" className="text-copper hover:underline">
                  Get in touch
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
