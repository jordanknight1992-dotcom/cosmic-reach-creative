"use client";

import { useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

export function CaseStudyDownloadForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return;

    setState("loading");

    try {
      const res = await fetch("/api/case-study/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setState("success");
      window.open("/api/case-study/la-cherie/pdf", "_blank");
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-8 text-center">
        <h3 className="font-display font-semibold text-xl text-starlight mb-3">
          Your download is starting.
        </h3>
        <p className="text-starlight/70 text-sm">
          If the download didn&apos;t begin automatically,{" "}
          <a
            href="/api/case-study/la-cherie/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-copper hover:underline"
          >
            click here to download
          </a>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-starlight/10 bg-navy/50 p-8">
      <h3 className="font-display font-semibold text-xl text-starlight mb-6 text-center">
        Download the full case study
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="cs-name"
            className="block text-sm font-display font-medium text-copper mb-1.5 text-left"
          >
            Name
          </label>
          <input
            id="cs-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={state === "loading"}
            className="w-full rounded-[var(--radius-md)] border border-starlight/10 bg-deep-space px-4 py-3 text-base text-starlight placeholder:text-starlight/40 focus:border-copper/50 focus:outline-none transition-colors disabled:opacity-60"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="cs-email"
            className="block text-sm font-display font-medium text-copper mb-1.5 text-left"
          >
            Email
          </label>
          <input
            id="cs-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={state === "loading"}
            className="w-full rounded-[var(--radius-md)] border border-starlight/10 bg-deep-space px-4 py-3 text-base text-starlight placeholder:text-starlight/40 focus:border-copper/50 focus:outline-none transition-colors disabled:opacity-60"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label
            htmlFor="cs-company"
            className="block text-sm font-display font-medium text-copper mb-1.5 text-left"
          >
            Company <span className="text-starlight/40">(optional)</span>
          </label>
          <input
            id="cs-company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            disabled={state === "loading"}
            className="w-full rounded-[var(--radius-md)] border border-starlight/10 bg-deep-space px-4 py-3 text-base text-starlight placeholder:text-starlight/40 focus:border-copper/50 focus:outline-none transition-colors disabled:opacity-60"
            placeholder="Company name"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="cs-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={state === "loading"}
            className="mt-1 h-4 w-4 rounded border-starlight/10 bg-deep-space accent-copper"
          />
          <label htmlFor="cs-consent" className="text-xs text-starlight/60 text-left">
            By submitting this form, you agree to receive updates from Cosmic
            Reach Creative. You can unsubscribe at any time.
          </label>
        </div>

        <button
          type="submit"
          disabled={state === "loading" || !consent}
          className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-copper text-deep-space px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "Submitting..." : "Get the Case Study"}
        </button>

        {state === "error" && (
          <p className="text-center text-sm text-red-400">
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
