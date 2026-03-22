"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tenantSlug: string;
  tenantName: string;
  userName: string;
  progress: {
    steps: Record<string, unknown>;
    current_step: string;
  };
  connectedProviders: string[];
  providerSources?: Record<string, "tenant" | "platform">;
}

const STEPS = [
  { key: "workspace", label: "Workspace", description: "Your business details" },
  { key: "calendar", label: "Calendar", description: "Connect Google Calendar" },
  { key: "booking", label: "Booking", description: "Meeting preferences" },
  { key: "crm", label: "CRM", description: "Lead target & pipeline" },
  { key: "integrations", label: "Integrations", description: "Signal sources" },
  { key: "review", label: "Launch", description: "Review & go live" },
];

export function OnboardingWizard({ tenantSlug, tenantName, userName, progress, connectedProviders, providerSources = {} }: Props) {
  const router = useRouter();
  const base = `/mission-control/${tenantSlug}`;

  const initialStep = STEPS.findIndex((s) => s.key === progress.current_step);
  const [currentStep, setCurrentStep] = useState(Math.max(0, initialStep));
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    (progress.steps as Record<string, boolean>) || {}
  );
  const [saving, setSaving] = useState(false);

  // Form state per step
  const [workspace, setWorkspace] = useState({
    industry: "",
    timezone: "America/Chicago",
    website: "",
    leadTarget: "20",
  });
  const [booking, setBooking] = useState({
    meetingLengths: ["30", "60"],
    defaultTitle: "Meeting with " + userName.split(" ")[0],
  });
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({});

  async function saveProgress(stepKey: string) {
    setSaving(true);
    try {
      const newCompleted = { ...completedSteps, [stepKey]: true };
      setCompletedSteps(newCompleted);

      await fetch(`/api/mc/${tenantSlug}/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steps: newCompleted,
          current_step: STEPS[Math.min(currentStep + 1, STEPS.length - 1)].key,
          data: { workspace, booking },
        }),
      });
    } catch {
      // Progress will be retried on next step
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    const step = STEPS[currentStep];
    await saveProgress(step.key);
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  async function handleComplete() {
    await saveProgress("review");
    // Mark onboarding as complete
    await fetch(`/api/mc/${tenantSlug}/onboarding/complete`, { method: "POST" });
    router.push(base);
  }

  async function saveCredential(provider: string) {
    const value = keyInputs[provider];
    if (!value?.trim()) return;
    setSaving(true);
    try {
      await fetch(`/api/mc/${tenantSlug}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, credential: value }),
      });
      // Update local state
      connectedProviders.push(provider);
      setKeyInputs({ ...keyInputs, [provider]: "" });
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  const step = STEPS[currentStep];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#d4a574", marginBottom: 8, fontFamily: 'var(--font-display)' }}>
          Mission Control Setup
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px 0", fontFamily: 'var(--font-display)', color: '#e8dfcf' }}>
          Setting up {tenantName}
        </h1>
        <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: 0 }}>
          Step {currentStep + 1} of {STEPS.length}
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 36 }}>
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => i <= currentStep && setCurrentStep(i)}
            style={{
              flex: 1, height: 4, borderRadius: 2, border: "none", cursor: i <= currentStep ? "pointer" : "default",
              background:
                i < currentStep || completedSteps[s.key]
                  ? "#d4a574"
                  : i === currentStep
                    ? "#d4a574"
                    : "rgba(232,223,207,0.08)",
              transition: "background 0.2s",
              opacity: i === currentStep ? 0.7 : 1,
            }}
          />
        ))}
      </div>

      {/* Step labels */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => i <= currentStep && setCurrentStep(i)}
            style={{
              background: "none", border: "none", textAlign: "center", cursor: i <= currentStep ? "pointer" : "default",
              opacity: i === currentStep ? 1 : i < currentStep ? 0.6 : 0.3,
              fontFamily: 'var(--font-body)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: i === currentStep ? 700 : 400, color: i === currentStep ? "#d4a574" : "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)' }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Step content */}
      <div style={{
        background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
        borderRadius: 16, padding: "32px 28px",
      }}>
        {step.key === "workspace" && (
          <>
            <StepHeader title="Workspace Details" subtitle="Tell us about your business so Mission Control can tailor recommendations." />
            <Field label="Industry">
              <input
                value={workspace.industry}
                onChange={(e) => setWorkspace({ ...workspace, industry: e.target.value })}
                placeholder="e.g., SaaS, Consulting, Agency"
                style={inputStyle}
              />
            </Field>
            <Field label="Website">
              <input
                value={workspace.website}
                onChange={(e) => setWorkspace({ ...workspace, website: e.target.value })}
                placeholder="https://yourcompany.com"
                style={inputStyle}
              />
            </Field>
            <Field label="Timezone">
              <select
                value={workspace.timezone}
                onChange={(e) => setWorkspace({ ...workspace, timezone: e.target.value })}
                style={{ ...inputStyle, appearance: "auto" as React.CSSProperties["appearance"] }}
              >
                <option value="America/New_York">Eastern</option>
                <option value="America/Chicago">Central</option>
                <option value="America/Denver">Mountain</option>
                <option value="America/Los_Angeles">Pacific</option>
              </select>
            </Field>
            <Field label="Monthly lead target">
              <input
                type="number"
                value={workspace.leadTarget}
                onChange={(e) => setWorkspace({ ...workspace, leadTarget: e.target.value })}
                placeholder="20"
                style={inputStyle}
              />
              <div style={{ fontSize: 12, color: "rgba(232,223,207,0.25)", marginTop: 4 }}>
                How many new leads do you want to work per month?
              </div>
            </Field>
          </>
        )}

        {step.key === "calendar" && (
          <>
            <StepHeader title="Connect Calendar" subtitle="Link your Google Calendar so Mission Control can manage availability and create meetings." />
            <IntegrationCard
              label="Google Calendar"
              icon="📅"
              connected={connectedProviders.includes("google_calendar")}
              source={providerSources["google_calendar"]}
              description="Enables real-time availability, automatic meeting creation, and Google Meet links."
            >
              {!connectedProviders.includes("google_calendar") && (
                <div style={{ marginTop: 12 }}>
                  <input
                    type="password"
                    value={keyInputs.google_calendar || ""}
                    onChange={(e) => setKeyInputs({ ...keyInputs, google_calendar: e.target.value })}
                    placeholder="Google OAuth refresh token"
                    style={inputStyle}
                  />
                  <button onClick={() => saveCredential("google_calendar")} disabled={saving} style={btnPrimary}>
                    {saving ? "Saving..." : "Connect"}
                  </button>
                  <p style={{ fontSize: 12, color: "rgba(232,223,207,0.25)", marginTop: 8 }}>
                    Jordan will help you generate this during setup. You can skip and return later.
                  </p>
                </div>
              )}
              {providerSources["google_calendar"] === "platform" && (
                <p style={{ fontSize: 12, color: "rgba(212,165,116,0.5)", marginTop: 8 }}>
                  Already configured by Cosmic Reach Creative. No action needed.
                </p>
              )}
            </IntegrationCard>
          </>
        )}

        {step.key === "booking" && (
          <>
            <StepHeader title="Meeting Preferences" subtitle="Configure how people book time with you." />
            <Field label="Default meeting title">
              <input
                value={booking.defaultTitle}
                onChange={(e) => setBooking({ ...booking, defaultTitle: e.target.value })}
                style={inputStyle}
              />
            </Field>
            <Field label="Preferred meeting lengths">
              <div style={{ display: "flex", gap: 8 }}>
                {["15", "30", "60", "90"].map((len) => (
                  <button
                    key={len}
                    onClick={() => {
                      const lengths = booking.meetingLengths.includes(len)
                        ? booking.meetingLengths.filter((l) => l !== len)
                        : [...booking.meetingLengths, len];
                      setBooking({ ...booking, meetingLengths: lengths });
                    }}
                    style={{
                      padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer",
                      background: booking.meetingLengths.includes(len) ? "#d4a574" : "rgba(232,223,207,0.05)",
                      color: booking.meetingLengths.includes(len) ? "#0b1120" : "rgba(232,223,207,0.5)",
                      border: "none",
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {len} min
                  </button>
                ))}
              </div>
            </Field>
            <div style={{
              background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "12px 16px",
              border: "1px solid rgba(212,165,116,0.1)", marginTop: 16,
            }}>
              <div style={{ fontSize: 13, color: "rgba(232,223,207,0.5)" }}>
                PTO & blocked time can be managed in Meetings after setup.
              </div>
            </div>
          </>
        )}

        {step.key === "crm" && (
          <>
            <StepHeader title="CRM Setup" subtitle="Your CRM is ready to go. Here's what to know." />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ReadyItem label="Lead Pipeline" detail="Candidate → Qualified → Ready → Emailed → Replied → Meeting → Won" />
              <ReadyItem label="Fit Scoring" detail="Automatic 0-100 scoring based on title, industry, location, and email validity" />
              <ReadyItem label="Activity Tracking" detail="Every email, stage change, and note is logged automatically" />
              <ReadyItem label="Email Generation" detail="AI-powered draft generation personalized by lead persona" />
            </div>
            <div style={{
              background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "12px 16px",
              border: "1px solid rgba(212,165,116,0.1)", marginTop: 16,
            }}>
              <div style={{ fontSize: 13, color: "rgba(232,223,207,0.5)" }}>
                Leads can be added manually, imported from People Data Labs, or auto-created when someone books a meeting.
              </div>
            </div>
          </>
        )}

        {step.key === "integrations" && (
          <>
            <StepHeader title="Signal Sources" subtitle="Connect additional services to deepen Mission Control's recommendations." />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { key: "google_analytics", label: "Google Analytics (GA4)", icon: "📊", desc: "Traffic signal for website performance recommendations.", placeholder: "GA4 Property ID" },
                { key: "pdl", label: "People Data Labs", icon: "🔍", desc: "Auto-generate scored leads matching your ideal customer profile.", placeholder: "PDL API Key" },
                { key: "resend", label: "Resend", icon: "✉️", desc: "Send emails from your own domain.", placeholder: "Resend API Key" },
              ].map((int) => {
                const isConnected = connectedProviders.includes(int.key);
                const source = providerSources[int.key];
                return (
                  <IntegrationCard
                    key={int.key}
                    label={int.label}
                    icon={int.icon}
                    connected={isConnected}
                    source={source}
                    description={int.desc}
                  >
                    {!isConnected && (
                      <div style={{ marginTop: 12 }}>
                        <input
                          type="password"
                          value={keyInputs[int.key] || ""}
                          onChange={(e) => setKeyInputs({ ...keyInputs, [int.key]: e.target.value })}
                          placeholder={int.placeholder}
                          style={inputStyle}
                        />
                        <button onClick={() => saveCredential(int.key)} disabled={saving} style={btnPrimary}>
                          {saving ? "Saving..." : "Connect"}
                        </button>
                      </div>
                    )}
                    {source === "platform" && (
                      <p style={{ fontSize: 12, color: "rgba(212,165,116,0.5)", marginTop: 8 }}>
                        Already configured by Cosmic Reach Creative. No action needed.
                      </p>
                    )}
                  </IntegrationCard>
                );
              })}
            </div>

            <div style={{
              background: "rgba(232,223,207,0.03)", borderRadius: 10, padding: "12px 16px",
              border: "1px solid rgba(232,223,207,0.06)", marginTop: 16,
            }}>
              <div style={{ fontSize: 13, color: "rgba(232,223,207,0.35)" }}>
                All integrations are optional. Mission Control works with just CRM and meetings.
                Connect more sources to unlock deeper recommendations.
              </div>
            </div>
          </>
        )}

        {step.key === "review" && (
          <>
            <StepHeader title="Ready to Launch" subtitle={`${tenantName} is almost ready. Review your setup below.`} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <ChecklistItem label="Workspace created" done />
              <ChecklistItem label={`Calendar ${providerSources["google_calendar"] === "platform" ? "(pre-configured)" : "connected"}`} done={connectedProviders.includes("google_calendar")} optional />
              <ChecklistItem label="Meeting preferences set" done={completedSteps["booking"] ?? false} />
              <ChecklistItem label="CRM ready" done />
              <ChecklistItem label={`GA4 ${providerSources["google_analytics"] === "platform" ? "(pre-configured)" : "connected"}`} done={connectedProviders.includes("google_analytics")} optional />
              <ChecklistItem label={`PDL ${providerSources["pdl"] === "platform" ? "(pre-configured)" : "connected"}`} done={connectedProviders.includes("pdl")} optional />
              <ChecklistItem label={`Resend ${providerSources["resend"] === "platform" ? "(pre-configured)" : "connected"}`} done={connectedProviders.includes("resend")} optional />
            </div>
          </>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(232,223,207,0.08)" }}>
          {currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                background: "none", border: "1px solid rgba(232,223,207,0.1)", color: "rgba(232,223,207,0.5)",
                borderRadius: 10, padding: "10px 20px", fontSize: 14,
                fontWeight: 500, cursor: "pointer",
                fontFamily: 'var(--font-body)',
              }}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step.key === "review" ? (
            <button
              onClick={handleComplete}
              disabled={saving}
              style={{
                background: "linear-gradient(135deg, #d4a574, #e04747)", color: "#fff", border: "none",
                borderRadius: 10, padding: "12px 32px", fontSize: 15,
                fontWeight: 700, cursor: "pointer",
                fontFamily: 'var(--font-display)',
              }}
            >
              {saving ? "Launching..." : "Launch Mission Control →"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={saving}
              style={{
                background: "#e04747", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 24px", fontSize: 14,
                fontWeight: 600, cursor: "pointer",
                fontFamily: 'var(--font-display)',
              }}
            >
              {saving ? "Saving..." : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px 0", color: "#e8dfcf", fontFamily: 'var(--font-display)' }}>{title}</h2>
      <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.5)", marginBottom: 6, fontFamily: 'var(--font-display)' }}>{label}</label>
      {children}
    </div>
  );
}

function IntegrationCard({
  label, icon, connected, description, source, children,
}: {
  label: string; icon: string; connected: boolean; description: string; source?: "tenant" | "platform"; children?: React.ReactNode;
}) {
  const isPlatform = source === "platform";
  return (
    <div style={{
      padding: "16px 18px", borderRadius: 12,
      border: `1px solid ${connected ? "rgba(34,197,94,0.15)" : "rgba(232,223,207,0.1)"}`,
      background: connected ? "rgba(34,197,94,0.03)" : "transparent",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{label}</div>
          <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{description}</div>
        </div>
        {connected && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: isPlatform ? "#d4a574" : "#22c55e" }} />
            <span style={{ fontSize: 12, color: isPlatform ? "#d4a574" : "#22c55e", fontWeight: 500 }}>
              {isPlatform ? "Pre-configured" : "Connected"}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ReadyItem({ label, detail }: { label: string; detail: string }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 0" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
        <span style={{ color: "#22c55e", fontSize: 12 }}>✓</span>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{label}</div>
        <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

function ChecklistItem({ label, done, optional }: { label: string; done: boolean; optional?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
      <div style={{
        width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
        background: done ? "rgba(34,197,94,0.15)" : "rgba(232,223,207,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done ? (
          <span style={{ color: "#22c55e", fontSize: 12 }}>✓</span>
        ) : (
          <span style={{ color: "rgba(232,223,207,0.25)", fontSize: 10 }}>-</span>
        )}
      </div>
      <span style={{ fontSize: 14, color: done ? "#e8dfcf" : "rgba(232,223,207,0.35)", fontWeight: done ? 500 : 400 }}>
        {label}
      </span>
      {optional && !done && (
        <span style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginLeft: 4 }}>optional</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", background: "#0b1120",
  border: "1px solid rgba(232,223,207,0.1)", borderRadius: 8, color: "#e8dfcf",
  fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: 'var(--font-body)',
};

const btnPrimary: React.CSSProperties = {
  background: "#e04747", color: "#fff", border: "none",
  borderRadius: 8, padding: "8px 16px", fontSize: 13,
  fontWeight: 600, cursor: "pointer", marginTop: 8,
  fontFamily: 'var(--font-display)',
};
