import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function Container({
  children,
  className = "",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component className={`mx-auto w-full max-w-[1200px] px-5 md:px-8 ${className}`}>
      {children}
    </Component>
  );
}
