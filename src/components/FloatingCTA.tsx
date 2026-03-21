"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link
      href="/connect"
      aria-label="Book a call"
      className={`fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-spark-red text-white px-4 py-2.5 text-sm font-display font-semibold shadow-soft transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-lg ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
      </svg>
      Book a Call
    </Link>
  );
}
