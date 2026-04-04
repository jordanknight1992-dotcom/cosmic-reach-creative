import { type ElementType, type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

export function GlassCard({
  children,
  className = "",
  as: Tag = "div",
}: GlassCardProps) {
  return (
    <Tag
      className={`bg-navy rounded-[var(--radius-md)] p-6 border border-starlight/10 ${className}`}
    >
      {children}
    </Tag>
  );
}
