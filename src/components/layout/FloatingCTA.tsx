"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chevron } from "@/components/ui/Chevron";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const isHidden = pathname === "/signal-session";

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isHidden) return null;

  return (
    <Link
      href="/signal-session"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-[var(--radius-md)] bg-spark-red text-white font-display font-semibold shadow-lg shadow-spark-red/20 transition-all duration-300 ease-cosmic hover:bg-spark-red/90 hover:shadow-xl hover:shadow-spark-red/30 hover:scale-105 px-5 py-3 text-sm max-sm:px-3.5 max-sm:py-2.5 max-sm:text-xs max-sm:bottom-4 max-sm:right-4 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="Start a Signal Session"
    >
      <span className="hidden sm:inline">Start a Signal Session</span>
      <span className="sm:hidden">Signal Session</span>
      <Chevron size={14} />
    </Link>
  );
}
