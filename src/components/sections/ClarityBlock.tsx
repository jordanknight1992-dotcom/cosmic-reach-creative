import { Section } from "@/components/ui/Section";

export function ClarityBlock() {
  return (
    <Section background="surface">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-starlight leading-tight mb-6">
          Clarity is not empty space.
          <br />
          Clarity is a focused lens.
        </h2>
        <p className="text-muted text-lg leading-relaxed">
          We work with teams facing complexity. Growth, scale, repositioning, digital transformation. The moment where the signal gets lost in noise. We restore the signal.
        </p>
      </div>
    </Section>
  );
}
