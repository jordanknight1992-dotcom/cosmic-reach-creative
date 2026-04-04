"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" />
    </svg>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownGroupRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleDropdownBlur = (e: React.FocusEvent) => {
    if (!dropdownGroupRef.current?.contains(e.relatedTarget as Node)) {
      setDropdownOpen(false);
    }
  };

  const linkClass =
    "px-3 py-2 text-sm text-starlight/80 hover:text-copper transition-colors duration-[var(--duration-fast)]";
  const mobileLinkClass =
    "block px-4 py-3 text-lg text-starlight/80 hover:text-copper transition-colors rounded-[var(--radius-sm)]";

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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logo-primary-dark.svg"
                alt="Cosmic Reach Creative"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {/* Home */}
              <Link href="/" className={linkClass}>
                Home
              </Link>

              {/* How It Works — with dropdown */}
              <div
                ref={dropdownGroupRef}
                className="relative"
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                  setDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  closeTimeoutRef.current = setTimeout(() => setDropdownOpen(false), 150);
                }}
                onBlur={handleDropdownBlur}
              >
                <Link
                  href="/how-it-works"
                  className={`${linkClass} flex items-center gap-1`}
                  onFocus={() => setDropdownOpen(true)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  How It Works
                  <ChevronDown
                    className={`transition-transform duration-[var(--duration-fast)] ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </Link>

                {/* Dropdown panel */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-56 rounded-[var(--radius-md)] border border-starlight/10 bg-navy shadow-soft py-2 transition-all duration-[var(--duration-fast)] ${
                    dropdownOpen
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-1 pointer-events-none"
                  }`}
                  role="menu"
                >
                  {siteConfig.howItWorksDropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      tabIndex={dropdownOpen ? 0 : -1}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      <span className="block text-sm font-display font-semibold text-starlight">
                        {item.label}
                      </span>
                      <span className="block text-xs text-starlight/50 mt-0.5">
                        {item.detail}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <Link href="/pricing" className={linkClass}>
                Pricing
              </Link>

              {/* Featured Projects */}
              <Link href="/work" className={linkClass}>
                Featured Projects
              </Link>

              {/* FAQ */}
              <Link href="/faq" className={linkClass}>
                FAQ
              </Link>

              {/* CTAs */}
              <Link
                href="/mission-control"
                className="ml-4 inline-flex items-center justify-center rounded-[var(--radius-md)] border border-copper/40 text-copper px-5 py-2 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-copper/70 hover:bg-copper/10 hover:-translate-y-0.5"
              >
                Mission Control
              </Link>
              <Link
                href="/connect"
                className="ml-2 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-5 py-2 text-sm font-display font-semibold transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5"
              >
                Book a Call
              </Link>
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
        className={`lg:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-deep-space overflow-y-auto transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] ${
          menuOpen
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <nav
          className="flex flex-col px-6 py-8 gap-1"
          aria-label="Mobile navigation"
        >
          {/* Home */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            Home
          </Link>

          {/* How It Works — accordion */}
          <div>
            <div className="flex items-center">
              <Link
                href="/how-it-works"
                onClick={() => setMenuOpen(false)}
                className={`flex-1 ${mobileLinkClass}`}
              >
                How It Works
              </Link>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="px-3 py-3 text-starlight/60 hover:text-copper transition-colors"
                aria-label={
                  mobileDropdownOpen
                    ? "Collapse How It Works"
                    : "Expand How It Works"
                }
                aria-expanded={mobileDropdownOpen}
              >
                <ChevronDown
                  className={`transition-transform duration-[var(--duration-fast)] ${
                    mobileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {mobileDropdownOpen && (
              <div className="pl-4 pb-2 ml-4 border-l border-starlight/10">
                {siteConfig.howItWorksDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setMenuOpen(false);
                      setMobileDropdownOpen(false);
                    }}
                    className="block px-4 py-2.5 text-base text-starlight/60 hover:text-copper transition-colors rounded-[var(--radius-sm)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link
            href="/pricing"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            Pricing
          </Link>

          {/* Featured Projects */}
          <Link
            href="/work"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            Featured Projects
          </Link>

          {/* FAQ */}
          <Link
            href="/faq"
            onClick={() => setMenuOpen(false)}
            className={mobileLinkClass}
          >
            FAQ
          </Link>

          {/* CTAs */}
          <Link
            href="/mission-control"
            className="mt-4 inline-flex items-center justify-center rounded-[var(--radius-md)] border border-copper/40 text-copper px-5 py-3 font-display font-semibold transition-all duration-[var(--duration-base)] hover:border-copper/70 hover:bg-copper/10"
            onClick={() => setMenuOpen(false)}
          >
            Mission Control
          </Link>
          <Link
            href="/connect"
            className="mt-2 inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-5 py-3 font-display font-semibold transition-all duration-[var(--duration-base)]"
            onClick={() => setMenuOpen(false)}
          >
            Book a Call
          </Link>
        </nav>
      </div>
    </>
  );
}
