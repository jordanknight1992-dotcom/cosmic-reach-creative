import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/mission-control/*/",
        "/next-steps",
        "/audit-intake",
        "/signal-check-confirmed",
        "/clarity-confirmed",
        "/clarity",
        "/clarity-session",
      ],
    },
    sitemap: `${siteConfig.domain}/sitemap.xml`,
  };
}
