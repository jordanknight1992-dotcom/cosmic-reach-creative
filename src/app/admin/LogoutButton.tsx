"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-lg transition-colors"
      style={{ color: "#5E5E62", border: "1px solid #202431" }}
    >
      Log out
    </button>
  );
}
