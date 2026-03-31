"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { GA4Metrics, SearchConsoleMetrics } from "@/lib/ga4";
import type { PageSpeedResult, UptimeResult } from "@/lib/site-health";
import type { SiteHealthScores } from "@/lib/site-scoring";
import { getScoreColor } from "@/lib/site-scoring";

export interface PerformanceData {
  hasGA4: boolean;
  ga4Data: GA4Metrics | null;
  keywordData: SearchConsoleMetrics | null;
  connectedProviders: string[];
  pageSpeed?: PageSpeedResult | null;
  uptime?: UptimeResult | null;
  siteUrl?: string | null;
  scores?: SiteHealthScores | null;
}

export function SignalView({ tenantSlug, data }: { tenantSlug: string; data: PerformanceData }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const base = `/mission-control/${tenantSlug}`;
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = useCallback(async () => {
    if (!reportRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#0B1120",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    const date = new Date().toISOString().slice(0, 10);
    pdf.save(`performance-report-${date}.pdf`);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)', color: '#d4a574' }}>Performance</h1>
          <p style={{ color: "rgba(232,223,207,0.35)", fontSize: 14, marginTop: 4 }}>
            Website traffic, sources, and keyword visibility over the last 30 days.
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          style={{
            background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "1px solid rgba(212,165,116,0.2)",
            borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: 'var(--font-display)',
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(212,165,116,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(212,165,116,0.1)"; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <polyline points="9 15 12 18 15 15" />
          </svg>
          Export PDF
        </button>
      </div>

      <div ref={reportRef}>

      {/* ─── Layer Scores ─── */}
      {data.scores && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Site Health</h2>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: getScoreColor(data.scores.overall), fontFamily: 'var(--font-display)' }}>
                {data.scores.overall}
              </span>
              <span style={{ fontSize: 12, color: "rgba(232,223,207,0.3)" }}>/ 10</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[data.scores.signal, data.scores.gravity, data.scores.orbit, data.scores.thrust].map((layer) => (
              <div key={layer.label} style={{
                background: "rgba(232,223,207,0.02)", borderRadius: 10, padding: "12px 16px",
                border: "1px solid rgba(232,223,207,0.04)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#e8dfcf", fontFamily: 'var(--font-display)' }}>{layer.label}</span>
                    <span style={{ fontSize: 11, color: "rgba(232,223,207,0.25)" }}>{layer.area}</span>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: getScoreColor(layer.score), fontFamily: 'var(--font-display)' }}>
                    {layer.score}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "rgba(232,223,207,0.3)", marginBottom: 8 }}>{layer.question}</div>
                {/* Score bar */}
                <div style={{ height: 6, borderRadius: 3, background: "rgba(232,223,207,0.06)", overflow: "hidden", marginBottom: 8 }}>
                  <div style={{
                    height: "100%", borderRadius: 3,
                    background: getScoreColor(layer.score),
                    width: `${(layer.score / 10) * 100}%`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
                {/* Factors */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 6 : 12 }}>
                  {layer.factors.map((f) => (
                    <div key={f.name} style={{ fontSize: 11 }}>
                      <span style={{ color: "rgba(232,223,207,0.25)" }}>{f.name} </span>
                      <span style={{ color: "rgba(232,223,207,0.45)", fontWeight: 500 }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(232,223,207,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 10, color: "rgba(232,223,207,0.3)" }}>8-10 Good</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} />
              <span style={{ fontSize: 10, color: "rgba(232,223,207,0.3)" }}>5-7 Be Aware</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontSize: 10, color: "rgba(232,223,207,0.3)" }}>0-4 Warning</span>
            </div>
          </div>
        </div>
      )}

      {/* GA4 Analytics Dashboard */}
      {data.ga4Data ? (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Website Analytics (30d)</h2>

          {/* GA4 KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <GA4KpiCard
              label="Sessions"
              value={data.ga4Data.sessions30d.toLocaleString()}
              change={data.ga4Data.comparison.sessions.changePercent}
            />
            <GA4KpiCard
              label="Page Views"
              value={data.ga4Data.pageViews30d.toLocaleString()}
              change={data.ga4Data.comparison.pageViews.changePercent}
            />
            <GA4KpiCard
              label="Bounce Rate"
              value={`${data.ga4Data.bounceRate30d.toFixed(1)}%`}
              change={data.ga4Data.comparison.bounceRate.changePercent}
              invertColor
            />
            <GA4KpiCard
              label="Engagement"
              value={`${data.ga4Data.engagementRate30d.toFixed(1)}%`}
              change={data.ga4Data.comparison.engagement.changePercent}
            />
          </div>

          {/* Sessions Overlay Chart */}
          {data.ga4Data.dailySessions.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Sessions: Current vs Previous 30 Days</h3>
              <SessionsOverlayChart
                current={data.ga4Data.dailySessions}
                previous={data.ga4Data.previousDailySessions}
              />
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 16, height: 2, background: "#d4a574" }} />
                  <span style={{ fontSize: 11, color: "rgba(232,223,207,0.4)" }}>Current</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 16, height: 2, background: "rgba(212,165,116,0.3)", borderTop: "1px dashed rgba(212,165,116,0.4)" }} />
                  <span style={{ fontSize: 11, color: "rgba(232,223,207,0.4)" }}>Previous</span>
                </div>
              </div>
            </div>
          )}

          {/* Source Performance Over Time */}
          {data.ga4Data.sourceTimeline.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Traffic Source Performance</h3>
              <SourceTimelineChart timeline={data.ga4Data.sourceTimeline} />
            </div>
          )}

          {/* Traffic Sources */}
          {data.ga4Data.topSources.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Traffic Sources</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.ga4Data.topSources.slice(0, 6).map((src) => (
                  <div key={src.source} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 100, fontSize: 12, color: "rgba(232,223,207,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {src.source}
                    </div>
                    <div style={{ flex: 1, height: 6, background: "rgba(232,223,207,0.06)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${src.percentage}%`, height: "100%", background: "#d4a574", borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", width: 60, textAlign: "right" }}>
                      {src.sessions} ({src.percentage.toFixed(0)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Pages */}
          {data.ga4Data.topPages.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Top Pages</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {data.ga4Data.topPages.slice(0, 5).map((page) => (
                  <div key={page.page} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(232,223,207,0.05)" }}>
                    <div style={{ flex: 1, fontSize: 12, color: "rgba(232,223,207,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {page.page}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(232,223,207,0.4)" }}>{page.views} views</div>
                    <div style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 4,
                      background: page.bounceRate < 50 ? "rgba(34,197,94,0.1)" : page.bounceRate < 70 ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)",
                      color: page.bounceRate < 50 ? "#22c55e" : page.bounceRate < 70 ? "#eab308" : "#ef4444",
                    }}>
                      {page.bounceRate.toFixed(0)}% bounce
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginTop: 16 }}>
            <div style={{ background: "rgba(34,197,94,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e", fontFamily: 'var(--font-display)' }}>{data.ga4Data.newUsers30d}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)" }}>New Users</div>
            </div>
            <div style={{ background: "rgba(59,130,246,0.06)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6", fontFamily: 'var(--font-display)' }}>{data.ga4Data.returningUsers30d}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)" }}>Returning</div>
            </div>
          </div>
        </div>
      ) : !data.hasGA4 ? (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "24px 24px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28, opacity: 0.3 }}>◇</div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>
                Connect Google Analytics for traffic data
              </h3>
              <p style={{ fontSize: 13, color: "rgba(232,223,207,0.35)", margin: 0 }}>
                When connected, you will see page views, top pages, and traffic sources here.
              </p>
              <button
                onClick={() => router.push(`${base}/settings`)}
                style={{
                  background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
                  borderRadius: 8, padding: "6px 14px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", marginTop: 12,
                  fontFamily: 'var(--font-display)',
                }}
              >
                Connect in Settings →
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Keyword Performance */}
      {data.keywordData && data.keywordData.keywords.length > 0 && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 24,
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Keyword Performance (30d)</h2>

          {/* Keyword KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{data.keywordData.totalClicks.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>Clicks</div>
            </div>
            <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{data.keywordData.totalImpressions.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>Impressions</div>
            </div>
            <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{data.keywordData.avgCtr.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>Avg CTR</div>
            </div>
            <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{data.keywordData.avgPosition.toFixed(1)}</div>
              <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>Avg Position</div>
            </div>
          </div>

          {/* Keyword table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(232,223,207,0.1)" }}>
                  <th style={{ textAlign: "left", padding: "8px 8px 8px 0", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: 'var(--font-display)' }}>Keyword</th>
                  <th style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: 'var(--font-display)' }}>Clicks</th>
                  <th style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: 'var(--font-display)' }}>Impressions</th>
                  {!isMobile && <th style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: 'var(--font-display)' }}>CTR</th>}
                  <th style={{ textAlign: "right", padding: "8px 0 8px 8px", color: "rgba(232,223,207,0.4)", fontWeight: 600, fontSize: 11, fontFamily: 'var(--font-display)' }}>Position</th>
                </tr>
              </thead>
              <tbody>
                {data.keywordData.keywords.slice(0, 15).map((kw) => (
                  <tr key={kw.query} style={{ borderBottom: "1px solid rgba(232,223,207,0.05)" }}>
                    <td style={{ padding: "8px 8px 8px 0", color: "rgba(232,223,207,0.7)" }}>{kw.query}</td>
                    <td style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.6)" }}>{kw.clicks}</td>
                    <td style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.5)" }}>{kw.impressions.toLocaleString()}</td>
                    {!isMobile && <td style={{ textAlign: "right", padding: "8px 8px", color: "rgba(232,223,207,0.5)" }}>{kw.ctr.toFixed(1)}%</td>}
                    <td style={{
                      textAlign: "right", padding: "8px 0 8px 8px", fontWeight: 600,
                      color: kw.position <= 10 ? "#22c55e" : kw.position <= 20 ? "#eab308" : "rgba(232,223,207,0.4)",
                    }}>
                      {kw.position.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Website Health ─── */}
      {(data.pageSpeed || data.uptime) && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "20px 24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>Website Health</h2>
            {data.siteUrl && (
              <span style={{ fontSize: 11, color: "rgba(232,223,207,0.3)" }}>{data.siteUrl}</span>
            )}
          </div>

          {/* Uptime Status */}
          {data.uptime && (
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
              background: data.uptime.ok ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)",
              borderRadius: 10, padding: "12px 16px",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: data.uptime.ok ? "#22c55e" : "#ef4444",
                boxShadow: data.uptime.ok ? "0 0 8px rgba(34,197,94,0.4)" : "0 0 8px rgba(239,68,68,0.4)",
              }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: data.uptime.ok ? "#22c55e" : "#ef4444" }}>
                  {data.uptime.ok ? "Online" : "Unreachable"}
                </span>
                {data.uptime.status && (
                  <span style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", marginLeft: 8 }}>
                    HTTP {data.uptime.status}
                  </span>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: data.uptime.responseTimeMs < 500 ? "#22c55e" : data.uptime.responseTimeMs < 1500 ? "#eab308" : "#ef4444", fontFamily: 'var(--font-display)' }}>
                  {data.uptime.responseTimeMs}ms
                </div>
                <div style={{ fontSize: 10, color: "rgba(232,223,207,0.35)" }}>Response Time</div>
              </div>
            </div>
          )}

          {/* PageSpeed Scores */}
          {data.pageSpeed && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                <ScoreGauge label="Performance" score={data.pageSpeed.performanceScore} />
                <ScoreGauge label="Accessibility" score={data.pageSpeed.accessibilityScore} />
                <ScoreGauge label="SEO" score={data.pageSpeed.seoScore} />
                <ScoreGauge label="Best Practices" score={data.pageSpeed.bestPracticesScore} />
              </div>

              {/* Core Web Vitals */}
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(232,223,207,0.5)", margin: "0 0 10px 0", fontFamily: 'var(--font-display)' }}>Core Web Vitals</h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10 }}>
                {data.pageSpeed.vitals.lcp != null && (
                  <VitalCard
                    label="LCP"
                    sublabel="Largest Contentful Paint"
                    value={`${(data.pageSpeed.vitals.lcp / 1000).toFixed(1)}s`}
                    status={data.pageSpeed.vitals.lcp <= 2500 ? "good" : data.pageSpeed.vitals.lcp <= 4000 ? "needs-improvement" : "poor"}
                  />
                )}
                {data.pageSpeed.vitals.cls != null && (
                  <VitalCard
                    label="CLS"
                    sublabel="Cumulative Layout Shift"
                    value={data.pageSpeed.vitals.cls.toFixed(3)}
                    status={data.pageSpeed.vitals.cls <= 0.1 ? "good" : data.pageSpeed.vitals.cls <= 0.25 ? "needs-improvement" : "poor"}
                  />
                )}
                {data.pageSpeed.vitals.tbt != null && (
                  <VitalCard
                    label="TBT"
                    sublabel="Total Blocking Time"
                    value={`${data.pageSpeed.vitals.tbt}ms`}
                    status={data.pageSpeed.vitals.tbt <= 200 ? "good" : data.pageSpeed.vitals.tbt <= 600 ? "needs-improvement" : "poor"}
                  />
                )}
                {data.pageSpeed.vitals.fcp != null && (
                  <VitalCard
                    label="FCP"
                    sublabel="First Contentful Paint"
                    value={`${(data.pageSpeed.vitals.fcp / 1000).toFixed(1)}s`}
                    status={data.pageSpeed.vitals.fcp <= 1800 ? "good" : data.pageSpeed.vitals.fcp <= 3000 ? "needs-improvement" : "poor"}
                  />
                )}
                {data.pageSpeed.vitals.si != null && (
                  <VitalCard
                    label="SI"
                    sublabel="Speed Index"
                    value={`${(data.pageSpeed.vitals.si / 1000).toFixed(1)}s`}
                    status={data.pageSpeed.vitals.si <= 3400 ? "good" : data.pageSpeed.vitals.si <= 5800 ? "needs-improvement" : "poor"}
                  />
                )}
                {data.pageSpeed.vitals.ttfb != null && (
                  <VitalCard
                    label="TTFB"
                    sublabel="Time to First Byte"
                    value={`${data.pageSpeed.vitals.ttfb}ms`}
                    status={data.pageSpeed.vitals.ttfb <= 800 ? "good" : data.pageSpeed.vitals.ttfb <= 1800 ? "needs-improvement" : "poor"}
                  />
                )}
              </div>

              <div style={{ fontSize: 10, color: "rgba(232,223,207,0.2)", marginTop: 12, textAlign: "right" }}>
                {data.pageSpeed.strategy} analysis &middot; {new Date(data.pageSpeed.fetchedAt).toLocaleDateString()}
              </div>
            </>
          )}
        </div>
      )}

      {/* No domain set — prompt to add */}
      {!data.pageSpeed && !data.uptime && !data.siteUrl && (
        <div style={{
          background: "#111827", border: "1px solid rgba(232,223,207,0.1)",
          borderRadius: 14, padding: "24px 24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28, opacity: 0.3 }}>&#9671;</div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px 0", color: "rgba(232,223,207,0.85)", fontFamily: 'var(--font-display)' }}>
                Add your website for health monitoring
              </h3>
              <p style={{ fontSize: 13, color: "rgba(232,223,207,0.35)", margin: 0 }}>
                Set your website domain in settings to see PageSpeed scores, Core Web Vitals, and uptime monitoring.
              </p>
              <button
                onClick={() => router.push(`${base}/settings`)}
                style={{
                  background: "rgba(212,165,116,0.1)", color: "#d4a574", border: "none",
                  borderRadius: 8, padding: "6px 14px", fontSize: 13,
                  fontWeight: 600, cursor: "pointer", marginTop: 12,
                  fontFamily: 'var(--font-display)',
                }}
              >
                Go to Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Report Footer */}
      <div style={{
        padding: "16px 0", marginTop: 8,
        borderTop: "1px solid rgba(232,223,207,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: "rgba(232,223,207,0.2)" }}>
          Report generated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </span>
        <span style={{ fontSize: 11, color: "rgba(232,223,207,0.15)" }}>
          Cosmic Reach Creative
        </span>
      </div>

      </div>{/* end reportRef */}
    </div>
  );
}

/* ─── Helper Components ─── */

function ScoreGauge({ label, score }: { label: string; score: number }) {
  const color = score >= 90 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ background: "rgba(232,223,207,0.03)", borderRadius: 10, padding: "16px 12px", textAlign: "center" }}>
      <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 8px" }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(232,223,207,0.06)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          fontSize: 22, fontWeight: 800, color, fontFamily: 'var(--font-display)',
        }}>
          {score}
        </div>
      </div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", fontFamily: 'var(--font-display)', fontWeight: 600 }}>{label}</div>
    </div>
  );
}

