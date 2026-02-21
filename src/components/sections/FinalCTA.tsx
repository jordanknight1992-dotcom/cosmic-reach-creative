import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 bg-brand-navy-alt">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-starlight leading-tight mb-6">
            Book a Clarity Session.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-10">
            First consultation is free. We assess the terrain, identify interference, and determine the correct orbit.
          </p>
          <Button href="/clarity-session" size="lg" chevron>
            Book a Clarity Session
          </Button>
        </div>
      </Container>
    </section>
  );
}
