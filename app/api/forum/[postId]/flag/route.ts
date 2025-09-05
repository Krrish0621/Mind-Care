import { type NextRequest, NextResponse } from "next/server"
import { forumPosts, flags, generateId } from "@/lib/data-store"

export async function PATCH(request: NextRequest, { params }: { params: { postId: string } }) {
  try {
    const { postId } = params
    const { reason } = await request.json()

    const post = forumPosts.find((p) => p.post_id === postId)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    post.flags += 1

    flags.push({
      id: generateId(),
      post_id: postId,
      reason,
      timestamp: new Date(),
      status: "pending",
    })

    return NextResponse.json({
      success: true,
      message: "Post flagged for review. Thank you for helping keep our community safe.",
    })
  } catch (error) {
    console.error("Flag API error:", error)
    return NextResponse.json({ error: "Failed to flag post" }, { status: 500 })
  }
}
