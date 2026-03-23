/**
 * Smart Field Mapping Engine
 *
 * Deterministic column-name matching for lead imports.
 * Handles CSV, Excel, CRM exports, Apollo, LinkedIn, and custom spreadsheets.
 * No AI calls. Pure string matching and heuristics.
 */

export type StandardField =
  | "first_name"
  | "last_name"
  | "full_name"
  | "email"
  | "title"
  | "company"
  | "website"
  | "domain"
  | "phone"
  | "linkedin_url"
  | "industry"
  | "city"
  | "state"
  | "country"
  | "company_size"
  | "skip";

interface FieldPattern {
  field: StandardField;
  patterns: string[];
  priority: number; // Higher = stronger match
}

const FIELD_PATTERNS: FieldPattern[] = [
  {
    field: "email",
    patterns: [
      "email", "e-mail", "work email", "business email", "work_email",
      "email address", "email_address", "contact email", "primary email",
      "recommended_personal_email", "personal_email",
    ],
    priority: 10,
  },
  {
    field: "first_name",
    patterns: [
      "first name", "first_name", "firstname", "given name", "given_name",
      "first", "fname",
    ],
    priority: 9,
  },
  {
    field: "last_name",
    patterns: [
      "last name", "last_name", "lastname", "surname", "family name",
      "family_name", "last", "lname",
    ],
    priority: 9,
  },
  {
    field: "full_name",
    patterns: [
      "full name", "full_name", "fullname", "name", "contact name",
      "contact_name", "person name", "display name",
    ],
    priority: 8,
  },
  {
    field: "title",
    patterns: [
      "title", "job title", "job_title", "jobtitle", "role", "position",
      "seniority", "job role", "designation", "function",
    ],
    priority: 7,
  },
  {
    field: "company",
    patterns: [
      "company", "company name", "company_name", "companyname", "organization",
      "organisation", "org", "account", "account name", "account_name",
      "employer", "firm", "business name",
    ],
    priority: 7,
  },
  {
    field: "website",
    patterns: [
      "website", "company website", "company_website", "url", "web",
      "homepage", "site", "company url", "company_url",
    ],
    priority: 6,
  },
  {
    field: "domain",
    patterns: [
      "domain", "company domain", "company_domain", "email domain",
    ],
    priority: 6,
  },
  {
    field: "phone",
    patterns: [
      "phone", "phone number", "phone_number", "mobile", "direct dial",
      "direct_dial", "cell", "telephone", "tel", "work phone", "mobile phone",
      "direct phone", "contact number",
    ],
    priority: 5,
  },
  {
    field: "linkedin_url",
    patterns: [
      "linkedin", "linkedin url", "linkedin_url", "linkedinurl",
      "profile url", "profile_url", "linkedin profile", "li url",
      "person linkedin url", "contact linkedin",
    ],
    priority: 5,
  },
  {
    field: "industry",
    patterns: [
      "industry", "sector", "vertical", "market", "segment",
      "company industry", "business type",
    ],
    priority: 4,
  },
  {
    field: "city",
    patterns: [
      "city", "location city", "person city", "company city", "metro",
    ],
    priority: 4,
  },
  {
    field: "state",
    patterns: [
      "state", "province", "region", "person state", "company state",
      "location state",
    ],
    priority: 4,
  },
  {
    field: "country",
    patterns: [
      "country", "nation", "person country", "company country",
      "location country", "country code",
    ],
    priority: 4,
  },
  {
    field: "company_size",
    patterns: [
      "company size", "company_size", "employees", "employee count",
      "employee_count", "headcount", "head count", "num employees",
      "number of employees", "size", "staff count",
    ],
    priority: 3,
  },
];

/**
 * Normalize a column header for matching.
 * Strips special characters, lowercases, trims whitespace.
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, "")
    .replace(/_/g, " ")
    .trim();
}

/**
 * Score how well a column header matches a field pattern.
 * Returns 0 for no match, higher for better matches.
 */
function matchScore(header: string, pattern: string): number {
  const normalizedHeader = normalizeHeader(header);
  const normalizedPattern = normalizeHeader(pattern);

  // Exact match
  if (normalizedHeader === normalizedPattern) return 100;

  // Starts with pattern
  if (normalizedHeader.startsWith(normalizedPattern)) return 80;

  // Ends with pattern
  if (normalizedHeader.endsWith(normalizedPattern)) return 70;

  // Contains pattern
  if (normalizedHeader.includes(normalizedPattern)) return 50;

  // Pattern contains header (short header, long pattern)
  if (normalizedPattern.includes(normalizedHeader) && normalizedHeader.length > 2) return 40;

  return 0;
}

/**
 * Auto-suggest field mappings for a set of column headers.
 * Returns a map of column header -> suggested StandardField.
 */
