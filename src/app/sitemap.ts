import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = siteConfig.domain;

  const pages: {
    route: string;
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
  }[] = [
    { route: "/", changeFrequency: "weekly", priority: 1.0 },
    { route: "/services", changeFrequency: "monthly", priority: 0.9 },
    { route: "/pricing", changeFrequency: "monthly", priority: 0.9 },
    { route: "/framework", changeFrequency: "monthly", priority: 0.8 },
    { route: "/about", changeFrequency: "monthly", priority: 0.7 },
    { route: "/faq", changeFrequency: "monthly", priority: 0.7 },
    { route: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { route: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { route: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { route: "/accessibility", changeFrequency: "yearly", priority: 0.3 },
  ];

  return pages.map((page) => ({
    url: `${domain}${page.route}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
