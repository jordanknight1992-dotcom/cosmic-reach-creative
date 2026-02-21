interface ChevronProps {
  className?: string;
  size?: number;
}

export function Chevron({ className = "", size = 16 }: ChevronProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-hidden="true"
    >
      <path
        d="M6 3L11 8L6 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
