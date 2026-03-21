import { neon } from "@neondatabase/serverless";
import { availability, bookingTypes, type BookingType } from "@/config/booking";
import { getBusySlots } from "@/lib/google-calendar";

function getSQL() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

/* ─── Schema ─── */

export async function ensureBookingTables() {
  const sql = getSQL();
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id              SERIAL PRIMARY KEY,
      booking_type    TEXT NOT NULL,
      start_time      TIMESTAMPTZ NOT NULL,
      end_time        TIMESTAMPTZ NOT NULL,
      client_name     TEXT NOT NULL,
      client_email    TEXT NOT NULL,
      notes           TEXT DEFAULT '',
      status          TEXT DEFAULT 'confirmed',
      google_event_id TEXT,
      google_meet_url TEXT,
      created_at      TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_start
    ON bookings (start_time)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_bookings_status
    ON bookings (status)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blackout_dates (
      id         SERIAL PRIMARY KEY,
      start_date DATE NOT NULL,
      end_date   DATE NOT NULL,
      label      TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Idempotent column adds for existing tables
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS google_meet_url TEXT`.catch(() => {});
}

/* ─── Available slots ─── */

/**
 * Generate available time slots for a given date and booking type.
 * Checks against both Google Calendar busy times and existing bookings in DB.
 */
export async function getAvailableSlots(
  date: Date,
  bookingType: BookingType
): Promise<{ start: Date; end: Date }[]> {
  await ensureBookingTables();
  const { timezone, bufferMinutes, windows } = availability;

  // Find the availability window for this day of week
  const dayOfWeek = getDayOfWeekInTimezone(date, timezone);
  const window = windows.find((w) => w.day === dayOfWeek);
  if (!window) return [];

  // Check blackout dates
  const isBlackedOut = await isDateBlackedOut(date);
  if (isBlackedOut) return [];

  // Build the day boundaries in the owner's timezone
  const dayStart = setHourInTimezone(date, window.startHour, timezone);
  const dayEnd = setHourInTimezone(date, window.endHour, timezone);

  // Don't show slots in the past (with 1 hour minimum lead time)
  const now = new Date();
  const minStart = new Date(now.getTime() + 60 * 60 * 1000);

  // Fetch blockers in parallel
  const [googleBusy, dbBookings] = await Promise.all([
    getBusySlots(dayStart, dayEnd),
    getBookingsForRange(dayStart, dayEnd),
  ]);

  // Merge all busy periods (Google Calendar + existing DB bookings)
  const busy = [
    ...googleBusy,
    ...dbBookings.map((b) => ({
      start: new Date(new Date(b.start_time as string).getTime() - bufferMinutes * 60000),
      end: new Date(new Date(b.end_time as string).getTime() + bufferMinutes * 60000),
    })),
  ];

  // Generate candidate slots at 30-minute intervals
  const slotDuration = bookingType.durationMinutes * 60 * 1000;
  const interval = 30 * 60 * 1000;
  const slots: { start: Date; end: Date }[] = [];

  for (
    let t = dayStart.getTime();
    t + slotDuration <= dayEnd.getTime();
    t += interval
  ) {
    const slotStart = new Date(t);
    const slotEnd = new Date(t + slotDuration);

    if (slotStart < minStart) continue;

    // Check if slot overlaps any busy period
    const overlaps = busy.some(
      (b) => slotStart < b.end && slotEnd > b.start
    );
    if (!overlaps) {
      slots.push({ start: slotStart, end: slotEnd });
    }
  }

  return slots;
}

/* ─── CRUD ─── */

export async function createBooking(data: {
  bookingType: string;
  startTime: Date;
  clientName: string;
  clientEmail: string;
  notes?: string;
  googleEventId?: string | null;
  googleMeetUrl?: string | null;
}) {
  await ensureBookingTables();
  const sql = getSQL();
  const type = bookingTypes[data.bookingType];
  if (!type) throw new Error(`Unknown booking type: ${data.bookingType}`);

  const endTime = new Date(
    data.startTime.getTime() + type.durationMinutes * 60 * 1000
  );

  const rows = await sql`
    INSERT INTO bookings (
      booking_type, start_time, end_time,
      client_name, client_email, notes, google_event_id, google_meet_url
    ) VALUES (
      ${data.bookingType},
      ${data.startTime.toISOString()},
      ${endTime.toISOString()},
      ${data.clientName},
      ${data.clientEmail},
      ${data.notes ?? ""},
      ${data.googleEventId ?? null},
      ${data.googleMeetUrl ?? null}
    )
    RETURNING *
  `;
  return rows[0];
}

export async function getBookingById(id: number) {
  await ensureBookingTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM bookings WHERE id = ${id}
  `;
  return rows[0] ?? null;
}

export async function getBookingsForRange(start: Date, end: Date) {
  await ensureBookingTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM bookings
    WHERE status = 'confirmed'
      AND start_time < ${end.toISOString()}
      AND end_time > ${start.toISOString()}
    ORDER BY start_time ASC
  `;
  return rows;
}

export async function cancelBooking(id: number) {
  await ensureBookingTables();
  const sql = getSQL();
  await sql`
    UPDATE bookings SET status = 'cancelled' WHERE id = ${id}
  `;
}

/* ─── Blackout Dates ─── */

async function isDateBlackedOut(date: Date): Promise<boolean> {
  await ensureBookingTables();
  const sql = getSQL();
  const dateStr = date.toISOString().split("T")[0];
  const rows = await sql`
    SELECT 1 FROM blackout_dates
    WHERE start_date <= ${dateStr}::date AND end_date >= ${dateStr}::date
    LIMIT 1
  `;
  return rows.length > 0;
}

export async function getBlackoutDates() {
  await ensureBookingTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM blackout_dates ORDER BY start_date ASC
  `;
  return rows;
}

export async function addBlackoutDate(data: {
  startDate: string;
  endDate: string;
  label?: string;
}) {
  await ensureBookingTables();
  const sql = getSQL();
  const rows = await sql`
    INSERT INTO blackout_dates (start_date, end_date, label)
    VALUES (${data.startDate}::date, ${data.endDate}::date, ${data.label ?? ""})
    RETURNING *
  `;
  return rows[0];
}

export async function deleteBlackoutDate(id: number) {
  await ensureBookingTables();
  const sql = getSQL();
  await sql`DELETE FROM blackout_dates WHERE id = ${id}`;
}

/* ─── Upcoming Bookings ─── */

export async function getUpcomingBookings() {
  await ensureBookingTables();
  const sql = getSQL();
  const rows = await sql`
    SELECT * FROM bookings
    WHERE status = 'confirmed'
      AND start_time > NOW()
    ORDER BY start_time ASC
    LIMIT 50
  `;
  return rows;
}

/* ─── Timezone helpers ─── */

function getDayOfWeekInTimezone(date: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const map: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return map[weekday ?? "Mon"] ?? 1;
}

function setHourInTimezone(date: Date, hour: number, tz: string): Date {
  // Get the date string in the target timezone
  const dateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  // Build an ISO string for the target hour in that timezone
  const hourStr = hour.toString().padStart(2, "0");

  // Get the timezone offset for this moment
  const probe = new Date(`${dateStr}T${hourStr}:00:00`);
  const utcStr = probe.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = probe.toLocaleString("en-US", { timeZone: tz });
  const utcDate = new Date(utcStr);
  const tzDate = new Date(tzStr);
  const offsetMs = utcDate.getTime() - tzDate.getTime();

  return new Date(probe.getTime() + offsetMs);
}
