import { NextRequest, NextResponse } from "next/server";
import { bookingTypes } from "@/config/booking";
import { createBooking, getAvailableSlots } from "@/lib/booking";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendBookingEmails } from "@/lib/booking-emails";

/**
 * POST /api/booking/create
 *
 * Body: { type, startTime, name, email, notes? }
 *
 * Creates a booking, adds a Google Calendar event, and returns the booking.
 */
export async function POST(request: NextRequest) {
  let body: {
    type?: string;
    startTime?: string;
    name?: string;
    email?: string;
    notes?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, startTime, name, email, notes } = body;

  // Validate required fields
  if (!type || !startTime || !name || !email) {
    return NextResponse.json(
      { error: "Missing required fields: type, startTime, name, email" },
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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) {
    return NextResponse.json(
      { error: "Invalid startTime" },
      { status: 400 }
    );
  }

  // Don't allow booking in the past
  if (start < new Date()) {
    return NextResponse.json(
      { error: "Cannot book a time in the past" },
      { status: 400 }
    );
  }

  // Verify the slot is still available (prevent race conditions)
  const slots = await getAvailableSlots(start, bookingType);
  const slotAvailable = slots.some(
    (s) => s.start.getTime() === start.getTime()
  );

  if (!slotAvailable) {
    return NextResponse.json(
      { error: "This time slot is no longer available" },
      { status: 409 }
    );
  }

  try {
    const endTime = new Date(
      start.getTime() + bookingType.durationMinutes * 60 * 1000
    );

    // Create Google Calendar event with Google Meet
    let googleEventId: string | null = null;
    let googleMeetUrl: string | null = null;
    try {
      const calResult = await createCalendarEvent({
        title: `${bookingType.title} — ${name}`,
        description: [
          `Booking type: ${bookingType.title}`,
          `Client: ${name} (${email})`,
          notes ? `Notes: ${notes}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        startTime: start,
        endTime,
        attendeeEmail: email,
        attendeeName: name,
      });
      googleEventId = calResult.eventId;
      googleMeetUrl = calResult.meetUrl;
      console.log("Google Calendar result:", { googleEventId, googleMeetUrl });
    } catch (calErr) {
      console.error("Google Calendar failed (booking will proceed without Meet link):", calErr);
    }

    // Save to database
    const booking = await createBooking({
      bookingType: type,
      startTime: start,
      clientName: name,
      clientEmail: email,
      notes,
      googleEventId,
      googleMeetUrl,
    });

    // Send confirmation + alert emails (non-blocking)
    sendBookingEmails({
      clientName: name,
      clientEmail: email,
      bookingTitle: bookingType.title,
      durationMinutes: bookingType.durationMinutes,
      startTime: start,
      endTime,
      notes,
      bookingId: booking.id as number,
      googleMeetUrl,
    }).catch((err) => console.error("Email send error:", err));

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        type: bookingType.title,
        duration: bookingType.durationMinutes,
        startTime: booking.start_time,
        endTime: booking.end_time,
        name: booking.client_name,
        email: booking.client_email,
        meetUrl: googleMeetUrl,
      },
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
