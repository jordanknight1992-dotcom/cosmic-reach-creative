"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { saveLead } from "@/lib/leads";

const segmentOptions = [
  { value: "signal", label: "Signal (Strategy)" },
  { value: "transmission", label: "Transmission (Creative)" },
  { value: "labs", label: "Labs" },
  { value: "parallax", label: "Parallax (Reporting)" },
  { value: "strategy", label: "Strategy" },
];

const timelineOptions = [
  { value: "0-30", label: "0 to 30 days" },
  { value: "30-90", label: "30 to 90 days" },
  { value: "90+", label: "90+ days" },
];

interface FormState {
  name: string;
  company: string;
  role: string;
  challenge: string;
  timeline: string;
  email: string;
  segment: string;
}

const initialState: FormState = {
  name: "",
  company: "",
  role: "",
  challenge: "",
  timeline: "",
  email: "",
  segment: "",
};

export function ContactForm() {
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
        role: form.role,
        challenge: form.challenge,
        timeline: form.timeline,
        segment: form.segment,
        source: "contact",
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
          Message received.
        </h3>
        <p className="text-muted text-base">
          We will be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Name" name="name" required value={form.name} onChange={update("name")} placeholder="Your name" />
        <FormField label="Email" name="email" type="email" required value={form.email} onChange={update("email")} placeholder="your@email.com" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Company" name="company" value={form.company} onChange={update("company")} placeholder="Company name" />
        <FormField label="Role" name="role" value={form.role} onChange={update("role")} placeholder="Your role" />
      </div>
      <FormField
        label="Primary challenge"
        name="challenge"
        type="textarea"
        required
        value={form.challenge}
        onChange={update("challenge")}
        placeholder="What is the primary challenge you are facing?"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField
          label="Timeline"
          name="timeline"
          type="select"
          options={timelineOptions}
          value={form.timeline}
          onChange={update("timeline")}
          placeholder="When do you need results?"
        />
        <FormField
          label="Area of interest"
          name="segment"
          type="select"
          options={segmentOptions}
          value={form.segment}
          onChange={update("segment")}
          placeholder="Select category"
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
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
