import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, segment, source, ...rest } = body;

    if (!email || !segment || !source) {
      return NextResponse.json(
        { error: "Missing required fields: email, segment, source" },
        { status: 400 }
      );
    }

    const result = await saveLead({
      name: name || "",
      email,
      segment,
      source,
      ...rest,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}
