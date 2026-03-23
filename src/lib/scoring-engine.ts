/**
 * Deterministic Lead Scoring Engine
 *
 * Layer 1: Rule-based scoring against tenant ICP.
 * No AI calls. Pure deterministic logic.
 * Produces baseline scores for triage, ranking, and prioritization.
 */

import { createHash } from "crypto";

export interface ICPConfig {
  target_roles: string[];
  target_industries: string[];
  target_geo: string[];
  company_size_min: number | null;
  company_size_max: number | null;
  priorities: string[];
  exclusion_rules: string[];
  scoring_weights: Record<string, number>;
}

export interface LeadData {
  title: string | null;
  company_name: string | null;
  industry: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  email: string | null;
  email_status: string | null;
  linkedin_url: string | null;
  website: string | null;
  company_size: number | null;
}

export interface ScoreResult {
  fitScore: number;
  priority: "high" | "medium" | "low" | "excluded";
  shortReason: string;
  matchedSignals: string[];
  concerns: string[];
}

// Default weights if tenant hasn't configured custom weights
const DEFAULT_WEIGHTS: Record<string, number> = {
  role_match: 25,
  industry_match: 20,
  geo_match: 15,
  email_quality: 15,
  web_presence: 10,
  company_size_match: 10,
  linkedin_present: 5,
};

/**
 * Common title patterns for matching against ICP target roles.
 */
const TITLE_PATTERNS: Record<string, string[]> = {
  founder: ["founder", "co-founder", "cofounder", "owner", "principal"],
  ceo: ["ceo", "chief executive", "managing director"],
  cto: ["cto", "chief technology", "chief technical"],
  cmo: ["cmo", "chief marketing"],
  coo: ["coo", "chief operating"],
  cro: ["cro", "chief revenue"],
  vp: ["vp", "vice president", "v.p."],
  director: ["director", "head of", "senior director"],
  manager: ["manager", "senior manager", "lead"],
  marketing: ["marketing", "growth", "demand gen", "brand"],
  sales: ["sales", "business development", "bd", "account executive"],
  engineering: ["engineering", "developer", "software", "technical"],
  product: ["product", "pm"],
  operations: ["operations", "ops"],
  finance: ["finance", "cfo", "controller", "accounting"],
  hr: ["hr", "human resources", "people", "talent"],
};

/**
 * Score a lead against a tenant ICP configuration.
 * Returns a score 0-100 with signals and reasoning.
 */
