import { NextRequest, NextResponse } from "next/server";
import { bookingTypes } from "@/config/booking";
import { createBooking, getAvailableSlots } from "@/lib/booking";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendBookingEmails } from "@/lib/booking-emails";
import {
  ensureCrmTables,
  createCompany,
  createContact,
  createLead,
  createActivity,
  updateLeadStage,
} from "@/lib/crm-db";

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

    // Send confirmation + alert emails (must await on serverless — function terminates after response)
    try {
      await sendBookingEmails({
        clientName: name,
        clientEmail: email,
        bookingTitle: bookingType.title,
        durationMinutes: bookingType.durationMinutes,
        startTime: start,
        endTime,
        notes,
        bookingId: booking.id as number,
        googleMeetUrl,
      });
      console.log("Booking emails sent successfully");
    } catch (emailErr) {
      console.error("Email send error (booking still created):", emailErr);
    }

    // Auto-create CRM lead from booking (non-fatal if it fails)
    try {
      await ensureCrmTables();
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(" ") || "";
      const emailDomain = email.split("@")[1] || "";

      // Create company from email domain (or use "Unknown" for free email providers)
      const freeProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "me.com", "live.com"];
      const companyName = freeProviders.includes(emailDomain.toLowerCase())
        ? `${firstName} ${lastName}`.trim()
        : emailDomain.replace(/\.\w+$/, "").replace(/^\w/, (c) => c.toUpperCase());

      const company = await createCompany({
        name: companyName,
        domain: freeProviders.includes(emailDomain.toLowerCase()) ? undefined : emailDomain,
        source: "booking",
      });

      const contact = await createContact({
        company_id: company.id,
        full_name: name,
        first_name: firstName,
        last_name: lastName || undefined,
        email,
        source: "booking",
        persona_type: "other",
      });

      const lead = await createLead({
        company_id: company.id,
        contact_id: contact.id,
        fit_score: 80, // High — they booked a meeting
        fit_reason: `Booked a ${bookingType.title} — shows active interest`,
        stage: "meeting_booked",
        next_action: `${bookingType.title} on ${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        next_action_at: start.toISOString(),
        last_contacted_at: new Date().toISOString(),
      });

      await createActivity({
        lead_id: lead.id,
        contact_id: contact.id,
        company_id: company.id,
        type: "stage_change",
        channel: "booking",
        body_preview: `Booked ${bookingType.title} for ${start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`,
      });

      console.log("CRM lead created from booking:", { leadId: lead.id, contactId: contact.id });
    } catch (crmErr) {
      // Don't block booking if CRM insert fails (e.g. duplicate email)
      console.error("CRM lead creation from booking failed (non-fatal):", crmErr);
    }

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
