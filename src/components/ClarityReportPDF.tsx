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
  businessContext,
  siteBreakdowns,
  leadLimiters,
  priorityFixes,
  afterFixing,
  recommendedNextStep,
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
const c = {
  deepSpace:      "#0B1120",
  navy:           "#101726",
  starlight:      "#E8DFCF",
  copper:         "#D4A574",
  starlightDim:   "#5E5E62",
  starlightFaint: "#343841",
  bodyText:       "#BCB6AC",
  cardBg:         "#101726",
  cardBorder:     "#202431",
  subCardBg:      "#0A0F1C",
  copperSoft:     "#AC8763",
};

/* ─── Styles ─── */
const s = StyleSheet.create({
  pageBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: c.deepSpace,
  },
  page: {
    fontFamily: "Inter",
    color: c.starlight,
  },
  pageContent: {
    paddingHorizontal: 48,
    paddingTop: 40,
    paddingBottom: 52,
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
      <Text style={s.footerText}>Website Audit: {reportMeta.business}</Text>
      <Text style={s.footerText}>{pageNum}</Text>
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
      title={`Website Audit: ${reportMeta.business}`}
      author="Cosmic Reach Creative"
      subject="Website Audit"
    >
      {/* ── Page 1: Cover ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.coverContent}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={`${origin}/logo/logo-primary-dark.png`} style={s.coverLogo} />
          <Text style={s.coverLabel}>Website Audit</Text>
          <Text style={s.coverTitle}>Clarity Audit Report</Text>
          <Text style={s.coverCompany}>{reportMeta.business}</Text>
          <View style={s.coverDivider} />
          <Text style={s.coverPrepared}>Prepared by Cosmic Reach Creative</Text>
          <Text style={s.coverDate}>{formattedDate}</Text>
        </View>
      </Page>

      {/* ── Page 2: Business Context + Where the Site Breaks Down ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          {/* Business Context */}
          <SectionDivider label="Business Context" />
          <View style={[s.card, s.mb16]}>
            <View style={s.mb8}>
              <Text style={s.metaLabel}>Business</Text>
              <Text style={s.metaValue}>{reportMeta.business}</Text>
              <Text style={s.metaLabel}>Industry</Text>
              <Text style={s.metaValue}>{reportMeta.industry}</Text>
              <Text style={s.metaLabel}>Primary Offer</Text>
              <Text style={[s.bodyText, { maxWidth: 400 }]}>{reportMeta.primaryOffer}</Text>
            </View>
            <View style={s.mt12}>
              <Text style={s.bodyText}>{businessContext}</Text>
            </View>
          </View>

          {/* Where the Site Breaks Down */}
          <SectionDivider label="Where the Site Breaks Down" />
          {siteBreakdowns.map((item) => (
            <View key={item.area} style={s.card}>
              <Text style={{ fontFamily: "Space Grotesk", fontSize: 11, fontWeight: 700, color: c.starlight, marginBottom: 8 }}>
                {item.area}
              </Text>
              <View style={s.subCard}>
                <Text style={s.subCardLabel}>What We Observed</Text>
                <Text style={s.bodyText}>{item.observation}</Text>
              </View>
              <View style={s.subCard}>
                <Text style={s.subCardAccentLabel}>Impact</Text>
                <Text style={{ fontSize: 9, lineHeight: 1.55, color: c.copper }}>{item.impact}</Text>
              </View>
            </View>
          ))}
        </View>
        <PageFooterBar pageNum={2} />
      </Page>

      {/* ── Page 3: What Is Limiting Leads + Priority Fixes ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          {/* What Is Limiting Leads */}
          <SectionDivider label="What Is Limiting Leads" />
          <View style={[s.card, s.mb20]}>
            {leadLimiters.map((item, i) => (
              <View key={i} style={s.numberedItem}>
                <View style={s.numberCircle}>
                  <Text style={s.numberText}>{i + 1}</Text>
                </View>
                <Text style={[s.bodyText, { flex: 1, marginTop: 1 }]}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Priority Fixes */}
          <SectionDivider label="Priority Fixes" />
          {priorityFixes.map((item, i) => (
            <View key={i} style={s.card}>
              <View style={s.numberedItem}>
                <View style={s.numberCircle}>
                  <Text style={s.numberText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: "Space Grotesk", fontSize: 10, fontWeight: 600, color: c.starlight, marginBottom: 4 }}>
                    {item.fix}
                  </Text>
                  <Text style={[s.bodyText, { fontSize: 8 }]}>{item.why}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <PageFooterBar pageNum={3} />
      </Page>

      {/* ── Page 4: What Changes After Fixing + Recommended Next Step ── */}
      <Page size="LETTER" style={s.page}>
        <PageBg />
        <View style={s.pageContent}>
          {/* What Changes After Fixing */}
          <SectionDivider label="What Changes After Fixing" />
          <View style={[s.card, s.mb20]}>
            {afterFixing.map((item, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 8 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.copper, marginRight: 10, marginTop: 4 }} />
                <Text style={[s.bodyText, { flex: 1 }]}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Recommended Next Step */}
          <SectionDivider label="Recommended Next Step" />
          <View style={[s.card, { borderColor: c.copper, borderWidth: 1.5 }]}>
            <Text style={[s.smallLabel, s.mb4]}>Recommended Engagement</Text>
            <Text style={{ fontFamily: "Space Grotesk", fontSize: 12, fontWeight: 700, color: c.copper, marginBottom: 6 }}>
              {recommendedNextStep.name}
            </Text>
            <Text style={[s.bodyText, s.mb8]}>{recommendedNextStep.description}</Text>
            <Text style={s.subCardAccentLabel}>Next Step</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.55, color: c.copper }}>{recommendedNextStep.nextStep}</Text>
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
        <PageFooterBar pageNum={4} />
      </Page>
    </Document>
  );
}
