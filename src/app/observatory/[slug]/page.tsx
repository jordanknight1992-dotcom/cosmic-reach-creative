import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { siteConfig } from "@/config/site";
import { getPostBySlug, getAllPublishedSlugs } from "@/lib/blog-db";
import { ArticleSchema } from "@/components/schema/ArticleSchema";

export const dynamic = "force-dynamic";
import { SubscribeForm } from "@/components/SubscribeForm";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Not Found" };
  }

  const canonical =
    post.canonical_url || `${siteConfig.domain}/observatory/${post.slug}`;
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || "";
  const ogTitle = post.og_title || post.title;
  const ogDescription = post.og_description || post.excerpt || "";
  const ogImage =
    post.og_image_override ||
    `${siteConfig.domain}/api/og/observatory?title=${encodeURIComponent(post.title)}${post.category ? `&category=${encodeURIComponent(post.category)}` : ""}`;

  return {
    title: `${title} | Cosmic Reach Creative`,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: [{ url: ogImage }],
    },
    ...(post.noindex && { robots: { index: false } }),
  };
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs();
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

export default async function ObservatoryArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlBody = marked.parse(post.body) as string;

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteConfig.domain,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "The Observatory",
                item: `${siteConfig.domain}/observatory`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `${siteConfig.domain}/observatory/${post.slug}`,
              },
            ],
          }),
        }}
      />

      <ArticleSchema
        headline={post.title}
        description={post.excerpt || ""}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        image={
          post.feature_image ||
          `${siteConfig.domain}/api/og/observatory?title=${encodeURIComponent(post.title)}`
        }
      />

      {/* Feature Image Hero */}
      {post.feature_image && (
        <section className="relative overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0">
            <Image
              src={post.feature_image}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
          </div>
          <div className="relative pt-28 sm:pt-36 pb-16 sm:pb-24" />
        </section>
      )}

      {/* Article Header */}
      <section
        className={`${post.feature_image ? "" : "pt-28 sm:pt-36"} pb-8`}
        aria-labelledby="article-title"
      >
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-[680px] mx-auto">
            <div className="flex items-center gap-3 text-xs mb-4">
              {post.category && (
                <span className="text-copper uppercase tracking-wider font-semibold">
                  {post.category}
                </span>
              )}
            </div>
            <h1
              id="article-title"
              className="font-display text-3xl sm:text-4xl font-semibold text-starlight mb-4"
            >
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-starlight/40">
              <span>{post.author}</span>
              {post.published_at && (
                <span>{formatDate(post.published_at)}</span>
              )}
              {post.reading_time_minutes && (
                <span>{post.reading_time_minutes} min read</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section aria-label="Article content">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div
            className="observatory-prose max-w-[680px] mx-auto"
            dangerouslySetInnerHTML={{ __html: htmlBody }}
          />
        </div>
      </section>

      {/* Tags */}
      {post.tags.length > 0 && (
        <section className="pt-10 pb-6" aria-label="Article tags">
          <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
            <div className="max-w-[680px] mx-auto flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-starlight/10 bg-navy/50 px-3 py-1 text-xs text-starlight/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe CTA */}
      <section className="py-12 sm:py-16" aria-labelledby="article-subscribe">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="bg-navy rounded-2xl border border-starlight/10 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <h2
              id="article-subscribe"
              className="font-display text-2xl font-semibold text-starlight mb-3"
            >
              Stay in the loop.
            </h2>
            <p className="text-starlight/60 text-base mb-6">
              Get new essays, breakdowns, and sharp signal from Cosmic Reach.
            </p>
            <div className="max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="pb-16 sm:pb-24" aria-label="Navigation">
        <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
          <div className="max-w-[680px] mx-auto">
            <Link
              href="/observatory"
              className="text-copper font-display font-semibold text-sm hover:text-copper/80 transition-colors"
            >
              &larr; Back to The Observatory
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
