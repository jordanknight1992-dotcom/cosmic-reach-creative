import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Featured Projects | Cosmic Reach Creative",
  description:
    "Case studies and speculative builds from Cosmic Reach Creative. Real brand systems, rebuilt from the foundation up.",
  alternates: { canonical: `${siteConfig.domain}/work` },
};

const projects = [
  {
    slug: "la-cherie",
    title: "La Ch\u00e9rie Weddings",
    tagline: "From beautiful work to a system that shows it",
    description:
      "A luxury wedding planner in Memphis already booked through word of mouth. We rebuilt the brand, the site, and the infrastructure so the website converts on its own.",
    image: "/images/work/image-asset-11.jpeg",
    imageAlt: "The founder of La Ch\u00e9rie Weddings",
    imagePosition: "center 35%",
    tags: ["Brand System", "Website Rebuild", "Memphis"],
    score: { before: 1.6, after: 7.0 },
  },
  {
    slug: "bluff-city-ac",
    title: "Bluff City AC",
    tagline: "A complete HVAC brand built from scratch",
    description:
      "A speculative case study. We built an entire HVAC service brand for the Memphis market to demonstrate what happens when a commodity business is rebuilt at the system level.",
    image: "/images/work/bluff-city-ac/hero_thermostat.jpg",
    imageAlt: "Thermostat reading 85 degrees in a Memphis home",
    imagePosition: "center center",
    tags: ["Speculative Build", "HVAC", "Memphis"],
    score: null,
  },
];

export default function WorkPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden" aria-labelledby="work-hero-title">
        <div className="absolute inset-0">
          <Image
            src="/images/04-work-hero.jpg"
            alt="Cosmic Reach Creative featured projects"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
          <div className="max-w-2xl">
            <p className="text-copper font-display text-xs font-semibold tracking-widest uppercase mb-4">
              Case Studies
            </p>
            <h1 id="work-hero-title" className="font-display font-semibold text-3xl sm:text-4xl text-starlight mb-4 tracking-tight">
              Work that makes the difference visible.
            </h1>
            <p className="text-starlight/60 text-base leading-relaxed max-w-lg">
              A mix of real client rebuilds and strategic concept builds
              designed to show what clearer positioning actually changes.
            </p>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section className="bg-deep-space pb-20 sm:pb-28">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-10">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group block rounded-2xl border border-starlight/10 bg-navy/50 overflow-hidden transition-all duration-300 hover:border-copper/30 hover:shadow-lg"
              >
                <div className="grid sm:grid-cols-2">
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{ objectPosition: project.imagePosition, zIndex: 1 }}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-space/40 hidden sm:block" style={{ zIndex: 2 }} />
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-display font-semibold uppercase tracking-widest text-copper/70 bg-copper/8 px-2.5 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-display font-semibold text-xl sm:text-2xl text-starlight mb-2 tracking-tight">
                      {project.title}
                    </h2>
                    <p className="text-copper text-sm font-display font-medium mb-3">
                      {project.tagline}
                    </p>
                    <p className="text-starlight/60 text-sm leading-relaxed mb-5">
                      {project.description}
                    </p>

                    {project.score && (
                      <div className="flex items-center gap-3 mb-5">
                        <div className="text-center">
                          <div className="text-lg font-display font-bold text-red-400">
                            {project.score.before}
                          </div>
                          <div className="text-[10px] text-starlight/30 uppercase tracking-wider">
                            Before
                          </div>
                        </div>
                        <span className="text-starlight/20">&rarr;</span>
                        <div className="text-center">
                          <div className="text-lg font-display font-bold text-green-400">
                            {project.score.after}
                          </div>
                          <div className="text-[10px] text-starlight/30 uppercase tracking-wider">
                            After
                          </div>
                        </div>
                        <span className="text-[10px] text-starlight/25 font-display uppercase tracking-wider ml-2">
                          System Momentum Score
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-copper text-sm font-display font-semibold group-hover:gap-3 transition-all">
                      View project
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 text-center">
          <div className="max-w-lg mx-auto">
            <h2 className="font-display font-semibold text-xl sm:text-2xl text-starlight mb-3">
              Your system has the same gap.
            </h2>
            <p className="text-starlight/50 text-sm mb-6">
              The Clarity Audit scores your business across four layers and
              shows you exactly where momentum is breaking down.
            </p>
            <Link
              href="/book/signal-check"
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] px-8 py-3
                font-display font-semibold text-base
                bg-copper text-deep-space hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-[var(--duration-base)] ease-[var(--ease-out)]"
            >
              Book a Signal Check
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
