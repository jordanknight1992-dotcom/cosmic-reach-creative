"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [mode, setMode] = useState<"login" | "setup">("login");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "setup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "setup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/admin/login" : "/api/admin/setup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      let data: Record<string, unknown> = {};
      try {
        data = await res.json();
      } catch {
        setError("Server error — check that POSTGRES_URL is configured in Vercel.");
        setLoading(false);
        return;
      }

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else if (data.setup) {
        setMode("setup");
        setError("");
      } else {
        setError((data.error as string) ?? "Something went wrong.");
      }
    } catch (err) {
      setError("Connection failed — check Vercel environment variables.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0B1120" }}>
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ backgroundColor: "#101726", border: "1px solid #202431" }}
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/logo-mark-light.svg" alt="Cosmic Reach" className="w-10 h-10" />
        </div>

        <p
          className="text-xs font-semibold tracking-widest uppercase text-center mb-2"
          style={{ color: "#5E5E62" }}
        >
          Mission Control
        </p>
        <h1
          className="text-xl font-bold text-center mb-8"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "#E8DFCF" }}
        >
          {mode === "setup" ? "Create Admin Password" : "Admin Access"}
        </h1>

        {mode === "setup" && (
          <p className="text-sm text-center mb-6" style={{ color: "#5E5E62" }}>
            First time setup — choose a password to protect this dashboard.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#5E5E62" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1"
              style={{
                backgroundColor: "#0B1120",
                border: "1px solid #202431",
                color: "#E8DFCF",
                // @ts-expect-error ring color via CSS
                "--tw-ring-color": "#D4A574",
              }}
            />
          </div>

          {mode === "setup" && (
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#5E5E62" }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1"
                style={{
                  backgroundColor: "#0B1120",
                  border: "1px solid #202431",
                  color: "#E8DFCF",
                }}
              />
            </div>
          )}

          {error && (
            <p className="text-sm text-center" style={{ color: "#E04747" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ backgroundColor: "#D4A574", color: "#0B1120" }}
          >
            {loading
              ? "..."
              : mode === "setup"
              ? "Set Password & Enter"
              : "Enter Mission Control"}
          </button>
        </form>

        {mode === "login" && (
          <p className="mt-4 text-center text-xs" style={{ color: "#343841" }}>
            First time?{" "}
            <button
              onClick={() => { setMode("setup"); setError(""); }}
              className="underline"
              style={{ color: "#5E5E62" }}
            >
              Set up admin password
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
