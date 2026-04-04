"use client";

import { useState, useRef } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function SubscribeForm() {
  const [state, setState] = useState<FormState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = inputRef.current?.value?.trim();
    if (!email) return;

    setState("loading");

    try {
      const res = await fetch("/api/observatory/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Subscribe failed");

      setState("success");
      if (inputRef.current) inputRef.current.value = "";

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setState("idle"), 5000);
    } catch {
      setState("error");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setState("idle"), 5000);
    }
  }

  if (state === "success") {
    return (
      <p className="text-copper font-display font-semibold text-sm py-3">
        You&apos;re in. Watch your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        ref={inputRef}
        type="email"
        required
        placeholder="you@example.com"
        disabled={state === "loading"}
        className="flex-1 rounded-[var(--radius-md)] border border-starlight/10 bg-navy px-4 py-3 text-base text-starlight placeholder:text-starlight/40 focus:border-copper/50 focus:outline-none transition-colors disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="rounded-[var(--radius-md)] bg-copper text-deep-space font-display font-semibold px-6 py-3 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {state === "loading" ? "..." : "Subscribe"}
      </button>
      {state === "error" && (
        <p className="text-red-400 text-sm self-center">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
