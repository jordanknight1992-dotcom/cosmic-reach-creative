"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-12">
        <Icon name="spark" size={32} className="opacity-70 mx-auto mb-4" />
        <h3 className="font-display font-semibold text-xl mb-2">Message received.</h3>
        <p className="text-starlight/70 text-base">
          We&apos;ll be in touch soon. In the meantime, feel free to{" "}
          <a
            href={siteConfig.calendlySignalCheckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-copper hover:underline"
          >
            book an intro call
          </a>.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-display font-medium text-starlight/80 mb-1.5">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-[var(--radius-md)] border border-starlight/15 bg-navy/60 px-4 py-3 text-base text-starlight placeholder:text-starlight/30 focus:border-copper/50 focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-display font-medium text-starlight/80 mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-[var(--radius-md)] border border-starlight/15 bg-navy/60 px-4 py-3 text-base text-starlight placeholder:text-starlight/30 focus:border-copper/50 focus:outline-none transition-colors"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-display font-medium text-starlight/80 mb-1.5">
            Company <span className="text-starlight/40">(optional)</span>
          </label>
          <input
            id="company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full rounded-[var(--radius-md)] border border-starlight/15 bg-navy/60 px-4 py-3 text-base text-starlight placeholder:text-starlight/30 focus:border-copper/50 focus:outline-none transition-colors"
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-display font-medium text-starlight/80 mb-1.5">
            What are you working through?
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-[var(--radius-md)] border border-starlight/15 bg-navy/60 px-4 py-3 text-base text-starlight placeholder:text-starlight/30 focus:border-copper/50 focus:outline-none transition-colors resize-none"
            placeholder="Briefly describe the operational challenge or question..."
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
        {status === "error" && (
          <p className="text-center text-sm text-spark-red">
            Something went wrong. Please try again or email{" "}
            <a href={`mailto:${siteConfig.contactEmail}`} className="underline">
              {siteConfig.contactEmail}
            </a>.
          </p>
        )}
      </form>

      <p className="mt-8 text-sm text-starlight/40 text-center">
        Or email directly:{" "}
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="text-copper hover:underline"
        >
          {siteConfig.contactEmail}
        </a>
      </p>
    </>
  );
}
