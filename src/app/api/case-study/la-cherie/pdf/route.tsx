import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const fontData = await fetch(
    new URL("/fonts/SpaceGrotesk-Bold.woff2", request.url)
  ).then((res) => res.arrayBuffer());

  const copper = "#d4a574";
  const starlight = "#e8dfcf";
  const muted = "rgba(232,223,207,0.6)";
  const deepSpace = "#0b1120";
  const navy = "#111827";

  const scores = [
    { label: "Signal", before: 2, after: 7 },
    { label: "Gravity", before: 1, after: 7 },
    { label: "Orbit", before: 2, after: 8 },
    { label: "Thrust", before: 1, after: 6 },
  ];

  const problems = [
    "Trust gap for non-referral visitors",
    "No positioning online",
    "Generic messaging",
    "Hidden offer structure",
  ];

  const changes = [
    "Brand system (38 pages)",
    "Full site rebuild",
    "Offer architecture",
    "SEO foundation",
    "Inquiry flow redesign",
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: deepSpace,
          padding: "48px 56px",
          fontFamily: "SpaceGrotesk",
          gap: "0px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: copper,
            }}
          >
            COSMIC REACH CREATIVE
          </div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: muted,
              border: `1px solid ${copper}`,
              padding: "4px 12px",
              borderRadius: "3px",
            }}
          >
            CASE STUDY
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: copper,
            opacity: 0.3,
            marginBottom: "28px",
            display: "flex",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: "40px",
            fontWeight: 700,
            color: starlight,
            lineHeight: 1.1,
            marginBottom: "10px",
          }}
        >
          La Ch&#233;rie Weddings
        </div>

        {/* Subhead */}
        <div
          style={{
            fontSize: "15px",
            color: muted,
            lineHeight: 1.5,
            marginBottom: "28px",
            maxWidth: "900px",
          }}
        >
          She delivered a premium experience. Anyone who hadn&#39;t spoken to her
          had no way to know.
        </div>

        {/* Two column layout */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            flex: 1,
          }}
        >
          {/* Left column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: "20px",
            }}
          >
            {/* Problem card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: navy,
                borderRadius: "8px",
                padding: "22px 24px",
                border: "1px solid rgba(212,165,116,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: copper,
                  marginBottom: "14px",
                }}
              >
                THE PROBLEM
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {problems.map((p) => (
                  <div
                    key={p}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: copper,
                        flexShrink: 0,
                        display: "flex",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "13px",
                        color: starlight,
                        lineHeight: 1.4,
                      }}
                    >
                      {p}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What Changed card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: navy,
                borderRadius: "8px",
                padding: "22px 24px",
                border: "1px solid rgba(212,165,116,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: copper,
                  marginBottom: "14px",
                }}
              >
                WHAT CHANGED
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {changes.map((c) => (
                  <div
                    key={c}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: copper,
                        flexShrink: 0,
                        display: "flex",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "13px",
                        color: starlight,
                        lineHeight: 1.4,
                      }}
                    >
                      {c}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: "20px",
            }}
          >
            {/* Score Shift card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: navy,
                borderRadius: "8px",
                padding: "22px 24px",
                border: "1px solid rgba(212,165,116,0.15)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: copper,
                  }}
                >
                  SCORE SHIFT
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "rgba(232,223,207,0.3)",
                    }}
                  >
                    1.6
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      color: copper,
                    }}
                  >
                    &#8594;
                  </div>
                  <div
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: copper,
                    }}
                  >
                    7.0
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {scores.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: muted,
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: starlight,
                          display: "flex",
                          gap: "6px",
                        }}
                      >
                        <span style={{ color: "rgba(232,223,207,0.3)" }}>
                          {s.before}
                        </span>
                        <span style={{ color: copper }}>&#8594;</span>
                        <span style={{ color: copper }}>{s.after}</span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        height: "4px",
                        backgroundColor: "rgba(232,223,207,0.08)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(s.after / 10) * 100}%`,
                          height: "100%",
                          backgroundColor: copper,
                          borderRadius: "2px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: navy,
                borderRadius: "8px",
                padding: "22px 24px",
                border: `1px solid ${copper}`,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: copper,
                  marginBottom: "12px",
                }}
              >
                OUTCOME
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: starlight,
                  lineHeight: 1.6,
                }}
              >
                Site now supports premium positioning for all visitors, not just
                referrals.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: "1px solid rgba(212,165,116,0.2)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: muted,
              letterSpacing: "0.5px",
            }}
          >
            cosmicreachcreative.com/clarity
          </div>
          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: copper,
              letterSpacing: "0.5px",
            }}
          >
            $150 Clarity Audit
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1600,
      fonts: [
        {
          name: "SpaceGrotesk",
          data: fontData,
          style: "normal" as const,
          weight: 700 as const,
        },
      ],
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition":
          'attachment; filename="la-cherie-case-study.png"',
      },
    }
  );
}
