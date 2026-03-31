/* ─── Shared Clarity Report data for web page + PDF export ─── */

export const reportMeta = {
  business: "AtlasOps",
  industry: "SaaS Operations Consulting",
  primaryOffer: "Operational systems consulting for scaling SaaS companies",
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
