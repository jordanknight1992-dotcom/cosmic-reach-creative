import { SignalView } from "../../[tenantSlug]/signal/SignalView";
import { DEMO_LEADS, DEMO_PIPELINE_STATS, DEMO_OVERDUE, DEMO_GA4 } from "../demo-data";

export const metadata = { title: "Signal Demo | Mission Control" };

export default function DemoSignalPage() {
  return (
    <SignalView
      tenantSlug="demo"
      data={{
        pipelineStats: DEMO_PIPELINE_STATS,
        recentLeads: DEMO_LEADS.filter((l) => l.fit_score >= 70),
        overdueCount: DEMO_OVERDUE.length,
        hasGA4: true,
        ga4Data: DEMO_GA4,
        connectedProviders: ["google_analytics", "google_calendar", "resend"],
      }}
    />
  );
}
