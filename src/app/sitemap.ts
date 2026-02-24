import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = siteConfig.domain;

  const routes = [
    "/",
    "/about",
    "/services",
    "/framework",
    "/pricing",
    "/faq",
    "/contact",
    "/clarity",
    "/clarity-session",
    "/privacy",
    "/terms",
    "/accessibility",
  ];

  return routes.map((route) => ({
    url: `${domain}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
