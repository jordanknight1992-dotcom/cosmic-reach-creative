import { Section } from "@/components/ui/Section";

const signals = [
  {
    metric: "Decision velocity",
    description: "Teams move from weekly bottlenecks to daily clarity on what matters.",
  },
  {
    metric: "Reporting clarity",
    description: "One dashboard. One source of truth. No more spreadsheet archaeology.",
  },
  {
    metric: "Strategic alignment",
    description: "Everyone from leadership to execution working from the same signal.",
  },
  {
    metric: "Operational focus",
    description: "Less noise in the system. Fewer meetings about meetings.",
  },
];

export function SocialProof() {
  return (
    <Section>
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-3">
          Outcomes
        </p>
        <h2 className="text-starlight leading-tight">
          Signals we optimize for
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {signals.map((signal) => (
          <div key={signal.metric} className="flex gap-4">
            <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-spark-red" />
            <div>
              <h3 className="font-display font-semibold text-lg text-starlight mb-1">
                {signal.metric}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {signal.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