export function scoreLead(lead: LeadData, icp: ICPConfig): ScoreResult {
  const weights = { ...DEFAULT_WEIGHTS, ...icp.scoring_weights };
  const matchedSignals: string[] = [];
  const concerns: string[] = [];
  let totalScore = 0;
  let maxPossible = 0;

  // 1. Role/Title Match
  const roleWeight = weights.role_match || 25;
  maxPossible += roleWeight;
  if (lead.title && icp.target_roles.length > 0) {
    const titleLower = lead.title.toLowerCase();
    const roleMatch = icp.target_roles.some((role) => {
      const roleLower = role.toLowerCase();
      // Direct match
      if (titleLower.includes(roleLower)) return true;
      // Pattern match
      const patterns = TITLE_PATTERNS[roleLower];
      if (patterns) {
        return patterns.some((p) => titleLower.includes(p));
      }
      return false;
    });

    if (roleMatch) {
      totalScore += roleWeight;
      matchedSignals.push(`Title matches target role: ${lead.title}`);
    } else {
      // Partial credit for senior titles
      const isSenior = ["founder", "ceo", "cto", "cmo", "vp", "director", "head", "chief", "president"]
        .some((s) => titleLower.includes(s));
      if (isSenior) {
        totalScore += Math.floor(roleWeight * 0.4);
        matchedSignals.push(`Senior title detected: ${lead.title}`);
      } else {
        concerns.push("Title does not match target roles");
      }
    }
  } else if (!lead.title) {
    concerns.push("No title available");
  }

  // 2. Industry Match
  const industryWeight = weights.industry_match || 20;
  maxPossible += industryWeight;
  if (lead.industry && icp.target_industries.length > 0) {
    const industryLower = lead.industry.toLowerCase();
    const industryMatch = icp.target_industries.some((ind) =>
      industryLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(industryLower)
    );
    if (industryMatch) {
      totalScore += industryWeight;
      matchedSignals.push(`Industry match: ${lead.industry}`);
    } else {
      totalScore += Math.floor(industryWeight * 0.2); // Some credit for having industry data
    }
  } else if (lead.industry) {
    totalScore += Math.floor(industryWeight * 0.3); // Known industry, no ICP filter
  }

  // 3. Geography Match
  const geoWeight = weights.geo_match || 15;
  maxPossible += geoWeight;
  if (icp.target_geo.length > 0) {
    const leadGeo = [lead.city, lead.state, lead.country].filter(Boolean).map((g) => g!.toLowerCase());
    const geoMatch = icp.target_geo.some((g) =>
      leadGeo.some((lg) => lg.includes(g.toLowerCase()) || g.toLowerCase().includes(lg))
    );
    if (geoMatch) {
      totalScore += geoWeight;
      matchedSignals.push(`Geography match: ${[lead.city, lead.state].filter(Boolean).join(", ")}`);
    }
  } else {
    totalScore += Math.floor(geoWeight * 0.5); // No geo filter = neutral
  }

  // 4. Email Quality
  const emailWeight = weights.email_quality || 15;
  maxPossible += emailWeight;
  if (lead.email) {
    if (lead.email_status === "valid" || lead.email_status === "verified") {
      totalScore += emailWeight;
      matchedSignals.push("Verified email address");
    } else if (lead.email_status !== "invalid" && lead.email_status !== "bounced") {
      totalScore += Math.floor(emailWeight * 0.7);
      matchedSignals.push("Email address available");
    } else {
      concerns.push("Email status is invalid or bounced");
    }
  } else {
    concerns.push("No email address");
  }

  // 5. Web Presence
  const webWeight = weights.web_presence || 10;
  maxPossible += webWeight;
  if (lead.website) {
    totalScore += webWeight;
    matchedSignals.push("Company website available");
  }

  // 6. Company Size Match
  const sizeWeight = weights.company_size_match || 10;
  maxPossible += sizeWeight;
  if (lead.company_size !== null && (icp.company_size_min !== null || icp.company_size_max !== null)) {
    const min = icp.company_size_min ?? 0;
    const max = icp.company_size_max ?? Infinity;
    if (lead.company_size >= min && lead.company_size <= max) {
      totalScore += sizeWeight;
      matchedSignals.push(`Company size (${lead.company_size}) within target range`);
    } else {
      concerns.push(`Company size (${lead.company_size}) outside target range`);
    }
  } else if (lead.company_size !== null) {
    totalScore += Math.floor(sizeWeight * 0.5);
  }

  // 7. LinkedIn Presence
  const linkedinWeight = weights.linkedin_present || 5;
  maxPossible += linkedinWeight;
  if (lead.linkedin_url) {
    totalScore += linkedinWeight;
    matchedSignals.push("LinkedIn profile available");
  }

  // Check exclusion rules
  if (icp.exclusion_rules.length > 0) {
    const leadText = [lead.title, lead.company_name, lead.industry]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    for (const rule of icp.exclusion_rules) {
      if (leadText.includes(rule.toLowerCase())) {
        return {
          fitScore: 0,
          priority: "excluded",
          shortReason: `Excluded by rule: ${rule}`,
          matchedSignals: [],
          concerns: [`Matched exclusion rule: ${rule}`],
        };
      }
    }
  }

  // Calculate final score (normalized to 0-100)
  const finalScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;

  // Determine priority
  let priority: "high" | "medium" | "low" = "low";
  if (finalScore >= 70) priority = "high";
  else if (finalScore >= 40) priority = "medium";

  // Generate short reason
  const topSignals = matchedSignals.slice(0, 2);
  const shortReason = topSignals.length > 0
    ? topSignals.join(". ")
    : (concerns.length > 0 ? concerns[0] : "Insufficient data for scoring");

  return {
    fitScore: finalScore,
    priority,
    shortReason,
    matchedSignals,
    concerns,
  };
}

/**
 * Generate a stable hash for lead data (for cache key).
 */
export function hashLeadData(lead: LeadData): string {
  const normalized = JSON.stringify({
    title: lead.title?.toLowerCase()?.trim() || "",
    company: lead.company_name?.toLowerCase()?.trim() || "",
    industry: lead.industry?.toLowerCase()?.trim() || "",
    city: lead.city?.toLowerCase()?.trim() || "",
    state: lead.state?.toLowerCase()?.trim() || "",
    country: lead.country?.toLowerCase()?.trim() || "",
    email: lead.email?.toLowerCase()?.trim() || "",
    email_status: lead.email_status || "",
    linkedin: lead.linkedin_url ? "1" : "0",
    website: lead.website ? "1" : "0",
    size: lead.company_size || "",
  });
  return createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}

/**
 * Generate a stable hash for ICP config (for cache key).
 */
export function hashICP(icp: ICPConfig): string {
  const normalized = JSON.stringify({
    roles: [...(icp.target_roles || [])].sort(),
    industries: [...(icp.target_industries || [])].sort(),
    geo: [...(icp.target_geo || [])].sort(),
    sizeMin: icp.company_size_min,
    sizeMax: icp.company_size_max,
    exclusions: [...(icp.exclusion_rules || [])].sort(),
    weights: icp.scoring_weights,
  });
  return createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}
