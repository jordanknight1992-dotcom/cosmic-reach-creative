"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] bg-deep-space lg:bg-deep-space/95 lg:backdrop-blur-md ${
          scrolled ? "shadow-subtle" : ""
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="shrink-0"
              aria-label="Cosmic Reach Creative home"
            >
              <Image
                src="/logo/logo-primary-dark.svg"
                alt="Cosmic Reach Creative"
                width={160}
                height={32}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-sm text-starlight/80 hover:text-copper transition-colors duration-[var(--duration-fast)]"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={siteConfig.calendlySignalCheckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-5 py-2 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
              >
                Start Here
              </a>
            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-starlight"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="6" y1="18" x2="18" y2="6" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — outside header to avoid backdrop-filter containment */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-deep-space transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          menuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col px-6 py-8 gap-1"
          aria-label="Mobile navigation"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-lg text-starlight/80 hover:text-copper transition-colors rounded-[var(--radius-sm)]"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={siteConfig.calendlySignalCheckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-5 py-3 font-display font-semibold transition-all duration-[var(--duration-base)]"
            onClick={() => setMenuOpen(false)}
          >
            Book
          </a>
        </nav>
      </div>
    </>
  );
}
