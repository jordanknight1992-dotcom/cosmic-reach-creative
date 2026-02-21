"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { saveLead } from "@/lib/leads";

const segments = [
  { value: "consulting", label: "Consulting help" },
  { value: "parallax", label: "Reporting automation" },
  { value: "labs", label: "Frameworks and systems" },
];

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [segment, setSegment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !segment) return;

    setStatus("submitting");
    try {
      await saveLead({
        name: "",
        email,
        segment,
        source: "homepage-email-capture",
      });
      setStatus("success");
      setEmail("");
      setSegment("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section background="surface">
      <SectionHeading
        label="Stay in orbit"
        title="What are you here for?"
        align="center"
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto space-y-6"
        aria-label="Email capture form"
      >
        <fieldset>
          <legend className="text-muted text-sm mb-4 text-center">
            Select your interest to receive relevant updates.
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {segments.map((seg) => (
              <label
                key={seg.value}
                className={`flex items-center justify-center px-4 py-3 rounded-[var(--radius-sm)] border text-sm font-display font-semibold cursor-pointer transition-all duration-200 ease-cosmic ${
                  segment === seg.value
                    ? "border-spark-red bg-spark-red/10 text-starlight"
                    : "border-border text-muted hover:border-starlight/30"
                }`}
              >
                <input
                  type="radio"
                  name="segment"
                  value={seg.value}
                  checked={segment === seg.value}
                  onChange={(e) => setSegment(e.target.value)}
                  className="sr-only"
                />
                {seg.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="capture-email" className="sr-only">
            Email address
          </label>
          <input
            id="capture-email"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-[var(--radius-sm)] bg-deep-space border border-border text-starlight placeholder:text-muted/60 text-sm focus:outline-none focus:border-spark-red transition-colors duration-200"
            aria-describedby="capture-status"
          />
          <button
            type="submit"
            disabled={status === "submitting" || !segment}
            className="px-6 py-3 rounded-[var(--radius-sm)] bg-spark-red text-white font-display font-semibold text-sm transition-all duration-200 ease-cosmic hover:bg-spark-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Sending..." : "Subscribe"}
          </button>
        </div>

        <div id="capture-status" aria-live="polite" className="text-center text-sm">
          {status === "success" && (
            <p className="text-copper">You are in orbit. We will be in touch.</p>
          )}
          {status === "error" && (
            <p className="text-spark-red">Something went wrong. Please try again.</p>
          )}
        </div>
      </form>
    </Section>
  );
}
