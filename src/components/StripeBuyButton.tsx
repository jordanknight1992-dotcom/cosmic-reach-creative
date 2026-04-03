"use client";

import { useEffect, useRef, useState } from "react";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PK || "";

export function StripeBuyButton({
  buyButtonId,
  label = "Continue to Payment",
}: {
  buyButtonId: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current || !STRIPE_PK || !revealed) return;

    // Load script once
    if (!document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Render the buy button inline — Stripe handles its own UI and checkout overlay
    ref.current.innerHTML = `<stripe-buy-button buy-button-id="${buyButtonId}" publishable-key="${STRIPE_PK}"></stripe-buy-button>`;
  }, [buyButtonId, revealed]);

  if (!STRIPE_PK) {
    return (
      <p style={{ color: "rgba(232,223,207,0.4)", textAlign: "center", fontSize: 13, padding: "8px 0" }}>
        Payment system is not configured.
      </p>
    );
  }

  return (
    <div>
      {/* Brand-styled button — visible until user clicks */}
      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-6 py-3 font-display font-semibold text-sm transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          {label}
        </button>
      )}

      {/* Stripe widget — revealed on click with smooth transition */}
      <div
        className={`transition-all duration-500 ease-out overflow-hidden ${
          revealed
            ? "max-h-[500px] opacity-100 mt-2"
            : "max-h-0 opacity-0"
        }`}
      >
        {revealed && (
          <p className="text-center text-xs text-starlight/40 mb-2">
            Complete your purchase below via Stripe
          </p>
        )}
        <div ref={ref} />
      </div>
    </div>
  );
}
