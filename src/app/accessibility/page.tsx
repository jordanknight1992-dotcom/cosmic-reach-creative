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
          <h1 className="mb-8">Accessibility</h1>

          <div className="space-y-6 text-starlight/70">
            <p>
              {siteConfig.siteName} is committed to making this website accessible to all visitors.
            </p>

            <h2 className="text-xl mt-8">What We Do</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                We use semantic HTML with correct heading structure and landmark regions.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                All images include descriptive alt text.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Focus states are visible for keyboard navigation.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                All interactive elements are reachable by keyboard.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Color contrast meets WCAG AA standards.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-copper mt-1.5 text-xs" aria-hidden="true">&#9670;</span>
                Animations respect the prefers-reduced-motion setting.
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
              . We take accessibility seriously and will work to address any issues.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
