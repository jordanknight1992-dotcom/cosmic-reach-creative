"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/Icon";

type FormData = {
  name: string;
  email: string;
  company: string;
  website: string;
  businessDescription: string;
  whatIsStuck: string;
  primaryGoal: string;
  keyOffers: string;
  idealCustomer: string;
  anythingElse: string;
  supportingLinks: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  company: "",
  website: "",
  businessDescription: "",
  whatIsStuck: "",
  primaryGoal: "",
  keyOffers: "",
  idealCustomer: "",
  anythingElse: "",
  supportingLinks: "",
};

const fieldClass =
  "w-full rounded-[var(--radius-md)] border border-starlight/15 bg-navy/60 px-4 py-3 text-base text-starlight placeholder:text-starlight/30 focus:border-copper/50 focus:outline-none transition-colors";

const labelClass =
  "block text-sm font-display font-medium text-starlight/80 mb-1.5";

const textareaClass = `${fieldClass} resize-none`;

export function AuditIntakeForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/audit-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm(initialForm);
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
        <h3 className="font-display font-semibold text-xl mb-2">Intake form received.</h3>
        <p className="text-starlight/70 text-base max-w-sm mx-auto">
          We&apos;ll review your submission and begin the Business Clarity Audit within one business day. Expect your Clarity Report within 3–5 business days.
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Info */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="intake-name" className={labelClass}>
              Name
            </label>
            <input
              id="intake-name"
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              className={fieldClass}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="intake-email" className={labelClass}>
              Email
            </label>
            <input
              id="intake-email"
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              className={fieldClass}
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="intake-company" className={labelClass}>
              Company name
            </label>
            <input
              id="intake-company"
              type="text"
              value={form.company}
              onChange={set("company")}
              className={fieldClass}
              placeholder="Your company"
            />
          </div>
          <div>
            <label htmlFor="intake-website" className={labelClass}>
              Website URL
            </label>
            <input
              id="intake-website"
              type="url"
              value={form.website}
              onChange={set("website")}
              className={fieldClass}
              placeholder="https://yoursite.com"
            />
          </div>
        </div>

        {/* Business Context */}
        <div>
          <label htmlFor="intake-business" className={labelClass}>
            What does your business do?
          </label>
          <textarea
            id="intake-business"
            required
            rows={3}
            value={form.businessDescription}
            onChange={set("businessDescription")}
            className={textareaClass}
            placeholder="Briefly describe what you do and who you serve..."
          />
        </div>

        <div>
          <label htmlFor="intake-stuck" className={labelClass}>
            What feels stuck right now?
          </label>
          <textarea
            id="intake-stuck"
            required
            rows={3}
            value={form.whatIsStuck}
            onChange={set("whatIsStuck")}
            className={textareaClass}
            placeholder="Describe the friction, the gap, or the symptom you're experiencing..."
          />
        </div>

        <div>
          <label htmlFor="intake-goal" className={labelClass}>
            What is your primary goal over the next 6–12 months?
          </label>
          <textarea
            id="intake-goal"
            rows={2}
            value={form.primaryGoal}
            onChange={set("primaryGoal")}
            className={textareaClass}
            placeholder="Revenue target, product milestone, team clarity, etc..."
          />
        </div>

        <div>
          <label htmlFor="intake-offers" className={labelClass}>
            What offers or services are most important right now?
          </label>
          <textarea
            id="intake-offers"
            rows={2}
            value={form.keyOffers}
            onChange={set("keyOffers")}
            className={textareaClass}
            placeholder="List your main products, services, or offers..."
          />
        </div>

        <div>
          <label htmlFor="intake-customer" className={labelClass}>
            Who is your ideal customer?
          </label>
          <textarea
            id="intake-customer"
            rows={2}
            value={form.idealCustomer}
            onChange={set("idealCustomer")}
            className={textareaClass}
            placeholder="Describe the person or company you most want to serve..."
          />
        </div>

        <div>
          <label htmlFor="intake-else" className={labelClass}>
            Anything else I should review?
          </label>
          <textarea
            id="intake-else"
            rows={2}
            value={form.anythingElse}
            onChange={set("anythingElse")}
            className={textareaClass}
            placeholder="Additional context, history, or anything relevant..."
          />
        </div>

        <div>
          <label htmlFor="intake-links" className={labelClass}>
            Optional links or supporting materials{" "}
            <span className="text-starlight/40">(optional)</span>
          </label>
          <textarea
            id="intake-links"
            rows={2}
            value={form.supportingLinks}
            onChange={set("supportingLinks")}
            className={textareaClass}
            placeholder="Google Docs, Notion pages, decks, or any other links..."
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full inline-flex items-center justify-center rounded-[var(--radius-md)] bg-spark-red text-white px-6 py-3 font-display font-semibold text-base transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? "Submitting..." : "Submit Intake Form"}
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
