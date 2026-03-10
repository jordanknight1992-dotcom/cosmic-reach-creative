"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  reportMeta,
  layerScores,
  deepAnalyses,
  executiveInsights,
  missionContext,
  priorityActions,
  implementationPath,
} from "@/lib/clarity-report-data";

/* ─── Font Registration ─── */
let fontsRegistered = false;

export function registerFonts(origin: string) {
  if (fontsRegistered) return;
  fontsRegistered = true;

  Font.register({
    family: "Space Grotesk",
    fonts: [
      { src: `${origin}/fonts/SpaceGrotesk-SemiBold.ttf`, fontWeight: 600 },
      { src: `${origin}/fonts/SpaceGrotesk-Bold.ttf`, fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Inter",
    fonts: [
      { src: `${origin}/fonts/Inter-Regular.ttf`, fontWeight: 400 },
      { src: `${origin}/fonts/Inter-SemiBold.ttf`, fontWeight: 600 },
    ],
  });
}

/* ─── Brand Tokens ─── */
/* All colours are fully opaque — @react-pdf does not reliably render
   8-digit hex (#RRGGBBAA). Each "muted" token is the original colour
   pre-blended against deepSpace (#0B1120).                           */
const c = {
  /* Base */
  deepSpace:    "#0B1120",
  navy:         "#101726",   /* navy @ 80 % on deepSpace */
  starlight:    "#E8DFCF",
  copper:       "#D4A574",

  /* Muted solids */
  starlightDim:   "#5E5E62", /* starlight @ ~38 % on deepSpace */
  starlightFaint: "#343841", /* starlight @ ~19 % on deepSpace */
  bodyText:       "#BCB6AC", /* starlight @ 80 % on deepSpace */
  cardBg:         "#101726", /* navy @ 80 % on deepSpace */
  cardBorder:     "#202431", /* starlight @ ~9 % on deepSpace */
  subCardBg:      "#0A0F1C", /* slightly deeper than deepSpace */
  copperSoft:     "#AC8763", /* copper @ 80 % on deepSpace */

  /* Semantic score colours */
  scoreRed:    "#E04747", /* ≤ 4  — warning */
  scoreAmber:  "#D4A230", /* 5–6  — be aware */
  scoreGreen:  "#4DB871", /* ≥ 7  — good */
};

/* Returns a semantic colour for a 0-10 score */
function scoreColor(score: number): string {
  if (score <= 4) return c.scoreRed;
  if (score <= 6) return c.scoreAmber;
  return c.scoreGreen;
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  /* Full-bleed page background — used as an absolute first child on every Page */
  pageBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: c.deepSpace,
  },

  /* Page shell */
  page: {
    fontFamily: "Inter",
    color: c.starlight,
  },
  pageContent: {
    paddingHorizontal: 48,
    paddingTop: 40,
    paddingBottom: 52, /* leave room for footer */
  },

  /* Cover */
  coverContent: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
  },
  coverLogo:    { width: 180, marginBottom: 48 },
  coverLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: 3,
    color: c.starlightDim,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  coverTitle: {
    fontFamily: "Space Grotesk",
    fontSize: 32,
    fontWeight: 700,
    color: c.copper,
    textAlign: "center",
    marginBottom: 8,
  },
  coverCompany: {
    fontFamily: "Space Grotesk",
    fontSize: 16,
    fontWeight: 600,
    color: c.starlight,
    marginBottom: 32,
  },
  coverDivider: {
    width: 48,
    height: 1,
    backgroundColor: c.copperSoft,
    marginBottom: 32,
  },
  coverPrepared: {
    fontFamily: "Space Grotesk",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1,
    color: c.starlightDim,
    marginBottom: 6,
  },
  coverDate: { fontSize: 9, color: c.starlightFaint },

  /* Section label + divider line */
  sectionLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 7,
    fontWeight: 600,
    letterSpacing: 2.5,
    color: c.copperSoft,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  /* Cards */
  card: {
    backgroundColor: c.cardBg,
    borderWidth: 1,
    borderColor: c.cardBorder,
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
  },
  subCard: {
    backgroundColor: c.subCardBg,
    borderWidth: 1,
    borderColor: c.cardBorder,
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },

  /* Score bar */
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  scoreLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 8,
    fontWeight: 600,
    color: c.starlightDim,
    width: 50,
  },
  scoreBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: c.starlightFaint,
    borderRadius: 3,
    marginHorizontal: 8,
  },
  scoreBarFill: {
    height: 6,
    borderRadius: 3,
  },
  scoreValue: {
    fontFamily: "Space Grotesk",
    fontSize: 9,
    fontWeight: 600,
    width: 18,
    textAlign: "right",
  },

  /* Text utilities */
  bodyText: {
    fontSize: 9,
    lineHeight: 1.55,
    color: c.bodyText,
  },
  smallLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 7,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: c.starlightDim,
    marginBottom: 4,
  },
  subCardLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 7,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: c.starlightFaint,
    marginBottom: 3,
  },
  subCardAccentLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 7,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: c.copperSoft,
    marginBottom: 3,
  },
  metaLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 7,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: c.starlightFaint,
    marginBottom: 2,
  },
  metaValue: {
    fontFamily: "Space Grotesk",
    fontSize: 10,
    fontWeight: 600,
    color: c.starlight,
    marginBottom: 10,
  },

  /* Badge */
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: c.cardBorder,
    marginRight: 6,
    marginBottom: 4,
  },
  badgeText: { fontSize: 7, color: c.starlightDim },

  /* Numbered list item */
  numberedItem: { flexDirection: "row", marginBottom: 8 },
  numberCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: c.copper,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 1,
  },
  numberText: {
    fontFamily: "Space Grotesk",
    fontSize: 8,
    fontWeight: 700,
    color: c.deepSpace,
  },

  /* Implementation step */
  implStep: {
    flexDirection: "row",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: c.cardBorder,
  },
  implDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.copper,
    marginRight: 10,
    marginTop: 3,
  },

  /* Page footer */
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 7, color: c.starlightFaint },

  /* Flex utilities */
  row:          { flexDirection: "row" },
  spaceBetween: { flexDirection: "row", justifyContent: "space-between" },
  mb4:  { marginBottom: 4 },
  mb8:  { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mt12: { marginTop: 12 },
});

