"use client";

import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface MemberInfo {
  id: number;
  email: string;
  full_name: string;
  role: string;
  status: string;
  last_login_at: string | null;
}

interface SupportSessionInfo {
  id: string;
  user_name: string;
  reason: string;
  started_at: string;
  ended_at: string | null;
  status: string;
}

interface Props {
  tenantSlug: string;
  tenant: { name: string; plan: string; timezone: string };
  user: { id: number; full_name: string; email: string; totp_enabled: boolean; is_super_admin: boolean };
  connectedProviders: string[];
  providerSources?: Record<string, "tenant" | "platform">;
  members: MemberInfo[];
  icp: {
    target_roles: string[];
    target_industries: string[];
    target_geo: string[];
    company_size_min: number | null;
    company_size_max: number | null;
    priorities: string[];
    exclusion_rules: string[];
  } | null;
  supportAccess: {
    enabled: boolean;
    recentSessions: SupportSessionInfo[];
  };
  isSupportMode?: boolean;
}

const INTEGRATIONS = [
  { key: "google_calendar", label: "Google Calendar", description: "Sync availability, create events with Google Meet links", icon: "📅" },
  { key: "google_analytics", label: "Google Analytics (GA4)", description: "Website traffic signal for recommendations", icon: "📊" },
  { key: "openai", label: "OpenAI", description: "Powers AI email drafts personalized to each lead's profile", icon: "🤖" },
  { key: "pdl", label: "People Data Labs", description: "Search and enrich leads matching your ICP", icon: "🔍" },
  { key: "resend", label: "Resend (Email)", description: "Send emails and booking confirmations from your domain", icon: "✉️" },
];

