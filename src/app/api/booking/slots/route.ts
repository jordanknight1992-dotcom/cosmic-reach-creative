import { NextRequest, NextResponse } from "next/server";
import { bookingTypes } from "@/config/booking";
import { getAvailableSlots } from "@/lib/booking";

/**
 * GET /api/booking/slots?type=signal-check&date=2026-03-25
 *
 * Returns available time slots for a given booking type and date.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");
  const dateStr = searchParams.get("date");

  if (!type || !dateStr) {
    return NextResponse.json(
      { error: "Missing required params: type, date" },
      { status: 400 }
    );
  }

  const bookingType = bookingTypes[type];
  if (!bookingType) {
    return NextResponse.json(
      { error: `Unknown booking type: ${type}` },
      { status: 400 }
    );
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const date = new Date(dateStr + "T12:00:00");
  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { error: "Invalid date" },
      { status: 400 }
    );
  }

  // Don't allow dates more than 60 days out
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  if (date > maxDate) {
    return NextResponse.json(
      { error: "Cannot book more than 60 days in advance" },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date, bookingType);

    return NextResponse.json({
      date: dateStr,
      type,
      duration: bookingType.durationMinutes,
      slots: slots.map((s) => ({
        start: s.start.toISOString(),
        end: s.end.toISOString(),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error fetching slots:", message, err);
    return NextResponse.json(
      { error: "Failed to fetch available slots", detail: message },
      { status: 500 }
    );
  }
}