/* ─── Sub-components ─── */

function PageBg() {
  return <View style={s.pageBg} fixed />;
}

function SectionDivider({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
      <Text style={s.sectionLabel}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: c.cardBorder, marginLeft: 8 }} />
    </View>
  );
}

function PageFooterBar({ pageNum }: { pageNum: number }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.footerText}>cosmicreachcreative.com</Text>
      <Text style={s.footerText}>Business Clarity Report — {reportMeta.business}</Text>
      <Text style={s.footerText}>{pageNum}</Text>
    </View>
  );
}

function ScoreBar({ name, score }: { name: string; score: number }) {
  const color = scoreColor(score);
  return (
    <View style={s.scoreRow}>
      <Text style={s.scoreLabel}>{name}</Text>
      <View style={s.scoreBarBg}>
        <View style={[s.scoreBarFill, { width: `${score * 10}%`, backgroundColor: color }]} />
      </View>
      <Text style={[s.scoreValue, { color }]}>{score}</Text>
    </View>
  );
}

/* ─── Document ─── */

export function ClarityReportDocument({ origin = "" }: { origin?: string }) {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title={`Business Clarity Report — ${reportMeta.business}`}
      author="Cosmic Reach Creative"
      subject="Business Clarity Audit"
    >
      {/* ── Page 1: Cover ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.coverContent}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={`${origin}/logo/logo-primary-dark.png`} style={s.coverLogo} />
          <Text style={s.coverLabel}>Business Clarity Audit</Text>
          <Text style={s.coverTitle}>Business Clarity Report</Text>
          <Text style={s.coverCompany}>{reportMeta.business}</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverPrepared}>Prepared by Cosmic Reach Creative</Text>
          <Text style={s.coverDate}>{formattedDate}</Text>
        </View>
      </Page>

      {/* ── Page 2: Executive Readout ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          <SectionDivider label="Executive Readout" />

          <View style={[s.spaceBetween, s.mb16]}>
            <View>
              <Text style={s.metaLabel}>Business</Text>
              <Text style={s.metaValue}>{reportMeta.business}</Text>
              <Text style={s.metaLabel}>Industry</Text>
              <Text style={s.metaValue}>{reportMeta.industry}</Text>
              <Text style={s.metaLabel}>Primary Offer</Text>
              <Text style={[s.bodyText, { maxWidth: 280 }]}>{reportMeta.primaryOffer}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.metaLabel}>System Momentum Score</Text>
              <Text
                style={{
                  fontFamily: "Space Grotesk",
                  fontSize: 48,
                  fontWeight: 700,
                  color: scoreColor(reportMeta.overallScore),
                  lineHeight: 1,
                }}
              >
                {reportMeta.overallScore}
              </Text>
              <Text style={{ fontSize: 12, color: c.starlightFaint, marginTop: 2 }}>/ 10</Text>
            </View>
          </View>

          {/* Layer Scores */}
          <View style={s.card}>
            <Text style={[s.smallLabel, s.mb8]}>Layer Scores</Text>
            {layerScores.map((l) => (
              <ScoreBar key={l.name} name={l.name} score={l.score} />
            ))}
          </View>

          {/* Score legend */}
          <View style={[s.row, s.mb12, { gap: 16 }]}>
            {[
              { color: c.scoreGreen, label: "7–10  Good" },
              { color: c.scoreAmber, label: "5–6  Be Aware" },
              { color: c.scoreRed,   label: "0–4  Warning" },
            ].map((item) => (
              <View key={item.label} style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, marginRight: 5 }} />
                <Text style={{ fontSize: 7, color: c.starlightDim }}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Insights */}
          <View style={s.card}>
            <Text style={[s.smallLabel, s.mb4]}>Primary Constraint</Text>
            <Text style={[s.bodyText, s.mb12]}>{executiveInsights.primaryConstraint}</Text>
            <Text style={[s.smallLabel, s.mb4]}>Highest Leverage Shift</Text>
            <Text style={[s.bodyText, s.mb12]}>{executiveInsights.highestLeverageShift}</Text>
            <Text style={[s.smallLabel, s.mb8]}>Estimated Momentum Impact</Text>
            <View style={s.row}>
              {executiveInsights.momentumImpact.map((item) => (
                <View key={item.label} style={s.badge}>
                  <Text style={s.badgeText}>{item.label}: {item.level}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <PageFooterBar pageNum={2} />
      </Page>

      {/* ── Page 3: System Map + Mission Context ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          <SectionDivider label="System Map" />
          {layerScores.map((layer) => {
            const col = scoreColor(layer.score);
            return (
              <View
                key={layer.name}
                style={[s.card, { marginBottom: 8, borderColor: col, borderWidth: 1.5 }]}
              >
                <View style={[s.spaceBetween, s.mb4]}>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 12, fontWeight: 700, color: c.starlight }}>
                    {layer.name}
                  </Text>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 10, fontWeight: 600, color: col }}>
                    {layer.score} / 10
                  </Text>
                </View>
                <Text style={[s.bodyText, { fontSize: 8 }]}>{layer.description}</Text>
              </View>
            );
          })}

          <View style={s.mt12}>
            <SectionDivider label="Mission Context" />
            <View style={s.card}>
              <Text style={s.bodyText}>{missionContext}</Text>
            </View>
          </View>
        </View>
        <PageFooterBar pageNum={3} />
      </Page>

      {/* ── Page 4: System Momentum Scorecard ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          <SectionDivider label="System Momentum Scorecard" />
          {layerScores.map((layer) => {
            const col = scoreColor(layer.score);
            return (
              <View key={layer.name} style={[s.card, { borderColor: col, borderWidth: 1.5 }]}>
                <View style={[s.spaceBetween, s.mb8]}>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 13, fontWeight: 700, color: c.starlight }}>
                    {layer.name}
                  </Text>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 600, color: col }}>
                    {layer.score} / 10
                  </Text>
                </View>
                <Text style={[s.smallLabel, s.mb4]}>Assessment</Text>
                <Text style={[s.bodyText, s.mb8]}>{layer.scorecard}</Text>
                <Text style={[s.subCardAccentLabel, s.mb4]}>Opportunity</Text>
                <Text style={{ fontSize: 9, lineHeight: 1.55, color: c.copper }}>{layer.opportunity}</Text>
              </View>
            );
          })}
        </View>
        <PageFooterBar pageNum={4} />
      </Page>

      {/* ── Page 5: Deep Analysis (first 2 layers) ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          <SectionDivider label="Deep Analysis" />
          {deepAnalyses.slice(0, 2).map((analysis) => {
            const col = scoreColor(analysis.score);
            return (
              <View key={analysis.layer} style={[s.card, { marginBottom: 10, borderColor: col, borderWidth: 1.5 }]}>
                <View style={[s.spaceBetween, s.mb8]}>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 700, color: c.starlight }}>
                    {analysis.layer}
                  </Text>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 600, color: col }}>
                    {analysis.score} / 10
                  </Text>
                </View>
                <View style={s.subCard}>
                  <Text style={s.subCardLabel}>Observed Friction</Text>
                  <Text style={s.bodyText}>{analysis.observed}</Text>
                </View>
                <View style={s.subCard}>
                  <Text style={s.subCardLabel}>Why It Matters</Text>
                  <Text style={s.bodyText}>{analysis.why}</Text>
                </View>
                <View style={s.subCard}>
                  <Text style={s.subCardAccentLabel}>Recommended Shift</Text>
                  <Text style={{ fontSize: 9, lineHeight: 1.55, color: c.copper }}>{analysis.shift}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <PageFooterBar pageNum={5} />
      </Page>

      {/* ── Page 6: Deep Analysis (remaining layers) ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          <SectionDivider label="Deep Analysis (Continued)" />
          {deepAnalyses.slice(2).map((analysis) => {
            const col = scoreColor(analysis.score);
            return (
              <View key={analysis.layer} style={[s.card, { marginBottom: 10, borderColor: col, borderWidth: 1.5 }]}>
                <View style={[s.spaceBetween, s.mb8]}>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 700, color: c.starlight }}>
                    {analysis.layer}
                  </Text>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 600, color: col }}>
                    {analysis.score} / 10
                  </Text>
                </View>
                <View style={s.subCard}>
                  <Text style={s.subCardLabel}>Observed Friction</Text>
                  <Text style={s.bodyText}>{analysis.observed}</Text>
                </View>
                <View style={s.subCard}>
                  <Text style={s.subCardLabel}>Why It Matters</Text>
                  <Text style={s.bodyText}>{analysis.why}</Text>
                </View>
                <View style={s.subCard}>
                  <Text style={s.subCardAccentLabel}>Recommended Shift</Text>
                  <Text style={{ fontSize: 9, lineHeight: 1.55, color: c.copper }}>{analysis.shift}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <PageFooterBar pageNum={6} />
      </Page>

      {/* ── Page 7: Priority Actions + Implementation Path ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          <SectionDivider label="Priority Actions" />
          <View style={[s.card, s.mb20]}>
            {priorityActions.map((action, i) => (
              <View key={i} style={s.numberedItem}>
                <View style={s.numberCircle}>
                  <Text style={s.numberText}>{i + 1}</Text>
                </View>
                <Text style={[s.bodyText, { flex: 1, marginTop: 1 }]}>{action}</Text>
              </View>
            ))}
          </View>

          <SectionDivider label="Implementation Path" />
          <View style={s.card}>
            {implementationPath.map((step, i) => (
              <View
                key={i}
                style={[
                  s.implStep,
                  i === implementationPath.length - 1
                    ? { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }
                    : {},
                ]}
              >
                <View style={s.implDot} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontFamily: "Space Grotesk",
                      fontSize: 10,
                      fontWeight: 700,
                      color: c.starlight,
                      marginBottom: 2,
                    }}
                  >
                    {step.name}
                  </Text>
                  <Text style={[s.bodyText, { fontSize: 8 }]}>{step.focus}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Report end mark */}
          <View style={[s.mt12, { alignItems: "center", paddingTop: 20 }]}>
            <View style={{ width: 40, height: 1, backgroundColor: c.copperSoft, marginBottom: 16 }} />
            <Text
              style={{
                fontFamily: "Space Grotesk",
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: 1,
                color: c.starlightDim,
                marginBottom: 4,
              }}
            >
              Cosmic Reach Creative
            </Text>
            <Text style={{ fontSize: 7, color: c.starlightFaint }}>cosmicreachcreative.com</Text>
          </View>
        </View>
        <PageFooterBar pageNum={7} />
      </Page>
    </Document>
  );
}
