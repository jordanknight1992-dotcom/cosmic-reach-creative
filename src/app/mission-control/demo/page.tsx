import { DailyBriefing } from "../[tenantSlug]/DailyBriefing";
import {
  DEMO_LEADS,
  DEMO_PIPELINE_STATS,
  DEMO_ACTIVITIES,
  DEMO_MEETINGS_UPCOMING,
  DEMO_OVERDUE,
} from "./demo-data";

export const metadata = { title: "Mission Control Demo | Cosmic Reach Creative" };

export default function DemoPage() {
  return (
    <DailyBriefing
      userName=""
      tenantSlug="demo"
      onboardingCompleted={true}
      data={{
        pipelineStats: DEMO_PIPELINE_STATS,
        recentLeads: DEMO_LEADS,
        upcomingMeetings: DEMO_MEETINGS_UPCOMING,
        recentActivities: DEMO_ACTIVITIES,
        overdueFollowUps: DEMO_OVERDUE,
      }}
    />
  );
}
