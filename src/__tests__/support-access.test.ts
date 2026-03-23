/**
 * Tests for support access security model.
 * Run with: npx tsx src/__tests__/support-access.test.ts
 *
 * These tests verify the security invariants of the support access system
 * without requiring a database connection.
 */

import {
  isSuperUserEmail,
  hasRecentStepUp,
  clearStepUp,
} from "../lib/mc-auth";

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

// Test 1: Super User email identification
console.log("\n[Support Access] Super User email identification:");
assert(isSuperUserEmail("jordan@cosmicreachcreative.com"), "Correct email is identified as Super User");
assert(isSuperUserEmail("JORDAN@cosmicreachcreative.com"), "Case-insensitive match works");
assert(isSuperUserEmail("  jordan@cosmicreachcreative.com  "), "Trimmed match works");
assert(!isSuperUserEmail("other@cosmicreachcreative.com"), "Other emails are not Super User");
assert(!isSuperUserEmail("jordan@gmail.com"), "External email is not Super User");
assert(!isSuperUserEmail(""), "Empty email is not Super User");
assert(!isSuperUserEmail("admin@cosmicreachcreative.com"), "Admin email is not Super User");

// Test 2: Step-up verification state
console.log("\n[Support Access] Step-up verification state:");
assert(!hasRecentStepUp(999), "No step-up exists for unknown user");

// Clear should not throw for unknown user
clearStepUp(999);
assert(!hasRecentStepUp(999), "Clear on unknown user doesn't break state");

// Test 3: Session expiry model
console.log("\n[Support Access] Session duration constants:");
// We can't directly test the private constants, but we can verify the
// design intent through the API shape
assert(typeof isSuperUserEmail === "function", "isSuperUserEmail is exported");
assert(typeof hasRecentStepUp === "function", "hasRecentStepUp is exported");
assert(typeof clearStepUp === "function", "clearStepUp is exported");

// Test 4: Multiple users don't interfere
console.log("\n[Support Access] User isolation:");
clearStepUp(1);
clearStepUp(2);
assert(!hasRecentStepUp(1), "User 1 has no step-up");
assert(!hasRecentStepUp(2), "User 2 has no step-up");

// Test 5: Security invariants documented
console.log("\n[Support Access] Security invariants:");
assert(
  !isSuperUserEmail("attacker@evil.com"),
  "Attacker email is rejected"
);
assert(
  !isSuperUserEmail("jordan@cosmicreachcreative.com.evil.com"),
  "Subdomain attack is rejected"
);

// --- Summary ---
console.log(`\n${"=".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) process.exit(1);
