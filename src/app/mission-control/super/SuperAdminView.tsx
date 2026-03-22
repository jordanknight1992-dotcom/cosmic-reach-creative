"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface Props {
  adminName: string;
  adminId: number;
  tenants: Record<string, unknown>[];
  auditLogs: Record<string, unknown>[];
}

type Tab = "workspaces" | "users" | "blocklist" | "activity";

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

export function SuperAdminView({ adminName, adminId, tenants, auditLogs }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("workspaces");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [blocklist, setBlocklist] = useState<BlocklistEntry[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingBlocklist, setLoadingBlocklist] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [blockEmail, setBlockEmail] = useState("");
  const [blockReason, setBlockReason] = useState("user_request");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
    { key: "workspaces", label: "Workspaces" },
    { key: "users", label: "Users" },
    { key: "blocklist", label: "Blocklist" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#0b1120", color: "#e8dfcf", padding: "32px",
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#dc2626", marginBottom: 4, fontFamily: 'var(--font-display)' }}>
              Super Admin
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>Mission Control Admin</h1>
            <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
              Logged in as {adminName} · Cosmic Reach Creative
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
                    border: "1px solid rgba(232,223,207,0.1)",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>{t.name as string}</span>
                        <PlanBadge plan={(t as Record<string, unknown>).plan as string} />
                        {t.onboarding_completed ? (
                          <span style={{ fontSize: 10, color: "#22c55e" }}>● Live</span>
                        ) : (
                          <span style={{ fontSize: 10, color: "#eab308" }}>● Onboarding</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 2 }}>
                        /{t.slug as string} · {t.lead_count as number} leads · {t.user_count as number} users · {t.credential_count as number} integrations
                      </div>
                    </div>
                    <button
                      onClick={() => router.push(`/mission-control/${t.slug as string}`)}
                      style={actionBtnStyle("#dc2626")}
                    >
                      View as Support
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
                    {/* Avatar */}
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: u.is_super_admin ? "#dc2626" : "#d4a574",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "#0b1120", flexShrink: 0,
                    }}>
                      {u.full_name.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{u.full_name}</span>
                        {u.is_super_admin && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-display)" }}>Admin</span>
                        )}
                        <span style={{
                          fontSize: 10,
                          color: u.status === "active" ? "#22c55e" : "#f87171",
                        }}>
                          ● {u.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "rgba(232,223,207,0.35)", marginTop: 1 }}>
                        {u.email} · {u.tenant_count} workspace{u.tenant_count !== 1 ? "s" : ""} · Joined {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {u.last_login_at && ` · Last login ${new Date(u.last_login_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      </div>
                    </div>

                    {/* Actions */}
                    {u.id !== adminId && (
                      <div style={{ display: "flex", gap: 6 }}>
                        {confirmDelete === u.id ? (
                          <>
                            <button
                              onClick={() => handleUserAction("delete", u.id, u.email, "admin_deletion")}
                              disabled={actionLoading === u.id}
                              style={{ ...actionBtnStyle("#dc2626"), background: "#dc2626", color: "#fff" }}
                            >
                              {actionLoading === u.id ? "..." : "Confirm Delete"}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              style={actionBtnStyle("rgba(232,223,207,0.3)")}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {u.status === "active" ? (
                              <button
                                onClick={() => handleUserAction("deactivate", u.id)}
                                disabled={actionLoading === u.id}
                                style={actionBtnStyle("#eab308")}
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction("reactivate", u.id)}
                                disabled={actionLoading === u.id}
                                style={actionBtnStyle("#22c55e")}
                              >
                                Reactivate
                              </button>
                            )}
                            <button
                              onClick={() => setConfirmDelete(u.id)}
                              style={actionBtnStyle("#dc2626")}
                            >
                              Delete
                            </button>
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

            {/* Add to blocklist form */}
            <form onSubmit={handleAddToBlocklist} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <input
                type="email"
                value={blockEmail}
                onChange={(e) => setBlockEmail(e.target.value)}
                placeholder="email@example.com"
                required
                style={{
                  flex: 1, padding: "8px 12px", background: "#0b1120",
                  border: "1px solid rgba(232,223,207,0.1)", borderRadius: 6,
                  color: "#e8dfcf", fontSize: 13, outline: "none", fontFamily: "var(--font-body)",
                }}
              />
              <select
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                style={{
                  padding: "8px 12px", background: "#0b1120",
                  border: "1px solid rgba(232,223,207,0.1)", borderRadius: 6,
                  color: "#e8dfcf", fontSize: 13, fontFamily: "var(--font-body)",
                }}
              >
                <option value="user_request">User request</option>
                <option value="gdpr_deletion">GDPR deletion</option>
                <option value="spam">Spam/abuse</option>
                <option value="admin_action">Admin action</option>
              </select>
              <button type="submit" style={{
                background: "#e04747", color: "#fff", border: "none",
                borderRadius: 6, padding: "8px 16px", fontSize: 13,
                fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-display)",
              }}>
                Block
              </button>
            </form>

            {/* Blocklist entries */}
            {loadingBlocklist ? (
              <Empty>Loading...</Empty>
            ) : blocklist.length === 0 ? (
              <Empty>No blocked emails</Empty>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {blocklist.map((entry) => (
                  <div key={entry.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 8,
                    border: "1px solid rgba(239,68,68,0.1)",
                    background: "rgba(239,68,68,0.03)",
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{entry.email}</span>
                      <span style={{ fontSize: 11, color: "rgba(232,223,207,0.3)", marginLeft: 8 }}>
                        {entry.reason.replace(/_/g, " ")} · {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFromBlocklist(entry.email)}
                      style={actionBtnStyle("rgba(232,223,207,0.3)")}
                    >
                      Remove
                    </button>
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
                        (log.action as string)?.includes("delete") ? "#dc2626" :
                        (log.action as string)?.includes("impersonation") ? "#dc2626" :
                        (log.action as string)?.includes("blocklist") ? "#eab308" :
                        (log.action as string)?.includes("credential") ? "#eab308" :
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
      borderRadius: 14, padding: "20px 24px",
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px 0", fontFamily: 'var(--font-display)' }}>{title}</h2>
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
