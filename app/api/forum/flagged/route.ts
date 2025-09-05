import { type NextRequest, NextResponse } from "next/server"
import { forumPosts } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const flaggedPosts = forumPosts
      .filter((post) => post.flags >= 1)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ posts: flaggedPosts })
  } catch (error) {
    console.error("Flagged posts API error:", error)
    return NextResponse.json({ error: "Failed to fetch flagged posts" }, { status: 500 })
  }
}
