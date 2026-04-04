import { sql } from "@vercel/postgres";
import crypto from "crypto";

/* ─── Interfaces ─── */

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  feature_image: string | null;
  category: string | null;
  tags: string[];
  author: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_override: string | null;
  reading_time_minutes: number | null;
  noindex: boolean;
  publish_email_sent: boolean;
  publish_email_sent_at: string | null;
  publish_email_message_id: string | null;
}

export interface BlogSubscriber {
  id: number;
  email: string;
  status: "active" | "unsubscribed";
  unsubscribe_token: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  body?: string;
  excerpt?: string;
  feature_image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  status?: "draft" | "published" | "archived";
  featured?: boolean;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image_override?: string;
  reading_time_minutes?: number;
  noindex?: boolean;
}

/* ─── Schema ─── */

export async function ensureBlogTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id                     SERIAL PRIMARY KEY,
      title                  TEXT NOT NULL,
      slug                   TEXT NOT NULL UNIQUE,
      body                   TEXT NOT NULL DEFAULT '',
      excerpt                TEXT,
      feature_image          TEXT,
      category               TEXT,
      tags                   TEXT[] DEFAULT '{}',
      author                 TEXT DEFAULT 'Jordan Knight',
      status                 TEXT DEFAULT 'draft',
      featured               BOOLEAN DEFAULT FALSE,
      published_at           TIMESTAMPTZ,
      created_at             TIMESTAMPTZ DEFAULT NOW(),
      updated_at             TIMESTAMPTZ DEFAULT NOW(),
      seo_title              TEXT,
      seo_description        TEXT,
      canonical_url          TEXT,
      og_title               TEXT,
      og_description         TEXT,
      og_image_override      TEXT,
      reading_time_minutes   INTEGER,
      noindex                BOOLEAN DEFAULT FALSE,
      publish_email_sent     BOOLEAN DEFAULT FALSE,
      publish_email_sent_at  TIMESTAMPTZ,
      publish_email_message_id TEXT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS blog_subscribers (
      id                SERIAL PRIMARY KEY,
      email             TEXT NOT NULL UNIQUE,
      status            TEXT DEFAULT 'active',
      unsubscribe_token TEXT NOT NULL UNIQUE,
      subscribed_at     TIMESTAMPTZ DEFAULT NOW(),
      unsubscribed_at   TIMESTAMPTZ
    )
  `;
}

/* ─── Helpers ─── */

export function calculateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 238));
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ─── Post Operations ─── */

export async function createPost(data: CreatePostInput): Promise<BlogPost> {
  await ensureBlogTables();
  const { rows } = await sql`
    INSERT INTO blog_posts (
      title, slug, body, excerpt, feature_image, category, tags,
      author, status, featured, published_at,
      seo_title, seo_description, canonical_url,
      og_title, og_description, og_image_override,
      reading_time_minutes, noindex
    ) VALUES (
      ${data.title},
      ${data.slug},
      ${data.body ?? ""},
      ${data.excerpt ?? null},
      ${data.feature_image ?? null},
      ${data.category ?? null},
      ${`{${(data.tags ?? []).map(t => `"${t.replace(/"/g, '\\"')}"`).join(",")}}`},
      ${data.author ?? "Jordan Knight"},
      ${data.status ?? "draft"},
      ${data.featured ?? false},
      ${data.published_at ?? null},
      ${data.seo_title ?? null},
      ${data.seo_description ?? null},
      ${data.canonical_url ?? null},
      ${data.og_title ?? null},
      ${data.og_description ?? null},
      ${data.og_image_override ?? null},
      ${data.reading_time_minutes ?? null},
      ${data.noindex ?? false}
    )
    RETURNING *
  `;
  return rows[0] as BlogPost;
}

export async function updatePost(
  id: number,
  data: Partial<CreatePostInput>
): Promise<BlogPost> {
  await ensureBlogTables();

  /* Build SET clauses dynamically for only the fields provided */
  const fields: string[] = [];
  const values: unknown[] = [];

  if (data.title !== undefined) { fields.push("title"); values.push(data.title); }
  if (data.slug !== undefined) { fields.push("slug"); values.push(data.slug); }
  if (data.body !== undefined) { fields.push("body"); values.push(data.body); }
  if (data.excerpt !== undefined) { fields.push("excerpt"); values.push(data.excerpt); }
  if (data.feature_image !== undefined) { fields.push("feature_image"); values.push(data.feature_image); }
  if (data.category !== undefined) { fields.push("category"); values.push(data.category); }
  if (data.tags !== undefined) { fields.push("tags"); values.push(`{${data.tags.map(t => `"${t.replace(/"/g, '\\"')}"`).join(",")}}`); }
  if (data.author !== undefined) { fields.push("author"); values.push(data.author); }
  if (data.status !== undefined) { fields.push("status"); values.push(data.status); }
  if (data.featured !== undefined) { fields.push("featured"); values.push(data.featured); }
  if (data.published_at !== undefined) { fields.push("published_at"); values.push(data.published_at); }
  if (data.seo_title !== undefined) { fields.push("seo_title"); values.push(data.seo_title); }
  if (data.seo_description !== undefined) { fields.push("seo_description"); values.push(data.seo_description); }
  if (data.canonical_url !== undefined) { fields.push("canonical_url"); values.push(data.canonical_url); }
  if (data.og_title !== undefined) { fields.push("og_title"); values.push(data.og_title); }
  if (data.og_description !== undefined) { fields.push("og_description"); values.push(data.og_description); }
  if (data.og_image_override !== undefined) { fields.push("og_image_override"); values.push(data.og_image_override); }
  if (data.reading_time_minutes !== undefined) { fields.push("reading_time_minutes"); values.push(data.reading_time_minutes); }
  if (data.noindex !== undefined) { fields.push("noindex"); values.push(data.noindex); }

  /* Fall back to a no-op update if no fields provided */
  if (fields.length === 0) {
    const { rows } = await sql`
      UPDATE blog_posts SET updated_at = NOW() WHERE id = ${id} RETURNING *
    `;
    return rows[0] as BlogPost;
  }

  /*
   * @vercel/postgres tagged templates don't support dynamic column names,
   * so we update each field individually then return the row.
   * This keeps us within the tagged-template pattern.
   */
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const value = values[i];
    switch (field) {
      case "title": await sql`UPDATE blog_posts SET title = ${value as string} WHERE id = ${id}`; break;
      case "slug": await sql`UPDATE blog_posts SET slug = ${value as string} WHERE id = ${id}`; break;
      case "body": await sql`UPDATE blog_posts SET body = ${value as string} WHERE id = ${id}`; break;
      case "excerpt": await sql`UPDATE blog_posts SET excerpt = ${value as string | null} WHERE id = ${id}`; break;
      case "feature_image": await sql`UPDATE blog_posts SET feature_image = ${value as string | null} WHERE id = ${id}`; break;
      case "category": await sql`UPDATE blog_posts SET category = ${value as string | null} WHERE id = ${id}`; break;
      case "tags": await sql`UPDATE blog_posts SET tags = ${value as string}::text[] WHERE id = ${id}`; break;
      case "author": await sql`UPDATE blog_posts SET author = ${value as string} WHERE id = ${id}`; break;
      case "status": await sql`UPDATE blog_posts SET status = ${value as string} WHERE id = ${id}`; break;
      case "featured": await sql`UPDATE blog_posts SET featured = ${value as boolean} WHERE id = ${id}`; break;
      case "published_at": await sql`UPDATE blog_posts SET published_at = ${value as string | null} WHERE id = ${id}`; break;
      case "seo_title": await sql`UPDATE blog_posts SET seo_title = ${value as string | null} WHERE id = ${id}`; break;
      case "seo_description": await sql`UPDATE blog_posts SET seo_description = ${value as string | null} WHERE id = ${id}`; break;
      case "canonical_url": await sql`UPDATE blog_posts SET canonical_url = ${value as string | null} WHERE id = ${id}`; break;
      case "og_title": await sql`UPDATE blog_posts SET og_title = ${value as string | null} WHERE id = ${id}`; break;
      case "og_description": await sql`UPDATE blog_posts SET og_description = ${value as string | null} WHERE id = ${id}`; break;
      case "og_image_override": await sql`UPDATE blog_posts SET og_image_override = ${value as string | null} WHERE id = ${id}`; break;
      case "reading_time_minutes": await sql`UPDATE blog_posts SET reading_time_minutes = ${value as number | null} WHERE id = ${id}`; break;
      case "noindex": await sql`UPDATE blog_posts SET noindex = ${value as boolean} WHERE id = ${id}`; break;
    }
  }

  const { rows } = await sql`
    UPDATE blog_posts SET updated_at = NOW() WHERE id = ${id} RETURNING *
  `;
  return rows[0] as BlogPost;
}

export async function getPostById(id: number): Promise<BlogPost | null> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT * FROM blog_posts WHERE id = ${id}
  `;
  return (rows[0] as BlogPost) ?? null;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT * FROM blog_posts WHERE slug = ${slug} AND status = 'published'
  `;
  return (rows[0] as BlogPost) ?? null;
}

export async function listPosts(opts: {
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<BlogPost[]> {
  await ensureBlogTables();
  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  if (opts.status) {
    const { rows } = await sql`
      SELECT * FROM blog_posts
      WHERE status = ${opts.status}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as BlogPost[];
  }

  const { rows } = await sql`
    SELECT * FROM blog_posts
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows as BlogPost[];
}

export async function listPublishedPosts(opts: {
  limit?: number;
  offset?: number;
  category?: string;
  tag?: string;
  featured?: boolean;
} = {}): Promise<BlogPost[]> {
  await ensureBlogTables();
  const limit = opts.limit ?? 20;
  const offset = opts.offset ?? 0;

  if (opts.category && opts.featured) {
    const { rows } = await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published'
        AND category = ${opts.category}
        AND featured = true
      ORDER BY published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as BlogPost[];
  }

  if (opts.tag && opts.featured) {
    const { rows } = await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published'
        AND ${opts.tag} = ANY(tags)
        AND featured = true
      ORDER BY published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as BlogPost[];
  }

  if (opts.category) {
    const { rows } = await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published' AND category = ${opts.category}
      ORDER BY published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as BlogPost[];
  }

  if (opts.tag) {
    const { rows } = await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published' AND ${opts.tag} = ANY(tags)
      ORDER BY published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as BlogPost[];
  }

  if (opts.featured) {
    const { rows } = await sql`
      SELECT * FROM blog_posts
      WHERE status = 'published' AND featured = true
      ORDER BY published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return rows as BlogPost[];
  }

  const { rows } = await sql`
    SELECT * FROM blog_posts
    WHERE status = 'published'
    ORDER BY published_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows as BlogPost[];
}

export async function getAllPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT slug, updated_at FROM blog_posts WHERE status = 'published'
    ORDER BY published_at DESC
  `;
  return rows as { slug: string; updated_at: string }[];
}

