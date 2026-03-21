import { NextResponse } from "next/server";
import { getUpcomingBookings } from "@/lib/booking";

export async function GET() {
  try {
    const bookings = await getUpcomingBookings();
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
