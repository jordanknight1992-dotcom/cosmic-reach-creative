import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = siteConfig.domain;

  const pages: {
    route: string;
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
  }[] = [
    { route: "/", changeFrequency: "weekly", priority: 1.0 },
    { route: "/how-it-works", changeFrequency: "monthly", priority: 0.9 },
    { route: "/services", changeFrequency: "monthly", priority: 0.8 },
    { route: "/pricing", changeFrequency: "monthly", priority: 0.9 },
    { route: "/framework", changeFrequency: "monthly", priority: 0.8 },
    { route: "/about", changeFrequency: "monthly", priority: 0.8 },
    { route: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { route: "/clarity-report-example", changeFrequency: "monthly", priority: 0.8 },
    { route: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { route: "/book/signal-check", changeFrequency: "monthly", priority: 0.8 },
    { route: "/book/clarity-session", changeFrequency: "monthly", priority: 0.8 },
    { route: "/connect", changeFrequency: "monthly", priority: 0.8 },
    { route: "/mission-control", changeFrequency: "monthly", priority: 0.8 },
    { route: "/work", changeFrequency: "weekly", priority: 0.8 },
    { route: "/work/la-cherie", changeFrequency: "monthly", priority: 0.8 },
    { route: "/work/bluff-city-ac", changeFrequency: "monthly", priority: 0.8 },
    { route: "/observatory", changeFrequency: "weekly", priority: 0.8 },
    { route: "/brand", changeFrequency: "monthly", priority: 0.6 },
    { route: "/help", changeFrequency: "monthly", priority: 0.5 },
    { route: "/help/setup-ga4", changeFrequency: "monthly", priority: 0.5 },
    { route: "/help/setup-search-console", changeFrequency: "monthly", priority: 0.5 },
    { route: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { route: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { route: "/accessibility", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${domain}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  /* Dynamic blog post entries */
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const { getAllPublishedSlugs } = await import("@/lib/blog-db");
    const posts = await getAllPublishedSlugs();
    blogEntries = posts.map((post) => ({
      url: `${domain}/observatory/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    /* Blog tables may not exist yet */
  }

  return [...staticEntries, ...blogEntries];
}
