"use client";

import { useEffect, useRef } from "react";

const STRIPE_PK = "pk_live_51T44ee0vGBLnj72kD2j5gz8MPQ9DaBKFFOtPacjH3NUsAns3pzr5N2C2pcqcOsvDGa0SD6sg2jcZxggna1VmAjBl00uJ9kwAz4";

let scriptLoaded = false;

export function StripeBuyButton({ buyButtonId }: { buyButtonId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/buy-button.js";
      script.async = true;
      document.head.appendChild(script);
      scriptLoaded = true;
    }

    // Create the custom element manually to avoid React SSR issues
    const el = document.createElement("stripe-buy-button");
    el.setAttribute("buy-button-id", buyButtonId);
    el.setAttribute("publishable-key", STRIPE_PK);
    containerRef.current?.appendChild(el);

    return () => {
      containerRef.current?.replaceChildren();
    };
  }, [buyButtonId]);

  return <div ref={containerRef} />;
}
