import type { Metadata } from "next";
import { SITE } from "./constants";

export function createMetadata({
  title,
  description,
  path = "",
  heroImage,
}: {
  title: string;
  description: string;
  path?: string;
  heroImage?: string;
}): Metadata {
  const url = `${SITE.url}${path}`;
  const ogImage = heroImage || "/images/hero/home.jpg";

  return {
    title,
    description,
    metadataBase: new URL(SITE.url),
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}
