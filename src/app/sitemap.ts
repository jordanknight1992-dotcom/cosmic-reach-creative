import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/work",
    "/work/milestone",
    "/approach",
    "/about",
    "/labs",
    "/clarity-session",
    "/contact",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/clarity-session" ? 0.9 : 0.7,
  }));
}