function VitalCard({ label, sublabel, value, status }: { label: string; sublabel: string; value: string; status: "good" | "needs-improvement" | "poor" }) {
  const statusColor = status === "good" ? "#22c55e" : status === "needs-improvement" ? "#eab308" : "#ef4444";
  const statusBg = status === "good" ? "rgba(34,197,94,0.06)" : status === "needs-improvement" ? "rgba(234,179,8,0.06)" : "rgba(239,68,68,0.06)";
  const statusLabel = status === "good" ? "Good" : status === "needs-improvement" ? "Needs Work" : "Poor";

  return (
    <div style={{ background: statusBg, borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,223,207,0.6)", fontFamily: 'var(--font-display)' }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: statusColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>{statusLabel}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: statusColor, fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 10, color: "rgba(232,223,207,0.3)", marginTop: 2 }}>{sublabel}</div>
    </div>
  );
}

function GA4KpiCard({ label, value, change, invertColor }: { label: string; value: string; change: number; invertColor?: boolean }) {
  const isPositive = invertColor ? change < 0 : change > 0;
  const changeColor = change === 0 ? "rgba(232,223,207,0.3)" : isPositive ? "#22c55e" : "#ef4444";
  const arrow = change > 0 ? "↑" : change < 0 ? "↓" : "";
  return (
    <div style={{ background: "rgba(212,165,116,0.06)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: "#d4a574", fontFamily: 'var(--font-display)' }}>{value}</div>
      <div style={{ fontSize: 11, color: "rgba(232,223,207,0.5)", marginTop: 2 }}>{label}</div>
      {change !== 0 && (
        <div style={{ fontSize: 10, color: changeColor, marginTop: 4, fontWeight: 600 }}>
          {arrow} {Math.abs(change).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

/* ─── SVG Chart Components ─── */

function SessionsOverlayChart({
  current,
  previous,
}: {
  current: { date: string; sessions: number }[];
  previous: { date: string; sessions: number }[];
}) {
  const W = 700, H = 160, PX = 40, PY = 20;
  const allVals = [...current, ...previous].map((d) => d.sessions);
  const maxVal = Math.max(...allVals, 1);

  function toPath(data: { sessions: number }[]) {
    if (data.length === 0) return "";
    const stepX = (W - PX * 2) / Math.max(data.length - 1, 1);
    return data
      .map((d, i) => {
        const x = PX + i * stepX;
        const y = PY + (H - PY * 2) * (1 - d.sessions / maxVal);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const yTicks = [0, Math.round(maxVal / 2), maxVal];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {yTicks.map((v) => {
        const y = PY + (H - PY * 2) * (1 - v / maxVal);
        return (
          <g key={v}>
            <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="rgba(232,223,207,0.06)" />
            <text x={PX - 6} y={y + 3} textAnchor="end" fill="rgba(232,223,207,0.25)" fontSize={9}>{v}</text>
          </g>
        );
      })}
      {previous.length > 0 && (
        <path d={toPath(previous)} fill="none" stroke="rgba(212,165,116,0.25)" strokeWidth={1.5} strokeDasharray="4 3" />
      )}
      <path d={toPath(current)} fill="none" stroke="#d4a574" strokeWidth={2} />
    </svg>
  );
}

const SOURCE_COLORS: Record<string, string> = {
  google: "#4285f4", direct: "#d4a574", linkedin: "#0a66c2",
  x: "#e8dfcf", referral: "#22c55e", email: "#eab308",
  facebook: "#1877f2", bing: "#00809d", "(direct)": "#d4a574",
};

function SourceTimelineChart({
  timeline,
}: {
  timeline: { date: string; sources: Record<string, number> }[];
}) {
  if (timeline.length === 0) return null;

  const W = 700, H = 160, PX = 40, PY = 20;

  const sourceNames = Array.from(
    new Set(timeline.flatMap((t) => Object.keys(t.sources)))
  ).slice(0, 6);

  const maxVal = Math.max(
    ...timeline.flatMap((t) => Object.values(t.sources)),
    1
  );

  function toPath(source: string) {
    return timeline
      .map((t, i) => {
        const x = PX + (i * (W - PX * 2)) / Math.max(timeline.length - 1, 1);
        const y = PY + (H - PY * 2) * (1 - (t.sources[source] || 0) / maxVal);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {[0, Math.round(maxVal / 2), maxVal].map((v) => {
          const y = PY + (H - PY * 2) * (1 - v / maxVal);
          return (
            <g key={v}>
              <line x1={PX} y1={y} x2={W - PX} y2={y} stroke="rgba(232,223,207,0.06)" />
              <text x={PX - 6} y={y + 3} textAnchor="end" fill="rgba(232,223,207,0.25)" fontSize={9}>{v}</text>
            </g>
          );
        })}
        {sourceNames.map((source) => (
          <path
            key={source}
            d={toPath(source)}
            fill="none"
            stroke={SOURCE_COLORS[source] || "rgba(232,223,207,0.3)"}
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
        {sourceNames.map((source) => (
          <div key={source} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 2, background: SOURCE_COLORS[source] || "rgba(232,223,207,0.3)" }} />
            <span style={{ fontSize: 11, color: "rgba(232,223,207,0.4)", textTransform: "capitalize" }}>{source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
