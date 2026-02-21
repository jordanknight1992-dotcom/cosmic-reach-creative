import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/homepage-hero.jpg"
          alt=""
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-space/30 via-deep-space/50 to-deep-space" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-4 motion-safe:animate-[fadeIn_0.3s_ease-out]">
            Cosmic Reach Creative
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-starlight leading-[1.1] mb-6">
            Designing clarity for growing companies.
          </h1>
          <p className="text-muted text-lg md:text-xl mb-10 max-w-xl">
            Strategy. Systems. Signal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button href="/clarity-session" size="lg" chevron>
              Book a Clarity Session
            </Button>
            <Button href="/work" variant="secondary" size="lg">
              Explore Work
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
