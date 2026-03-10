import { NextResponse } from "next/server";
import { trackCtaClick } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { label, page } = await request.json();
    if (!label || !page) return NextResponse.json({ ok: false });
    await trackCtaClick(String(label), String(page));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
