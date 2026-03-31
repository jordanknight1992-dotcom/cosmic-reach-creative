"use client";

import { useState } from "react";

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
  { key: "integrations", label: "Connections", description: "Connect data sources" },
  { key: "review", label: "Launch", description: "Review & go live" },
];

export function OnboardingWizard({ tenantSlug, tenantName, userName, progress, connectedProviders, providerSources = {} }: Props) {
  const base = `/mission-control/${tenantSlug}`;

  const initialStep = STEPS.findIndex((s) => s.key === progress.current_step);
  const [currentStep, setCurrentStep] = useState(Math.max(0, initialStep));
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    (progress.steps as Record<string, boolean>) || {}
  );
  const [saving, setSaving] = useState(false);

  // Form state
  const [workspace, setWorkspace] = useState({
    industry: "",
    timezone: "America/Chicago",
    website: "",
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
          data: { workspace },
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
    await fetch(`/api/mc/${tenantSlug}/onboarding/complete`, { method: "POST" });
    window.location.href = base;
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
      <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
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
            <StepHeader title="Workspace Details" subtitle="Basic information about your business." />
            <Field label="Industry">
              <input
                value={workspace.industry}
                onChange={(e) => setWorkspace({ ...workspace, industry: e.target.value })}
                placeholder="e.g., Wedding Planning, Consulting, SaaS"
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
          </>
        )}

        {step.key === "integrations" && (
          <>
            <StepHeader title="Connect Data Sources" subtitle="Connect Google Analytics to see traffic, sources, and page performance inside Mission Control." />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <IntegrationCard
                label="Google Analytics (GA4)"
                icon="📊"
                connected={connectedProviders.includes("google_analytics")}
                source={providerSources["google_analytics"]}
                description="See sessions, page views, traffic sources, and top pages."
              >
                {!connectedProviders.includes("google_analytics") && (
                  <div style={{ marginTop: 12 }}>
                    <input
                      type="text"
                      value={keyInputs.google_analytics || ""}
                      onChange={(e) => setKeyInputs({ ...keyInputs, google_analytics: e.target.value })}
                      placeholder="GA4 Property ID (e.g., 123456789)"
                      style={inputStyle}
                    />
                    <button onClick={() => saveCredential("google_analytics")} disabled={saving} style={btnPrimary}>
                      {saving ? "Saving..." : "Connect"}
                    </button>
                    <p style={{ fontSize: 12, color: "rgba(232,223,207,0.25)", marginTop: 8 }}>
                      Found in Google Analytics → Admin → Property Settings. You can skip and add this later.
                    </p>
                  </div>
                )}
                {providerSources["google_analytics"] === "platform" && (
                  <p style={{ fontSize: 12, color: "rgba(212,165,116,0.5)", marginTop: 8 }}>
                    Already configured by Cosmic Reach Creative. No action needed.
                  </p>
                )}
              </IntegrationCard>
            </div>

            <div style={{
              background: "rgba(232,223,207,0.03)", borderRadius: 10, padding: "12px 16px",
              border: "1px solid rgba(232,223,207,0.06)", marginTop: 20,
            }}>
              <div style={{ fontSize: 13, color: "rgba(232,223,207,0.35)" }}>
                Google Analytics is optional. Mission Control tracks form submissions from your website automatically.
                Connecting GA4 adds traffic data, top pages, and source breakdowns.
              </div>
            </div>
          </>
        )}

        {step.key === "review" && (
          <>
            <StepHeader title="Ready to Launch" subtitle={`${tenantName} is set up. Here is what Mission Control will do for you.`} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <ReadyItem label="Captures leads" detail="Every contact and audit form submission from your website appears automatically." />
              <ReadyItem label="Shows where leads come from" detail="See which sources and pages are driving inquiries." />
              <ReadyItem label="Tracks site performance" detail="Sessions, page views, bounce rates, and trends over time." />
              <ReadyItem label="Highlights what is working" detail="Top pages, traffic sources, and keyword visibility at a glance." />
            </div>

            <div style={{ borderTop: "1px solid rgba(232,223,207,0.08)", paddingTop: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <ChecklistItem label="Workspace created" done />
                <ChecklistItem label="Google Analytics connected" done={connectedProviders.includes("google_analytics")} optional />
              </div>
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
                background: "#d4a574", color: "#1a1f2e", border: "none",
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
                background: "#d4a574", color: "#1a1f2e", border: "none",
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
  background: "#d4a574", color: "#1a1f2e", border: "none",
  borderRadius: 8, padding: "8px 16px", fontSize: 13,
  fontWeight: 600, cursor: "pointer", marginTop: 8,
  fontFamily: 'var(--font-display)',
};
