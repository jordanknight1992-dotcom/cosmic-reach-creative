import { google } from "googleapis";
import { availability } from "@/config/booking";

export interface CalendarCredentials {
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
}

/**
 * Returns an authorized Google Calendar client using a service-account-style
 * OAuth2 flow. The refresh token is obtained once via the OAuth consent flow
 * and stored in GOOGLE_REFRESH_TOKEN (or passed via credentials).
 */
function getAuthClient(creds?: CalendarCredentials) {
  const oauth2 = new google.auth.OAuth2(
    creds?.clientId || process.env.GOOGLE_CLIENT_ID,
    creds?.clientSecret || process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  );

  const refreshToken = creds?.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;
  if (refreshToken) {
    oauth2.setCredentials({ refresh_token: refreshToken });
  }

  return oauth2;
}

function getCalendar(creds?: CalendarCredentials) {
  return google.calendar({ version: "v3", auth: getAuthClient(creds) });
}

/**
 * Fetch busy times from Google Calendar for a given date range.
 */
export async function getBusySlots(
  startDate: Date,
  endDate: Date,
  creds?: CalendarCredentials
): Promise<{ start: Date; end: Date }[]> {
  const refreshToken = creds?.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    return [];
  }

  try {
    const calendar = getCalendar(creds);
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
  creds?: CalendarCredentials;
}): Promise<{ eventId: string | null; meetUrl: string | null }> {
  const refreshToken = params.creds?.refreshToken || process.env.GOOGLE_REFRESH_TOKEN;
  if (!refreshToken) {
    return { eventId: null, meetUrl: null };
  }

  try {
  const calendar = getCalendar(params.creds);
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
