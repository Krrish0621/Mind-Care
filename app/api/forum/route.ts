import { type NextRequest, NextResponse } from "next/server"
import { forumPosts, addForumPost } from "@/lib/data-store"

export async function POST(request: NextRequest) {
  try {
    const { title, message } = await request.json()

    const post = addForumPost({
      title,
      message,
      author: `Anonymous User #${Math.floor(Math.random() * 1000)}`,
      category: "general",
    })

    return NextResponse.json({
      success: true,
      post,
      message: "Post created successfully!",
    })
  } catch (error) {
    console.error("Forum post API error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let filteredPosts = [...forumPosts]

    if (category && category !== "all") {
      filteredPosts = filteredPosts.filter((post) => post.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter(
        (post) => post.title.toLowerCase().includes(searchLower) || post.message.toLowerCase().includes(searchLower),
      )
    }

    const sortedPosts = filteredPosts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20)

    return NextResponse.json({ posts: sortedPosts })
  } catch (error) {
    console.error("Forum fetch API error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