export function SettingsView({ tenantSlug, tenant, user, connectedProviders, providerSources = {}, members, icp, supportAccess, isSupportMode }: Props) {
  const isMobile = useIsMobile();
  const [saving, setSaving] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "team" | "icp" | "integrations" | "security">("general");

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

  // Team state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);

  // ICP state
  const [icpRoles, setIcpRoles] = useState(icp?.target_roles?.join(", ") || "");
  const [icpIndustries, setIcpIndustries] = useState(icp?.target_industries?.join(", ") || "");
  const [icpGeo, setIcpGeo] = useState(icp?.target_geo?.join(", ") || "");
  const [icpSizeMin, setIcpSizeMin] = useState(icp?.company_size_min?.toString() || "");
  const [icpSizeMax, setIcpSizeMax] = useState(icp?.company_size_max?.toString() || "");
  const [icpExclusions, setIcpExclusions] = useState(icp?.exclusion_rules?.join(", ") || "");
  const [savingIcp, setSavingIcp] = useState(false);

  // Support access state
  const [supportEnabled, setSupportEnabled] = useState(supportAccess.enabled);
  const [togglingSupportAccess, setTogglingSupportAccess] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmNewPassword) { setMessage({ type: "error", text: "New passwords do not match" }); return; }
    if (newPassword.length < 8) { setMessage({ type: "error", text: "New password must be at least 8 characters" }); return; }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/mc/account/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: data.error || "Failed to change password" }); return; }
      setMessage({ type: "success", text: "Password changed successfully" });
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch { setMessage({ type: "error", text: "Something went wrong" }); }
    finally { setChangingPassword(false); }
  }

  async function saveCredential(provider: string) {
    if (!keyValue.trim()) return;
    setSaving(provider); setMessage(null);
    try {
      const res = await fetch(`/api/mc/${tenantSlug}/credentials`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, credential: keyValue }) });
      if (!res.ok) { const data = await res.json(); setMessage({ type: "error", text: data.error || "Failed to save" }); return; }
      setMessage({ type: "success", text: `${provider} connected successfully` });
      setShowKeyInput(null); setKeyValue(""); window.location.reload();
    } catch { setMessage({ type: "error", text: "Something went wrong" }); }
    finally { setSaving(null); }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true); setMessage(null);
    try {
      const res = await fetch("/api/mc/team", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", tenantSlug, email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage({ type: "error", text: data.error || "Failed to send invitation" }); return; }
      setMessage({ type: "success", text: `Invitation sent to ${inviteEmail}` });
      setInviteEmail("");
    } catch { setMessage({ type: "error", text: "Something went wrong" }); }
    finally { setInviting(false); }
  }

  async function handleSaveICP(e: React.FormEvent) {
    e.preventDefault();
    setSavingIcp(true); setMessage(null);
    try {
      const res = await fetch("/api/mc/icp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantSlug,
          target_roles: icpRoles.split(",").map((s) => s.trim()).filter(Boolean),
          target_industries: icpIndustries.split(",").map((s) => s.trim()).filter(Boolean),
          target_geo: icpGeo.split(",").map((s) => s.trim()).filter(Boolean),
          company_size_min: icpSizeMin ? parseInt(icpSizeMin) : null,
          company_size_max: icpSizeMax ? parseInt(icpSizeMax) : null,
          exclusion_rules: icpExclusions.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) { setMessage({ type: "error", text: "Failed to save ICP" }); return; }
      setMessage({ type: "success", text: "ICP configuration saved. Scoring will use these rules." });
    } catch { setMessage({ type: "error", text: "Something went wrong" }); }
    finally { setSavingIcp(false); }
  }

  async function handleToggleSupportAccess() {
    setTogglingSupportAccess(true);
    try {
      const res = await fetch("/api/mc/support-history", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSlug, enabled: !supportEnabled }),
      });
      if (res.ok) {
        setSupportEnabled(!supportEnabled);
        setMessage({ type: "success", text: `Support access ${!supportEnabled ? "enabled" : "disabled"}` });
      }
    } catch { setMessage({ type: "error", text: "Failed to update" }); }
    finally { setTogglingSupportAccess(false); }
  }

  const TABS: { key: typeof activeTab; label: string }[] = [
    { key: "general", label: "General" },
    { key: "team", label: "Team" },
    { key: "icp", label: "ICP & Scoring" },
    { key: "integrations", label: "Integrations" },
    { key: "security", label: "Security" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 20px 0", fontFamily: 'var(--font-display)', color: '#d4a574' }}>Settings</h1>

      {message && (
        <div style={{
          background: message.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
          border: `1px solid ${message.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          borderRadius: 10, padding: "10px 16px", fontSize: 13,
          color: message.type === "success" ? "#22c55e" : "#f87171", marginBottom: 20,
        }}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => { setActiveTab(t.key); setMessage(null); }}
            style={{
              padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: "none", cursor: "pointer", fontFamily: "var(--font-display)",
              background: activeTab === t.key ? "rgba(212,165,116,0.12)" : "transparent",
              color: activeTab === t.key ? "#d4a574" : "rgba(232,223,207,0.4)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <>
          <Section title="Workspace">
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <InfoRow label="Workspace" value={tenant.name} />
              <InfoRow label="Plan" value={tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)} />
              <InfoRow label="Timezone" value={tenant.timezone} />
              <InfoRow label="URL" value={`/mission-control/${tenantSlug}`} />
            </div>
          </Section>
          <Section title="Account">
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <InfoRow label="Name" value={user.full_name} />
              <InfoRow label="Email" value={user.email} />
            </div>
          </Section>
        </>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <>
          <Section title="Team Members">
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {members.map((m) => (
                <div key={m.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 8, border: "1px solid rgba(232,223,207,0.08)",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: "rgba(212,165,116,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, color: "#d4a574", flexShrink: 0,
                  }}>
                    {m.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf" }}>{m.full_name}</div>
                    <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)" }}>{m.email}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, textTransform: "uppercase", padding: "2px 8px",
                    borderRadius: 4, fontFamily: "var(--font-display)", letterSpacing: "0.04em",
                    background: m.role === "owner" ? "rgba(212,165,116,0.1)" : "rgba(232,223,207,0.05)",
                    color: m.role === "owner" ? "#d4a574" : "rgba(232,223,207,0.4)",
                  }}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>

            {!isSupportMode && (
              <div style={{ borderTop: "1px solid rgba(232,223,207,0.08)", paddingTop: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e8dfcf", marginBottom: 12 }}>Invite Team Member</div>
                <form onSubmit={handleInvite} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" required style={{ ...fieldInputStyle, flex: 1, minWidth: 200 }} />
                  <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ ...fieldInputStyle, width: "auto" }}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button type="submit" disabled={inviting} style={{
                    background: "#d4a574", color: "#0b1120", border: "none", borderRadius: 8,
                    padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)",
                  }}>
                    {inviting ? "Sending..." : "Send Invite"}
                  </button>
                </form>
              </div>
            )}
          </Section>
        </>
      )}

      {/* ICP & Scoring Tab */}
      {activeTab === "icp" && (
        <Section title="Ideal Customer Profile">
          <p style={{ fontSize: 13, color: "rgba(232,223,207,0.4)", margin: "0 0 16px" }}>
            These settings shape how leads are scored and prioritized in your workspace. Lead scoring uses these rules directly. No AI is required for baseline scoring.
          </p>
          <form onSubmit={handleSaveICP}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <FieldGroup label="Target Roles" hint="Comma-separated: founder, CEO, VP Marketing">
                <input value={icpRoles} onChange={(e) => setIcpRoles(e.target.value)} placeholder="founder, CEO, VP Marketing, Director" style={fieldInputStyle} />
              </FieldGroup>
              <FieldGroup label="Target Industries" hint="Comma-separated: B2B SaaS, Health Tech">
                <input value={icpIndustries} onChange={(e) => setIcpIndustries(e.target.value)} placeholder="B2B SaaS, Health Tech, FinTech" style={fieldInputStyle} />
              </FieldGroup>
              <FieldGroup label="Target Geography" hint="Comma-separated: Memphis, Tennessee, US">
                <input value={icpGeo} onChange={(e) => setIcpGeo(e.target.value)} placeholder="Memphis, TN, US" style={fieldInputStyle} />
              </FieldGroup>
              <FieldGroup label="Company Size Range" hint="Minimum and maximum employee count">
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={icpSizeMin} onChange={(e) => setIcpSizeMin(e.target.value)} placeholder="Min" type="number" style={{ ...fieldInputStyle, width: "50%" }} />
                  <input value={icpSizeMax} onChange={(e) => setIcpSizeMax(e.target.value)} placeholder="Max" type="number" style={{ ...fieldInputStyle, width: "50%" }} />
                </div>
              </FieldGroup>
            </div>
            <div style={{ marginTop: 16 }}>
              <FieldGroup label="Exclusion Rules" hint="Comma-separated keywords. Leads matching these are excluded from scoring.">
                <input value={icpExclusions} onChange={(e) => setIcpExclusions(e.target.value)} placeholder="recruitment, staffing, intern" style={fieldInputStyle} />
              </FieldGroup>
            </div>
            <button type="submit" disabled={savingIcp} style={{
              marginTop: 16, background: "#d4a574", color: "#0b1120", border: "none", borderRadius: 8,
              padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-display)",
            }}>
              {savingIcp ? "Saving..." : "Save ICP Configuration"}
            </button>
          </form>
        </Section>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
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
                  display: "flex", alignItems: isMobile ? "flex-start" : "center", gap: 14,
                  flexDirection: isMobile ? "column" : "row",
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
                      <input type="password" value={keyValue} onChange={(e) => setKeyValue(e.target.value)} placeholder={`Paste ${int.label} key`} style={{ ...fieldInputStyle, width: 200 }} />
                      <button onClick={() => saveCredential(int.key)} disabled={saving === int.key} style={{ background: "#d4a574", color: "#1a1f2e", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)' }}>
                        {saving === int.key ? "..." : "Save"}
                      </button>
                      <button onClick={() => { setShowKeyInput(null); setKeyValue(""); }} style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", cursor: "pointer", fontSize: 14 }}>×</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowKeyInput(int.key)} style={{ background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: 'var(--font-display)' }}>Connect</button>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <>
          {/* Password */}
          <Section title="Password">
            <form onSubmit={handleChangePassword}>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
                <FieldGroup label="Current password">
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required style={fieldInputStyle} />
                </FieldGroup>
                <FieldGroup label="New password">
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} style={fieldInputStyle} />
                </FieldGroup>
                <FieldGroup label="Confirm new password">
                  <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required minLength={8} style={fieldInputStyle} />
                </FieldGroup>
              </div>
              <button type="submit" disabled={changingPassword} style={{
                marginTop: 12, background: "rgba(212,165,116,0.1)", color: "#d4a574",
                border: "1px solid rgba(212,165,116,0.2)", borderRadius: 8, padding: "8px 20px",
                fontSize: 13, fontWeight: 600, cursor: changingPassword ? "wait" : "pointer", fontFamily: "var(--font-display)",
              }}>
                {changingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
          </Section>

          {/* Two-Factor Authentication */}
          <Section title="Two-Factor Authentication">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2 }}>
                  {user.totp_enabled ? "Enabled. Your account is protected with an authenticator app." : "Add an extra layer of security with an authenticator app."}
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
                    if (res.ok) { setTotpQr(data.qrDataUrl); setTotpSetup(true); }
                    else setMessage({ type: "error", text: data.error || "Failed to start 2FA setup" });
                  } catch { setMessage({ type: "error", text: "Something went wrong" }); }
                  finally { setTotpLoading(false); }
                }}
                disabled={totpLoading}
                style={{ background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "1px solid rgba(212,165,116,0.2)", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: totpLoading ? "wait" : "pointer", fontFamily: "var(--font-display)" }}
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
                  <input type="text" inputMode="numeric" maxLength={6} value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))} placeholder="000000"
                    style={{ ...fieldInputStyle, width: 120, textAlign: "center", fontSize: 18, fontWeight: 700, letterSpacing: 4 }} />
                  <button
                    onClick={async () => {
                      setTotpLoading(true);
                      try {
                        const res = await fetch("/api/mc/account/totp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "enable", code: totpCode }) });
                        const data = await res.json();
                        if (res.ok) { setMessage({ type: "success", text: "Two-factor authentication enabled" }); setTotpSetup(false); setTotpQr(null); setTotpCode(""); window.location.reload(); }
                        else setMessage({ type: "error", text: data.error || "Verification failed" });
                      } catch { setMessage({ type: "error", text: "Something went wrong" }); }
                      finally { setTotpLoading(false); }
                    }}
                    disabled={totpCode.length !== 6 || totpLoading}
                    style={{ background: "#d4a574", color: "#0b1120", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: totpCode.length === 6 ? "pointer" : "default", opacity: totpCode.length === 6 ? 1 : 0.5, fontFamily: "var(--font-display)" }}
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
                    const res = await fetch("/api/mc/account/totp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "disable" }) });
                    if (res.ok) { setMessage({ type: "success", text: "Two-factor authentication disabled" }); window.location.reload(); }
                  } catch { setMessage({ type: "error", text: "Something went wrong" }); }
                  finally { setTotpLoading(false); }
                }}
                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-display)" }}
              >
                Disable 2FA
              </button>
            )}
          </Section>

          {/* Support Access History */}
          <Section title="Support Access">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(232,223,207,0.5)" }}>
                  {supportEnabled
                    ? "Support access is enabled. Cosmic Reach can assist with setup and troubleshooting when needed."
                    : "Support access is disabled. Enable it to allow Cosmic Reach to help with your workspace."}
                </div>
              </div>
              {!isSupportMode && (
                <button
                  onClick={handleToggleSupportAccess}
                  disabled={togglingSupportAccess}
                  style={{
                    background: supportEnabled ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
                    color: supportEnabled ? "#f87171" : "#22c55e",
                    border: `1px solid ${supportEnabled ? "rgba(239,68,68,0.2)" : "rgba(34,197,94,0.2)"}`,
                    borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "var(--font-display)", flexShrink: 0,
                  }}
                >
                  {togglingSupportAccess ? "..." : supportEnabled ? "Disable" : "Enable"}
                </button>
              )}
            </div>

            {/* Support Access History */}
            {supportAccess.recentSessions.length > 0 && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.6)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                  Support Access History
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {supportAccess.recentSessions.map((s) => (
                    <div key={s.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                      borderBottom: "1px solid rgba(232,223,207,0.06)",
                    }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                        background: s.status === "active" ? "#22c55e" : "rgba(232,223,207,0.2)",
                      }} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, color: "rgba(232,223,207,0.7)" }}>{s.user_name}</span>
                        <span style={{ fontSize: 12, color: "rgba(232,223,207,0.3)", marginLeft: 8 }}>
                          {s.reason}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: "rgba(232,223,207,0.2)" }}>
                        {new Date(s.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>
        </>
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

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(232,223,207,0.5)", display: "block", marginBottom: 4, fontFamily: "var(--font-display)" }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "rgba(232,223,207,0.2)", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

const fieldInputStyle: React.CSSProperties = {
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
