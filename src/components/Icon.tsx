import Image from "next/image";
import { iconPath } from "@/lib/icon-alias";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  label?: string;
}

export function Icon({ name, size = 32, className = "", label }: IconProps) {
  return (
    <Image
      src={iconPath(name)}
      alt={label ?? ""}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      aria-hidden={!label}
      style={{ filter: "invert(78%) sepia(18%) saturate(700%) hue-rotate(345deg) brightness(90%) contrast(85%)" }}
    />
  );
}
