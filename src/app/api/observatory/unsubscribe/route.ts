import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/blog-db";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/observatory/unsubscribe?success=false", req.url)
      );
    }

    await unsubscribeByToken(token);

    return NextResponse.redirect(
      new URL("/observatory/unsubscribe?success=true", req.url)
    );
  } catch (err) {
    console.error("Unsubscribe error:", err);
    return NextResponse.redirect(
      new URL("/observatory/unsubscribe?success=false", req.url)
    );
  }
}
