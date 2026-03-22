"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type Step = "password" | "totp" | "setup-password" | "setup-totp";

export default function AdminLogin() {
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const totpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((step === "totp" || step === "setup-totp") && totpInputRef.current) {
      totpInputRef.current.focus();
    }
  }, [step]);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (step === "setup-password" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (step === "setup-password" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        step === "setup-password" ? "/api/admin/setup" : "/api/admin/login";
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
        /* Check if TOTP is required */
        if (data.requireTotp) {
          setStep("totp");
        } else if (data.requireTotpSetup) {
          /* Migration case: existing password, no TOTP yet */
          const totp = data.totp as { secret: string; qrDataUrl: string };
          setTotpSecret(totp.secret);
          setQrDataUrl(totp.qrDataUrl);
          setStep("setup-totp");
        } else if (data.totp) {
          /* First-time setup: password saved, now show QR */
          const totp = data.totp as { secret: string; qrDataUrl: string };
          setTotpSecret(totp.secret);
          setQrDataUrl(totp.qrDataUrl);
          setStep("setup-totp");
        } else if (data.success) {
          router.push("/admin");
          router.refresh();
        }
      } else if (data.setup) {
        setStep("setup-password");
        setError("");
      } else {
        setError((data.error as string) ?? "Something went wrong.");
      }
    } catch {
      setError("Connection failed — check Vercel environment variables.");
    }
    setLoading(false);
  }

  async function handleTotpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (totpCode.length !== 6) {
      setError("Enter a 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      if (step === "setup-totp") {
        /* Confirm TOTP setup */
        const res = await fetch("/api/admin/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password,
            totpCode,
            totpSecret,
            confirmSetup: true,
          }),
        });

        let data: Record<string, unknown> = {};
        try {
          data = await res.json();
        } catch {
          setError("Server error.");
          setLoading(false);
          return;
        }

        if (res.ok && data.success) {
          router.push("/admin");
          router.refresh();
        } else {
          setError((data.error as string) ?? "Verification failed.");
        }
      } else {
        /* Regular TOTP login */
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, totpCode }),
        });

        let data: Record<string, unknown> = {};
        try {
          data = await res.json();
        } catch {
          setError("Server error.");
          setLoading(false);
          return;
        }

        if (res.ok && data.success) {
          router.push("/admin");
          router.refresh();
        } else {
          setError((data.error as string) ?? "Verification failed.");
        }
      }
    } catch {
      setError("Connection failed.");
    }
    setLoading(false);
  }

  const inputStyle = {
    backgroundColor: "#0B1120",
    border: "1px solid #202431",
    color: "#E8DFCF",
  };

  const labelStyle = { color: "#5E5E62" };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#0B1120" }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ backgroundColor: "#101726", border: "1px solid #202431" }}
      >
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo/logo-mark-light.svg"
            alt="Cosmic Reach"
            className="w-10 h-10"
          />
        </div>

        <p
          className="text-xs font-semibold tracking-widest uppercase text-center mb-2"
          style={labelStyle}
        >
          Mission Control
        </p>
        <h1
          className="text-xl font-bold text-center mb-8"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "#E8DFCF",
          }}
        >
          {step === "setup-password"
            ? "Create Admin Password"
            : step === "setup-totp"
            ? "Set Up Authenticator"
            : step === "totp"
            ? "Two-Factor Verification"
            : "Admin Access"}
        </h1>

        {/* ── Password step ── */}
        {(step === "password" || step === "setup-password") && (
          <>
            {step === "setup-password" && (
              <p className="text-sm text-center mb-6" style={labelStyle}>
                First time setup — choose a password to protect this dashboard.
              </p>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-semibold tracking-wider uppercase mb-2"
                  style={labelStyle}
                >
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
                    ...inputStyle,
                    // @ts-expect-error ring color via CSS custom prop
                    "--tw-ring-color": "#D4A574",
                  }}
                />
              </div>

              {step === "setup-password" && (
                <div>
                  <label
                    className="block text-xs font-semibold tracking-wider uppercase mb-2"
                    style={labelStyle}
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-1"
                    style={inputStyle}
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
                  : step === "setup-password"
                  ? "Set Password & Continue"
                  : "Enter Mission Control"}
              </button>
            </form>

            {step === "password" && (
              <p
                className="mt-4 text-center text-xs"
                style={{ color: "#343841" }}
              >
                First time?{" "}
                <button
                  onClick={() => {
                    setStep("setup-password");
                    setError("");
                  }}
                  className="underline"
                  style={{ color: "#5E5E62" }}
                >
                  Set up admin password
                </button>
              </p>
            )}
          </>
        )}

        {/* ── TOTP verification step ── */}
        {step === "totp" && (
          <form onSubmit={handleTotpSubmit} className="space-y-4">
            <p className="text-sm text-center mb-2" style={labelStyle}>
              Enter the 6-digit code from your authenticator app.
            </p>
            <div>
              <input
                ref={totpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                onChange={(e) =>
                  setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                autoComplete="one-time-code"
                className="w-full rounded-lg px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:ring-1"
                style={{
                  ...inputStyle,
                  // @ts-expect-error ring color via CSS custom prop
                  "--tw-ring-color": "#D4A574",
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: "#E04747" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || totpCode.length !== 6}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#D4A574", color: "#0B1120" }}
            >
              {loading ? "..." : "Verify"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("password");
                setTotpCode("");
                setError("");
              }}
              className="w-full text-xs text-center"
              style={{ color: "#5E5E62" }}
            >
              Back to password
            </button>
          </form>
        )}

        {/* ── TOTP setup step (QR code) ── */}
        {step === "setup-totp" && (
          <form onSubmit={handleTotpSubmit} className="space-y-5">
            <p className="text-sm text-center" style={labelStyle}>
              Scan this QR code with Google Authenticator, Authy, or your
              preferred authenticator app.
            </p>

            {qrDataUrl && (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Scan QR code with authenticator app"
                  className="rounded-lg"
                  width={200}
                  height={200}
                />
              </div>
            )}

            <div>
              <label
                className="block text-xs font-semibold tracking-wider uppercase mb-2"
                style={labelStyle}
              >
                Verification Code
              </label>
              <input
                ref={totpInputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={totpCode}
                onChange={(e) =>
                  setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                autoComplete="one-time-code"
                className="w-full rounded-lg px-4 py-4 text-center text-2xl font-mono tracking-[0.5em] outline-none focus:ring-1"
                style={{
                  ...inputStyle,
                  // @ts-expect-error ring color via CSS custom prop
                  "--tw-ring-color": "#D4A574",
                }}
              />
            </div>

            {error && (
              <p className="text-sm text-center" style={{ color: "#E04747" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || totpCode.length !== 6}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "#D4A574", color: "#0B1120" }}
            >
              {loading ? "..." : "Verify & Complete Setup"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
