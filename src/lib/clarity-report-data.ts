/* ─── Shared Clarity Report data for web page + PDF export ─── */

import type { SiteHealthScores } from "./site-scoring";

export const reportMeta = {
  business: "AtlasOps",
  industry: "SaaS Operations Consulting",
  primaryOffer: "Operational systems consulting for scaling SaaS companies",
};

/* ─── Layer Scores (audit assessment) ─── */
export const layerScores: SiteHealthScores = {
  overall: 1.5,
  signal: {
    score: 2,
    label: "Signal",
    area: "Messaging",
    question: "Is your message reaching the right people?",
    factors: [
      { name: "SEO Structure", value: "42/100", contribution: 4.2, weight: 0.3 },
      { name: "Search Position", value: "Avg #38.4", contribution: 2, weight: 0.3 },
      { name: "Search Impressions", value: "210/mo", contribution: 2, weight: 0.2 },
      { name: "Organic Traffic", value: "8%", contribution: 2, weight: 0.2 },
    ],
  },
  gravity: {
    score: 2,
    label: "Gravity",
    area: "Offer",
    question: "Is your offer converting visitors into leads?",
    factors: [
      { name: "Engagement Rate", value: "22%", contribution: 2, weight: 0.3 },
      { name: "Bounce Rate", value: "74%", contribution: 2, weight: 0.25 },
      { name: "Search CTR", value: "0.6%", contribution: 2, weight: 0.2 },
      { name: "Conversion Rate", value: "0.1%", contribution: 0, weight: 0.25 },
    ],
  },
  orbit: {
    score: 1,
    label: "Orbit",
    area: "Path to Action",
    question: "Is your site guiding visitors toward action?",
    factors: [
      { name: "Accessibility", value: "38/100", contribution: 3.8, weight: 0.2 },
      { name: "Best Practices", value: "25/100", contribution: 2.5, weight: 0.15 },
      { name: "Layout Stability", value: "0.340", contribution: 2, weight: 0.25 },
      { name: "Page Load (LCP)", value: "5.2s", contribution: 2, weight: 0.2 },
      { name: "Responsiveness", value: "820ms", contribution: 2, weight: 0.2 },
    ],
  },
  thrust: {
    score: 1,
    label: "Thrust",
    area: "Visibility",
    question: "Can you see what is working?",
    factors: [
      { name: "Performance", value: "28/100", contribution: 2.8, weight: 0.25 },
      { name: "Uptime", value: "2400ms", contribution: 4, weight: 0.2 },
      { name: "Analytics", value: "Not connected", contribution: 0, weight: 0.2 },
      { name: "Search Data", value: "Not connected", contribution: 0, weight: 0.15 },
      { name: "Traffic Trend", value: "-18%", contribution: 2, weight: 0.2 },
    ],
  },
  generatedAt: new Date().toISOString(),
};

/* ─── Section 1: Business Context ─── */
export const businessContext =
  "AtlasOps provides SaaS companies with operational consulting to improve internal systems, reporting visibility, and cross-functional alignment during growth. The business has deep expertise and strong delivery but faces challenges translating that into a compelling online presence that generates consistent inbound leads.";

/* ─── Section 2: Where the Site Breaks Down ─── */
export const siteBreakdowns = [
  {
    area: "Messaging",
    observation:
      "The homepage leads with what AtlasOps does rather than the problem the buyer is experiencing. Visitors have to work to understand why this matters to them.",
    impact:
      "Recognition takes longer. Visitors who are experiencing the exact problem AtlasOps solves may not see themselves reflected in the language.",
  },
  {
    area: "Offer Structure",
    observation:
      "The consulting engagement is described broadly without a defined scope, timeline, or deliverable. Buyers are left to imagine what they are purchasing.",
    impact:
      "Undefined services increase perceived risk and lengthen the sales cycle.",
  },
  {
    area: "Conversion Path",
    observation:
      "The site explains services across multiple pages but does not guide visitors toward a single clear next step.",
    impact:
      "Multiple navigation paths dilute momentum. Visitors browse but do not take action.",
  },
];

/* ─── Section 3: What Is Limiting Leads ─── */
export const leadLimiters = [
  "Messaging focuses on expertise instead of the buyer's problem.",
  "No defined entry point for prospects who are not ready to commit to a full engagement.",
  "The site does not pre-qualify visitors by clearly stating who this is for and what it costs.",
  "No urgency or specificity in the call to action.",
];

/* ─── Section 4: Priority Fixes ─── */
export const priorityFixes = [
  {
    fix: "Rewrite the homepage headline to lead with the problem, not the service.",
    why: "Visitors decide in seconds whether to stay. The first line needs to reflect their situation.",
  },
  {
    fix: "Package the consulting service into a defined engagement with a clear scope and deliverable.",
    why: "Buyers need to understand what they are getting, how long it takes, and what the outcome is.",
  },
  {
    fix: "Simplify the site to one primary call to action per page.",
    why: "Every additional option reduces the likelihood of any single action being taken.",
  },
  {
    fix: "Add a low-commitment entry point for visitors who are not ready to buy.",
    why: "Most visitors are not ready on the first visit. An entry offer keeps them in the pipeline.",
  },
];

/* ─── Section 5: What Changes After Fixing ─── */
export const afterFixing = [
  "Visitors immediately understand what AtlasOps solves and whether it is relevant to them.",
  "The site guides prospects toward a clear next step instead of leaving them to browse.",
  "Inbound inquiries become more consistent because the message matches the buyer's experience.",
  "The sales cycle shortens because prospects arrive with clearer expectations.",
];

/* ─── Recommended Next Step ─── */
export const recommendedNextStep = {
  name: "30-Day Rebuild",
  description:
    "AtlasOps has strong expertise and a viable market. The constraint is not strategy. It is the gap between what the business delivers and how the market perceives it. A focused rebuild of the brand messaging, website, and conversion path would address the core issues identified in this audit.",
  nextStep:
    "Schedule a follow-up call to review these findings, confirm scope, and set a start date.",
};
