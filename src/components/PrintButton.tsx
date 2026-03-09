"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-starlight/30 bg-transparent px-4 py-2 font-display font-semibold text-sm text-starlight/70 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-starlight/50 hover:text-starlight focus-visible:outline-2 focus-visible:outline-offset-2"
      aria-label="Download report as PDF"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download PDF
    </button>
  );
}
