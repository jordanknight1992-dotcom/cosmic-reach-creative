"use client";

import { useState } from "react";

interface Props {
  tenantSlug: string;
  tenant: { name: string; plan: string; timezone: string };
  user: { full_name: string; email: string; totp_enabled: boolean };
  connectedProviders: string[];
  providerSources?: Record<string, "tenant" | "platform">;
}

const INTEGRATIONS = [
  {
    key: "google_calendar",
    label: "Google Calendar",
    description: "Sync availability, create events with Google Meet links",
    icon: "📅",
  },
  {
    key: "google_analytics",
    label: "Google Analytics (GA4)",
    description: "Website traffic signal for recommendations",
    icon: "📊",
  },
  {
    key: "pdl",
    label: "People Data Labs",
    description: "Auto-generate scored leads matching your ICP",
    icon: "🔍",
  },
  {
    key: "resend",
    label: "Resend (Email)",
    description: "Send emails and booking confirmations from your domain",
    icon: "✉️",
  },
];

export function SettingsView({ tenantSlug, tenant, user, connectedProviders, providerSources = {} }: Props) {
  const [saving, setSaving] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // TOTP state
  const [totpSetup, setTotpSetup] = useState(false);
  const [totpQr, setTotpQr] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpLoading, setTotpLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" });
      return;
    }

    setChangingPassword(true);

    try {
      const res = await fetch("/api/mc/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to change password" });
        return;
      }

      setMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setChangingPassword(false);
    }
  }

  async function saveCredential(provider: string) {
    if (!keyValue.trim()) return;
    setSaving(provider);
    setMessage(null);

    try {
      const res = await fetch(`/api/mc/${tenantSlug}/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, credential: keyValue }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save" });
        return;
      }

      setMessage({ type: "success", text: `${provider} connected successfully` });
      setShowKeyInput(null);
      setKeyValue("");
      // Refresh to show updated status
      window.location.reload();
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 28px 0", fontFamily: 'var(--font-display)', color: '#d4a574' }}>Settings</h1>

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

      {/* Workspace info */}
      <Section title="Workspace">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InfoRow label="Workspace" value={tenant.name} />
          <InfoRow label="Plan" value={tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} />
          <InfoRow label="Timezone" value={tenant.timezone} />
          <InfoRow label="URL" value={`/mission-control/${tenantSlug}`} />
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <InfoRow label="Name" value={user.full_name} />
          <InfoRow label="Email" value={user.email} />
        </div>
      </Section>

      {/* Security */}
      <Section title="Security">
        <form onSubmit={handleChangePassword}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", display: "block", marginBottom: 4, fontFamily: "var(--font-display)" }}>
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={securityInputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", display: "block", marginBottom: 4, fontFamily: "var(--font-display)" }}>
                New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                style={securityInputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", display: "block", marginBottom: 4, fontFamily: "var(--font-display)" }}>
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                minLength={8}
                style={securityInputStyle}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={changingPassword}
            style={{
              marginTop: 12,
              background: "rgba(212,165,116,0.1)",
              color: "#d4a574",
              border: "1px solid rgba(212,165,116,0.2)",
              borderRadius: 8,
              padding: "8px 20px",
              fontSize: 13,
              fontWeight: 600,
              cursor: changingPassword ? "wait" : "pointer",
              fontFamily: "var(--font-display)",
            }}
          >
            {changingPassword ? "Updating..." : "Update password"}
          </button>
        </form>

        {/* Two-Factor Authentication */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(232,223,207,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>Two-Factor Authentication</div>
              <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2 }}>
                {user.totp_enabled ? "Enabled — your account is protected with an authenticator app" : "Add an extra layer of security with Google Authenticator or Authy"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: user.totp_enabled ? "#22c55e" : "rgba(232,223,207,0.2)" }} />
              <span style={{ fontSize: 12, color: user.totp_enabled ? "#22c55e" : "rgba(232,223,207,0.4)" }}>
                {user.totp_enabled ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {!user.totp_enabled && !totpSetup && (
            <button
              onClick={async () => {
                setTotpLoading(true);
                try {
                  const res = await fetch("/api/mc/account/totp");
                  const data = await res.json();
                  if (res.ok) {
                    setTotpQr(data.qrDataUrl);
                    setTotpSetup(true);
                  } else {
                    setMessage({ type: "error", text: data.error || "Failed to start 2FA setup" });
                  }
                } catch { setMessage({ type: "error", text: "Something went wrong" }); }
                finally { setTotpLoading(false); }
              }}
              disabled={totpLoading}
              style={{
                background: "rgba(212,165,116,0.1)", color: "#d4a574",
                border: "1px solid rgba(212,165,116,0.2)", borderRadius: 8,
                padding: "8px 20px", fontSize: 13, fontWeight: 600,
                cursor: totpLoading ? "wait" : "pointer", fontFamily: "var(--font-display)",
              }}
            >
              {totpLoading ? "Setting up..." : "Enable 2FA"}
            </button>
          )}

          {totpSetup && totpQr && (
            <div style={{ background: "#0b1120", borderRadius: 10, padding: 20, border: "1px solid rgba(232,223,207,0.08)" }}>
              <p style={{ fontSize: 13, color: "rgba(232,223,207,0.6)", margin: "0 0 14px" }}>
                Scan this QR code with your authenticator app, then enter the 6-digit code to verify.
              </p>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={totpQr} alt="TOTP QR Code" width={200} height={200} style={{ borderRadius: 8 }} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  style={{
                    ...securityInputStyle,
                    width: 120, textAlign: "center", fontSize: 18,
                    fontWeight: 700, letterSpacing: 4,
                  }}
                />
                <button
                  onClick={async () => {
                    setTotpLoading(true);
                    try {
                      const res = await fetch("/api/mc/account/totp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "enable", code: totpCode }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setMessage({ type: "success", text: "Two-factor authentication enabled" });
                        setTotpSetup(false);
                        setTotpQr(null);
                        setTotpCode("");
                        window.location.reload();
                      } else {
                        setMessage({ type: "error", text: data.error || "Verification failed" });
                      }
                    } catch { setMessage({ type: "error", text: "Something went wrong" }); }
                    finally { setTotpLoading(false); }
                  }}
                  disabled={totpCode.length !== 6 || totpLoading}
                  style={{
                    background: "#d4a574", color: "#0b1120", border: "none",
                    borderRadius: 8, padding: "8px 20px", fontSize: 13,
                    fontWeight: 700, cursor: totpCode.length === 6 ? "pointer" : "default",
                    opacity: totpCode.length === 6 ? 1 : 0.5, fontFamily: "var(--font-display)",
                  }}
                >
                  {totpLoading ? "Verifying..." : "Verify & Enable"}
                </button>
              </div>
            </div>
          )}

          {user.totp_enabled && (
            <button
              onClick={async () => {
                setTotpLoading(true);
                try {
                  const res = await fetch("/api/mc/account/totp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "disable" }),
                  });
                  if (res.ok) {
                    setMessage({ type: "success", text: "Two-factor authentication disabled" });
                    window.location.reload();
                  }
                } catch { setMessage({ type: "error", text: "Something went wrong" }); }
                finally { setTotpLoading(false); }
              }}
              style={{
                background: "rgba(239,68,68,0.1)", color: "#f87171",
                border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
                padding: "8px 20px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--font-display)",
              }}
            >
              Disable 2FA
            </button>
          )}
        </div>
      </Section>

      {/* Integrations */}
      <Section title="Integrations">
        <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 13, margin: "0 0 16px 0" }}>
          Connect your own provider keys. Credentials are encrypted at rest and never shown again after saving.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {INTEGRATIONS.map((int) => {
            const connected = connectedProviders.includes(int.key);
            const source = providerSources[int.key];
            const isPlatform = source === "platform";
            return (
              <div key={int.key} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 10,
                border: `1px solid ${connected ? (isPlatform ? "rgba(212,165,116,0.15)" : "rgba(34,197,94,0.15)") : "rgba(232,223,207,0.1)"}`,
                background: connected ? (isPlatform ? "rgba(212,165,116,0.03)" : "rgba(34,197,94,0.03)") : "transparent",
              }}>
                <span style={{ fontSize: 20 }}>{int.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{int.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{int.description}</div>
                </div>

                {connected ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: isPlatform ? "#d4a574" : "#22c55e" }} />
                    <span style={{ fontSize: 12, color: isPlatform ? "#d4a574" : "#22c55e", fontWeight: 500 }}>
                      {isPlatform ? "Pre-configured" : "Connected"}
                    </span>
                  </div>
                ) : showKeyInput === int.key ? (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      type="password"
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      placeholder={`Paste ${int.label} key`}
                      style={{
                        padding: "6px 10px", background: "#0b1120",
                        border: "1px solid rgba(232,223,207,0.1)", borderRadius: 6,
                        color: "#e8dfcf", fontSize: 12, width: 200,
                        outline: "none", fontFamily: 'var(--font-body)',
                      }}
                    />
                    <button
                      onClick={() => saveCredential(int.key)}
                      disabled={saving === int.key}
                      style={{
                        background: "#e04747", color: "#fff", border: "none",
                        borderRadius: 6, padding: "6px 12px", fontSize: 12,
                        fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
                      }}
                    >
                      {saving === int.key ? "..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setShowKeyInput(null); setKeyValue(""); }}
                      style={{
                        background: "none", border: "none", color: "rgba(232,223,207,0.35)",
                        cursor: "pointer", fontSize: 14,
                      }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowKeyInput(int.key)}
                    style={{
                      background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
                      borderRadius: 8, padding: "6px 14px", fontSize: 12,
                      fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)',
                    }}
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
      borderRadius: 14, padding: "20px 24px", marginBottom: 20,
    }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>{title}</h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginBottom: 2, fontFamily: 'var(--font-display)' }}>{label}</div>
      <div style={{ fontSize: 14, color: "#e8dfcf", fontWeight: 500 }}>{value}</div>
    </div>
  );
}

const securityInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  background: "#0b1120",
  border: "1px solid rgba(232,223,207,0.1)",
  borderRadius: 6,
  color: "#e8dfcf",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-body)",
};
