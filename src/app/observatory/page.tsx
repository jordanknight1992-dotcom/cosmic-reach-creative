import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { listPublishedPosts } from "@/lib/blog-db";

export const dynamic = "force-dynamic";
import { BlogCard } from "@/components/BlogCard";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "The Observatory | Cosmic Reach Creative",
  description:
    "Sharp signal on marketing, positioning, systems, and what actually drives growth.",
  alternates: { canonical: `${siteConfig.domain}/observatory` },
  openGraph: {
    title: "The Observatory | Cosmic Reach Creative",
    description:
      "Sharp signal on marketing, positioning, systems, and what actually drives growth.",
    url: `${siteConfig.domain}/observatory`,
    images: [{ url: `${siteConfig.domain}/api/og/observatory` }],
  },
};

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export default async function ObservatoryPage() {
  const [featuredPosts, allPosts] = await Promise.all([
    listPublishedPosts({ featured: true, limit: 1 }),
    listPublishedPosts({ limit: 12 }),
  ]);

  const featuredPost = featuredPosts[0] ?? null;
  const latestPosts = featuredPost
    ? allPosts.filter((p) => p.id !== featuredPost.id)
    : allPosts;
  const hasPosts = featuredPost || latestPosts.length > 0;

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
            ],
          }),
        }}
      />

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="observatory-hero"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/02-framework-hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-space/85 via-deep-space/75 to-deep-space" />
        </div>
        <div className="relative mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-copper uppercase tracking-widest text-sm font-semibold mb-4">
              The Observatory
            </p>
            <h1
              id="observatory-hero"
              className="font-display text-4xl sm:text-5xl font-semibold text-starlight mb-4"
            >
              The Observatory
            </h1>
            <p className="text-starlight/70 text-base sm:text-lg">
              Sharp signal on marketing, positioning, systems, and what actually
              drives growth.
            </p>
          </div>
        </div>
      </section>

      {hasPosts ? (
        <>
          {/* Featured Article */}
          {featuredPost && (
            <section
              className="py-12 sm:py-16"
              aria-labelledby="featured-article"
            >
              <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
                <Link
                  href={`/observatory/${featuredPost.slug}`}
                  className="group block rounded-2xl border border-starlight/5 bg-navy/30 overflow-hidden transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-starlight/15"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    {featuredPost.feature_image && (
                      <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] overflow-hidden">
                        <Image
                          src={featuredPost.feature_image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                        />
                      </div>
                    )}
                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs mb-4">
                        {featuredPost.category && (
                          <span className="text-copper uppercase tracking-wider font-semibold">
                            {featuredPost.category}
                          </span>
                        )}
                        {featuredPost.published_at && (
                          <span className="text-starlight/40">
                            {formatDate(featuredPost.published_at)}
                          </span>
                        )}
                        {featuredPost.reading_time_minutes && (
                          <span className="text-starlight/40">
                            {featuredPost.reading_time_minutes} min read
                          </span>
                        )}
                      </div>
                      <h2
                        id="featured-article"
                        className="font-display font-semibold text-2xl sm:text-3xl text-starlight mb-4 group-hover:text-copper transition-colors"
                      >
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="text-starlight/60 text-base mb-6 line-clamp-4">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <span className="text-copper font-display font-semibold text-sm">
                        Read article &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Latest Articles Grid */}
          {latestPosts.length > 0 && (
            <section className="pb-16 sm:pb-24" aria-labelledby="latest-posts">
              <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
                <h2
                  id="latest-posts"
                  className="font-display text-2xl font-semibold text-starlight mb-8"
                >
                  Latest
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* Empty State */
        <section className="py-16 sm:py-24" aria-label="Coming soon">
          <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8 text-center">
            <p className="text-starlight/60 text-lg mb-8">
              The first transmission is coming soon.
            </p>
            <div className="max-w-md mx-auto">
              <SubscribeForm />
            </div>
          </div>
        </section>
      )}

      {/* Subscribe Section */}
      {hasPosts && (
        <section className="pb-16 sm:pb-24" aria-labelledby="subscribe-cta">
          <div className="mx-auto max-w-[var(--container-max)] px-5 sm:px-6 lg:px-8">
            <div className="bg-navy rounded-2xl border border-starlight/10 p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <h2
                id="subscribe-cta"
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
      )}
    </main>
  );
}
