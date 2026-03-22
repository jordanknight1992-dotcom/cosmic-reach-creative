import { google } from "googleapis";
import { availability } from "@/config/booking";

/**
 * Returns an authorized Google Calendar client using a service-account-style
 * OAuth2 flow. The refresh token is obtained once via the OAuth consent flow
 * and stored in GOOGLE_REFRESH_TOKEN.
 *
 * For initial setup you need a one-time OAuth consent to get a refresh token.
 * See /api/auth/google/route.ts for the consent flow.
 */
function getAuthClient() {
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  }

  return oauth2;
}

function getCalendar() {
  return google.calendar({ version: "v3", auth: getAuthClient() });
}

/**
 * Fetch busy times from Google Calendar for a given date range.
 */
export async function getBusySlots(
  startDate: Date,
  endDate: Date
): Promise<{ start: Date; end: Date }[]> {
  // If no refresh token yet, return empty (allows dev without Google connected)
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return [];
  }

  try {
    const calendar = getCalendar();
    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        timeZone: availability.timezone,
        items: [{ id: "primary" }],
      },
    });

    const busy = res.data.calendars?.primary?.busy ?? [];
    return busy
      .filter((b) => b.start && b.end)
      .map((b) => ({
        start: new Date(b.start!),
        end: new Date(b.end!),
      }));
  } catch (err) {
    console.error("Google Calendar freebusy error (continuing without):", err instanceof Error ? err.message : err);
    return [];
  }
}

/**
 * Create a Google Calendar event for a confirmed booking.
 */
export async function createCalendarEvent(params: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
  attendeeName: string;
}): Promise<{ eventId: string | null; meetUrl: string | null }> {
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    return { eventId: null, meetUrl: null };
  }

  try {
  console.log("Creating Google Calendar event. Client ID starts:", process.env.GOOGLE_CLIENT_ID?.substring(0, 15), "Refresh token length:", process.env.GOOGLE_REFRESH_TOKEN?.length);
  const calendar = getCalendar();
  const event = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: params.title,
      description: params.description,
      start: {
        dateTime: params.startTime.toISOString(),
        timeZone: availability.timezone,
      },
      end: {
        dateTime: params.endTime.toISOString(),
        timeZone: availability.timezone,
      },
      attendees: [
        { email: params.attendeeEmail, displayName: params.attendeeName },
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    },
    sendUpdates: "all",
  });

  const meetUrl = event.data.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === "video"
  )?.uri ?? null;

  return {
    eventId: event.data.id ?? null,
    meetUrl,
  };
  } catch (err) {
    console.error("Google Calendar event creation error:", err instanceof Error ? err.message : err);
    return { eventId: null, meetUrl: null };
  }
}
