import { DailyBriefing } from "../[tenantSlug]/DailyBriefing";
import { generateBriefing, type BriefingInput, type LeadSnapshot } from "@/lib/briefing-engine";
import {
  DEMO_LEADS,
  DEMO_PIPELINE_STATS,
  DEMO_ACTIVITIES,
  DEMO_MEETINGS_UPCOMING,
  DEMO_OVERDUE,
} from "./demo-data";

export const metadata = { title: "Mission Control Demo | Cosmic Reach Creative" };

export default function DemoPage() {
  // Run demo data through the real briefing engine
  const briefingInput: BriefingInput = {
    pipelineStats: DEMO_PIPELINE_STATS,
    allLeads: DEMO_LEADS as unknown as LeadSnapshot[],
    overdueFollowUps: DEMO_OVERDUE as unknown as LeadSnapshot[],
    upcomingMeetings: DEMO_MEETINGS_UPCOMING as unknown as BriefingInput["upcomingMeetings"],
    recentActivities: DEMO_ACTIVITIES as unknown as BriefingInput["recentActivities"],
    recentStageChanges: [
      { lead_id: 1, old_stage: "emailed", new_stage: "replied_positive", changed_at: new Date(Date.now() - 86400000).toISOString(), contact_name: "Marcus Chen", company_name: "Relay Health" },
      { lead_id: 2, old_stage: "meeting_requested", new_stage: "meeting_booked", changed_at: new Date(Date.now() - 3 * 86400000).toISOString(), contact_name: "Rachel Torres", company_name: "Stackline Analytics" },
    ],
    newLeadsToday: 1,
    totalLeadsYesterday: 11,
  };

  const briefing = generateBriefing(briefingInput);

  return (
    <DailyBriefing
      userName=""
      tenantSlug="demo"
      onboardingCompleted={true}
      briefing={briefing}
      meetings={DEMO_MEETINGS_UPCOMING as unknown as Record<string, unknown>[]}
      activities={DEMO_ACTIVITIES as unknown as Record<string, unknown>[]}
      pipelineStats={DEMO_PIPELINE_STATS}
    />
  );
}
