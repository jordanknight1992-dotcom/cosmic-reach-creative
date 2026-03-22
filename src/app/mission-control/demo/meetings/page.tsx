import { MeetingsView } from "../../[tenantSlug]/meetings/MeetingsView";
import { DEMO_MEETINGS_UPCOMING, DEMO_MEETINGS_PAST, DEMO_BLACKOUT_DATES } from "../demo-data";

export const metadata = { title: "Meetings Demo | Mission Control" };

export default function DemoMeetingsPage() {
  return (
    <MeetingsView
      tenantSlug="demo"
      data={{
        upcoming: DEMO_MEETINGS_UPCOMING,
        past: DEMO_MEETINGS_PAST,
        blackoutDates: DEMO_BLACKOUT_DATES,
        hasCalendar: true,
        calendarBusy: [],
        bookingUrl: "https://cosmicreachcreative.com/connect",
      }}
    />
  );
}
