import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SITE, FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-deep-space py-16" role="contentinfo">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <Image
              src="/logos/logo-light-rgb.svg"
              alt="Cosmic Reach Creative"
              width={160}
              height={54}
              className="h-8 w-auto mb-4 block"
              unoptimized
            />
            <p className="text-muted text-sm max-w-xs">
              Strategy. Systems. Signal. Designing clarity for growing companies.
            </p>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-starlight mb-4">
              Navigate
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted text-sm hover:text-starlight transition-colors duration-200 ease-cosmic"
                    >
                      {link.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-muted text-sm hover:text-starlight transition-colors duration-200 ease-cosmic"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm tracking-wide uppercase text-starlight mb-4">
              Contact
            </h3>
            <a
              href={`mailto:${SITE.email}`}
              className="text-muted text-sm hover:text-starlight transition-colors duration-200 ease-cosmic"
            >
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs">
            &copy; {currentYear} {SITE.name}. All rights reserved.
          </p>
          <p className="text-muted text-xs">
            Built with clarity.
          </p>
        </div>
      </Container>
    </footer>
  );
}
