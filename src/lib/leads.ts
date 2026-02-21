"use server";

import { promises as fs } from "fs";
import path from "path";

export interface LeadEntry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  website?: string;
  challenge?: string;
  timeline?: string;
  budget?: string;
  tools?: string;
  segment: string;
  source: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const JSON_PATH = path.join(DATA_DIR, "leads.json");
const CSV_PATH = path.join(DATA_DIR, "leads.csv");

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readLeads(): Promise<LeadEntry[]> {
  try {
    const data = await fs.readFile(JSON_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const CSV_HEADERS = [
  "id",
  "timestamp",
  "name",
  "email",
  "company",
  "role",
  "website",
  "challenge",
  "timeline",
  "budget",
  "tools",
  "segment",
  "source",
];

function leadToCSVRow(lead: LeadEntry): string {
  return CSV_HEADERS.map((h) => escapeCSV(lead[h as keyof LeadEntry] || "")).join(",");
}

export async function saveLead(lead: Omit<LeadEntry, "id" | "timestamp">): Promise<{ success: boolean }> {
  await ensureDataDir();

  const entry: LeadEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...lead,
  };

  const leads = await readLeads();
  leads.push(entry);

  await fs.writeFile(JSON_PATH, JSON.stringify(leads, null, 2));

  try {
    await fs.access(CSV_PATH);
    await fs.appendFile(CSV_PATH, "\n" + leadToCSVRow(entry));
  } catch {
    const header = CSV_HEADERS.join(",");
    await fs.writeFile(CSV_PATH, header + "\n" + leadToCSVRow(entry));
  }

  return { success: true };
}
