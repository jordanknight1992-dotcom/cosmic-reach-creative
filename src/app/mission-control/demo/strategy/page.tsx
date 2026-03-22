import { StrategyView } from "../../[tenantSlug]/strategy/StrategyView";
import { DEMO_GOALS } from "../demo-data";

export const metadata = { title: "Strategy Demo | Mission Control" };

export default function DemoStrategyPage() {
  return (
    <StrategyView
      tenantSlug="demo"
      tenantName="Cosmic Reach Creative"
      initialGoals={DEMO_GOALS}
    />
  );
}
