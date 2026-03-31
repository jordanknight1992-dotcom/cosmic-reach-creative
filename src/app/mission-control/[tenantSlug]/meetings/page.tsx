import { requireTenantAccess } from "@/lib/mc-session";
import { getSQL } from "@/lib/mc-db";
import { resolveCredential } from "@/lib/mc-auth";
import { getBusySlots } from "@/lib/google-calendar";
import { MeetingsView } from "./MeetingsView";

async function getMeetingsData(tenantId: number) {
  const sql = getSQL();

  // Backfill: assign orphan bookings (tenant_id IS NULL) to this tenant
  // This handles bookings created from the public /connect page
  await sql`UPDATE bookings SET tenant_id = ${tenantId} WHERE tenant_id IS NULL`.catch(() => {});
  await sql`UPDATE blackout_dates SET tenant_id = ${tenantId} WHERE tenant_id IS NULL`.catch(() => {});

  const [upcoming, past, blackoutDates] = await Promise.all([
    sql`
      SELECT id, booking_type, start_time, end_time, client_name, client_email,
             google_meet_url, status, notes
      FROM bookings
      WHERE tenant_id = ${tenantId} AND start_time >= NOW() AND status = 'confirmed'
      ORDER BY start_time ASC LIMIT 20
    `.catch(() => []),

    sql`
      SELECT id, booking_type, start_time, end_time, client_name, client_email,
             google_meet_url, status, notes
      FROM bookings
      WHERE tenant_id = ${tenantId} AND start_time < NOW()
      ORDER BY start_time DESC LIMIT 10
    `.catch(() => []),

    sql`
      SELECT id, start_date, end_date, label
      FROM blackout_dates
      WHERE tenant_id = ${tenantId} AND end_date >= CURRENT_DATE
      ORDER BY start_date ASC
    `.catch(() => []),
  ]);

  // Check Google Calendar connection
  let hasCalendar = false;
  let calendarBusy: { start: string; end: string }[] = [];
  try {
    const calCred = await resolveCredential(tenantId, "google_calendar");
    if (calCred) {
      hasCalendar = true;
      // Fetch next 7 days of busy slots
      const now = new Date();
      const weekOut = new Date(now.getTime() + 7 * 86400000);
      const busy = await getBusySlots(now, weekOut, { refreshToken: calCred.value });
      calendarBusy = busy.map((b) => ({ start: b.start.toISOString(), end: b.end.toISOString() }));
    }
  } catch (err) {
    console.error("Calendar fetch failed:", err);
  }

  // Get tenant's booking URL (domain or default)
  const tenantRow = await sql`SELECT domain FROM tenants WHERE id = ${tenantId} LIMIT 1`.catch(() => []);
  const domain = tenantRow[0]?.domain || null;

  return {
    upcoming: upcoming as unknown as Record<string, unknown>[],
    past: past as unknown as Record<string, unknown>[],
    blackoutDates: blackoutDates as unknown as Record<string, unknown>[],
    hasCalendar,
    calendarBusy,
    bookingUrl: domain ? `https://${domain}/connect` : "/connect",
  };
}

export default async function MeetingsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const { tenant } = await requireTenantAccess(tenantSlug);
  const data = await getMeetingsData(tenant.id);

  return <MeetingsView tenantSlug={tenant.slug} data={data} />;
}
