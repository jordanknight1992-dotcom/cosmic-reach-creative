"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
    onboarding_completed: boolean;
  };
  isImpersonation: boolean;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { key: "", label: "Briefing", iconSrc: "/icons/compass.svg" },
  { key: "targets", label: "Targets", iconSrc: "/icons/signal.svg" },
  { key: "crm", label: "CRM", iconSrc: "/icons/network.svg" },
  { key: "signal", label: "Signal", iconSrc: "/icons/eye.svg" },
  { key: "strategy", label: "Strategy", iconSrc: "/icons/map.svg" },
  { key: "meetings", label: "Meetings", iconSrc: "/icons/orbit.svg" },
  { key: "settings", label: "Settings", iconSrc: "/icons/gears.svg" },
];

export function McShell({ user, tenant, isImpersonation, children }: McShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const base = `/mission-control/${tenant.slug}`;

  function isActive(key: string) {
    if (key === "") return pathname === base || pathname === `${base}/`;
    return pathname.startsWith(`${base}/${key}`);
  }

  async function handleLogout() {
    await fetch("/api/mc/auth/logout", { method: "POST" });
    router.push("/mission-control/login");
  }

  const sidebarWidth = collapsed ? 64 : 220;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b1120", color: "#e8dfcf", fontFamily: 'var(--font-body)' }}>
      {/* Impersonation Banner */}
      {isImpersonation && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "#dc2626", color: "#fff", padding: "6px 16px",
          fontSize: 13, fontWeight: 600, textAlign: "center",
        }}>
          ⚠ Support access: viewing as {tenant.name}
        </div>
      )}

      {/* Sidebar */}
      <aside style={{
        width: sidebarWidth, minHeight: "100vh",
        background: "#111827", borderRight: "1px solid rgba(232,223,207,0.1)",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease",
        position: "fixed", top: isImpersonation ? 32 : 0, left: 0, bottom: 0,
        zIndex: 50, overflow: "hidden",
      }}>
        {/* Logo + branding */}
        <div style={{
          borderBottom: "1px solid rgba(232,223,207,0.1)",
          padding: collapsed ? "16px 8px" : "16px 16px",
        }}>
          <Link href="/" style={{ display: "block", textDecoration: "none", marginBottom: collapsed ? 0 : 12 }}>
            <Image
              src="/logo/logo-primary-dark.svg"
              alt="Cosmic Reach Creative"
              width={collapsed ? 32 : 120}
              height={collapsed ? 32 : 32}
              style={{ display: "block", margin: collapsed ? "0 auto" : undefined, opacity: 0.7 }}
            />
          </Link>
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
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.key);
            return (
              <button
                key={item.key}
                onClick={() => router.push(item.key ? `${base}/${item.key}` : base)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
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
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom area */}
        <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(232,223,207,0.1)" }}>
          {/* Plan badge */}
          {!collapsed && (
            <div style={{
              margin: "8px 12px 4px", padding: "4px 8px",
              background: tenant.plan === "pro" ? "rgba(234,179,8,0.1)" : tenant.plan === "growth" ? "rgba(212,165,116,0.1)" : "rgba(232,223,207,0.05)",
              color: tenant.plan === "pro" ? "#eab308" : tenant.plan === "growth" ? "#d4a574" : "rgba(232,223,207,0.35)",
              borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "uppercase",
              letterSpacing: "0.05em", textAlign: "center",
              fontFamily: 'var(--font-display)',
            }}>
              {tenant.plan} plan
            </div>
          )}

          {/* User + logout */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: collapsed ? "8px 0" : "8px 12px",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "#d4a574", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#0b1120", flexShrink: 0,
            }}>
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(232,223,207,0.85)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.full_name}</div>
                <button onClick={handleLogout} style={{ background: "none", border: "none", color: "rgba(232,223,207,0.35)", fontSize: 11, cursor: "pointer", padding: 0, fontFamily: 'var(--font-body)' }}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: sidebarWidth,
        flex: 1,
        minHeight: "100vh",
        transition: "margin-left 0.2s ease",
        marginTop: isImpersonation ? 32 : 0,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 64px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
