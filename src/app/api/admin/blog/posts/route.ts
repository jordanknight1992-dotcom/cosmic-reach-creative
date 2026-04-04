import { NextRequest, NextResponse } from "next/server";
import {
  listPosts,
  createPost,
  generateSlug,
  calculateReadingTime,
} from "@/lib/blog-db";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") ?? undefined;
    const posts = await listPosts({ status });
    return NextResponse.json(posts);
  } catch (err) {
    console.error("Failed to list posts:", err);
    return NextResponse.json(
      { error: "Failed to list posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const slug = body.slug || generateSlug(body.title);
    const reading_time_minutes = body.body
      ? calculateReadingTime(body.body)
      : undefined;

    const post = await createPost({
      title: body.title,
      slug,
      body: body.body,
      excerpt: body.excerpt,
      feature_image: body.feature_image,
      category: body.category,
      tags: body.tags,
      author: body.author,
      status: body.status,
      featured: body.featured,
      published_at: body.published_at,
      seo_title: body.seo_title,
      seo_description: body.seo_description,
      canonical_url: body.canonical_url,
      og_title: body.og_title,
      og_description: body.og_description,
      og_image_override: body.og_image_override,
      reading_time_minutes,
      noindex: body.noindex,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error("Failed to create post:", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
