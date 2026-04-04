"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

interface McShellProps {
  user: {
    id: number;
    email: string;
    full_name: string;
    is_super_admin: boolean;
  };
  tenant: {
    id: number;
    name: string;
    slug: string;
    plan: string;
    is_retainer_client?: boolean;
    onboarding_completed: boolean;
  };
  isImpersonation: boolean;
  isSupportMode?: boolean;
  supportSession?: {
    id: string;
    reason: string;
    started_at: string;
    expires_at: string;
  } | null;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: "", label: "Overview", iconSrc: "/icons/compass.svg" },
  { key: "crm", label: "Leads", iconSrc: "/icons/network.svg" },
  { key: "signal", label: "Performance", iconSrc: "/icons/eye.svg" },
  { key: "meetings", label: "Meetings", iconSrc: "/icons/orbit.svg" },
  { key: "settings", label: "Settings", iconSrc: "/icons/gears.svg" },
];

export function McShell({ user, tenant, isImpersonation, isSupportMode, supportSession, children }: McShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [supportTimeLeft, setSupportTimeLeft] = useState("");
  const [endingSession, setEndingSession] = useState(false);
  const isMobile = useIsMobile();

  // Support session countdown timer
  useEffect(() => {
    if (!isSupportMode || !supportSession?.expires_at) return;
    const updateTimer = () => {
      const now = new Date().getTime();
      const expires = new Date(supportSession.expires_at).getTime();
      const diff = expires - now;
      if (diff <= 0) {
        setSupportTimeLeft("Expired");
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setSupportTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isSupportMode, supportSession]);

  async function handleEndSupportSession() {
    if (!supportSession) return;
    setEndingSession(true);
    try {
      await fetch("/api/mc/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", supportSessionId: supportSession.id }),
      });
      router.push("/mission-control/super");
    } catch {
      setEndingSession(false);
    }
  }

  const base = `/mission-control/${tenant.slug}`;

  function isActive(key: string) {
    if (key === "") return pathname === base || pathname === `${base}/`;
    return pathname.startsWith(`${base}/${key}`);
  }

  async function handleLogout() {
    await fetch("/api/mc/auth/logout", { method: "POST" });
    router.push("/mission-control/login");
  }

  function handleNav(key: string) {
    router.push(key ? `${base}/${key}` : base);
    if (isMobile) setMobileOpen(false);
  }

  const sidebarWidth = isMobile ? 0 : collapsed ? 64 : 220;
  const showSidebar = isMobile ? mobileOpen : true;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1120", color: "#e8dfcf", fontFamily: 'var(--font-body)' }}>
      {/* Support Mode Banner */}
      {isSupportMode && supportSession && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "linear-gradient(90deg, #1e3a5f 0%, #1a2744 100%)",
          borderBottom: "2px solid #d4a574",
          color: "#e8dfcf", padding: "8px 16px",
          fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: supportTimeLeft === "Expired" ? "#dc2626" : "#22c55e",
              animation: supportTimeLeft === "Expired" ? "none" : "pulse 2s infinite",
            }} />
            <span style={{ fontWeight: 700, color: "#d4a574", fontFamily: "var(--font-display)" }}>
              Support Mode
            </span>
          </div>
          <span style={{ color: "rgba(232,223,207,0.6)" }}>|</span>
          <span>{tenant.name}</span>
          <span style={{ color: "rgba(232,223,207,0.6)" }}>|</span>
          <span style={{ fontSize: 12, color: "rgba(232,223,207,0.5)" }}>
            Reason: {supportSession.reason}
          </span>
          <span style={{ color: "rgba(232,223,207,0.6)" }}>|</span>
          <span style={{ fontSize: 12, fontFamily: "var(--font-display)", fontWeight: 600, color: supportTimeLeft === "Expired" ? "#f87171" : "#d4a574" }}>
            {supportTimeLeft === "Expired" ? "Session Expired" : `Expires in ${supportTimeLeft}`}
          </span>
          <button
            onClick={handleEndSupportSession}
            disabled={endingSession}
            style={{
              marginLeft: 8,
              background: "rgba(232,223,207,0.1)",
              border: "1px solid rgba(232,223,207,0.2)",
              color: "#e8dfcf",
              borderRadius: 6,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: endingSession ? "wait" : "pointer",
              fontFamily: "var(--font-display)",
            }}
          >
            {endingSession ? "Ending..." : "End Support Session"}
          </button>
        </div>
      )}
      {/* Legacy impersonation banner (non-support) */}
      {isImpersonation && !isSupportMode && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "#dc2626", color: "#fff", padding: "6px 16px",
          fontSize: 13, fontWeight: 600, textAlign: "center",
        }}>
          Support access: viewing {tenant.name}
        </div>
      )}

      {/* Mobile top bar */}
      {isMobile && (
        <div style={{
          position: "fixed", top: (isSupportMode || isImpersonation) ? 40 : 0, left: 0, right: 0,
          zIndex: 60, background: "#111827",
          borderBottom: "1px solid rgba(232,223,207,0.1)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", height: 48,
        }}>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none", border: "none", color: "#e8dfcf",
              fontSize: 20, cursor: "pointer", padding: "4px",
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e8dfcf", fontFamily: "var(--font-display)" }}>
            Mission Control
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "#d4a574", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#0b1120",
          }}>
            {user.full_name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 49,
            background: "rgba(0,0,0,0.5)",
          }}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <aside style={{
          width: isMobile ? 260 : (collapsed ? 64 : 220),
          minHeight: "100vh",
          background: "#111827", borderRight: "1px solid rgba(232,223,207,0.1)",
          display: "flex", flexDirection: "column",
          transition: isMobile ? "transform 0.2s ease" : "width 0.2s ease",
          position: "fixed",
          top: (isSupportMode || isImpersonation) ? 40 : 0,
          left: 0, bottom: 0,
          zIndex: isMobile ? 70 : 50,
          overflow: "hidden",
        }}>
          {/* Logo + branding */}
          <div style={{
            borderBottom: "1px solid rgba(232,223,207,0.1)",
            padding: collapsed && !isMobile ? "16px 8px" : "16px 16px",
          }}>
            <Link href="/" style={{ display: "block", textDecoration: "none", marginBottom: collapsed && !isMobile ? 0 : 12 }}>
              <Image
                src="/logo/logo-primary-dark.svg"
                alt="Cosmic Reach Creative"
                width={collapsed && !isMobile ? 32 : 120}
                height={collapsed && !isMobile ? 32 : 32}
                style={{ display: "block", margin: collapsed && !isMobile ? "0 auto" : undefined, opacity: 0.7 }}
              />
            </Link>
            {!isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  display: "block", width: "100%", textAlign: collapsed ? "center" : "left",
                  padding: 0, background: "transparent", border: "none", cursor: "pointer",
                  marginTop: collapsed ? 8 : 0,
                }}
              >
                {collapsed ? (
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#d4a574", fontFamily: "var(--font-display)" }}>MC</div>
                ) : (
                  <>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#e8dfcf", lineHeight: 1.2, fontFamily: "var(--font-display)" }}>Mission Control</div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginTop: 2 }}>{tenant.name}</div>
                  </>
                )}
              </button>
            )}
            {isMobile && (
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e8dfcf", lineHeight: 1.2, fontFamily: "var(--font-display)" }}>Mission Control</div>
                <div style={{ fontSize: 11, color: "rgba(232,223,207,0.25)", marginTop: 2 }}>{tenant.name}</div>
              </div>
            )}
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: "12px 8px" }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.key);
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%",
                    padding: collapsed && !isMobile ? "10px 0" : "10px 12px",
                    justifyContent: collapsed && !isMobile ? "center" : "flex-start",
                    background: active ? "rgba(212,165,116,0.12)" : "transparent",
                    border: "none", borderRadius: 8,
                    color: active ? "#d4a574" : "rgba(232,223,207,0.5)",
                    fontSize: 14, fontWeight: active ? 600 : 400,
                    fontFamily: 'var(--font-body)',
                    cursor: "pointer",
                    transition: "all 0.15s",
                    marginBottom: 2,
                  }}
                >
                  <Image src={item.iconSrc} alt="" width={16} height={16} style={{ opacity: active ? 1 : 0.5, filter: active ? "brightness(0) saturate(100%) invert(72%) sepia(30%) saturate(500%) hue-rotate(350deg)" : "brightness(0) invert(0.85)" }} />
                  {(isMobile || !collapsed) && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom area */}
          <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(232,223,207,0.1)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: collapsed && !isMobile ? "8px 0" : "8px 12px",
              justifyContent: collapsed && !isMobile ? "center" : "flex-start",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#d4a574", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#0b1120", flexShrink: 0,
              }}>
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              {(isMobile || !collapsed) && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.full_name}</div>
                  <button onClick={handleLogout} style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", fontSize: 11, cursor: "pointer", padding: 0, fontFamily: 'var(--font-body)' }}>Sign out</button>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Main content */}
      <main style={{
        marginLeft: sidebarWidth,
        flex: 1,
        minHeight: "100vh",
        transition: "margin-left 0.2s ease",
        marginTop: isMobile ? 48 + ((isSupportMode || isImpersonation) ? 40 : 0) : ((isSupportMode || isImpersonation) ? 40 : 0),
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px 16px 48px" : "32px 32px 64px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
