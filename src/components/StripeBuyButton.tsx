"use client";

import { useEffect, useRef } from "react";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PK || "";

export function StripeBuyButton({
  buyButtonId,
}: {
  buyButtonId: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !STRIPE_PK) return;

    // Load script once
    if (!document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Render the buy button inline — Stripe handles its own UI and checkout overlay
    ref.current.innerHTML = `<stripe-buy-button buy-button-id="${buyButtonId}" publishable-key="${STRIPE_PK}"></stripe-buy-button>`;
  }, [buyButtonId]);

  if (!STRIPE_PK) {
    return (
      <p style={{ color: "rgba(232,223,207,0.4)", textAlign: "center", fontSize: 13, padding: "8px 0" }}>
        Payment system is not configured.
      </p>
    );
  }

  return <div ref={ref} />;
}
