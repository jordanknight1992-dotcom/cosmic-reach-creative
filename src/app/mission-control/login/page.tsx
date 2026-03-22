"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/mc/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      router.push(data.redirect);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

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
      const res = await fetch("/api/mc/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          company_name: companyName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push(data.redirect);
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
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "0 20px",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: "#d4a574",
              marginBottom: 8,
              fontFamily: 'var(--font-display)',
            }}
          >
            Mission Control
          </div>
          <div
            style={{
              fontSize: 14,
              color: "rgba(232,223,207,0.35)",
            }}
          >
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
              fontFamily: 'var(--font-display)',
            }}
          >
            {mode === "login" ? "Welcome back" : "Get started"}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(232,223,207,0.35)",
              margin: "0 0 28px 0",
            }}
          >
            {mode === "login"
              ? "Sign in to your workspace"
              : "Create your workspace"}
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

          <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
            {mode === "register" && (
              <>
                <label style={labelStyle}>Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Jordan Knight"
                />

                <label style={labelStyle}>Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Acme Corp"
                />
              </>
            )}

            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="you@company.com"
            />

            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
              placeholder="••••••••"
            />

            {mode === "register" && (
              <>
                <label style={labelStyle}>Confirm password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  style={inputStyle}
                  placeholder="••••••••"
                />
              </>
            )}

            {mode === "login" && (
              <div style={{ textAlign: "right", marginTop: 8 }}>
                <Link
                  href="/mission-control/reset-password"
                  style={{
                    fontSize: 12,
                    color: "rgba(232,223,207,0.35)",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px 0",
                marginTop: 8,
                background: loading ? "#c93a3a" : "#e04747",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "wait" : "pointer",
                transition: "background 0.15s",
                fontFamily: 'var(--font-display)',
              }}
            >
              {loading
                ? "..."
                : mode === "login"
                  ? "Sign in"
                  : "Create workspace"}
            </button>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "rgba(232,223,207,0.35)",
            }}
          >
            {mode === "login" ? (
              <>
                New to Mission Control?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setError("");
                  }}
                  style={linkStyle}
                >
                  Create workspace
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  style={linkStyle}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            textAlign: "center",
            marginTop: 32,
            fontSize: 13,
            color: "rgba(232,223,207,0.25)",
          }}
        >
          Know what to fix today.
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(232,223,207,0.5)",
  marginBottom: 6,
  marginTop: 16,
  fontFamily: 'var(--font-display)',
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
  fontFamily: 'var(--font-body)',
};

const linkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#d4a574",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  padding: 0,
  fontFamily: 'var(--font-body)',
};
