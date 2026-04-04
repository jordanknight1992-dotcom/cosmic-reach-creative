"use client";

import { useEffect, useRef } from "react";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PK || "";

export function StripeBuyButton({
  buyButtonId,
}: {
  buyButtonId: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!ref.current || !STRIPE_PK || mounted.current) return;
    mounted.current = true;

    // Load script once globally
    if (!document.querySelector('script[src*="buy-button.js"]')) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Create the element only once
    const el = document.createElement("stripe-buy-button");
    el.setAttribute("buy-button-id", buyButtonId);
    el.setAttribute("publishable-key", STRIPE_PK);
    ref.current.appendChild(el);

    return () => {
      mounted.current = false;
    };
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
