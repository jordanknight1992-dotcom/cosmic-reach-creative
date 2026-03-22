import { NextResponse } from "next/server";
import { getPipelineStats } from "@/lib/crm-db";

export async function GET() {
  try {
    const stats = await getPipelineStats();
    return NextResponse.json({ stats });
  } catch (err) {
    console.error("Error fetching pipeline stats:", err);
    return NextResponse.json(
      { error: "Failed to fetch pipeline stats" },
      { status: 500 }
    );
  }
}
