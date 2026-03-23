/**
 * Smart Field Mapping Engine
 *
 * Deterministic column-name matching for lead imports.
 * Handles CSV, Excel, CRM exports (Apollo, LinkedIn, HubSpot, Salesforce,
 * Pipedrive), event attendee lists, conference lists, and custom spreadsheets.
 *
 * No AI calls. Pure string matching, heuristics, and content sniffing.
 *
 * Design philosophy: be forgiving. Users shouldn't need exact column names.
 * The mapper handles dozens of common variations and falls back to
 * content-based detection when header names don't match.
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

/**
 * Comprehensive pattern list covering:
 * - Apollo exports
 * - LinkedIn Sales Navigator exports
 * - HubSpot exports
 * - Salesforce exports
 * - Pipedrive exports
 * - Zoho CRM exports
 * - Eventbrite/conference attendee lists
 * - Generic spreadsheets
 */
const FIELD_PATTERNS: FieldPattern[] = [
  {
    field: "email",
    patterns: [
      "email", "e-mail", "e mail", "work email", "business email", "work_email",
      "email address", "email_address", "contact email", "primary email",
      "recommended_personal_email", "personal_email", "corporate email",
      "person email", "lead email", "prospect email", "attendee email",
      "participant email", "registrant email", "buyer email",
      // Apollo
      "email1", "email 1", "contact_email",
      // HubSpot
      "hs_email", "email_address_1",
      // Salesforce
      "npe01__work_email__c", "npe01__home_email__c",
      // Pipedrive
      "person - email", "org - email",
      // Zoho
      "email_opt_out",
    ],
    priority: 10,
  },
  {
    field: "first_name",
    patterns: [
      "first name", "first_name", "firstname", "given name", "given_name",
      "first", "fname", "f name", "forename",
      // Apollo
      "person first name",
      // Salesforce
      "contact first name", "lead first name",
      // Eventbrite
      "attendee first name", "registrant first name",
      "ticket first name", "buyer first name",
      // HubSpot
      "hs_firstname",
    ],
    priority: 9,
  },
  {
    field: "last_name",
    patterns: [
      "last name", "last_name", "lastname", "surname", "family name",
      "family_name", "last", "lname", "l name",
      // Apollo
      "person last name",
      // Salesforce
      "contact last name", "lead last name",
      // Eventbrite
      "attendee last name", "registrant last name",
      "ticket last name", "buyer last name",
      // HubSpot
      "hs_lastname",
    ],
    priority: 9,
  },
  {
    field: "full_name",
    patterns: [
      "full name", "full_name", "fullname", "name", "contact name",
      "contact_name", "person name", "display name", "display_name",
      "lead name", "prospect name", "attendee name", "registrant name",
      "participant name", "ticket holder", "buyer name",
      // Salesforce
      "contact: full name", "lead: name",
      // Pipedrive
      "person - name", "person name",
    ],
    priority: 8,
  },
  {
    field: "title",
    patterns: [
      "title", "job title", "job_title", "jobtitle", "role", "position",
      "seniority", "job role", "designation", "function", "job function",
      "job_function", "occupation", "profession",
      // Apollo
      "person title", "person seniority",
      // HubSpot
      "jobtitle", "hs_jobtitle",
      // Salesforce
      "contact title", "lead title",
      // Pipedrive
      "person - job title",
      // Eventbrite
      "job title / role", "attendee job title",
    ],
    priority: 7,
  },
  {
    field: "company",
    patterns: [
      "company", "company name", "company_name", "companyname", "organization",
      "organisation", "org", "account", "account name", "account_name",
      "employer", "firm", "business name", "business", "company/organization",
      "org name", "org_name", "workplace",
      // Apollo
      "company name for current position", "organization name",
      // HubSpot
      "associated company", "hs_company",
      // Salesforce
      "account: account name", "lead company",
      // Pipedrive
      "organization - name", "org - name",
      // Eventbrite
      "company / organization", "attendee company",
    ],
    priority: 7,
  },
  {
    field: "website",
    patterns: [
      "website", "company website", "company_website", "url", "web",
      "homepage", "site", "company url", "company_url", "web url",
      "web address", "site url", "org website",
      // Apollo
      "website url", "company website url",
      // HubSpot
      "hs_website",
      // Pipedrive
      "organization - website", "org - web",
    ],
    priority: 6,
  },
  {
    field: "domain",
    patterns: [
      "domain", "company domain", "company_domain", "email domain",
      "website domain", "org domain",
    ],
    priority: 6,
  },
  {
    field: "phone",
    patterns: [
      "phone", "phone number", "phone_number", "mobile", "direct dial",
      "direct_dial", "cell", "telephone", "tel", "work phone", "mobile phone",
      "direct phone", "contact number", "phone direct", "office phone",
      "cell phone", "mobile number", "contact phone", "primary phone",
      // Apollo
      "person phone", "direct phone number", "mobile phone number",
      "corporate phone",
      // HubSpot
      "hs_phone", "phone_number_1",
      // Salesforce
      "contact phone", "lead phone",
      // Pipedrive
      "person - phone", "org - phone",
      // Eventbrite
      "attendee phone", "cell/mobile",
    ],
    priority: 5,
  },
  {
    field: "linkedin_url",
    patterns: [
      "linkedin", "linkedin url", "linkedin_url", "linkedinurl",
      "profile url", "profile_url", "linkedin profile", "li url",
      "person linkedin url", "contact linkedin", "linkedin link",
      "linkedin page", "social linkedin", "linkedin address",
      // Apollo
      "person linkedin", "person linkedin url",
      // HubSpot
      "hs_linkedinbio", "linkedin bio",
      // Salesforce
      "linkedin_profile__c",
    ],
    priority: 5,
  },
  {
    field: "industry",
    patterns: [
      "industry", "sector", "vertical", "market", "segment",
      "company industry", "business type", "industry type",
      "company sector", "market segment", "business sector",
      // Apollo
      "company industry", "organization industry",
      // HubSpot
      "hs_industry",
      // Salesforce
      "account industry", "lead industry",
      // Pipedrive
      "organization - industry",
    ],
    priority: 4,
  },
  {
    field: "city",
    patterns: [
      "city", "location city", "person city", "company city", "metro",
      "town", "municipality", "contact city", "lead city",
      // Apollo
      "person city", "company city",
      // HubSpot
      "hs_city",
      // Salesforce
      "mailing city", "billing city",
      // Eventbrite
      "attendee city",
    ],
    priority: 4,
  },
  {
    field: "state",
    patterns: [
      "state", "province", "region", "person state", "company state",
      "location state", "state/province", "state/region", "contact state",
      // Apollo
      "person state", "company state",
      // HubSpot
      "hs_state",
      // Salesforce
      "mailing state", "billing state", "mailing state/province",
      // Eventbrite
      "attendee state",
    ],
    priority: 4,
  },
  {
    field: "country",
    patterns: [
      "country", "nation", "person country", "company country",
      "location country", "country code", "country/region",
      // Apollo
      "person country", "company country",
      // HubSpot
      "hs_country",
      // Salesforce
      "mailing country", "billing country",
      // Eventbrite
      "attendee country",
    ],
    priority: 4,
  },
  {
    field: "company_size",
    patterns: [
      "company size", "company_size", "employees", "employee count",
      "employee_count", "headcount", "head count", "num employees",
      "number of employees", "size", "staff count", "team size",
      "company headcount", "org size", "company employees",
      "estimated num employees", "# employees", "employee range",
      // Apollo
      "company employee count", "estimated number of employees",
      // HubSpot
      "numberofemployees", "hs_num_employees",
      // Salesforce
      "employees", "numberofemployees",
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

  // Word-level overlap (for multi-word headers)
  const headerWords = new Set(normalizedHeader.split(/\s+/));
  const patternWords = normalizedPattern.split(/\s+/);
  const overlap = patternWords.filter((w) => headerWords.has(w)).length;
  if (overlap >= 2) return 35;
  if (overlap === 1 && patternWords.length <= 2) return 25;

  return 0;
}

/**
 * Auto-suggest field mappings for a set of column headers.
 * Returns a map of column header -> suggested StandardField.
 *
 * Uses two passes:
 * 1. Header-name matching against known patterns
 * 2. Content-sniffing for unmapped columns (email patterns, URLs, etc.)
 */
export function suggestFieldMappings(
  headers: string[],
  sampleRows?: string[][],
): Record<string, { field: StandardField; confidence: number }> {
  const suggestions: Record<string, { field: StandardField; confidence: number }> = {};
  const usedFields = new Set<StandardField>();

  // === Pass 1: Header-name matching ===
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

  // Assign best match per header (greedy, no double-assignment)
  for (const match of allMatches) {
    if (suggestions[match.header]) continue;
    if (usedFields.has(match.field)) continue;

    suggestions[match.header] = {
      field: match.field,
      confidence: Math.min(match.score, 100),
    };
    usedFields.add(match.field);
  }

  // === Pass 2: Content-sniffing for unmapped columns ===
  if (sampleRows && sampleRows.length > 0) {
    for (let idx = 0; idx < headers.length; idx++) {
      const header = headers[idx];
      if (suggestions[header]) continue; // Already mapped

      const sampleValues = sampleRows
        .map((row) => row[idx]?.trim())
        .filter(Boolean)
        .slice(0, 5);

      if (sampleValues.length === 0) continue;

      const detected = sniffColumnContent(sampleValues);
      if (detected && !usedFields.has(detected.field)) {
        suggestions[header] = {
          field: detected.field,
          confidence: detected.confidence,
        };
        usedFields.add(detected.field);
      }
    }
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
 * Content-based field detection for when headers don't match patterns.
 * Looks at actual cell values to infer what the column contains.
 */
function sniffColumnContent(
  values: string[],
): { field: StandardField; confidence: number } | null {
  // Email detection
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (values.filter((v) => emailPattern.test(v)).length >= values.length * 0.6) {
    return { field: "email", confidence: 85 };
  }

  // LinkedIn URL detection
  if (values.filter((v) => v.includes("linkedin.com/")).length >= values.length * 0.5) {
    return { field: "linkedin_url", confidence: 85 };
  }

  // Website/URL detection
  const urlPattern = /^(https?:\/\/|www\.)/i;
  if (values.filter((v) => urlPattern.test(v)).length >= values.length * 0.5) {
    return { field: "website", confidence: 70 };
  }

  // Phone detection (digits, dashes, parens, plus sign)
  const phonePattern = /^[\d\s\-+().]{7,20}$/;
  if (values.filter((v) => phonePattern.test(v)).length >= values.length * 0.5) {
    return { field: "phone", confidence: 65 };
  }

  // Pure number (could be employee count or company size)
  const numberPattern = /^\d{1,7}$/;
  if (values.filter((v) => numberPattern.test(v)).length >= values.length * 0.7) {
    return { field: "company_size", confidence: 40 };
  }

  // Two-letter uppercase (likely state or country code)
  if (values.filter((v) => /^[A-Z]{2}$/.test(v)).length >= values.length * 0.5) {
    // Check if they look like US states
    const states = new Set(["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"]);
    const stateMatches = values.filter((v) => states.has(v.toUpperCase())).length;
    if (stateMatches >= values.length * 0.4) {
      return { field: "state", confidence: 60 };
    }
    return { field: "country", confidence: 50 };
  }

  return null;
}

/**
 * Parse a CSV or TSV string into rows of string arrays.
 * Handles:
 * - Quoted fields with commas inside
 * - Escaped quotes ("" inside quoted fields)
 * - Newlines inside quoted fields
 * - Tab-separated values (auto-detected)
 * - Pasted tabular data from spreadsheets
 * - BOM markers
 * - Mixed line endings (CRLF, LF, CR)
 */
export function parseCSV(text: string): string[][] {
  // Strip BOM if present
  if (text.charCodeAt(0) === 0xFEFF) {
    text = text.slice(1);
  }

  // Auto-detect delimiter: if first line has more tabs than commas, use tab
  const firstLine = text.split(/\r?\n/)[0] || "";
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delimiter = tabCount > commaCount ? "\t" : ",";

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
      } else if (char === delimiter) {
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
      } else if (char === "\r") {
        // Standalone CR (old Mac)
        row.push(current.trim());
        if (row.some((cell) => cell.length > 0)) {
          rows.push(row);
        }
        row = [];
        current = "";
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

  // Extract domain from website if no domain
  if (!result.domain && result.website) {
    try {
      const url = result.website.startsWith("http") ? result.website : `https://${result.website}`;
      const parsed = new URL(url);
      result.domain = parsed.hostname.replace(/^www\./, "");
    } catch {
      // Ignore malformed URLs
    }
  }

  // Normalize LinkedIn URL
  if (result.linkedin_url) {
    if (!result.linkedin_url.startsWith("http")) {
      if (result.linkedin_url.includes("linkedin.com")) {
        result.linkedin_url = `https://${result.linkedin_url}`;
      } else if (result.linkedin_url.startsWith("/in/") || result.linkedin_url.startsWith("in/")) {
        result.linkedin_url = `https://www.linkedin.com/${result.linkedin_url.replace(/^\//, "")}`;
      }
    }
  }

  // Normalize website URL
  if (result.website && !result.website.startsWith("http")) {
    result.website = `https://${result.website}`;
  }

  // Normalize phone (strip common formatting)
  if (result.phone) {
    result.phone = result.phone.replace(/[^\d+\-() ]/g, "").trim();
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
