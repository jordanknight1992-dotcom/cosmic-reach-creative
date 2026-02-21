import Link from "next/link";
import { type ReactNode } from "react";
import { Chevron } from "./Chevron";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  chevron?: boolean;
  className?: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-spark-red text-white hover:bg-spark-red/90 focus-visible:ring-2 focus-visible:ring-spark-red focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space",
  secondary:
    "bg-transparent text-starlight border border-border hover:border-starlight/40 focus-visible:ring-2 focus-visible:ring-starlight focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space",
  ghost:
    "bg-transparent text-starlight hover:text-white focus-visible:ring-2 focus-visible:ring-starlight focus-visible:ring-offset-2 focus-visible:ring-offset-deep-space",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  chevron = false,
  className = "",
  href,
  external = false,
  onClick,
  type,
  disabled,
}: ButtonProps) {
  const baseClasses = `inline-flex items-center gap-2 font-display font-semibold rounded-[var(--radius-sm)] transition-all duration-200 ease-cosmic ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        onClick={onClick}
      >
        {children}
        {chevron && <Chevron />}
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {children}
        {chevron && <Chevron />}
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {chevron && <Chevron />}
    </button>
  );
}
