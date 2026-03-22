/**
 * Seed data for the public Mission Control demo.
 * Realistic B2B SaaS pipeline for a Memphis-based marketing consultancy.
 */

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();
const hoursFromNow = (n: number) => new Date(now.getTime() + n * 3600000).toISOString();
const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400000).toISOString();

/* ── Leads ── */

export const DEMO_LEADS = [
  {
    id: 1,
    fit_score: 92,
    stage: "replied_positive",
    fit_reason: "Series A SaaS founder, strong ICP match. Active hiring for marketing roles.",
    pain_point_summary: "Growing fast but pipeline depends entirely on founder outbound. No system in place.",
    outreach_angle: "Position the Launch Sequence as the system that replaces founder-led sales with repeatable pipeline.",
    next_action: "Send calendar link for intro call",
    next_action_at: daysAgo(0),
    last_contacted_at: daysAgo(1),
    company_name: "Relay Health",
    company_domain: "relayhealth.io",
    company_industry: "Health Tech",
    contact_name: "Marcus Chen",
    contact_email: "marcus@relayhealth.io",
    contact_title: "CEO & Co-Founder",
    contact_linkedin_url: "https://linkedin.com/in/marcuschen",
    owner: "jordan",
    created_at: daysAgo(12),
    updated_at: daysAgo(1),
  },
  {
    id: 2,
    fit_score: 88,
    stage: "meeting_booked",
    fit_reason: "$2M ARR, scaling outbound. Needs messaging overhaul before hiring SDRs.",
    pain_point_summary: "Outbound emails getting <5% reply rate. Messaging feels generic.",
    outreach_angle: "Signal audit to fix messaging before scaling headcount.",
    next_action: "Prep clarity audit talking points",
    next_action_at: daysFromNow(1),
    last_contacted_at: daysAgo(3),
    company_name: "Stackline Analytics",
    company_domain: "stackline.com",
    company_industry: "Analytics / SaaS",
    contact_name: "Rachel Torres",
    contact_email: "rachel@stackline.com",
    contact_title: "VP Marketing",
    contact_linkedin_url: "https://linkedin.com/in/racheltorres",
    owner: "jordan",
    created_at: daysAgo(18),
    updated_at: daysAgo(3),
  },
  {
    id: 3,
    fit_score: 85,
    stage: "qualified",
    fit_reason: "Memphis-based fintech, $800K ARR. Founder-led growth hitting ceiling.",
    pain_point_summary: "Strong product but weak positioning. Competitors are winning deals on brand alone.",
    outreach_angle: "Gravity layer: offer redesign to convert attention into demand.",
    next_action: "Draft personalized outreach email",
    next_action_at: daysAgo(1),
    last_contacted_at: null,
    company_name: "Bridgeway Financial",
    company_domain: "bridgewayfinancial.co",
    company_industry: "Fintech",
    contact_name: "David Park",
    contact_email: "david@bridgewayfinancial.co",
    contact_title: "Founder & CEO",
    contact_linkedin_url: "https://linkedin.com/in/davidpark",
    owner: "jordan",
    created_at: daysAgo(8),
    updated_at: daysAgo(1),
  },
  {
    id: 4,
    fit_score: 81,
    stage: "ready_to_email",
    fit_reason: "Growing logistics company, looking to differentiate. Good budget signals.",
    pain_point_summary: "Website generates traffic but almost zero conversions. Offer page is confusing.",
    outreach_angle: "Orbit layer: rebuild conversion path from first touch to close.",
    next_action: "Review AI-generated draft and approve for send",
    next_action_at: daysAgo(0),
    last_contacted_at: null,
    company_name: "Route Freight",
    company_domain: "routefreight.com",
    company_industry: "Logistics",
    contact_name: "Angela Morris",
    contact_email: "angela@routefreight.com",
    contact_title: "Head of Growth",
    contact_linkedin_url: "https://linkedin.com/in/angelamorris",
    owner: "jordan",
    created_at: daysAgo(5),
    updated_at: daysAgo(0),
  },
  {
    id: 5,
    fit_score: 78,
    stage: "emailed",
    fit_reason: "Series B edtech, strong product-market fit. Needs to systematize growth.",
    pain_point_summary: "Relying on word of mouth. No outbound motion. Marketing team is 1 person.",
    outreach_angle: "Full Launch Sequence implementation to build a growth engine from scratch.",
    next_action: "Follow up if no reply by Friday",
    next_action_at: daysFromNow(2),
    last_contacted_at: daysAgo(4),
    company_name: "LearnPath",
    company_domain: "learnpath.io",
    company_industry: "EdTech",
    contact_name: "Sarah Kim",
    contact_email: "sarah@learnpath.io",
    contact_title: "CEO",
    contact_linkedin_url: "https://linkedin.com/in/sarahkim",
    owner: "jordan",
    created_at: daysAgo(14),
    updated_at: daysAgo(4),
  },
  {
    id: 6,
    fit_score: 76,
    stage: "emailed",
    fit_reason: "Memphis manufacturer expanding into D2C. Needs digital strategy.",
    pain_point_summary: "Legacy brand, no digital pipeline. Trade show leads aren't converting online.",
    outreach_angle: "Signal + Gravity: reposition brand for digital buyers.",
    next_action: "Send follow-up with case study",
    next_action_at: daysAgo(2),
    last_contacted_at: daysAgo(7),
    company_name: "Southern Steel Works",
    company_domain: "southernsteelworks.com",
    company_industry: "Manufacturing",
    contact_name: "James Whitfield",
    contact_email: "james@southernsteelworks.com",
    contact_title: "Director of Sales",
    contact_linkedin_url: "https://linkedin.com/in/jameswhitfield",
    owner: "jordan",
    created_at: daysAgo(21),
    updated_at: daysAgo(7),
  },
  {
    id: 7,
    fit_score: 73,
    stage: "candidate",
    fit_reason: "Property management SaaS, early traction. Founder doing all sales.",
    pain_point_summary: "Good product but no positioning. Competes on price instead of value.",
    outreach_angle: "Clarity Audit to find the positioning gap before scaling.",
    next_action: "Research company further",
    next_action_at: null,
    last_contacted_at: null,
    company_name: "PropFlow",
    company_domain: "propflow.io",
    company_industry: "PropTech",
    contact_name: "Tyler Brooks",
    contact_email: "tyler@propflow.io",
    contact_title: "Founder",
    contact_linkedin_url: "https://linkedin.com/in/tylerbrooks",
    owner: "jordan",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: 8,
    fit_score: 70,
    stage: "emailed",
    fit_reason: "B2B services company, $1.5M rev. Wants to move upmarket.",
    pain_point_summary: "Winning small deals but can't close enterprise. Messaging doesn't match buyer sophistication.",
    outreach_angle: "Signal layer: elevate messaging for enterprise buyer.",
    next_action: "Await reply",
    next_action_at: daysFromNow(3),
    last_contacted_at: daysAgo(5),
    company_name: "Clearbridge Consulting",
    company_domain: "clearbridge.co",
    company_industry: "Professional Services",
    contact_name: "Nina Vasquez",
    contact_email: "nina@clearbridge.co",
    contact_title: "Managing Partner",
    contact_linkedin_url: "https://linkedin.com/in/ninavasquez",
    owner: "jordan",
    created_at: daysAgo(16),
    updated_at: daysAgo(5),
  },
  {
    id: 9,
    fit_score: 65,
    stage: "won",
    fit_reason: "Memphis staffing firm. Needed complete marketing overhaul.",
    pain_point_summary: "No pipeline visibility, inconsistent messaging across channels.",
    outreach_angle: "Full Sprint: messaging, offers, and pipeline infrastructure.",
    next_action: null,
    next_action_at: null,
    last_contacted_at: daysAgo(30),
    company_name: "TalentBridge Memphis",
    company_domain: "talentbridgememphis.com",
    company_industry: "Staffing",
    contact_name: "Kathryn Wells",
    contact_email: "kathryn@talentbridgememphis.com",
    contact_title: "Owner",
    contact_linkedin_url: "https://linkedin.com/in/kathrynwells",
    owner: "jordan",
    created_at: daysAgo(45),
    updated_at: daysAgo(30),
  },
  {
    id: 10,
    fit_score: 60,
    stage: "replied_negative",
    fit_reason: "Tech startup, seed stage. Tight budget.",
    pain_point_summary: "Interested but timing is wrong. Revisit in Q3.",
    outreach_angle: "Clarity Audit as low-commitment entry point.",
    next_action: "Add to Q3 follow-up list",
    next_action_at: daysFromNow(90),
    last_contacted_at: daysAgo(10),
    company_name: "NeonGrid",
    company_domain: "neongrid.dev",
    company_industry: "Developer Tools",
    contact_name: "Alex Rivera",
    contact_email: "alex@neongrid.dev",
    contact_title: "CTO",
    contact_linkedin_url: "https://linkedin.com/in/alexrivera",
    owner: "jordan",
    created_at: daysAgo(20),
    updated_at: daysAgo(10),
  },
  {
    id: 11,
    fit_score: 83,
    stage: "meeting_requested",
    fit_reason: "E-commerce brand doing $3M/yr. Marketing feels scattered.",
    pain_point_summary: "Running ads, email, social — none of it connects. No attribution.",
    outreach_angle: "Thrust layer: visibility into what's actually driving revenue.",
    next_action: "Send booking link",
    next_action_at: daysAgo(0),
    last_contacted_at: daysAgo(2),
    company_name: "Wren & Co",
    company_domain: "wrenandco.com",
    company_industry: "E-Commerce",
    contact_name: "Liam Carter",
    contact_email: "liam@wrenandco.com",
    contact_title: "Founder",
    contact_linkedin_url: "https://linkedin.com/in/liamcarter",
    owner: "jordan",
    created_at: daysAgo(10),
    updated_at: daysAgo(2),
  },
  {
    id: 12,
    fit_score: 55,
    stage: "candidate",
    fit_reason: "Local restaurant group. Potential but low digital maturity.",
    pain_point_summary: "Wants more foot traffic. Mostly offline marketing.",
    outreach_angle: "Signal check to see if consulting is the right fit.",
    next_action: null,
    next_action_at: null,
    last_contacted_at: null,
    company_name: "Midtown Hospitality Group",
    company_domain: "midtownhospitality.com",
    company_industry: "Hospitality",
    contact_name: "Daniel Foster",
    contact_email: "daniel@midtownhospitality.com",
    contact_title: "Operations Director",
    contact_linkedin_url: "https://linkedin.com/in/danielfoster",
    owner: "jordan",
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
];

/* ── Pipeline Stats ── */

export const DEMO_PIPELINE_STATS = [
  { stage: "candidate", count: 2 },
  { stage: "qualified", count: 1 },
  { stage: "ready_to_email", count: 1 },
  { stage: "emailed", count: 3 },
  { stage: "replied_positive", count: 1 },
  { stage: "replied_negative", count: 1 },
  { stage: "meeting_requested", count: 1 },
  { stage: "meeting_booked", count: 1 },
  { stage: "won", count: 1 },
];

/* ── Activities ── */

export const DEMO_ACTIVITIES = [
  { type: "reply_logged", body_preview: "Replied: 'This sounds exactly like what we need. Can we talk this week?'", created_at: daysAgo(1), contact_name: "Marcus Chen", company_name: "Relay Health" },
  { type: "email_sent", body_preview: "Sent: Personalized outreach — positioning audit for scaling founders", created_at: daysAgo(4), contact_name: "Sarah Kim", company_name: "LearnPath" },
  { type: "stage_change", body_preview: "Stage changed: qualified → meeting_booked", created_at: daysAgo(3), contact_name: "Rachel Torres", company_name: "Stackline Analytics" },
  { type: "email_sent", body_preview: "Sent: Follow-up with case study on manufacturing repositioning", created_at: daysAgo(5), contact_name: "Nina Vasquez", company_name: "Clearbridge Consulting" },
  { type: "reply_logged", body_preview: "Replied: 'Interesting but our budget is locked until Q3.'", created_at: daysAgo(10), contact_name: "Alex Rivera", company_name: "NeonGrid" },
  { type: "stage_change", body_preview: "Stage changed: emailed → replied_positive", created_at: daysAgo(1), contact_name: "Marcus Chen", company_name: "Relay Health" },
  { type: "email_sent", body_preview: "Sent: Intro email — digital pipeline for trade-show-dependent companies", created_at: daysAgo(7), contact_name: "James Whitfield", company_name: "Southern Steel Works" },
  { type: "stage_change", body_preview: "Stage changed: meeting_requested → meeting_booked", created_at: daysAgo(3), contact_name: "Rachel Torres", company_name: "Stackline Analytics" },
];

/* ── Meetings ── */

export const DEMO_MEETINGS_UPCOMING = [
  {
    booking_type: "clarity-audit",
    start_time: hoursFromNow(26),
    end_time: hoursFromNow(27),
    client_name: "Rachel Torres",
    client_email: "rachel@stackline.com",
    status: "confirmed",
    google_meet_url: "https://meet.google.com/abc-defg-hij",
  },
  {
    booking_type: "signal-check",
    start_time: daysFromNow(4),
    end_time: new Date(new Date(daysFromNow(4)).getTime() + 1800000).toISOString(),
    client_name: "Liam Carter",
    client_email: "liam@wrenandco.com",
    status: "confirmed",
    google_meet_url: "https://meet.google.com/klm-nopq-rst",
  },
];

export const DEMO_MEETINGS_PAST = [
  {
    booking_type: "clarity-audit",
    start_time: daysAgo(30),
    end_time: daysAgo(30),
    client_name: "Kathryn Wells",
    client_email: "kathryn@talentbridgememphis.com",
    status: "completed",
    google_meet_url: null,
  },
];

/* ── Strategy / Goals ── */

export const DEMO_GOALS = {
  business_name: "Cosmic Reach Creative",
  business_description: "Marketing strategy consultancy helping founders and growing businesses sharpen messaging, design stronger offers, and build marketing systems that scale.",
  target_audience: "B2B founders and marketing leaders at companies doing $500K–$5M ARR who sense their marketing isn't converting proportionally to effort. They have traction but need strategic architecture.",
  brand_voice: "Direct, strategic, confident. We diagnose before we prescribe. No fluff, no hype — just clear thinking about what's broken and what to fix first.",
  key_offers: "Business Clarity Audit ($150) — 3-5 day diagnostic with scored report. Growth Sprint ($2,500) — 4-week strategic implementation. Advisory Retainer ($1,500/mo) — ongoing strategic support.",
  goals: [
    { label: "Pipeline", description: "Build a repeatable pipeline that generates 8-12 qualified leads per month" },
    { label: "Positioning", description: "Establish Cosmic Reach as the go-to strategic consultancy for founders in the Mid-South" },
    { label: "Revenue", description: "Hit $15K MRR through a mix of audits, sprints, and retainers" },
  ],
  cta_url: "https://cosmicreachcreative.com/connect",
  cta_label: "Book a Signal Check",
  sender_name: "Jordan Knight",
  sender_title: "Founder, Cosmic Reach Creative",
  avoid_phrases: "growth hacking, synergy, best-in-class, circle back, low-hanging fruit, disruptive",
  example_tone: "We looked at your pipeline and there's a clear pattern — strong product, weak signal. The market doesn't know what you do yet. That's fixable.",
};

/* ── GA4 Analytics ── */

function generateDailySessions(daysBack: number, baseMin: number, baseMax: number) {
  const points = [];
  for (let i = daysBack; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().slice(0, 10).replace(/-/g, "");
    const dayOfWeek = d.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
    const sessions = Math.round((baseMin + Math.random() * (baseMax - baseMin)) * weekendDip);
    const pageViews = Math.round(sessions * (1.8 + Math.random() * 0.8));
    const bounceRate = Math.round(35 + Math.random() * 20);
    const avgDuration = Math.round(80 + Math.random() * 80);
    points.push({ date: dateStr, sessions, pageViews, bounceRate, avgDuration });
  }
  return points;
}

const currentDaily = generateDailySessions(29, 40, 85);
const previousDaily = generateDailySessions(29, 30, 65);

export const DEMO_GA4: import("@/lib/ga4").GA4Metrics = {
  sessions30d: currentDaily.reduce((a, b) => a + b.sessions, 0),
  pageViews30d: currentDaily.reduce((a, b) => a + b.pageViews, 0),
  bounceRate30d: 42,
  avgSessionDuration30d: 127,
  newUsers30d: 892,
  returningUsers30d: 341,
  engagementRate30d: 58,
  topPages: [
    { page: "/", views: 1240, sessions: 890, bounceRate: 38, avgDuration: 95, engagementRate: 62 },
    { page: "/services", views: 620, sessions: 485, bounceRate: 32, avgDuration: 142, engagementRate: 68 },
    { page: "/framework", views: 410, sessions: 340, bounceRate: 28, avgDuration: 185, engagementRate: 72 },
    { page: "/pricing", views: 380, sessions: 310, bounceRate: 45, avgDuration: 78, engagementRate: 55 },
    { page: "/mission-control", views: 290, sessions: 240, bounceRate: 35, avgDuration: 110, engagementRate: 65 },
    { page: "/clarity-report-example", views: 185, sessions: 150, bounceRate: 22, avgDuration: 220, engagementRate: 78 },
    { page: "/connect", views: 165, sessions: 140, bounceRate: 18, avgDuration: 95, engagementRate: 82 },
    { page: "/contact", views: 120, sessions: 105, bounceRate: 52, avgDuration: 45, engagementRate: 48 },
  ],
  dailySessions: currentDaily,
  previousDailySessions: previousDaily,
  topSources: [
    { source: "google", sessions: 520, percentage: 42 },
    { source: "direct", sessions: 310, percentage: 25 },
    { source: "linkedin", sessions: 185, percentage: 15 },
    { source: "twitter", sessions: 98, percentage: 8 },
    { source: "referral", sessions: 75, percentage: 6 },
    { source: "email", sessions: 45, percentage: 4 },
  ],
  comparison: {
    sessions: { current: 1233, previous: 980, changePercent: 25.8 },
    pageViews: { current: 2890, previous: 2340, changePercent: 23.5 },
    bounceRate: { current: 42, previous: 48, changePercent: -12.5 },
    avgDuration: { current: 127, previous: 98, changePercent: 29.6 },
    engagement: { current: 58, previous: 52, changePercent: 11.5 },
    newUsers: { current: 892, previous: 710, changePercent: 25.6 },
  },
  sourceTimeline: currentDaily.slice(-14).map((d) => ({
    date: d.date,
    sources: {
      google: Math.round(d.sessions * 0.42),
      direct: Math.round(d.sessions * 0.25),
      linkedin: Math.round(d.sessions * 0.15),
      twitter: Math.round(d.sessions * 0.08),
      referral: Math.round(d.sessions * 0.06),
      email: Math.round(d.sessions * 0.04),
    },
  })),
};

/* ── Overdue follow-ups ── */

export const DEMO_OVERDUE = DEMO_LEADS.filter(
  (l) => l.next_action_at && new Date(l.next_action_at) < now && !["won", "lost", "suppressed", "replied_negative"].includes(l.stage)
);

/* ── Blackout dates ── */

export const DEMO_BLACKOUT_DATES = [
  { start_date: daysFromNow(14), end_date: daysFromNow(15), label: "Team offsite" },
];
