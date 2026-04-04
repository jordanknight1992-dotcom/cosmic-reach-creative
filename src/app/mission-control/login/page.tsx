"use client";

import { useState } from "react";
import Link from "next/link";
import { StripeBuyButton } from "@/components/StripeBuyButton";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registrationPath, setRegistrationPath] = useState<"choose" | "stripe" | "promo">("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [promoCode, setPromoCode] = useState("");

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
        setLoading(false);
        return;
      }

      // Handle TOTP requirement (if 2FA is enabled)
      if (data.requireTotp) {
        setError("Two-factor authentication is not yet supported in this interface. Please contact support.");
        setLoading(false);
        return;
      }

      if (!data.sessionId) {
        setError("Login succeeded but no session was returned. Please try again.");
        setLoading(false);
        return;
      }

      // Redirect through callback endpoint which sets the cookie via a
      // full-page GET response — reliable cookie setting
      window.location.href = `/api/mc/auth/callback?session_id=${data.sessionId}`;
    } catch {
      setError("Something went wrong. Please try again.");
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
          ...(registrationPath === "promo" && promoCode ? { promo_code: promoCode } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Use callback redirect for reliable cookie setting
      window.location.href = `/api/mc/auth/callback?session_id=${data.sessionId}`;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function switchToRegister() {
    setMode("register");
    setRegistrationPath("choose");
    setError("");
  }

  function switchToLogin() {
    setMode("login");
    setRegistrationPath("choose");
    setError("");
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0b1120",
        fontFamily: 'var(--font-body)',
        zIndex: 50,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "24px 20px",
          margin: "auto 0",
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo-mark-light.svg"
            alt="Cosmic Reach Creative"
            width={40}
            height={40}
            style={{ marginBottom: 12, display: "inline-block" }}
          />
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
              : registrationPath === "choose"
                ? "Choose how to create your workspace"
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

          {/* ── Login Form ── */}
          {mode === "login" && (
            <form onSubmit={handleLogin}>
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

              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "..." : "Sign in"}
              </button>
            </form>
          )}

          {/* ── Registration Path Chooser ── */}
          {mode === "register" && registrationPath === "choose" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Purchase subscription option */}
              <div
                style={{
                  border: "1px solid rgba(212,165,116,0.25)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  background: "rgba(212,165,116,0.04)",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e8dfcf",
                    margin: "0 0 6px 0",
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  Subscribe to Mission Control
                </p>
                <p
                  style={{
                    fontSize: 13,
                    color: "rgba(232,223,207,0.45)",
                    margin: "0 0 14px 0",
                    lineHeight: 1.5,
                  }}
                >
                  Site health, lead tracking, and performance insights. After purchase, return here to create your workspace.
                </p>
                <StripeBuyButton
                  buyButtonId="buy_btn_1THvGV0vGBLnj72kN97MqFHS"
                />
              </div>

              {/* Already purchased */}
              <button
                onClick={() => { setRegistrationPath("stripe"); setError(""); }}
                style={{
                  background: "none",
                  border: "1px solid rgba(232,223,207,0.1)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e8dfcf",
                    margin: "0 0 4px 0",
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  I already purchased
                </p>
                <p style={{ fontSize: 13, color: "rgba(232,223,207,0.35)", margin: 0 }}>
                  Create your workspace with the email used at checkout
                </p>
              </button>

              {/* Promo code */}
              <button
                onClick={() => { setRegistrationPath("promo"); setError(""); }}
                style={{
                  background: "none",
                  border: "1px solid rgba(232,223,207,0.1)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e8dfcf",
                    margin: "0 0 4px 0",
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  I have a promo code
                </p>
                <p style={{ fontSize: 13, color: "rgba(232,223,207,0.35)", margin: 0 }}>
                  Enter your code to create a free workspace
                </p>
              </button>
            </div>
          )}

          {/* ── Registration Form (stripe path) ── */}
          {mode === "register" && registrationPath === "stripe" && (
            <form onSubmit={handleRegister}>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(232,223,207,0.45)",
                  margin: "0 0 16px 0",
                  padding: "10px 14px",
                  background: "rgba(212,165,116,0.06)",
                  borderRadius: 8,
                  border: "1px solid rgba(212,165,116,0.12)",
                  lineHeight: 1.5,
                }}
              >
                Use the same email you provided during checkout.
              </p>

              {registrationFormFields({
                fullName, setFullName, companyName, setCompanyName,
                email, setEmail, password, setPassword,
                confirmPassword, setConfirmPassword,
              })}

              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "..." : "Create workspace"}
              </button>

              <button
                type="button"
                onClick={() => { setRegistrationPath("choose"); setError(""); }}
                style={{ ...backLinkStyle, marginTop: 16, display: "block", width: "100%", textAlign: "center" }}
              >
                &larr; Back
              </button>
            </form>
          )}

          {/* ── Registration Form (promo path) ── */}
          {mode === "register" && registrationPath === "promo" && (
            <form onSubmit={handleRegister}>
              <label style={labelStyle}>Promo code</label>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                required
                style={{ ...inputStyle, letterSpacing: "0.1em", fontFamily: "var(--font-display)" }}
                placeholder="ENTER CODE"
              />

              {registrationFormFields({
                fullName, setFullName, companyName, setCompanyName,
                email, setEmail, password, setPassword,
                confirmPassword, setConfirmPassword,
              })}

              <button type="submit" disabled={loading} style={buttonStyle(loading)}>
                {loading ? "..." : "Create workspace"}
              </button>

              <button
                type="button"
                onClick={() => { setRegistrationPath("choose"); setError(""); }}
                style={{ ...backLinkStyle, marginTop: 16, display: "block", width: "100%", textAlign: "center" }}
              >
                &larr; Back
              </button>
            </form>
          )}

          {/* Toggle login / register */}
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
                <button onClick={switchToRegister} style={linkStyle}>
                  Create workspace
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button onClick={switchToLogin} style={linkStyle}>
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

/* ── Shared form fields for registration ── */

function registrationFormFields({
  fullName, setFullName, companyName, setCompanyName,
  email, setEmail, password, setPassword,
  confirmPassword, setConfirmPassword,
}: {
  fullName: string; setFullName: (v: string) => void;
  companyName: string; setCompanyName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  confirmPassword: string; setConfirmPassword: (v: string) => void;
}) {
  return (
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
  );
}

/* ── Styles ── */

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

const backLinkStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(232,223,207,0.35)",
  cursor: "pointer",
  fontSize: 13,
  fontFamily: 'var(--font-body)',
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
    fontFamily: 'var(--font-display)',
  };
}
