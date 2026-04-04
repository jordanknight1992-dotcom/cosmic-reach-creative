import { NextRequest, NextResponse } from "next/server";
import { getActiveSubscribers, getSubscriberCount } from "@/lib/blog-db";

export async function GET(_req: NextRequest) {
  try {
    const [subscribers, stats] = await Promise.all([
      getActiveSubscribers(),
      getSubscriberCount(),
    ]);

    return NextResponse.json({ subscribers, stats });
  } catch (err) {
    console.error("Failed to fetch subscribers:", err);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
