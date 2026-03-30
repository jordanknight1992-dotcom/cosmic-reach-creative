import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `Accessibility commitment for ${siteConfig.siteName}.`,
  alternates: { canonical: `${siteConfig.domain}/accessibility` },
};

export default function AccessibilityPage() {
  return (
    <main id="main-content" className="pt-32 pb-20">
      <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="mb-4">Accessibility</h1>
          <p className="text-starlight/40 text-sm mb-8">Last updated: March 30, 2026</p>

          <div className="space-y-6 text-starlight/70">
            <p>
              {siteConfig.siteName} is committed to making this website accessible to all visitors.
            </p>

            <h2 className="text-xl mt-8">Our Approach</h2>
            <p>
              We aim to use semantic structure, visible focus states, keyboard-accessible interactions, sufficient contrast, and reduced-motion support where appropriate. If you encounter a barrier, contact us and we will work to address it.
            </p>
            <p className="mt-4">Specifically, we work toward the following in our implementation:</p>
            <ul className="space-y-2 mt-3">
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Semantic HTML with heading structure and landmark regions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Meaningful alt text for images where applicable
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Visible focus indicators for keyboard navigation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Keyboard-reachable interactive elements
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Color contrast aimed at WCAG AA guidance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Respect for the prefers-reduced-motion setting
              </li>
            </ul>

            <h2 className="text-xl mt-8">Feedback</h2>
            <p>
              If you encounter an accessibility barrier on this site, please let us know at{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-copper hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
              . We will work to address the issue promptly.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
