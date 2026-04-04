"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

interface CTAButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "default";
  className?: string;
}

function isAuditLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return (
    lower.includes("start the clarity audit") ||
    lower.includes("start with the audit") ||
    lower.includes("get your clarity audit") ||
    lower.includes("start with a business") ||
    lower.includes("book a business clarity audit") ||
    lower.includes("see the clarity audit") ||
    lower.includes("request a clarity audit") ||
    lower.includes("get clarity")
  );
}

function resolveCtaHref(label: string): string {
  const lower = label.toLowerCase();

  // Audit labels go directly to Stripe checkout in same window
  if (isAuditLabel(lower)) return siteConfig.stripeAuditUrl;

  // Signal Check / Intro Call
  if (
    lower.includes("intro call") ||
    lower.includes("signal check") ||
    lower.includes("book intro") ||
    lower.includes("request an intro")
  ) {
    return siteConfig.signalCheckUrl;
  }

  // Clarity Session (legacy)
  if (
    lower.includes("clarity session") ||
    lower.includes("book clarity") ||
    lower.includes("book your clarity") ||
    lower.includes("book the clarity")
  ) {
    return siteConfig.claritySessionUrl;
  }

  // Rebuild / Monthly
  if (lower.includes("rebuild") || lower.includes("monthly support")) {
    return "/pricing";
  }

  // How it works
  if (lower.includes("how it works")) {
    return "/how-it-works";
  }

  // Audit intake form
  if (lower.includes("intake form")) {
    return "/audit-intake";
  }

  // Services
  if (lower.includes("service")) {
    return "/services";
  }

  // Contact / Message
  if (lower.includes("send") || lower.includes("message") || lower.includes("contact")) {
    return `mailto:${siteConfig.contactEmail}`;
  }

  // Default to pricing
  return "/pricing";
}

function trackClick(label: string, page: string) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, page }),
  }).catch(() => {});
}

export function CTAButton({
  label,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const pathname = usePathname();
  const href = resolveCtaHref(label);
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  const isAudit = isAuditLabel(label);

  const baseStyles =
    "inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]";

  const variantStyles =
    variant === "secondary"
      ? "border-2 border-starlight text-starlight bg-transparent hover:bg-starlight/10"
      : "bg-copper text-deep-space hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0";

  // Audit button — opens Stripe checkout in new tab
  if (isAudit) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseStyles} ${variantStyles} ${className}`}
        onClick={() => trackClick(label, pathname)}
      >
        {label}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className={`${baseStyles} ${variantStyles} ${className}`}
        onClick={() => trackClick(label, pathname)}
      >
        {label}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles} ${className}`}
      onClick={() => trackClick(label, pathname)}
    >
      {label}
    </Link>
  );
}
