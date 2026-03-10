/* ─── Shared Clarity Report data for web page + PDF export ─── */

export const reportMeta = {
  business: "AtlasOps",
  industry: "SaaS Operations Consulting",
  primaryOffer: "Operational systems consulting for scaling SaaS companies",
  overallScore: 6.8,
};

export const layerScores = [
  {
    name: "Signal",
    score: 6,
    description: "How clearly the business communicates the problem it solves.",
    scorecard:
      "Messaging focuses on operational expertise but does not immediately identify the business problem experienced by SaaS founders and leadership teams.",
    opportunity:
      "Lead messaging with the operational confusion experienced during scaling.",
  },
  {
    name: "Gravity",
    score: 7,
    description: "How compelling the offer is to the right buyer.",
    scorecard:
      "AtlasOps offers valuable consulting but presents it as an open-ended service rather than a defined transformation.",
    opportunity:
      "Package consulting into a structured engagement with a clear outcome.",
  },
  {
    name: "Orbit",
    score: 6,
    description: "How smoothly prospects move from awareness to engagement.",
    scorecard:
      "The website explains services but does not guide visitors toward a single clear next step.",
    opportunity: "Introduce a diagnostic entry offer.",
  },
  {
    name: "Thrust",
    score: 8,
    description: "Where the highest leverage growth opportunities exist.",
    scorecard:
      "AtlasOps has strong expertise and significant growth potential if positioning improves.",
    opportunity:
      "Turn consulting knowledge into structured engagements.",
  },
];

export const deepAnalyses = [
  {
    layer: "Signal",
    score: 6,
    observed:
      "AtlasOps messaging describes operational consulting capabilities but does not quickly identify the operational pain experienced by scaling SaaS companies.",
    why: "When messaging leads with expertise instead of the buyer's problem, recognition takes longer and trust builds more slowly.",
    shift:
      "Lead messaging with the operational confusion and reporting challenges experienced during SaaS growth, then position AtlasOps as the system that restores clarity.",
  },
  {
    layer: "Gravity",
    score: 7,
    observed:
      "The consulting engagement is described broadly, forcing buyers to imagine the scope and outcomes.",
    why: "Undefined consulting engagements increase perceived risk.",
    shift:
      "Package the consulting service into a defined operational clarity engagement with a clear transformation outcome.",
  },
  {
    layer: "Orbit",
    score: 6,
    observed:
      "The website explains services but does not guide visitors toward a single conversion action.",
    why: "Multiple navigation paths dilute momentum and reduce conversions.",
    shift:
      "Introduce a diagnostic entry offer such as an Operational Clarity Assessment to simplify the buying decision.",
  },
  {
    layer: "Thrust",
    score: 8,
    observed:
      "AtlasOps has strong expertise that can support scalable growth if packaged correctly.",
    why: "Consulting expertise often remains constrained by time unless it is structured into repeatable engagements.",
    shift:
      "Develop a growth system consisting of a diagnostic entry product followed by deeper implementation engagements.",
  },
];

export const executiveInsights = {
  primaryConstraint:
    "Messaging emphasizes operational expertise before clearly identifying the operational problems experienced by SaaS leadership teams.",
  highestLeverageShift:
    "Reframe the messaging around the operational visibility problems experienced during rapid SaaS growth.",
  momentumImpact: [
    { label: "Signal improvement", level: "High" },
    { label: "Orbit improvement", level: "High" },
    { label: "Gravity improvement", level: "Medium" },
  ],
};

export const missionContext =
  "AtlasOps provides SaaS companies with operational consulting to improve internal systems, reporting visibility, and cross-functional alignment during periods of rapid growth. The business has deep expertise and strong delivery but faces challenges in translating that value into a compelling, conversion-ready market presence.";

export const priorityActions = [
  "Lead messaging with the operational pain experienced by SaaS leadership teams.",
  "Package consulting services into defined engagements.",
  "Simplify the website conversion path.",
  "Introduce a diagnostic entry product.",
];

export const implementationPhases = [
  {
    phase: "Weeks 1–2",
    title: "Rewrite Core Messaging",
    actions: [
      "Rewrite the homepage headline to lead with the scaling pain SaaS leaders experience — not AtlasOps capabilities.",
      "Create a one-sentence positioning statement that names the problem before the solution.",
      "Audit all website pages and replace inward-facing language ('we help', 'we offer') with buyer-facing language ('you're experiencing', 'the result is').",
    ],
  },
  {
    phase: "Weeks 3–4",
    title: "Restructure the Offer",
    actions: [
      "Package the consulting service into a named, defined engagement with a clear scope, timeline, and deliverable.",
      "Add visible pricing or a 'starting at' indicator to pre-qualify prospects by budget.",
      "Write a dedicated landing page for the entry offer that addresses the top three objections identified in this audit.",
    ],
  },
  {
    phase: "Weeks 5–6",
    title: "Simplify the Conversion Path",
    actions: [
      "Reduce the website to one primary CTA per page, mapped to the buyer's stage.",
      "Add a low-commitment entry point (e.g., a free diagnostic checklist or assessment) for visitors not ready to buy.",
      "Build a three-email nurture sequence for leads who engage with the entry offer but don't convert immediately.",
    ],
  },
  {
    phase: "Weeks 7–8",
    title: "Install Measurement Baseline",
    actions: [
      "Define three core KPIs: qualified leads per month, lead-to-call conversion rate, and average sales cycle length.",
      "Set up UTM tracking on all inbound channels and configure a simple dashboard to review weekly.",
      "Establish a monthly review rhythm where leadership evaluates marketing performance against these KPIs.",
    ],
  },
];

export const sprintRecommendation = {
  name: "60 Day Alignment Sprint",
  reasoning:
    "AtlasOps has strong expertise and a viable market. The constraint is not strategy — it is the gap between what the business delivers and how the market perceives it. A 30 Day Sprint would address messaging alone, but the offer structure and conversion path need coordinated work to produce measurable results. A 90 Day Sprint is premature until the messaging and offer foundation is solid. The 60 Day Alignment Sprint covers Signal and Gravity together, which is where the highest-leverage compound effect exists for this business.",
  nextStep:
    "Schedule a 30-minute follow-up call to review these findings, confirm scope, and set a start date for the 60 Day Alignment Sprint.",
};
