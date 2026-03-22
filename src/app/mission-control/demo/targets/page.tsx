import { TargetsView } from "../../[tenantSlug]/targets/TargetsView";
import { DEMO_LEADS, DEMO_OVERDUE } from "../demo-data";

export const metadata = { title: "Targets Demo | Mission Control" };

export default function DemoTargetsPage() {
  return (
    <TargetsView
      tenantSlug="demo"
      data={{
        allLeads: DEMO_LEADS.filter((l) => !["suppressed", "lost"].includes(l.stage)),
        overdueLeads: DEMO_OVERDUE,
      }}
    />
  );
}