export async function getDistinctCategories(): Promise<string[]> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT DISTINCT category FROM blog_posts
    WHERE status = 'published' AND category IS NOT NULL
    ORDER BY category ASC
  `;
  return rows.map((r) => r.category as string);
}

export async function getDistinctTags(): Promise<string[]> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT DISTINCT unnest(tags) AS tag FROM blog_posts
    WHERE status = 'published'
    ORDER BY tag ASC
  `;
  return rows.map((r) => r.tag as string);
}

export async function deletePost(id: number): Promise<void> {
  await ensureBlogTables();
  await sql`DELETE FROM blog_posts WHERE id = ${id}`;
}

export async function markEmailSent(
  postId: number,
  messageId: string
): Promise<void> {
  await ensureBlogTables();
  await sql`
    UPDATE blog_posts
    SET publish_email_sent = true,
        publish_email_sent_at = NOW(),
        publish_email_message_id = ${messageId}
    WHERE id = ${postId}
  `;
}

/* ─── Subscriber Operations ─── */

export async function addSubscriber(
  email: string
): Promise<BlogSubscriber> {
  await ensureBlogTables();
  const token = crypto.randomUUID();
  const { rows } = await sql`
    INSERT INTO blog_subscribers (email, unsubscribe_token)
    VALUES (${email}, ${token})
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING *
  `;
  return rows[0] as BlogSubscriber;
}

export async function unsubscribeByToken(token: string): Promise<void> {
  await ensureBlogTables();
  await sql`
    UPDATE blog_subscribers
    SET status = 'unsubscribed', unsubscribed_at = NOW()
    WHERE unsubscribe_token = ${token}
  `;
}

export async function getActiveSubscribers(): Promise<BlogSubscriber[]> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT * FROM blog_subscribers WHERE status = 'active'
    ORDER BY subscribed_at DESC
  `;
  return rows as BlogSubscriber[];
}

export async function getSubscriberCount(): Promise<{
  active: number;
  total: number;
}> {
  await ensureBlogTables();
  const { rows } = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(CASE WHEN status = 'active' THEN 1 END)::int AS active
    FROM blog_subscribers
  `;
  return { active: rows[0].active as number, total: rows[0].total as number };
}
