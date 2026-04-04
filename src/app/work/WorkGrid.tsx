"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Project = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  tags: string[];
  location: string;
  industry: string;
  type: "client" | "speculative";
  score: { before: number; after: number } | null;
};

const projects: Project[] = [
  {
    slug: "la-cherie",
    title: "La Ch\u00e9rie Weddings",
    tagline: "From beautiful work to a system that shows it",
    description:
      "A luxury wedding planner in Memphis already booked through word of mouth. We rebuilt the brand, the site, and the infrastructure so the website converts on its own.",
    image: "/images/work/image-asset-11.jpeg",
    imageAlt: "The founder of La Ch\u00e9rie Weddings",
    imagePosition: "center 35%",
    tags: ["Brand System", "Website Rebuild"],
    location: "Memphis",
    industry: "Weddings",
    type: "client",
    score: { before: 1.6, after: 7.0 },
  },
  {
    slug: "bluff-city-ac",
    title: "Bluff City AC",
    tagline: "A complete HVAC brand built from scratch",
    description:
      "We built an entire HVAC service brand for the Memphis market to demonstrate what happens when a commodity business is rebuilt at the system level.",
    image: "/images/work/bluff-city-ac/hero_thermostat.jpg",
    imageAlt: "Thermostat reading 85 degrees in a Memphis home",
    imagePosition: "center center",
    tags: ["Concept Build", "Full Brand System"],
    location: "Memphis",
    industry: "HVAC",
    type: "speculative",
    score: null,
  },
];

const locations = [...new Set(projects.map((p) => p.location))];
const industries = [...new Set(projects.map((p) => p.industry))];

function ProjectCard({ project }: { project: Project }) {
  const isSpec = project.type === "speculative";
  const linkProps = isSpec
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={`/work/${project.slug}`}
      {...linkProps}
      className="group block rounded-2xl border border-starlight/10 bg-navy/50 overflow-hidden transition-all duration-300 hover:border-copper/30 hover:shadow-lg"
    >
      <div className="grid sm:grid-cols-2">
        <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ objectPosition: project.imagePosition, zIndex: 1 }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent to-deep-space/40 hidden sm:block"
            style={{ zIndex: 2 }}
          />
        </div>

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
            <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-starlight/30 bg-starlight/5 px-2.5 py-1 rounded">
              {project.location}
            </span>
            <span className="text-[10px] font-display font-semibold uppercase tracking-widest text-starlight/30 bg-starlight/5 px-2.5 py-1 rounded">
              {project.industry}
            </span>
          </div>
          <h3 className="font-display font-semibold text-xl sm:text-2xl text-starlight mb-2 tracking-tight">
            {project.title}
          </h3>
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
            {isSpec ? "View concept build" : "View project"}
            {isSpec ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function WorkGrid() {
  const [location, setLocation] = useState("All");
  const [industry, setIndustry] = useState("All");

  const filtered = projects.filter((p) => {
    if (location !== "All" && p.location !== location) return false;
    if (industry !== "All" && p.industry !== industry) return false;
    return true;
  });

  const clientWork = filtered.filter((p) => p.type === "client");
  const specBuilds = filtered.filter((p) => p.type === "speculative");

  const buttonBase =
    "px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-wider rounded transition-all";
  const buttonActive = "bg-copper/20 text-copper border border-copper/30";
  const buttonInactive =
    "text-starlight/40 border border-starlight/10 hover:text-starlight/60 hover:border-starlight/20";

  return (
    <section className="bg-deep-space pb-20 sm:pb-28">
      <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-6 mb-10 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display uppercase tracking-widest text-starlight/30 mr-1">
              Location
            </span>
            <button
              onClick={() => setLocation("All")}
              className={`${buttonBase} ${location === "All" ? buttonActive : buttonInactive}`}
            >
              All
            </button>
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => setLocation(loc)}
                className={`${buttonBase} ${location === loc ? buttonActive : buttonInactive}`}
              >
                {loc}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-display uppercase tracking-widest text-starlight/30 mr-1">
              Industry
            </span>
            <button
              onClick={() => setIndustry("All")}
              className={`${buttonBase} ${industry === "All" ? buttonActive : buttonInactive}`}
            >
              All
            </button>
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`${buttonBase} ${industry === ind ? buttonActive : buttonInactive}`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Client Work */}
        {clientWork.length > 0 && (
          <div className="mb-14">
            <h2 className="font-display font-semibold text-lg text-starlight mb-1 tracking-tight">
              Client Work
            </h2>
            <p className="text-starlight/40 text-sm mb-6">
              Real engagements with real businesses.
            </p>
            <div className="grid gap-8">
              {clientWork.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Speculative Builds */}
        {specBuilds.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-lg text-starlight mb-1 tracking-tight">
              Speculative Builds
            </h2>
            <p className="text-starlight/40 text-sm mb-6">
              Concept brands built from scratch to prove the system.
            </p>
            <div className="grid gap-8">
              {specBuilds.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-starlight/40 text-sm text-center py-16">
            No projects match that filter. More case studies are on the way.
          </p>
        )}
      </div>
    </section>
  );
}
