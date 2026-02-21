import { Section } from "@/components/ui/Section";

export function ClarityBlock() {
  return (
    <Section background="surface">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-starlight leading-tight mb-6">
          You scaled. Now everything is louder.
        </h2>
        <p className="text-muted text-lg leading-relaxed mb-4">
          More channels. More dashboards. More opinions. The data is everywhere but the decisions are harder than ever. Your team is busy, but clarity is missing.
        </p>
        <p className="text-muted text-lg leading-relaxed">
          We work with growing companies at the exact moment complexity outpaces structure. We design the systems that restore signal, so your team can stop reacting and start navigating.
        </p>
      </div>
    </Section>
  );
}
