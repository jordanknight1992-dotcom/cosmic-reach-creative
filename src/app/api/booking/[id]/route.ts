import { NextRequest, NextResponse } from "next/server";
import { getBookingById } from "@/lib/booking";
import { bookingTypes } from "@/config/booking";

/**
 * GET /api/booking/[id]
 *
 * Returns booking details by ID.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: "Invalid booking ID" },
      { status: 400 }
    );
  }

  try {
    const booking = await getBookingById(numericId);

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingType = bookingTypes[booking.booking_type as string];

    return NextResponse.json({
      booking: {
        id: booking.id,
        type: booking.booking_type,
        title: bookingType?.title ?? booking.booking_type,
        duration: bookingType?.durationMinutes ?? null,
        startTime: booking.start_time,
        endTime: booking.end_time,
        name: booking.client_name,
        email: booking.client_email,
        status: booking.status,
        createdAt: booking.created_at,
      },
    });
  } catch (err) {
    console.error("Error fetching booking:", err);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
