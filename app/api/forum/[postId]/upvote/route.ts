import { type NextRequest, NextResponse } from "next/server"
import { forumPosts } from "@/lib/data-store"

export async function PATCH(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params

    const post = forumPosts.find((p) => p.post_id === postId)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    post.upvotes += 1

    return NextResponse.json({
      success: true,
      message: "Post upvoted successfully!",
    })
  } catch (error) {
    console.error("Upvote API error:", error)
    return NextResponse.json({ error: "Failed to upvote post" }, { status: 500 })
  }
}
