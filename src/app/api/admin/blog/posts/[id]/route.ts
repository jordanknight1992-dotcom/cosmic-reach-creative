import { NextRequest, NextResponse } from "next/server";
import {
  getPostById,
  updatePost,
  deletePost,
  calculateReadingTime,
} from "@/lib/blog-db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await getPostById(Number(id));
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    console.error("Failed to get post:", err);
    return NextResponse.json(
      { error: "Failed to get post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = Number(id);
    const body = await req.json();

    if (body.body !== undefined) {
      body.reading_time_minutes = calculateReadingTime(body.body);
    }

    await updatePost(postId, body);
    const updated = await getPostById(postId);

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update post:", err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePost(Number(id));
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Failed to delete post:", err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
