/**
 * Tests for the import field mapper.
 * Run with: npx tsx src/__tests__/import-mapper.test.ts
 */

import {
  suggestFieldMappings,
  parseCSV,
  normalizeRecord,
  isUsableRecord,
  type StandardField,
} from "../lib/import-mapper";

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

// Test 1: Standard CSV headers
console.log("\n[Import Mapper] Standard CSV headers:");
const standardHeaders = ["First Name", "Last Name", "Email", "Job Title", "Company", "LinkedIn URL"];
const standardMapping = suggestFieldMappings(standardHeaders);
assert(standardMapping["First Name"].field === "first_name", "Maps 'First Name' to first_name");
assert(standardMapping["Last Name"].field === "last_name", "Maps 'Last Name' to last_name");
assert(standardMapping["Email"].field === "email", "Maps 'Email' to email");
assert(standardMapping["Job Title"].field === "title", "Maps 'Job Title' to title");
assert(standardMapping["Company"].field === "company", "Maps 'Company' to company");
assert(standardMapping["LinkedIn URL"].field === "linkedin_url", "Maps 'LinkedIn URL' to linkedin_url");

// Test 2: Apollo export headers
console.log("\n[Import Mapper] Apollo export headers:");
const apolloHeaders = ["Name", "Title", "Company", "Email", "Phone", "Website", "LinkedIn"];
const apolloMapping = suggestFieldMappings(apolloHeaders);
assert(apolloMapping["Name"].field === "full_name", "Maps 'Name' to full_name");
assert(apolloMapping["Email"].field === "email", "Maps Apollo 'Email'");
assert(apolloMapping["LinkedIn"].field === "linkedin_url", "Maps 'LinkedIn' to linkedin_url");
assert(apolloMapping["Website"].field === "website", "Maps 'Website' to website");

// Test 3: Weird header variations
console.log("\n[Import Mapper] Non-standard headers:");
const weirdHeaders = ["contact_name", "work_email", "organization", "position", "direct_dial"];
const weirdMapping = suggestFieldMappings(weirdHeaders);
assert(weirdMapping["contact_name"].field === "full_name", "Maps 'contact_name' to full_name");
assert(weirdMapping["work_email"].field === "email", "Maps 'work_email' to email");
assert(weirdMapping["organization"].field === "company", "Maps 'organization' to company");
assert(weirdMapping["position"].field === "title", "Maps 'position' to title");
assert(weirdMapping["direct_dial"].field === "phone", "Maps 'direct_dial' to phone");

// Test 4: CSV parsing
console.log("\n[Import Mapper] CSV parsing:");
const csvText = `Name,Email,Company
"John Smith",john@example.com,"Acme, Inc."
Jane Doe,jane@example.com,Beta Corp`;
const rows = parseCSV(csvText);
assert(rows.length === 3, `Parses 3 rows including header (got ${rows.length})`);
assert(rows[0][0] === "Name", "First row is header");
assert(rows[1][0] === "John Smith", "Handles quoted fields");
assert(rows[1][2] === "Acme, Inc.", "Handles commas in quoted fields");
assert(rows[2][0] === "Jane Doe", "Parses unquoted fields");

// Test 5: CSV with quoted newlines
console.log("\n[Import Mapper] CSV with edge cases:");
const edgeCsv = `Email,Name
test@example.com,Test User
,Empty Email
complete@test.com,`;
const edgeRows = parseCSV(edgeCsv);
assert(edgeRows.length >= 3, `Handles rows with empty fields (got ${edgeRows.length})`);

// Test 6: Record normalization
console.log("\n[Import Mapper] Record normalization:");
const mapping: Record<string, StandardField> = {
  "First Name": "first_name",
  "Last Name": "last_name",
  "Email": "email",
  "Company": "company",
};
const normalized = normalizeRecord(
  { "First Name": "John", "Last Name": "Smith", "Email": "JOHN@Example.COM", "Company": "Acme Inc" },
  mapping
);
assert(normalized.full_name === "John Smith", "Auto-derives full name from first + last");
assert(normalized.email === "john@example.com", "Lowercases email");
assert(normalized.domain === "example.com", "Extracts domain from email");

// Test 7: Full name splitting
console.log("\n[Import Mapper] Full name splitting:");
const nameMapping: Record<string, StandardField> = {
  "Name": "full_name",
  "Email": "email",
};
const nameNormalized = normalizeRecord(
  { "Name": "Sarah Jane Williams", "Email": "sarah@test.com" },
  nameMapping
);
assert(nameNormalized.first_name === "Sarah", "Splits first name from full name");
assert(nameNormalized.last_name === "Jane Williams", "Splits last name from full name");

// Test 8: Usable record validation
console.log("\n[Import Mapper] Record validation:");
assert(isUsableRecord({ ...normalized }), "Record with name and email is usable");
assert(!isUsableRecord({ ...normalized, email: "", full_name: "John" }), "Record without email is not usable");
assert(!isUsableRecord({ ...normalized, email: "test@test.com", full_name: "" }), "Record without name is not usable");

// Test 9: LinkedIn URL normalization
console.log("\n[Import Mapper] LinkedIn URL normalization:");
const linkedinMapping: Record<string, StandardField> = {
  "LinkedIn": "linkedin_url",
  "Email": "email",
  "Name": "full_name",
};
const liNormalized = normalizeRecord(
  { "LinkedIn": "linkedin.com/in/johndoe", "Email": "john@test.com", "Name": "John" },
  linkedinMapping
);
assert(liNormalized.linkedin_url === "https://linkedin.com/in/johndoe", "Adds https:// to LinkedIn URL");

// Test 10: Unmapped columns get 'skip'
console.log("\n[Import Mapper] Unmapped columns:");
const mixedHeaders = ["Email", "First Name", "Random Column", "XYZ123"];
const mixedMapping = suggestFieldMappings(mixedHeaders);
assert(mixedMapping["Random Column"].field === "skip", "Unknown column mapped to skip");
assert(mixedMapping["XYZ123"].field === "skip", "Gibberish column mapped to skip");

// --- Summary ---
console.log(`\n${"=".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
if (failed > 0) process.exit(1);
