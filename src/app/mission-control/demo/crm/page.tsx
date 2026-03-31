import { LeadsView } from "../../[tenantSlug]/crm/LeadsView";

export const metadata = { title: "Leads Demo | Mission Control" };

const DEMO_LEADS = [
  {
    id: 1, source: "audit" as const, name: "Marcus Chen", email: "marcus@relayhealth.co",
    company: "Relay Health", website: "relayhealth.co",
    status: "audit_delivered", revenue: 150, notes: "", created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 2, source: "contact" as const, name: "Rachel Torres", email: "rachel@stackline.io",
    company: "Stackline Analytics", website: null,
    status: "rebuild_proposal", revenue: 6000, notes: "Wants a full rebuild", created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 3, source: "manual" as const, name: "David Park", email: "david@greenroof.design",
    company: "Green Roof Design", website: "greenroof.design",
    status: "website_build_complete", revenue: 5500, notes: "Build delivered March 15", created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 4, source: "manual" as const, name: "Amira Johnson", email: "amira@brightwell.co",
    company: "Brightwell", website: "brightwell.co",
    status: "mission_control_active", revenue: 4800, notes: "Ongoing $19.99/mo", created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 5, source: "contact" as const, name: "Sam Liu", email: "sam@novaedge.com",
    company: "Nova Edge", website: null,
    status: "lead", revenue: null, notes: "", created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export default function DemoCrmPage() {
  return (
    <LeadsView
      tenantSlug="demo"
      leads={DEMO_LEADS}
    />
  );
}
