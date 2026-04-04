import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-db";

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/observatory/${post.slug}`}
      className="group block rounded-xl border border-starlight/5 bg-navy/30 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] hover:border-starlight/15"
    >
      {post.feature_image && (
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl">
          <Image
            src={post.feature_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs mb-3">
          {post.category && (
            <span className="text-copper uppercase tracking-wider font-semibold">
              {post.category}
            </span>
          )}
          {post.published_at && (
            <span className="text-starlight/40">
              {formatDate(post.published_at)}
            </span>
          )}
          {post.reading_time_minutes && (
            <span className="text-starlight/40">
              {post.reading_time_minutes} min read
            </span>
          )}
        </div>
        <h3 className="font-display font-semibold text-lg text-starlight mb-2 group-hover:text-copper transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-starlight/60 text-sm line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
