import { type NextRequest, NextResponse } from "next/server"

import { forumPosts, flags } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const flaggedPosts = flags
      .map((flag) => {
        const post = forumPosts.find((p) => p.post_id === flag.post_id)
        return {
          id: flag.id,
          type: "Forum Post",
          content: post?.message || "Post not found",
          reporter: "Anonymous User",
          timestamp: flag.timestamp,
          status: "pending",
          postId: flag.post_id,
          reason: flag.reason,
        }
      })
      .slice(0, 20)

    return NextResponse.json({ reports: flaggedPosts })
  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { reportId, action, adminId } = await request.json()

    const flagIndex = flags.findIndex((flag) => flag.id === reportId)
    if (flagIndex !== -1) {
      flags[flagIndex] = {
        ...flags[flagIndex],
        status: action,
        resolvedBy: adminId,
        resolvedAt: new Date(),
      }
    }

    return NextResponse.json({
      success: true,
      message: `Report ${action} successfully`,
    })
  } catch (error) {
    console.error("Report action API error:", error)
    return NextResponse.json({ error: "Failed to process report action" }, { status: 500 })
  }
}
