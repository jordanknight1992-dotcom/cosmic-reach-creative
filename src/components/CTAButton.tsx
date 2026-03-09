import Link from "next/link";
import { siteConfig } from "@/config/site";

interface CTAButtonProps {
  label: string;
  variant?: "primary" | "secondary" | "default";
  className?: string;
}

function resolveCtaHref(label: string): string {
  const lower = label.toLowerCase();

  // High-intent: Start the Clarity Audit → Stripe
  if (
    lower.includes("start the clarity audit") ||
    lower.includes("start with a business") ||
    lower.includes("book a business clarity audit")
  ) {
    return siteConfig.stripeAuditUrl;
  }

  // Mid-intent: See / Request → Pricing page
  if (
    lower.includes("see the clarity audit") ||
    lower.includes("request a clarity audit") ||
    lower.includes("get clarity")
  ) {
    return "/pricing";
  }

  // Signal Check / Intro Call
  if (
    lower.includes("intro call") ||
    lower.includes("signal check") ||
    lower.includes("book intro") ||
    lower.includes("request an intro")
  ) {
    return siteConfig.calendlySignalCheckUrl;
  }

  // Clarity Session (legacy)
  if (
    lower.includes("clarity session") ||
    lower.includes("book clarity") ||
    lower.includes("book your clarity") ||
    lower.includes("book the clarity")
  ) {
    return siteConfig.calendlyClaritySessionUrl;
  }

  // Sprint / Monthly
  if (lower.includes("sprint") || lower.includes("monthly support")) {
    return siteConfig.calendlySignalCheckUrl;
  }

  // Framework
  if (lower.includes("framework") || lower.includes("how it works")) {
    return "/framework";
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

export function CTAButton({
  label,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const href = resolveCtaHref(label);
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  const baseStyles =
    "inline-flex items-center justify-center rounded-[var(--radius-md)] px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]";

  const variantStyles =
    variant === "secondary"
      ? "bg-spark-red text-white hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
      : "bg-spark-red text-white hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0";

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className={`${baseStyles} ${variantStyles} ${className}`}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseStyles} ${variantStyles} ${className}`}>
      {label}
    </Link>
  );
}
