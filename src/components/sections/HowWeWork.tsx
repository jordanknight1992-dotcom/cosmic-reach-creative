import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Diagnose",
    description: "Map the signal, locate interference.",
  },
  {
    number: "02",
    title: "Design",
    description: "Architect the simplest system that will hold.",
  },
  {
    number: "03",
    title: "Deploy",
    description: "Ship the work, measure, refine.",
  },
];

export function HowWeWork() {
  return (
    <Section background="surface">
      <SectionHeading
        label="Process"
        title="How we work"
        align="center"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-spark-red text-spark-red font-display font-bold text-lg mb-4">
              {step.number}
            </div>
            <h3 className="font-display font-bold text-xl text-starlight mb-2">
              {step.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
