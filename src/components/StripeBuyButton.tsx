"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PK || "";

let scriptLoaded = false;
function ensureScript() {
  if (scriptLoaded) return;
  const script = document.createElement("script");
  script.src = "https://js.stripe.com/v3/buy-button.js";
  script.async = true;
  document.head.appendChild(script);
  scriptLoaded = true;
}

export function StripeBuyButton({
  buyButtonId,
  label = "Get Started",
}: {
  buyButtonId: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    // Only load Stripe over HTTPS (or in development)
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isSecure || !STRIPE_PK) {
      containerRef.current?.replaceChildren();
      const msg = document.createElement("p");
      msg.textContent = !STRIPE_PK
        ? "Payment system is not configured."
        : "Payments require a secure (HTTPS) connection.";
      msg.style.cssText = "color: rgba(232,223,207,0.6); text-align: center; padding: 40px 0; font-size: 14px;";
      containerRef.current?.appendChild(msg);
      return;
    }

    ensureScript();

    const el = document.createElement("stripe-buy-button");
    el.setAttribute("buy-button-id", buyButtonId);
    el.setAttribute("publishable-key", STRIPE_PK);
    containerRef.current?.replaceChildren();
    containerRef.current?.appendChild(el);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, buyButtonId, close]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-6 py-3 font-display font-semibold text-sm transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0"
      >
        {label}
      </button>

      {open && (
        <div
          ref={overlayRef}
          onClick={(e) => {
            if (e.target === overlayRef.current) close();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: 480,
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: 16,
              background: "#111827",
              padding: 24,
            }}
          >
            <button
              onClick={close}
              style={{
                position: "absolute",
                top: 12,
                right: 16,
                background: "none",
                border: "none",
                color: "rgba(232,223,207,0.5)",
                fontSize: 20,
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              ✕
            </button>
            <div ref={containerRef} style={{ minHeight: 200 }} />
          </div>
        </div>
      )}
    </>
  );
}
