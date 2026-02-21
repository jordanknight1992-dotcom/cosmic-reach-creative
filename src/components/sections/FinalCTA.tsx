import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-brand-navy-alt">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-starlight leading-tight mb-6">
            Ready to cut through the noise?
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-10">
            The first conversation is free. We assess the terrain, identify the interference, and map the path to clarity.
          </p>
          <Button href="/clarity-session" size="lg" chevron>
            Request a Signal Scan
          </Button>
        </div>
      </Container>
    </section>
  );
}
