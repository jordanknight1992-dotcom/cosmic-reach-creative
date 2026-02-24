import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-starlight/8" role="contentinfo">
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Image
              src="/logo/logo-mark-light.svg"
              alt="Cosmic Reach Creative"
              width={40}
              height={40}
              className="mb-4"
              style={{ height: "40px", width: "auto" }}
            />
            <p className="text-sm text-starlight/60 max-w-xs">
              Operational clarity for teams that need structure, not more activity.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-display font-semibold text-copper mb-4">
              Navigate
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {siteConfig.nav.slice(1).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-starlight/60 hover:text-copper transition-colors duration-[var(--duration-fast)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="text-sm font-display font-semibold text-copper mb-4">
              Connect
            </h3>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-sm text-starlight/60 hover:text-copper transition-colors duration-[var(--duration-fast)] block mb-4"
            >
              {siteConfig.contactEmail}
            </a>
            <a
              href={siteConfig.calendlyClaritySessionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-5 py-2.5 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
            >
              Launch with a Clarity Session
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-starlight/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-starlight/40">
            &copy; {new Date().getFullYear()} {siteConfig.siteName}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-starlight/40">
            <Link
              href="/privacy"
              className="hover:text-copper transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-copper transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/accessibility"
              className="hover:text-copper transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
