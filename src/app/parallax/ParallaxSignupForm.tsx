"use client";

import { useState } from "react";
import { saveLead } from "@/lib/leads";

export function ParallaxSignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");
    try {
      await saveLead({
        name: "",
        email,
        segment: "parallax",
        source: "parallax-early-access",
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <h3 className="font-display font-bold text-2xl text-starlight mb-4">
          You are on the list.
        </h3>
        <p className="text-muted text-base">
          We will reach out when Parallax is ready for early access.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto"
      aria-label="Parallax early access signup"
    >
      <p className="text-muted text-sm mb-4 text-center">
        Enter your email and we will notify you when Parallax launches.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="parallax-email" className="sr-only">
          Email address
        </label>
        <input
          id="parallax-email"
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-[var(--radius-sm)] bg-deep-space border border-border text-starlight placeholder:text-muted/60 text-sm focus:outline-none focus:border-spark-red transition-colors duration-200"
          aria-describedby="parallax-status"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-6 py-3 rounded-[var(--radius-sm)] bg-spark-red text-white font-display font-semibold text-sm transition-all duration-200 ease-cosmic hover:bg-spark-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "Sending..." : "Notify me"}
        </button>
      </div>

      <div
        id="parallax-status"
        aria-live="polite"
        className="text-center text-sm mt-3"
      >
        {status === "error" && (
          <p className="text-spark-red">Something went wrong. Please try again.</p>
        )}
      </div>
    </form>
  );
}
