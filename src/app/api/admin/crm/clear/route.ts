import { NextResponse } from "next/server";
import { clearAllCrmData } from "@/lib/crm-db";

/**
 * POST /api/admin/crm/clear
 * Deletes all CRM data (companies, contacts, leads, etc.)
 */
export async function POST() {
  try {
    const result = await clearAllCrmData();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error clearing CRM data:", err);
    return NextResponse.json(
      { error: "Failed to clear CRM data" },
      { status: 500 }
    );
  }
}
