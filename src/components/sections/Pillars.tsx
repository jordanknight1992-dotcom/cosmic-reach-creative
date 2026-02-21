import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Chevron } from "@/components/ui/Chevron";

const pillars = [
  {
    label: "Creative",
    title: "Cosmic Reach Creative",
    description:
      "Consulting that turns marketing noise into decision ready signal.",
    href: "/approach",
  },
  {
    label: "Parallax",
    title: "Cosmic Reach Parallax",
    description:
      "A reporting dashboard that pulls GA4, Search Console, and LinkedIn data into one clean report.",
    href: "#",
  },
  {
    label: "Labs",
    title: "Cosmic Reach Labs",
    description:
      "Designing solutions to complex company problems through systems thinking and digital experimentation.",
    href: "/labs",
  },
];

export function Pillars() {
  return (
    <Section>
      <SectionHeading
        label="What we do"
        title="Three pillars of clarity"
        align="center"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => (
          <Card key={pillar.label} hover>
            <p className="text-spark-red font-display font-semibold text-xs tracking-wide uppercase mb-3">
              {pillar.label}
            </p>
            <h3 className="font-display font-bold text-xl text-starlight mb-3">
              {pillar.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-4">
              {pillar.description}
            </p>
            <span className="inline-flex items-center gap-1 text-spark-red text-sm font-display font-semibold">
              Learn more <Chevron size={14} />
            </span>
          </Card>
        ))}
      </div>
    </Section>
  );
}
