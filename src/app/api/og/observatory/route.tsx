import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "The Observatory";
  const category = searchParams.get("category") || "";

  const fontData = await fetch(
    new URL("/fonts/SpaceGrotesk-Bold.woff2", request.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B1120",
          padding: "60px",
          fontFamily: "SpaceGrotesk",
        }}
      >
        {/* Top: Label */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#D4A574",
            }}
          >
            THE OBSERVATORY
          </div>
          {category && (
            <div
              style={{
                fontSize: "14px",
                color: "rgba(232,223,207,0.4)",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          )}
        </div>

        {/* Center: Title */}
        <div
          style={{
            fontSize: title.length > 60 ? "42px" : "52px",
            fontWeight: 700,
            color: "#E8DFCF",
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Bottom: Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "rgba(232,223,207,0.35)",
              letterSpacing: "0.5px",
            }}
          >
            cosmicreachcreative.com
          </div>
          {/* Subtle accent line */}
          <div
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: "#D4A574",
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "SpaceGrotesk",
          data: fontData,
          style: "normal" as const,
          weight: 700 as const,
        },
      ],
    }
  );
}
