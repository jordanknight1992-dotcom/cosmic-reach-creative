import { OverviewView } from "../[tenantSlug]/OverviewView";

export const metadata = { title: "Mission Control Demo | Cosmic Reach Creative" };

const DEMO_SUBMISSIONS = [
  {
    id: 1, type: "audit" as const, name: "Marcus Chen", email: "marcus@relayhealth.co",
    company: "Relay Health", message: "Our website gets traffic but almost no inquiries. Not sure if the messaging is off or the layout.",
    website: "relayhealth.co", status: "new", created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 2, type: "contact" as const, name: "Rachel Torres", email: "rachel@stackline.io",
    company: "Stackline Analytics", message: "Interested in a full rebuild. We outgrew our current site about six months ago.",
    website: null, status: "contacted", created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 3, type: "audit" as const, name: "David Park", email: "david@greenroof.design",
    company: "Green Roof Design", message: "We just launched a new service tier and need the site updated. Also want to know if our SEO is hurting us.",
    website: "greenroof.design", status: "new", created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 4, type: "contact" as const, name: "Amira Johnson", email: "amira@brightwell.co",
    company: "Brightwell", message: "Looking for ongoing monthly support after an audit. Want to make sure we are growing the right way.",
    website: null, status: "closed", created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 5, type: "audit" as const, name: "Tom Keating", email: "tom@bluecrest.agency",
    company: "Blue Crest", message: "Bounce rate feels high and nobody fills out our contact form. Need to understand why.",
    website: "bluecrestagency.com", status: "new", created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
];

const DEMO_MEETINGS = [
  {
    client_name: "Rachel Torres",
    client_email: "rachel@stackline.io",
    start_time: new Date(Date.now() + 2 * 86400000).toISOString(),
    end_time: new Date(Date.now() + 2 * 86400000 + 3600000).toISOString(),
    booking_type: "signal-check",
    google_meet_url: "https://meet.google.com/demo",
    status: "confirmed",
  },
];

const DEMO_GA4 = {
  sessions30d: 1247,
  pageViews30d: 3891,
  bounceRate30d: 52.3,
  avgSessionDuration30d: 94,
  newUsers30d: 892,
  returningUsers30d: 355,
  engagementRate30d: 61.4,
  topPages: [
    { page: "/", views: 1120, sessions: 890, bounceRate: 48.2, avgDuration: 65, engagementRate: 68.1 },
    { page: "/pricing", views: 640, sessions: 480, bounceRate: 38.5, avgDuration: 120, engagementRate: 74.2 },
    { page: "/how-it-works", views: 412, sessions: 310, bounceRate: 55.1, avgDuration: 88, engagementRate: 58.9 },
    { page: "/services", views: 285, sessions: 220, bounceRate: 42.0, avgDuration: 95, engagementRate: 66.3 },
    { page: "/contact", views: 198, sessions: 165, bounceRate: 35.8, avgDuration: 72, engagementRate: 71.0 },
  ],
  dailySessions: [],
  previousDailySessions: [],
  topSources: [
    { source: "google", sessions: 520, percentage: 41.7 },
    { source: "(direct)", sessions: 340, percentage: 27.3 },
    { source: "linkedin", sessions: 185, percentage: 14.8 },
    { source: "referral", sessions: 120, percentage: 9.6 },
    { source: "email", sessions: 82, percentage: 6.6 },
  ],
  comparison: {
    sessions: { current: 1247, previous: 1080, changePercent: 15.5 },
    pageViews: { current: 3891, previous: 3200, changePercent: 21.6 },
    bounceRate: { current: 52.3, previous: 58.1, changePercent: -10.0 },
    avgDuration: { current: 94, previous: 82, changePercent: 14.6 },
    engagement: { current: 61.4, previous: 55.0, changePercent: 11.6 },
    newUsers: { current: 892, previous: 750, changePercent: 18.9 },
  },
  sourceTimeline: [],
};

export default function DemoPage() {
  return (
    <OverviewView
      userName=""
      tenantSlug="demo"
      onboardingCompleted={true}
      submissions={DEMO_SUBMISSIONS}
      ga4Data={DEMO_GA4}
      hasGA4={true}
      meetings={DEMO_MEETINGS as unknown as Record<string, unknown>[]}
    />
  );
}
