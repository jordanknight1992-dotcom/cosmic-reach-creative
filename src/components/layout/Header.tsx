"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-space/90 backdrop-blur-md border-b border-border">
      <Container>
        <nav
          className="flex items-center justify-between h-16 md:h-20"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            className="relative z-50 flex items-center shrink-0"
            aria-label="Cosmic Reach Creative, go to homepage"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/logo-light-rgb.svg"
              alt="Cosmic Reach Creative"
              style={{ height: 32, width: "auto", display: "block" }}
              className="md:!h-[40px]"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-sm font-medium transition-colors duration-200 hover:text-starlight ${
                  pathname === link.href
                    ? "text-starlight"
                    : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Button href="/signal-session" size="sm">
              Start a Signal Session
            </Button>
          </div>

          <button
            type="button"
            className="relative z-50 flex lg:hidden flex-col justify-center items-center w-10 h-10 gap-1.5"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-6 h-0.5 bg-starlight transition-transform duration-200 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-starlight transition-opacity duration-200 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-starlight transition-transform duration-200 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </Container>

      {isOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-deep-space pt-20 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <Container>
            <div className="flex flex-col gap-6 pt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-display text-2xl font-semibold transition-colors duration-200 hover:text-starlight ${
                    pathname === link.href
                      ? "text-starlight"
                      : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Button
                  href="/signal-session"
                  size="lg"
                  onClick={() => setIsOpen(false)}
                >
                  Start a Signal Session
                </Button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
