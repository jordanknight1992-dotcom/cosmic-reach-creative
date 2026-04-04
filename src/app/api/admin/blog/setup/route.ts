import { NextRequest, NextResponse } from "next/server";
import { ensureBlogTables } from "@/lib/blog-db";

export async function POST(_req: NextRequest) {
  try {
    await ensureBlogTables();
    return NextResponse.json({ message: "Blog tables initialized" });
  } catch (err) {
    console.error("Failed to initialize blog tables:", err);
    return NextResponse.json(
      { error: "Failed to initialize blog tables" },
      { status: 500 }
    );
  }
}
