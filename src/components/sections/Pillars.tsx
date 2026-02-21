import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Chevron } from "@/components/ui/Chevron";

const services = [
  {
    label: "Creative",
    problem: "Marketing is running but nobody knows what is working.",
    what: "Strategy and systems consulting that turns scattered activity into focused, measurable signal.",
    deliverables: "Brand strategy, campaign architecture, reporting frameworks",
    outcome: "Your team makes decisions from data, not guesswork.",
    href: "/approach",
  },
  {
    label: "Parallax",
    problem: "Reports live in five tabs and three spreadsheets.",
    what: "A unified reporting surface that pulls GA4, Search Console, and LinkedIn into one clean view.",
    deliverables: "Custom dashboards, automated reporting, data integration",
    outcome: "One source of truth your whole team trusts.",
    href: "/parallax",
  },
  {
    label: "Labs",
    problem: "The problem is complex and off-the-shelf tools do not fit.",
    what: "Custom systems thinking and digital experimentation for problems that need a new approach.",
    deliverables: "Custom tools, workflow systems, decision frameworks",
    outcome: "A solution designed for your specific terrain.",
    href: "/labs",
  },
];

export function Pillars() {
  return (
    <Section background="surface">
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <p className="text-spark-red font-display font-semibold text-sm tracking-wide uppercase mb-3">
          What We Solve
        </p>
        <h2 className="text-starlight leading-tight">
          Three systems. One mission.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link key={service.label} href={service.href} className="group">
            <Card hover className="h-full flex flex-col">
              <p className="text-spark-red font-display font-semibold text-xs tracking-wide uppercase mb-4">
                {service.label}
              </p>
              <p className="text-starlight font-display font-semibold text-base mb-3">
                {service.problem}
              </p>
              <p className="text-muted text-sm leading-relaxed mb-3">
                {service.what}
              </p>
              <p className="text-muted/70 text-xs leading-relaxed mb-4">
                {service.deliverables}
              </p>
              <div className="mt-auto pt-4 border-t border-border">
                <p className="text-copper text-sm font-medium mb-3">
                  {service.outcome}
                </p>
                <span className="inline-flex items-center gap-1 text-spark-red text-sm font-display font-semibold group-hover:gap-2 transition-all duration-200 ease-cosmic">
                  Explore <Chevron size={14} />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  );
}
