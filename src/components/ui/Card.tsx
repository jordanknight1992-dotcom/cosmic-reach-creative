import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-md)] border border-border bg-surface p-6 md:p-8 ${
        hover
          ? "transition-all duration-200 ease-cosmic hover:border-starlight/20 hover:bg-surface-elevated"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
