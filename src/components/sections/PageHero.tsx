import Image from "next/image";
import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  title: string;
  lead?: string;
  imageSrc: string;
  imageAlt: string;
}

export function PageHero({ title, lead, imageSrc, imageAlt }: PageHeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-end pt-32 pb-16 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover opacity-50"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-space/40 via-deep-space/60 to-deep-space" />
      </div>
      <Container className="relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-starlight leading-[1.1] mb-4">{title}</h1>
          {lead && (
            <p className="text-muted text-lg md:text-xl leading-relaxed max-w-2xl">
              {lead}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
