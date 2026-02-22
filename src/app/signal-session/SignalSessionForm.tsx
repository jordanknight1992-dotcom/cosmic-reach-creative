"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { saveLead } from "@/lib/leads";

const goalOptions = [
  { value: "consulting", label: "Consulting" },
  { value: "labs", label: "Labs (Systems)" },
  { value: "strategy", label: "Strategy" },
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
};

export function SignalSessionForm() {
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
        segment: form.goal,
        source: "signal-session",
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
        <p className="text-muted text-base">
          We will review your submission and reach out within 48 hours to schedule your Signal Session.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Signal Session intake form">
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
        label="Where is signal breaking down?"
        name="challenge"
        type="textarea"
        required
        value={form.challenge}
        onChange={update("challenge")}
        placeholder="Describe the core clarity problem you are experiencing"
      />
      <FormField
        label="Tools in use"
        name="tools"
        value={form.tools}
        onChange={update("tools")}
        placeholder="GA4, Search Console, HubSpot, etc."
      />
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
        {status === "submitting" ? "Submitting..." : "Schedule a Session"}
      </button>
    </form>
  );
}
