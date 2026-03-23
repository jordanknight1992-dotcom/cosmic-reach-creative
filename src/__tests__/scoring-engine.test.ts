/**
 * Tests for the deterministic scoring engine.
 * Run with: npx tsx src/__tests__/scoring-engine.test.ts
 *
 * When a test framework is installed (vitest/jest), these can be
 * imported directly. For now they run as a standalone script.
 */

import { scoreLead, hashLeadData, hashICP, type ICPConfig, type LeadData } from "../lib/scoring-engine";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

// --- Test ICP ---
const testICP: ICPConfig = {
  target_roles: ["founder", "CEO", "VP Marketing"],
  target_industries: ["B2B SaaS", "Health Tech"],
  target_geo: ["Memphis", "TN"],
  company_size_min: 5,
  company_size_max: 200,
  priorities: [],
  exclusion_rules: ["recruitment", "staffing"],
  scoring_weights: {},
};

// Test 1: High-fit lead should score high
console.log("\n[Scoring Engine] High-fit lead scoring:");
const highFitLead: LeadData = {
  title: "Founder & CEO",
  company_name: "TechCo",
  industry: "B2B SaaS",
  city: "Memphis",
  state: "TN",
  country: "US",
  email: "founder@techco.com",
  email_status: "valid",
  linkedin_url: "https://linkedin.com/in/founder",
  website: "https://techco.com",
  company_size: 50,
};

const highResult = scoreLead(highFitLead, testICP);
assert(highResult.fitScore >= 70, `High-fit lead scores >= 70 (got ${highResult.fitScore})`);
assert(highResult.priority === "high", `High-fit lead has high priority (got ${highResult.priority})`);
assert(highResult.matchedSignals.length >= 3, `High-fit lead has >= 3 matched signals (got ${highResult.matchedSignals.length})`);

// Test 2: Low-fit lead should score low
console.log("\n[Scoring Engine] Low-fit lead scoring:");
const lowFitLead: LeadData = {
  title: "Intern",
  company_name: "Random Corp",
  industry: "Logistics",
  city: "Seattle",
  state: "WA",
  country: "US",
  email: "intern@random.com",
  email_status: "valid",
  linkedin_url: null,
  website: null,
  company_size: 5000,
};

const lowResult = scoreLead(lowFitLead, testICP);
assert(lowResult.fitScore < 50, `Low-fit lead scores < 50 (got ${lowResult.fitScore})`);
assert(lowResult.priority !== "high", `Low-fit lead is not high priority (got ${lowResult.priority})`);

// Test 3: Excluded lead should return score 0
console.log("\n[Scoring Engine] Exclusion rule testing:");
const excludedLead: LeadData = {
  title: "CEO",
  company_name: "TopStaffing Recruitment",
  industry: "Recruitment",
  city: "Memphis",
  state: "TN",
  country: "US",
  email: "ceo@topstaffing.com",
  email_status: "valid",
  linkedin_url: "https://linkedin.com/in/ceo",
  website: "https://topstaffing.com",
  company_size: 30,
};

const excludedResult = scoreLead(excludedLead, testICP);
assert(excludedResult.fitScore === 0, `Excluded lead has score 0 (got ${excludedResult.fitScore})`);
assert(excludedResult.priority === "excluded", `Excluded lead has excluded priority (got ${excludedResult.priority})`);

// Test 4: Lead with no data should handle gracefully
console.log("\n[Scoring Engine] Minimal data lead:");
const minimalLead: LeadData = {
  title: null,
  company_name: null,
  industry: null,
  city: null,
  state: null,
  country: null,
  email: null,
  email_status: null,
  linkedin_url: null,
  website: null,
  company_size: null,
};

const minimalResult = scoreLead(minimalLead, testICP);
assert(minimalResult.fitScore >= 0, `Minimal lead doesn't crash (got score ${minimalResult.fitScore})`);
assert(minimalResult.concerns.length > 0, `Minimal lead has concerns (got ${minimalResult.concerns.length})`);

// Test 5: Hash stability
console.log("\n[Scoring Engine] Hash stability:");
const hash1 = hashLeadData(highFitLead);
const hash2 = hashLeadData(highFitLead);
assert(hash1 === hash2, "Same lead data produces same hash");

const hash3 = hashLeadData(lowFitLead);
assert(hash1 !== hash3, "Different lead data produces different hash");

const icpHash1 = hashICP(testICP);
const icpHash2 = hashICP(testICP);
assert(icpHash1 === icpHash2, "Same ICP produces same hash");

// Test 6: Senior title partial credit
console.log("\n[Scoring Engine] Senior title partial credit:");
const seniorNonTargetLead: LeadData = {
  ...highFitLead,
  title: "Chief Revenue Officer",
};
const seniorResult = scoreLead(seniorNonTargetLead, testICP);
assert(seniorResult.fitScore > 0, `Senior non-target title gets some credit (got ${seniorResult.fitScore})`);
assert(seniorResult.matchedSignals.some((s) => s.includes("Senior")), "Senior title detection signal present");

// Test 7: Empty ICP should not crash
console.log("\n[Scoring Engine] Empty ICP:");
const emptyICP: ICPConfig = {
  target_roles: [],
  target_industries: [],
  target_geo: [],
  company_size_min: null,
  company_size_max: null,
  priorities: [],
  exclusion_rules: [],
  scoring_weights: {},
};
const emptyIcpResult = scoreLead(highFitLead, emptyICP);
assert(emptyIcpResult.fitScore >= 0, `Empty ICP doesn't crash (got ${emptyIcpResult.fitScore})`);

// --- Summary ---
console.log(`\n${"=".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) process.exit(1);
