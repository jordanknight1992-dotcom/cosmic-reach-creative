import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface CaseStudyHeaderProps {
  title: string;
  subtitle: string;
  tags: string[];
  role: string;
  links?: { label: string; href: string; external?: boolean }[];
}

export function CaseStudyHeader({
  title,
  subtitle,
  tags,
  role,
  links,
}: CaseStudyHeaderProps) {
  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24 bg-deep-space">
      <Container>
        <div className="max-w-3xl">
          <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-4">
            Case Study
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-starlight leading-[1.1] mb-4">
            {title}
          </h1>
          <p className="text-muted text-xl md:text-2xl leading-relaxed mb-6">
            {subtitle}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-surface border border-border text-muted text-xs font-display font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p className="text-muted text-sm mb-8">
            {role}
          </p>
          {links && links.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {links.map((link, i) => (
                <Button
                  key={link.label}
                  href={link.href}
                  variant={i === 0 ? "primary" : "secondary"}
                  external={link.external}
                  chevron={i === 0}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
