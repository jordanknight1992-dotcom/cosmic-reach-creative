import type { Metadata } from "next";
import { SITE } from "./constants";

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = path === "" ? title : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
