"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { saveLead } from "@/lib/leads";

const goalOptions = [
  { value: "consulting", label: "Consulting" },
  { value: "parallax", label: "Parallax (Reporting)" },
  { value: "labs", label: "Labs (Systems)" },
];

const timelineOptions = [
  { value: "0-30", label: "0 to 30 days" },
  { value: "30-90", label: "30 to 90 days" },
  { value: "90+", label: "90+ days" },
];

interface FormState {
  name: string;
  email: string;
  company: string;
  website: string;
  goal: string;
  challenge: string;
  tools: string;
  timeline: string;
  budget: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  goal: "",
  challenge: "",
  tools: "",
  timeline: "",
  budget: "",
};

export function ClarityForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function update(field: keyof FormState) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await saveLead({
        name: form.name,
        email: form.email,
        company: form.company,
        website: form.website,
        challenge: form.challenge,
        tools: form.tools,
        timeline: form.timeline,
        budget: form.budget,
        segment: form.goal,
        source: "clarity-session",
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <h3 className="font-display font-bold text-2xl text-starlight mb-4">
          Session requested.
        </h3>
        <p className="text-muted text-base mb-6">
          We will review your submission and reach out within 48 hours to schedule your Clarity Session.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-spark-red font-display font-semibold text-sm"
          aria-label="Calendar booking link (placeholder)"
        >
          Or schedule directly on our calendar
        </a>
        <p className="text-muted text-xs mt-2">
          Calendar link coming soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Clarity Session intake form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Name" name="name" required value={form.name} onChange={update("name")} placeholder="Your name" />
        <FormField label="Email" name="email" type="email" required value={form.email} onChange={update("email")} placeholder="your@email.com" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Company" name="company" value={form.company} onChange={update("company")} placeholder="Company name" />
        <FormField label="Website" name="website" type="url" value={form.website} onChange={update("website")} placeholder="https://..." />
      </div>
      <FormField
        label="Primary goal"
        name="goal"
        type="select"
        required
        options={goalOptions}
        value={form.goal}
        onChange={update("goal")}
        placeholder="What brings you here?"
      />
      <FormField
        label="Biggest challenge"
        name="challenge"
        type="textarea"
        required
        value={form.challenge}
        onChange={update("challenge")}
        placeholder="What is the primary challenge you are facing?"
      />
      <FormField
        label="Tools in use"
        name="tools"
        value={form.tools}
        onChange={update("tools")}
        placeholder="GA4, Search Console, HubSpot, etc."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="Timeline"
          name="timeline"
          type="select"
          required
          options={timelineOptions}
          value={form.timeline}
          onChange={update("timeline")}
          placeholder="When do you need results?"
        />
        <FormField
          label="Budget comfort (optional)"
          name="budget"
          value={form.budget}
          onChange={update("budget")}
          placeholder="Approximate range"
        />
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p className="text-spark-red text-sm" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full px-6 py-3 rounded-[var(--radius-sm)] bg-spark-red text-white font-display font-semibold text-sm transition-all duration-200 ease-cosmic hover:bg-spark-red/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting..." : "Request Clarity Session"}
      </button>
    </form>
  );
}
