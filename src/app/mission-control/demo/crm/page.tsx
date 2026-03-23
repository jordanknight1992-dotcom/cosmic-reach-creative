import { CrmView } from "../../[tenantSlug]/crm/CrmView";
import { DEMO_LEADS, DEMO_PIPELINE_STATS } from "../demo-data";

export const metadata = { title: "Leads Demo | Mission Control" };

export default function DemoCrmPage() {
  return (
    <CrmView
      tenantSlug="demo"
      data={{
        leads: DEMO_LEADS,
        stats: DEMO_PIPELINE_STATS,
      }}
    />
  );
}
