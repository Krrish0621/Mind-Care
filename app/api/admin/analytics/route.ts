import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d"

    // Comprehensive dummy data for admin dashboard
    const analytics = {
      userMetrics: {
        totalUsers: 847,
        activeUsers: 234,
        newUsers: 67,
        userGrowth: 12.4,
      },
      bookingMetrics: {
        totalBookings: 156,
        pendingBookings: 23,
        completedBookings: 118,
        bookingGrowth: 8.7,
      },
      forumMetrics: {
        totalPosts: 342,
        activePosts: 89,
        flaggedPosts: 7,
        postGrowth: 15.2,
      },
      assessmentMetrics: {
        phq9Results: {
          minimal: 45,  // Largest group - healthy users
          mild: 28,     // Second largest
          moderate: 18, // Smaller group
          severe: 9,    // Smallest group - needs attention
        },
        gad7Results: {
          minimal: 42,  // Largest group - healthy users
          mild: 31,     // Second largest
          moderate: 16, // Smaller group  
          severe: 11,   // Smallest group - needs attention
        },
        highRiskUsers: 13, // Combined severe cases that need immediate attention
      },
      systemHealth: {
        uptime: 99.8,
        responseTime: 245,
        errorRate: 0.2,
        databaseHealth: 98.5,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