export function suggestFieldMappings(
  headers: string[]
): Record<string, { field: StandardField; confidence: number }> {
  const suggestions: Record<string, { field: StandardField; confidence: number }> = {};
  const usedFields = new Set<StandardField>();

  // Score all headers against all patterns
  type ScoredMatch = { header: string; field: StandardField; score: number; priority: number };
  const allMatches: ScoredMatch[] = [];

  for (const header of headers) {
    for (const fp of FIELD_PATTERNS) {
      let bestScore = 0;
      for (const pattern of fp.patterns) {
        const score = matchScore(header, pattern);
        if (score > bestScore) bestScore = score;
      }
      if (bestScore > 0) {
        allMatches.push({
          header,
          field: fp.field,
          score: bestScore + fp.priority,
          priority: fp.priority,
        });
      }
    }
  }

  // Sort by score descending
  allMatches.sort((a, b) => b.score - a.score);

  // Assign best match per header (greedy, no double-assignment of fields)
  for (const match of allMatches) {
    if (suggestions[match.header]) continue; // Header already mapped
    if (usedFields.has(match.field)) continue; // Field already used

    suggestions[match.header] = {
      field: match.field,
      confidence: Math.min(match.score, 100),
    };
    usedFields.add(match.field);
  }

  // Mark unmapped headers as skip
  for (const header of headers) {
    if (!suggestions[header]) {
      suggestions[header] = { field: "skip", confidence: 0 };
    }
  }

  return suggestions;
}

/**
 * Parse a CSV string into rows of string arrays.
 * Handles quoted fields, commas in values, newlines in quoted fields.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(current.trim());
        current = "";
      } else if (char === "\n" || (char === "\r" && next === "\n")) {
        row.push(current.trim());
        if (row.some((cell) => cell.length > 0)) {
          rows.push(row);
        }
        row = [];
        current = "";
        if (char === "\r") i++; // skip \n after \r
      } else {
        current += char;
      }
    }
  }

  // Last field/row
  row.push(current.trim());
  if (row.some((cell) => cell.length > 0)) {
    rows.push(row);
  }

  return rows;
}

/**
 * Normalize a single lead record using field mapping.
 */
export function normalizeRecord(
  row: Record<string, string>,
  mapping: Record<string, StandardField>
): {
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  title: string;
  company: string;
  website: string;
  domain: string;
  phone: string;
  linkedin_url: string;
  industry: string;
  city: string;
  state: string;
  country: string;
  company_size: string;
} {
  const result: Record<string, string> = {
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    title: "",
    company: "",
    website: "",
    domain: "",
    phone: "",
    linkedin_url: "",
    industry: "",
    city: "",
    state: "",
    country: "",
    company_size: "",
  };

  for (const [header, field] of Object.entries(mapping)) {
    if (field === "skip") continue;
    const value = row[header]?.trim() || "";
    if (value && !result[field]) {
      result[field] = value;
    }
  }

  // Auto-derive full_name from first + last if missing
  if (!result.full_name && (result.first_name || result.last_name)) {
    result.full_name = `${result.first_name} ${result.last_name}`.trim();
  }

  // Auto-derive first/last from full_name if missing
  if (result.full_name && !result.first_name && !result.last_name) {
    const parts = result.full_name.split(/\s+/);
    result.first_name = parts[0] || "";
    result.last_name = parts.slice(1).join(" ") || "";
  }

  // Normalize email
  result.email = result.email.toLowerCase().trim();

  // Extract domain from email if no domain/website
  if (result.email && !result.domain) {
    const atIdx = result.email.indexOf("@");
    if (atIdx > 0) {
      result.domain = result.email.substring(atIdx + 1);
    }
  }

  // Normalize LinkedIn URL
  if (result.linkedin_url && !result.linkedin_url.startsWith("http")) {
    if (result.linkedin_url.startsWith("linkedin.com") || result.linkedin_url.startsWith("www.linkedin.com")) {
      result.linkedin_url = `https://${result.linkedin_url}`;
    }
  }

  return result as {
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    title: string;
    company: string;
    website: string;
    domain: string;
    phone: string;
    linkedin_url: string;
    industry: string;
    city: string;
    state: string;
    country: string;
    company_size: string;
  };
}

/**
 * Validate that a record has minimum usable data.
 * Returns true if the record has at least a name and email.
 */
export function isUsableRecord(record: ReturnType<typeof normalizeRecord>): boolean {
  return !!(record.email && record.full_name);
}

/**
 * Detect likely file type from content or extension.
 */
export function detectFileType(filename: string): "csv" | "tsv" | "unknown" {
  const ext = filename.toLowerCase().split(".").pop();
  if (ext === "csv") return "csv";
  if (ext === "tsv" || ext === "txt") return "tsv";
  return "unknown";
}
