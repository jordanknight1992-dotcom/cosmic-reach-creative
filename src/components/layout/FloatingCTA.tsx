"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chevron } from "@/components/ui/Chevron";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on the clarity session page itself
  const isHidden = pathname === "/clarity-session";

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
      href="/clarity-session"
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-[var(--radius-md)] bg-spark-red text-white font-display font-semibold text-sm shadow-lg shadow-spark-red/20 transition-all duration-300 ease-cosmic hover:bg-spark-red/90 hover:shadow-xl hover:shadow-spark-red/30 hover:scale-105 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="Request a free Signal Scan"
    >
      Request Signal Scan
      <Chevron size={14} />
    </Link>
  );
}
