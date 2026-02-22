import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CTASectionProps {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  secondaryExternal?: boolean;
}

export function CTASection({
  title,
  description,
  buttonLabel = "Start a Signal Session",
  buttonHref = "/signal-session",
  secondaryLabel,
  secondaryHref,
  secondaryExternal,
}: CTASectionProps) {
  return (
    <section className="py-24 md:py-32 bg-brand-navy-alt">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-starlight leading-tight mb-6">
            {title}
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-10">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={buttonHref} size="lg" chevron>
              {buttonLabel}
            </Button>
            {secondaryLabel && secondaryHref && (
              <Button
                href={secondaryHref}
                variant="secondary"
                size="lg"
                external={secondaryExternal}
              >
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
