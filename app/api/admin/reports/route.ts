import { type NextRequest, NextResponse } from "next/server"

// Dummy reports data for admin dashboard
const dummyReports = [
  {
    id: "report-001",
    type: "Forum Post",
    content: "Inappropriate content discussing self-harm methods in detail...",
    reporter: "Anonymous User",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: "pending",
    postId: "post-123",
    reason: "Self-harm content"
  },
  {
    id: "report-002", 
    type: "User Behavior",
    content: "User sending inappropriate private messages to multiple users...",
    reporter: "StudentCare47",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: "under-review",
    postId: "post-124",
    reason: "Harassment"
  },
  {
    id: "report-003",
    type: "Forum Post", 
    content: "Spam post promoting external counseling services with links...",
    reporter: "MindfulStudent",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: "resolved",
    postId: "post-125",
    reason: "Spam/Advertisement"
  },
  {
    id: "report-004",
    type: "Forum Post",
    content: "Post contains triggering content about eating disorders without proper warnings...",
    reporter: "CareHelper23",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: "pending",
    postId: "post-126", 
    reason: "Triggering content"
  },
  {
    id: "report-005",
    type: "User Profile",
    content: "User profile contains inappropriate images and offensive bio text...",
    reporter: "SafeSpace Admin",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: "resolved",
    postId: "post-127",
    reason: "Inappropriate content"
  },
  {
    id: "report-006",
    type: "Forum Post",
    content: "User sharing personal contact information and asking others to contact outside platform...",
    reporter: "Anonymous User", 
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: "under-review",
    postId: "post-128",
    reason: "Privacy violation"
  },
  {
    id: "report-007",
    type: "Forum Post",
    content: "Suspected misinformation about mental health medications and treatments...",
    reporter: "HealthAdvocate",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: "resolved",
    postId: "post-129", 
    reason: "Medical misinformation"
  },
  {
    id: "report-008",
    type: "User Behavior",
    content: "User creating multiple fake accounts to upvote their own posts...",
    reporter: "TrustModerator",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: "pending",
    postId: "post-130",
    reason: "Vote manipulation"
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ reports: dummyReports })
  } catch (error) {
    console.error("Reports API error:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { reportId, action, adminId } = await request.json()

    // Find and update the report status
    const reportIndex = dummyReports.findIndex(report => report.id === reportId)
    if (reportIndex !== -1) {
      dummyReports[reportIndex] = {
        ...dummyReports[reportIndex],
        status: action as "pending" | "resolved" | "under-review"
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
