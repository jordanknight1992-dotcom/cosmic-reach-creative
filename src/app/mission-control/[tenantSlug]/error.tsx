"use client";

import { useParams } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ tenantSlug: string }>();
  const tenantSlug = params.tenantSlug;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: 32,
        fontFamily: "var(--font-body)",
        color: "#e8dfcf",
      }}
    >
      <div style={{ maxWidth: 420, textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            color: "#d4a574",
            margin: "0 0 12px",
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: "#e8dfcf",
            opacity: 0.7,
            margin: "0 0 8px",
          }}
        >
          An unexpected error occurred. You can try again or head back to your
          briefing.
        </p>
        {error.digest && (
          <p
            style={{
              fontSize: 11,
              color: "#e8dfcf",
              opacity: 0.35,
              margin: "0 0 28px",
            }}
          >
            Ref: {error.digest}
          </p>
        )}
        {!error.digest && <div style={{ height: 28 }} />}
        <div
          style={{
            display: "flex",
            gap: 14,
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
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <a
            href={`/mission-control/${tenantSlug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: "#d4a574",
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: 8,
              border: "1px solid rgba(212,165,116,0.3)",
            }}
          >
            Back to Briefing
          </a>
        </div>
      </div>
    </div>
  );
}
