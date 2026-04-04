interface ArticleSchemaProps {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  authorName?: string;
  authorUrl?: string;
  publisherName?: string;
  about?: {
    name: string;
    type?: string;
    industry?: string;
    addressLocality?: string;
    addressRegion?: string;
  };
}

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  image,
  authorName = "Jordan Knight",
  authorUrl = "https://cosmicreachcreative.com/about",
  publisherName = "Cosmic Reach Creative",
  about,
}: ArticleSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    ...(dateModified && { dateModified }),
    image,
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      url: "https://cosmicreachcreative.com",
      logo: "https://cosmicreachcreative.com/favicon/favicon.svg",
    },
  };

  if (about) {
    schema.about = {
      "@type": about.type || "LocalBusiness",
      name: about.name,
      ...(about.industry && { industry: about.industry }),
      ...(about.addressLocality && {
        address: {
          "@type": "PostalAddress",
          addressLocality: about.addressLocality,
          addressRegion: about.addressRegion,
        },
      }),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
