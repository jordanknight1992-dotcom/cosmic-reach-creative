"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Goal {
  label: string;
  description: string;
}

interface Props {
  tenantSlug: string;
  tenantName: string;
  initialGoals: Record<string, unknown> | null;
}

export function StrategyView({ tenantSlug, tenantName, initialGoals }: Props) {
  const isMobile = useIsMobile();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewDraft, setPreviewDraft] = useState<{ subject: string; body: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState((initialGoals?.business_name as string) || tenantName);
  const [businessDescription, setBusinessDescription] = useState((initialGoals?.business_description as string) || "");
  const [targetAudience, setTargetAudience] = useState((initialGoals?.target_audience as string) || "");
  const [brandVoice, setBrandVoice] = useState((initialGoals?.brand_voice as string) || "");
  const [keyOffers, setKeyOffers] = useState((initialGoals?.key_offers as string) || "");
  const [goals, setGoals] = useState<Goal[]>(
    (initialGoals?.goals as Goal[]) || [{ label: "", description: "" }]
  );
  const [ctaUrl, setCtaUrl] = useState((initialGoals?.cta_url as string) || "");
  const [ctaLabel, setCtaLabel] = useState((initialGoals?.cta_label as string) || "Book a call");
  const [senderName, setSenderName] = useState((initialGoals?.sender_name as string) || "");
  const [senderTitle, setSenderTitle] = useState((initialGoals?.sender_title as string) || "");
  const [avoidPhrases, setAvoidPhrases] = useState((initialGoals?.avoid_phrases as string) || "");
  const [exampleTone, setExampleTone] = useState((initialGoals?.example_tone as string) || "");

  function addGoal() {
    setGoals([...goals, { label: "", description: "" }]);
  }

  function removeGoal(index: number) {
    setGoals(goals.filter((_, i) => i !== index));
  }

  function updateGoal(index: number, field: "label" | "description", value: string) {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (tenantSlug === "demo") {
      setMessage({ type: "success", text: "Strategy saved (demo mode)" });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/mc/${tenantSlug}/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName,
          business_description: businessDescription,
          target_audience: targetAudience,
          brand_voice: brandVoice,
          key_offers: keyOffers,
          goals: goals.filter((g) => g.label.trim()),
          cta_url: ctaUrl,
          cta_label: ctaLabel,
          sender_name: senderName,
          sender_title: senderTitle,
          avoid_phrases: avoidPhrases,
          example_tone: exampleTone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save" });
        return;
      }

      setMessage({ type: "success", text: "Strategy saved successfully" });
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  }

  async function handlePreview() {
    setGenerating(true);
    setPreviewDraft(null);
    setMessage(null);

    // Demo mode: return a prepopulated sample email with no API call
    if (tenantSlug === "demo") {
      await new Promise((r) => setTimeout(r, 600));
      setPreviewDraft({
        subject: "Quick thought on Brightpath's positioning",
        body: `Hi Alex,\n\nI took a look at Brightpath Solutions and noticed a disconnect between how strong the product appears and how the brand comes across in market.\n\nSpecifically, the messaging feels like it could belong to any SaaS company. The positioning doesn't reflect the depth of what you've built. That gap tends to show up in conversion rates and sales cycle length.\n\nWe work with growing SaaS teams to close that gap, turning brand clarity into a revenue lever. Would a 15-minute conversation make sense to see if there's a fit?\n\nBest,\nJordan`,
      });
      setGenerating(false);
      return;
    }

    try {
      const res = await fetch(`/api/mc/${tenantSlug}/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead: {
            contact_name: "Alex Rivera",
            contact_title: "VP of Marketing",
            company_name: "Brightpath Solutions",
            company_industry: "SaaS",
            company_city: "Nashville",
            company_state: "TN",
            company_website: "https://brightpathsolutions.com",
            fit_reason: "Growing SaaS company with strong product but unclear brand positioning",
            outreach_angle: "Brand clarity and conversion optimization",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to generate preview" });
        return;
      }

      setPreviewDraft(data.draft);
    } catch {
      setMessage({ type: "error", text: "Failed to generate preview" });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: "var(--font-display)", color: "#d4a574" }}>Strategy</h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 13, margin: "4px 0 0" }}>
            Define your brand voice, goals, and audience. Mission Control uses this to generate emails in your voice.
          </p>
        </div>
      </div>

      {message && (
        <div style={{
          background: message.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${message.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          borderRadius: 10, padding: "10px 16px", fontSize: 13,
          color: message.type === "success" ? "#22c55e" : "#f87171",
          marginBottom: 20,
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Identity */}
        <Section title="Your Business">
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <Field label="Business name">
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Acme Corp" style={inputStyle} required />
            </Field>
            <Field label="Your name (email sender)">
              <input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="Jane Smith" style={inputStyle} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>
            <Field label="What does your business do?">
              <textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="We help growing companies clarify their brand and build web experiences that convert." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            </Field>
            <Field label="Your title">
              <input value={senderTitle} onChange={(e) => setSenderTitle(e.target.value)} placeholder="Founder & CEO" style={inputStyle} />
            </Field>
          </div>
        </Section>

        {/* Audience */}
        <Section title="Target Audience">
          <Field label="Who are your ideal customers?">
            <textarea value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Founders and marketing leaders at mid-size B2B SaaS companies ($2M-$20M ARR) who know their product is strong but their brand and web presence isn't converting." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
          </Field>
        </Section>

        {/* Voice */}
        <Section title="Brand Voice">
          <Field label="How should your emails sound?">
            <textarea value={brandVoice} onChange={(e) => setBrandVoice(e.target.value)} placeholder="Sharp, calm, credible, observant. Write like a peer, not a vendor. Confident but not pushy. Conversational but not sloppy." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
            <Field label="Phrases to avoid (one per line)">
              <textarea value={avoidPhrases} onChange={(e) => setAvoidPhrases(e.target.value)} placeholder={"just checking in\nwould love to connect\nhope this finds you well"} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            </Field>
            <Field label="Example of your tone (optional)">
              <textarea value={exampleTone} onChange={(e) => setExampleTone(e.target.value)} placeholder="We don't chase trends. We build systems that make growth feel inevitable." style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
            </Field>
          </div>
        </Section>

        {/* Offers */}
        <Section title="Services & CTA">
          <Field label="Key offers / services (one per line)">
            <textarea value={keyOffers} onChange={(e) => setKeyOffers(e.target.value)} placeholder={"Brand strategy & positioning\nWebsite design & development\nConversion optimization\nFractional creative direction"} style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 16 }}>
            <Field label="Call-to-action URL">
              <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://yoursite.com/book" style={inputStyle} />
            </Field>
            <Field label="CTA button label">
              <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Book a call" style={inputStyle} />
            </Field>
          </div>
        </Section>

        {/* Goals */}
        <Section title="Business Goals">
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 13, margin: "0 0 16px" }}>
            These goals shape the messaging angle in generated emails. What are you trying to achieve this quarter?
          </p>
          {goals.map((goal, i) => (
            <div key={i} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginBottom: 12, alignItems: isMobile ? "stretch" : "flex-start" }}>
              <div style={{ flex: isMobile ? "1 1 auto" : "0 0 180px" }}>
                <input
                  value={goal.label}
                  onChange={(e) => updateGoal(i, "label", e.target.value)}
                  placeholder="e.g., Increase bookings"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <input
                  value={goal.description}
                  onChange={(e) => updateGoal(i, "description", e.target.value)}
                  placeholder="e.g., Drive 20% more discovery calls from outbound email"
                  style={inputStyle}
                />
              </div>
              {goals.length > 1 && (
                <button type="button" onClick={() => removeGoal(i)} style={{ background: "none", border: "none", color: "rgba(232,223,207,0.25)", cursor: "pointer", fontSize: 18, padding: "8px 4px" }}>
                  x
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addGoal} style={{
            background: "rgba(232,223,207,0.05)", border: "1px dashed rgba(232,223,207,0.15)",
            borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "rgba(232,223,207,0.4)",
            cursor: "pointer", fontFamily: "var(--font-body)",
          }}>
            + Add goal
          </button>
        </Section>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={saving} style={{
            background: "#d4a574", color: "#1a1f2e", border: "none",
            borderRadius: 10, padding: "12px 32px", fontSize: 15, fontWeight: 700,
            cursor: saving ? "wait" : "pointer", fontFamily: "var(--font-display)",
          }}>
            {saving ? "Saving..." : "Save Strategy"}
          </button>
          <button type="button" onClick={handlePreview} disabled={generating || !businessName} style={{
            background: "rgba(212,165,116,0.1)", color: "#d4a574",
            border: "1px solid rgba(212,165,116,0.2)",
            borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600,
            cursor: generating ? "wait" : "pointer", fontFamily: "var(--font-display)",
          }}>
            {generating ? "Generating..." : "Preview Email Draft"}
          </button>
        </div>
      </form>

      {/* Email Preview */}
      {previewDraft && (
        <div style={{ marginTop: 32 }}>
          <Section title="Email Preview">
            <div style={{ background: "#0b1120", borderRadius: 10, padding: "20px 24px", border: "1px solid rgba(232,223,207,0.08)" }}>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginBottom: 4, fontFamily: "var(--font-display)" }}>Subject</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#e8dfcf", marginBottom: 20 }}>{previewDraft.subject}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginBottom: 4, fontFamily: "var(--font-display)" }}>Body</div>
              <div style={{ fontSize: 14, color: "rgba(232,223,207,0.75)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{previewDraft.body}</div>
            </div>
            <p style={{ fontSize: 12, color: "rgba(232,223,207,0.25)", marginTop: 12 }}>
              This is a sample email generated for a fictional lead (Alex Rivera, VP Marketing at Brightpath Solutions). Real emails will be personalized per lead.
            </p>
          </Section>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
      borderRadius: 14, padding: "20px 24px", marginBottom: 20,
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: "var(--font-display)" }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(232,223,207,0.4)", marginBottom: 6, fontFamily: "var(--font-display)" }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", background: "#0b1120",
  border: "1px solid rgba(232,223,207,0.1)", borderRadius: 8, color: "#e8dfcf",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "var(--font-body)",
};
