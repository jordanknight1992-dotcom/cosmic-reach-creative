import { type ReactNode } from "react";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "surface" | "navy";
}

const backgrounds = {
  default: "bg-deep-space",
  surface: "bg-surface",
  navy: "bg-brand-navy-alt",
};

export function Section({
  children,
  className = "",
  id,
  background = "default",
}: SectionProps) {
  return (
    <section id={id} className={`py-16 md:py-24 ${backgrounds[background]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
