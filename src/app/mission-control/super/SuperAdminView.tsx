"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface Props {
  adminName: string;
  adminId: number;
  tenants: Record<string, unknown>[];
  auditLogs: Record<string, unknown>[];
  totpEnabled: boolean;
}

type Tab = "support" | "workspaces" | "users" | "blocklist" | "activity";

interface UserRecord {
  id: number;
  email: string;
  full_name: string;
  status: string;
  is_super_admin: boolean;
  tenant_count: number;
  created_at: string;
  last_login_at: string | null;
}

interface BlocklistEntry {
  id: number;
  email: string;
  reason: string;
  created_at: string;
}

interface SupportSessionRecord {
  id: string;
  tenant_name: string;
  reason: string;
  started_at: string;
  expires_at: string;
  ended_at: string | null;
  status: string;
}

interface SupportTenant {
  id: number;
  name: string;
  slug: string;
  status: string;
  support_access_enabled: boolean;
  is_retainer_client: boolean;
}

export function SuperAdminView({ adminName, adminId, tenants, auditLogs, totpEnabled }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("support");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [blocklist, setBlocklist] = useState<BlocklistEntry[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBlocklist, setLoadingBlocklist] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [blockEmail, setBlockEmail] = useState("");
  const [blockReason, setBlockReason] = useState("user_request");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [retainerToggles, setRetainerToggles] = useState<Record<number, boolean>>({});

  // Support console state
  const [supportData, setSupportData] = useState<{
    activeSession: (SupportSessionRecord & { tenant_slug?: string }) | null;
    recentSessions: SupportSessionRecord[];
    tenants: SupportTenant[];
    hasStepUp: boolean;
  } | null>(null);
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [accessReason, setAccessReason] = useState("");
  const [stepUpCode, setStepUpCode] = useState("");
  const [stepUpMode, setStepUpMode] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [tenantSearch, setTenantSearch] = useState("");

  const loadSupportData = useCallback(async () => {
    setLoadingSupport(true);
    try {
      const res = await fetch("/api/mc/support");
      const data = await res.json();
      if (res.ok) setSupportData(data);
    } finally {
      setLoadingSupport(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "support") loadSupportData();
  }, [tab, loadSupportData]);

  async function handleStepUp() {
    if (!stepUpCode || stepUpCode.length !== 6) return;
    setStartingSession(true);
    setMessage(null);
    try {
      const res = await fetch("/api/mc/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "step_up", code: stepUpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Verification failed" });
        setStartingSession(false);
        return;
      }
      setStepUpMode(false);
      setStepUpCode("");
      // Now start the session
      await handleStartSession(true);
    } catch {
      setMessage({ type: "error", text: "Verification failed" });
      setStartingSession(false);
    }
  }

  async function handleStartSession(skipStepUpCheck?: boolean) {
    if (!selectedTenant || !accessReason.trim()) return;
    setStartingSession(true);
    setMessage(null);

    try {
      const res = await fetch("/api/mc/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          tenantId: selectedTenant,
          reason: accessReason.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.requireStepUp) {
          setStepUpMode(true);
          setStartingSession(false);
          return;
        }
        setMessage({ type: "error", text: data.error || "Failed to start session" });
        setStartingSession(false);
        return;
      }

      setMessage({ type: "success", text: `Support session started for ${data.session.tenant_name}` });
      setAccessReason("");
      setSelectedTenant(null);
      await loadSupportData();

      // Navigate to the tenant workspace
      if (data.session.tenant_slug) {
        router.push(`/mission-control/${data.session.tenant_slug}`);
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setStartingSession(false);
    }
  }

  async function handleEndSession() {
    if (!supportData?.activeSession) return;
    try {
      const res = await fetch("/api/mc/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", supportSessionId: supportData.activeSession.id }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Support session ended" });
        await loadSupportData();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to end session" });
    }
  }

  async function handleToggleRetainer(tenantId: number, enabled: boolean) {
    setRetainerToggles((prev) => ({ ...prev, [tenantId]: true }));
    try {
      const res = await fetch("/api/mc/admin/retainer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, enabled }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: `Retainer status ${enabled ? "enabled" : "disabled"}` });
        // Update local tenant data
        const idx = tenants.findIndex((t) => (t.id as number) === tenantId);
        if (idx >= 0) {
          (tenants[idx] as Record<string, unknown>).is_retainer_client = enabled;
        }
      } else {
        setMessage({ type: "error", text: "Failed to update retainer status" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update retainer status" });
    } finally {
      setRetainerToggles((prev) => ({ ...prev, [tenantId]: false }));
    }
  }

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/mc/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const loadBlocklist = useCallback(async () => {
    setLoadingBlocklist(true);
    try {
      const res = await fetch("/api/mc/admin/blocklist");
      const data = await res.json();
      if (res.ok) setBlocklist(data.blocklist);
    } finally {
      setLoadingBlocklist(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "users" && users.length === 0) loadUsers();
    if (tab === "blocklist" && blocklist.length === 0) loadBlocklist();
  }, [tab, users.length, blocklist.length, loadUsers, loadBlocklist]);

  async function handleUserAction(action: string, userId: number, email?: string, reason?: string) {
    setActionLoading(userId);
    setMessage(null);
    try {
      const res = await fetch("/api/mc/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId, email, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
        return;
      }
      setMessage({ type: "success", text: `User ${action}d successfully` });
      setConfirmDelete(null);
      await loadUsers();
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setActionLoading(null);
    }
  }

  async function handleAddToBlocklist(e: React.FormEvent) {
    e.preventDefault();
    if (!blockEmail.trim()) return;
    setMessage(null);
    try {
      const res = await fetch("/api/mc/admin/blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: blockEmail, reason: blockReason }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: `${blockEmail} added to blocklist` });
        setBlockEmail("");
        await loadBlocklist();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to add to blocklist" });
    }
  }

  async function handleRemoveFromBlocklist(email: string) {
    try {
      const res = await fetch("/api/mc/admin/blocklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", email }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: `${email} removed from blocklist` });
        await loadBlocklist();
      }
    } catch {
      setMessage({ type: "error", text: "Failed to remove from blocklist" });
    }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "support", label: "Support Access" },
    { key: "workspaces", label: "Workspaces" },
    { key: "users", label: "Users" },
    { key: "blocklist", label: "Blocklist" },
    { key: "activity", label: "Activity" },
  ];

  const filteredTenants = supportData?.tenants.filter((t) =>
    !tenantSearch || t.name.toLowerCase().includes(tenantSearch.toLowerCase()) || t.slug.includes(tenantSearch.toLowerCase())
  ) ?? [];

  return (
    <div style={{
      minHeight: "100vh", background: "#0b1120", color: "#e8dfcf", padding: "32px",
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#d4a574", marginBottom: 4, fontFamily: 'var(--font-display)' }}>
              Mission Control
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#e8dfcf' }}>Support Console</h1>
            <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
              Logged in as {adminName}
              {!totpEnabled && (
                <span style={{ color: "#eab308", marginLeft: 8, fontSize: 12 }}>
                  2FA required for support access
                </span>
              )}
            </p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/mc/auth/logout", { method: "POST" });
              router.push("/mission-control/login");
            }}
            style={{
              background: "rgba(232,223,207,0.05)", color: "rgba(232,223,207,0.5)", border: "none",
              borderRadius: 10, padding: "10px 16px", fontSize: 13,
              fontWeight: 500, cursor: "pointer", fontFamily: 'var(--font-body)',
            }}
          >
            Sign out
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          <StatCard label="Total Workspaces" value={tenants.length} color="#d4a574" />
          <StatCard
            label="Active Workspaces"
            value={tenants.filter((t) => t.status === "active").length}
            color="#22c55e"
          />
          <StatCard
            label="Total Leads"
            value={tenants.reduce((sum, t) => sum + ((t.lead_count as number) || 0), 0)}
            color="#3b82f6"
          />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setMessage(null); }}
              style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", fontFamily: "var(--font-display)",
                background: tab === t.key ? "rgba(212,165,116,0.12)" : "transparent",
                color: tab === t.key ? "#d4a574" : "rgba(232,223,207,0.4)",
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: message.type === "success" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${message.type === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            borderRadius: 10, padding: "10px 16px", fontSize: 13,
            color: message.type === "success" ? "#22c55e" : "#f87171",
            marginBottom: 16,
          }}>
            {message.text}
          </div>
        )}

        {/* Support Access Tab */}
        {tab === "support" && (
          <div>
            {/* Active Session */}
            {supportData?.activeSession && (
              <Panel title="Active Support Session">
                <div style={{
                  background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: 10, padding: 16, marginBottom: 16,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                        <span style={{ fontWeight: 700, fontSize: 15 }}>
                          {supportData.activeSession.tenant_name}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.5)" }}>
                        Reason: {supportData.activeSession.reason}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 4 }}>
                        Started {new Date(supportData.activeSession.started_at).toLocaleTimeString()} · Expires {new Date(supportData.activeSession.expires_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(supportData.activeSession as { tenant_slug?: string }).tenant_slug && (
                        <button
                          onClick={() => router.push(`/mission-control/${(supportData.activeSession as { tenant_slug?: string }).tenant_slug}`)}
                          style={actionBtnStyle("#d4a574")}
                        >
                          Open Workspace
                        </button>
                      )}
                      <button onClick={handleEndSession} style={actionBtnStyle("#f87171")}>
                        End Session
                      </button>
                    </div>
                  </div>
                </div>
              </Panel>
            )}

            {/* Start Support Session */}
            <Panel title="Start Support Session">
              {!totpEnabled ? (
                <div style={{
                  background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)",
                  borderRadius: 10, padding: 16,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#eab308", margin: "0 0 8px" }}>
                    Two-factor authentication required
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(232,223,207,0.5)", margin: 0 }}>
                    Enable 2FA in your account settings before using support access. This protects customer workspaces with an additional verification step.
                  </p>
                </div>
              ) : stepUpMode ? (
                <div style={{
                  background: "rgba(212,165,116,0.05)", border: "1px solid rgba(212,165,116,0.15)",
                  borderRadius: 10, padding: 20,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#d4a574", margin: "0 0 8px", fontFamily: "var(--font-display)" }}>
                    Step-up Verification Required
                  </p>
                  <p style={{ fontSize: 13, color: "rgba(232,223,207,0.5)", margin: "0 0 16px" }}>
                    Enter your authenticator code to verify your identity before accessing this workspace.
                  </p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={stepUpCode}
                      onChange={(e) => setStepUpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      style={{
                        width: 140, textAlign: "center", fontSize: 20, fontWeight: 700,
                        letterSpacing: 6, padding: "10px 16px", background: "#0b1120",
                        border: "1px solid rgba(232,223,207,0.15)", borderRadius: 8,
                        color: "#e8dfcf", outline: "none", fontFamily: "var(--font-body)",
                      }}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === "Enter" && stepUpCode.length === 6) handleStepUp(); }}
                    />
                    <button
                      onClick={handleStepUp}
                      disabled={stepUpCode.length !== 6 || startingSession}
                      style={{
                        background: "#d4a574", color: "#0b1120", border: "none", borderRadius: 8,
                        padding: "10px 20px", fontSize: 14, fontWeight: 700,
                        cursor: stepUpCode.length === 6 ? "pointer" : "default",
                        opacity: stepUpCode.length === 6 ? 1 : 0.5, fontFamily: "var(--font-display)",
                      }}
                    >
                      {startingSession ? "Verifying..." : "Verify & Enter"}
                    </button>
                    <button
                      onClick={() => { setStepUpMode(false); setStepUpCode(""); }}
                      style={{ background: "none", border: "none", color: "rgba(232,223,207,0.4)", cursor: "pointer", fontSize: 13 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Workspace search */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Select Workspace</label>
                    <input
                      type="text"
                      value={tenantSearch}
                      onChange={(e) => setTenantSearch(e.target.value)}
                      placeholder="Search workspaces..."
                      style={inputStyle}
                    />
                  </div>

                  {/* Workspace list */}
                  <div style={{ maxHeight: 240, overflowY: "auto", marginBottom: 16 }}>
                    {loadingSupport ? (
                      <Empty>Loading workspaces...</Empty>
                    ) : filteredTenants.length === 0 ? (
                      <Empty>No workspaces found</Empty>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {filteredTenants.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTenant(t.id)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "10px 14px", borderRadius: 8, border: "none",
                              background: selectedTenant === t.id ? "rgba(212,165,116,0.12)" : "rgba(232,223,207,0.02)",
                              color: selectedTenant === t.id ? "#d4a574" : "#e8dfcf",
                              cursor: t.support_access_enabled ? "pointer" : "default",
                              opacity: t.support_access_enabled ? 1 : 0.4,
                              textAlign: "left", fontFamily: "var(--font-body)", fontSize: 14,
                              outline: selectedTenant === t.id ? "1px solid rgba(212,165,116,0.3)" : "none",
                            }}
                            disabled={!t.support_access_enabled}
                          >
                            <div>
                              <span style={{ fontWeight: 600 }}>{t.name}</span>
                              <span style={{ fontSize: 12, color: "rgba(232,223,207,0.3)", marginLeft: 8 }}>/{t.slug}</span>
                            </div>
                            {!t.support_access_enabled && (
                              <span style={{ fontSize: 11, color: "#f87171" }}>Access disabled</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Access reason */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Access Reason</label>
                    <input
                      type="text"
                      value={accessReason}
                      onChange={(e) => setAccessReason(e.target.value)}
                      placeholder="Setup assistance, troubleshooting, configuration review..."
                      style={inputStyle}
                    />
                    <p style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginTop: 4 }}>
                      This reason is logged and visible to the workspace owner.
                    </p>
                  </div>

                  {/* Start button */}
                  <button
                    onClick={() => handleStartSession()}
                    disabled={!selectedTenant || !accessReason.trim() || accessReason.trim().length < 3 || startingSession}
                    style={{
                      background: selectedTenant && accessReason.trim().length >= 3 ? "#d4a574" : "rgba(212,165,116,0.2)",
                      color: selectedTenant && accessReason.trim().length >= 3 ? "#0b1120" : "rgba(232,223,207,0.3)",
                      border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14,
                      fontWeight: 700, cursor: selectedTenant && accessReason.trim().length >= 3 ? "pointer" : "default",
                      fontFamily: "var(--font-display)",
                      transition: "all 0.15s",
                    }}
                  >
                    {startingSession ? "Starting..." : "Start Support Session"}
                  </button>
                </div>
              )}
            </Panel>

            {/* Recent Sessions */}
            <div style={{ marginTop: 20 }}>
              <Panel title="Recent Support Sessions">
                {!supportData || supportData.recentSessions.length === 0 ? (
                  <Empty>No recent sessions</Empty>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {supportData.recentSessions.map((s) => (
                      <div key={s.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 0",
                        borderBottom: "1px solid rgba(232,223,207,0.06)",
                      }}>
                        <div style={{
                          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                          background: s.status === "active" ? "#22c55e" : s.status === "expired" ? "#eab308" : "rgba(232,223,207,0.25)",
                        }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{s.tenant_name}</span>
                          <span style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginLeft: 8 }}>
                            {s.reason}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", flexShrink: 0 }}>
                          {s.status} · {new Date(s.started_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        )}

        {/* Workspaces Tab */}
        {tab === "workspaces" && (
          <Panel title="Workspaces">
            {tenants.length === 0 ? (
              <Empty>No workspaces yet</Empty>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tenants.map((t) => (
                  <div key={t.id as number} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 10,
                    border: `1px solid ${(t as Record<string, unknown>).is_retainer_client ? "rgba(212,165,116,0.3)" : "rgba(232,223,207,0.1)"}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{t.name as string}</span>
                        <PlanBadge plan={(t as Record<string, unknown>).plan as string} />
                        {!!(t as Record<string, unknown>).is_retainer_client && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#d4a574", textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-display)", background: "rgba(212,165,116,0.1)", padding: "2px 6px", borderRadius: 4 }}>Retainer</span>
                        )}
                        {t.onboarding_completed ? (
                          <span style={{ fontSize: 10, color: "#22c55e" }}>Live</span>
                        ) : (
                          <span style={{ fontSize: 10, color: "#eab308" }}>Onboarding</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2 }}>
                        /{t.slug as string} · {t.lead_count as number} leads · {t.user_count as number} users · {t.credential_count as number} integrations
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleRetainer(t.id as number, !(t as Record<string, unknown>).is_retainer_client)}
                      disabled={retainerToggles[t.id as number]}
                      style={{
                        background: (t as Record<string, unknown>).is_retainer_client ? "rgba(239,68,68,0.1)" : "rgba(212,165,116,0.1)",
                        color: (t as Record<string, unknown>).is_retainer_client ? "#f87171" : "#d4a574",
                        border: "none", borderRadius: 8, padding: "6px 12px",
                        fontSize: 11, fontWeight: 600, cursor: retainerToggles[t.id as number] ? "wait" : "pointer",
                        fontFamily: "var(--font-display)", flexShrink: 0,
                      }}
                    >
                      {retainerToggles[t.id as number] ? "..." : (t as Record<string, unknown>).is_retainer_client ? "Remove Retainer" : "Set Retainer"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <Panel title="Users">
            {loadingUsers ? (
              <Empty>Loading users...</Empty>
            ) : users.length === 0 ? (
              <Empty>No users found</Empty>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {users.map((u) => (
                  <div key={u.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 10,
                    border: "1px solid rgba(232,223,207,0.1)",
                    opacity: u.status === "inactive" ? 0.5 : 1,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: u.is_super_admin ? "#d4a574" : "rgba(212,165,116,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#0b1120", flexShrink: 0,
                    }}>
                      {u.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{u.full_name}</span>
                        {u.is_super_admin && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#d4a574", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-display)" }}>Super User</span>
                        )}
                        <span style={{ fontSize: 10, color: u.status === "active" ? "#22c55e" : "#f87171" }}>
                          {u.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 1 }}>
                        {u.email} · {u.tenant_count} workspace{u.tenant_count !== 1 ? "s" : ""}
                        {u.last_login_at && ` · Last login ${new Date(u.last_login_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      </div>
                    </div>
                    {u.id !== adminId && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {confirmDelete === u.id ? (
                          <>
                            <button onClick={() => handleUserAction("delete", u.id, u.email, "admin_deletion")} disabled={actionLoading === u.id} style={{ ...actionBtnStyle("#dc2626"), background: "#dc2626", color: "#fff" }}>
                              {actionLoading === u.id ? "..." : "Confirm"}
                            </button>
                            <button onClick={() => setConfirmDelete(null)} style={actionBtnStyle("rgba(232,223,207,0.3)")}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {u.status === "active" ? (
                              <button onClick={() => handleUserAction("deactivate", u.id)} disabled={actionLoading === u.id} style={actionBtnStyle("#eab308")}>Deactivate</button>
                            ) : (
                              <button onClick={() => handleUserAction("reactivate", u.id)} disabled={actionLoading === u.id} style={actionBtnStyle("#22c55e")}>Reactivate</button>
                            )}
                            <button onClick={() => setConfirmDelete(u.id)} style={actionBtnStyle("#dc2626")}>Delete</button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* Blocklist Tab */}
        {tab === "blocklist" && (
          <Panel title="Email Blocklist">
            <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 13, margin: "0 0 16px 0" }}>
              Blocked emails cannot register or be re-added. Use this for opt-out requests and data deletion compliance.
            </p>
            <form onSubmit={handleAddToBlocklist} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input type="email" value={blockEmail} onChange={(e) => setBlockEmail(e.target.value)} placeholder="email@example.com" required style={{ ...inputStyle, flex: 1 }} />
              <select value={blockReason} onChange={(e) => setBlockReason(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                <option value="user_request">User request</option>
                <option value="gdpr_deletion">GDPR deletion</option>
                <option value="spam">Spam/abuse</option>
                <option value="admin_action">Admin action</option>
              </select>
              <button type="submit" style={{ background: "#d4a574", color: "#1a1f2e", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-display)" }}>Block</button>
            </form>
            {loadingBlocklist ? (
              <Empty>Loading...</Empty>
            ) : blocklist.length === 0 ? (
              <Empty>No blocked emails</Empty>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {blocklist.map((entry) => (
                  <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.1)", background: "rgba(239,68,68,0.03)" }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{entry.email}</span>
                      <span style={{ fontSize: 11, color: "rgba(232,223,207,0.3)", marginLeft: 8 }}>
                        {entry.reason.replace(/_/g, " ")} · {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <button onClick={() => handleRemoveFromBlocklist(entry.email)} style={actionBtnStyle("rgba(232,223,207,0.3)")}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* Activity Tab */}
        {tab === "activity" && (
          <Panel title="Recent Activity">
            {auditLogs.length === 0 ? (
              <Empty>No activity yet</Empty>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {auditLogs.map((log, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 0", borderBottom: i < auditLogs.length - 1 ? "1px solid rgba(232,223,207,0.08)" : "none",
                  }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                      background:
                        (log.action as string)?.includes("support") ? "#d4a574" :
                        (log.action as string)?.includes("delete") ? "#dc2626" :
                        (log.action as string)?.includes("blocklist") ? "#eab308" :
                        "rgba(232,223,207,0.25)",
                    }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, color: "rgba(232,223,207,0.85)" }}>
                        {log.user_name as string || "System"}{" "}
                        <span style={{ color: "rgba(232,223,207,0.35)" }}>{(log.action as string)?.replace(/_/g, " ")}</span>
                      </span>
                      {!!log.tenant_name && (
                        <span style={{ fontSize: 12, color: "rgba(232,223,207,0.25)" }}> · {log.tenant_name as string}</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: "rgba(232,223,207,0.2)", flexShrink: 0 }}>
                      {new Date(log.created_at as string).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
      borderRadius: 12, padding: "20px 20px", textAlign: "center",
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.5)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
      borderRadius: 14, padding: "20px 24px", marginBottom: 16,
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px 0", fontFamily: 'var(--font-display)', color: "#e8dfcf" }}>{title}</h2>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "rgba(232,223,207,0.25)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
      {children}
    </p>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const p = plan || "core";
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, textTransform: "uppercase",
      padding: "2px 6px", borderRadius: 4, letterSpacing: "0.04em",
      fontFamily: "var(--font-display)",
      background: p === "pro" ? "rgba(234,179,8,0.1)" : p === "growth" ? "rgba(212,165,116,0.1)" : "rgba(232,223,207,0.05)",
      color: p === "pro" ? "#eab308" : p === "growth" ? "#d4a574" : "rgba(232,223,207,0.35)",
    }}>
      {p}
    </span>
  );
}

function actionBtnStyle(color: string): React.CSSProperties {
  return {
    background: `${color}15`,
    color,
    border: "none",
    borderRadius: 8,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "var(--font-display)",
  };
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: "rgba(232,223,207,0.5)",
  display: "block", marginBottom: 6, fontFamily: "var(--font-display)",
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 14px", background: "#0b1120",
  border: "1px solid rgba(232,223,207,0.1)", borderRadius: 8,
  color: "#e8dfcf", fontSize: 14, outline: "none",
  fontFamily: "var(--font-body)", boxSizing: "border-box",
};
