import { LeadsView } from "../../[tenantSlug]/crm/LeadsView";

export const metadata = { title: "Leads Demo | Mission Control" };

const DEMO_SUBMISSIONS = [
  {
    id: 1, type: "audit" as const, name: "Marcus Chen", email: "marcus@relayhealth.co",
    company: "Relay Health", message: "Our website gets traffic but almost no inquiries.",
    website: "relayhealth.co", status: "new", notes: "", created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 2, type: "contact" as const, name: "Rachel Torres", email: "rachel@stackline.io",
    company: "Stackline Analytics", message: "Interested in a full rebuild.",
    website: null, status: "contacted", notes: "", created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 3, type: "audit" as const, name: "David Park", email: "david@greenroof.design",
    company: "Green Roof Design", message: "Just launched a new service tier and need the site updated.",
    website: "greenroof.design", status: "new", notes: "", created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 4, type: "contact" as const, name: "Amira Johnson", email: "amira@brightwell.co",
    company: "Brightwell", message: "Looking for ongoing monthly support.",
    website: null, status: "closed", notes: "", created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

export default function DemoCrmPage() {
  return (
    <LeadsView
      tenantSlug="demo"
      submissions={DEMO_SUBMISSIONS}
    />
  );
}
