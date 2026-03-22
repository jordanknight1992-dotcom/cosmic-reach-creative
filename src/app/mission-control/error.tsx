"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1120",
        color: "#e8dfcf",
        fontFamily: "var(--font-body)",
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>&#x2604;</div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 28,
            fontWeight: 700,
            color: "#d4a574",
            margin: "0 0 12px",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: "#e8dfcf",
            opacity: 0.8,
            margin: "0 0 8px",
          }}
        >
          Mission Control hit an unexpected anomaly. Our systems are standing by
          for another attempt.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: 12,
              color: "#e8dfcf",
              opacity: 0.4,
              margin: "0 0 32px",
            }}
          >
            Error reference: {error.digest}
          </p>
        )}
        {!error.digest && <div style={{ height: 32 }} />}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={reset}
            style={{
              background: "#e04747",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "12px 28px",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#d4a574",
              fontSize: 15,
              fontWeight: 500,
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: 8,
              border: "1px solid rgba(212,165,116,0.3)",
            }}
          >
            Return to Cosmic Reach
          </Link>
        </div>
      </div>
    </div>
  );
}
