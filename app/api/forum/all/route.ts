import { type NextRequest, NextResponse } from "next/server"
import { forumPosts } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const sortedPosts = forumPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({ posts: sortedPosts })
  } catch (error) {
    console.error("Forum all posts API error:", error)
    return NextResponse.json({ error: "Failed to fetch all posts" }, { status: 500 })
  }
}
