import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/approach",
    "/work",
    "/work/milestone",
    "/work/clear-enough",
    "/labs",
    "/about",
    "/signal-session",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/signal-session" ? 0.9 : 0.7,
  }));
}
