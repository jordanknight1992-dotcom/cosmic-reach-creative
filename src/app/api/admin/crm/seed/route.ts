import { NextResponse } from "next/server";
import { seedTestData } from "@/lib/crm-db";

export async function POST() {
  try {
    const result = await seedTestData();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error seeding test data:", err);
    return NextResponse.json(
      { error: "Failed to seed test data" },
      { status: 500 }
    );
  }
}
