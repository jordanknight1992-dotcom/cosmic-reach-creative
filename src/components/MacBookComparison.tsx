"use client";

import { MacBookFrame } from "./MacBookFrame";

interface MacBookComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function MacBookComparison({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: MacBookComparisonProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 ${className}`}>
      <MacBookFrame src={beforeSrc} alt={beforeAlt} label={beforeLabel} />
      <MacBookFrame src={afterSrc} alt={afterAlt} label={afterLabel} />
    </div>
  );
}
