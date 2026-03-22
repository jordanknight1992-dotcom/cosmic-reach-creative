"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Forgot password mode (no token)
  const [email, setEmail] = useState("");

  // Reset password mode (has token)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/mc/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("If an account exists with that email, you'll receive a reset link shortly.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/mc/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/mission-control/login"), 2000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1120",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, padding: "0 20px" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#d4a574",
              marginBottom: 8,
              fontFamily: "var(--font-display)",
            }}
          >
            Mission Control
          </div>
          <div style={{ fontSize: 14, color: "rgba(232,223,207,0.35)" }}>
            by Cosmic Reach Creative
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111827",
            border: "1px solid rgba(232,223,207,0.1)",
            borderRadius: 16,
            padding: "36px 32px",
          }}
        >
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#e8dfcf",
              margin: "0 0 4px 0",
              fontFamily: "var(--font-display)",
            }}
          >
            {token ? "Set new password" : "Reset password"}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(232,223,207,0.35)",
              margin: "0 0 28px 0",
            }}
          >
            {token
              ? "Enter your new password below"
              : "Enter your email and we'll send a reset link"}
          </p>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#f87171",
                marginBottom: 20,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#22c55e",
                marginBottom: 20,
              }}
            >
              {success}
            </div>
          )}

          {token ? (
            <form onSubmit={handleResetPassword}>
              <label style={labelStyle}>New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                style={inputStyle}
                placeholder="At least 8 characters"
              />

              <label style={labelStyle}>Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                style={inputStyle}
                placeholder="Confirm your new password"
              />

              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "..." : "Reset password"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder="you@company.com"
              />

              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "..." : "Send reset link"}
              </button>
            </form>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "rgba(232,223,207,0.35)",
            }}
          >
            <Link
              href="/mission-control/login"
              style={{
                color: "#d4a574",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(232,223,207,0.5)",
  marginBottom: 6,
  marginTop: 16,
  fontFamily: "var(--font-display)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  background: "#0b1120",
  border: "1px solid rgba(232,223,207,0.1)",
  borderRadius: 8,
  color: "#e8dfcf",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-body)",
};

function buttonStyle(loading: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "12px 0",
    marginTop: 8,
    background: loading ? "#b8906a" : "#d4a574",
    color: "#1a1f2e",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: loading ? "wait" : "pointer",
    transition: "background 0.15s",
    fontFamily: "var(--font-display)",
  };
}
