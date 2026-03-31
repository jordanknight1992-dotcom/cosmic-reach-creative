import { SignalView } from "../../[tenantSlug]/signal/SignalView";
import { DEMO_GA4 } from "../demo-data";

export const metadata = { title: "Performance Demo | Mission Control" };

export default function DemoSignalPage() {
  return (
    <SignalView
      tenantSlug="demo"
      data={{
        hasGA4: true,
        ga4Data: DEMO_GA4,
        keywordData: {
          keywords: [
            { query: "marketing strategy consultant", clicks: 42, impressions: 1200, ctr: 3.5, position: 8.2 },
            { query: "website audit service", clicks: 28, impressions: 890, ctr: 3.1, position: 11.4 },
            { query: "brand messaging strategy", clicks: 19, impressions: 650, ctr: 2.9, position: 14.1 },
            { query: "marketing consultant memphis", clicks: 15, impressions: 340, ctr: 4.4, position: 5.8 },
            { query: "small business marketing help", clicks: 12, impressions: 980, ctr: 1.2, position: 22.3 },
            { query: "website not converting", clicks: 9, impressions: 420, ctr: 2.1, position: 18.6 },
          ],
          totalClicks: 125,
          totalImpressions: 4480,
          avgCtr: 2.8,
          avgPosition: 13.4,
        },
        connectedProviders: ["google_analytics"],
      }}
    />
  );
}
