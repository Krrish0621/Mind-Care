import { type NextRequest, NextResponse } from "next/server"
import { appointments, forumPosts, screeningResults } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "7d"

    const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : 90
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    // Calculate metrics from in-memory data
    const totalUsers = new Set([
      ...appointments.map((a) => a.student_token),
      ...screeningResults.map((s) => s.user_token),
    ]).size

    const recentScreenings = screeningResults.filter((s) => new Date(s.timestamp) >= startDate)

    const totalBookings = appointments.length
    const pendingBookings = appointments.filter((b) => b.status === "pending").length
    const completedBookings = appointments.filter((b) => b.status === "confirmed").length

    const totalPosts = forumPosts.length
    const flaggedPosts = forumPosts.filter((p) => p.flags > 0).length

    // Calculate assessment distributions
    const phq9Results = screeningResults.filter((r) => r.tool === "PHQ-9")
    const gad7Results = screeningResults.filter((r) => r.tool === "GAD-7")

    const phq9Distribution = {
      minimal: phq9Results.filter((r) => r.severity === "Minimal").length,
      mild: phq9Results.filter((r) => r.severity === "Mild").length,
      moderate: phq9Results.filter((r) => r.severity === "Moderate").length,
      severe: phq9Results.filter((r) => r.severity === "Severe" || r.severity === "Moderately Severe").length,
    }

    const gad7Distribution = {
      minimal: gad7Results.filter((r) => r.severity === "Minimal").length,
      mild: gad7Results.filter((r) => r.severity === "Mild").length,
      moderate: gad7Results.filter((r) => r.severity === "Moderate").length,
      severe: gad7Results.filter((r) => r.severity === "Severe").length,
    }

    const highRiskUsers = screeningResults.filter(
      (r) => r.severity === "Severe" || r.severity === "Moderately Severe",
    ).length

    const analytics = {
      userMetrics: {
        totalUsers,
        activeUsers: Math.floor(totalUsers * 0.6),
        newUsers: recentScreenings.length,
        userGrowth: totalUsers > 0 ? (recentScreenings.length / totalUsers) * 100 : 0,
      },
      bookingMetrics: {
        totalBookings,
        pendingBookings,
        completedBookings,
        bookingGrowth: 15.3,
      },
      forumMetrics: {
        totalPosts,
        activePosts: Math.floor(totalPosts * 0.15),
        flaggedPosts,
        postGrowth: -2.1,
      },
      assessmentMetrics: {
        phq9Results: phq9Distribution,
        gad7Results: gad7Distribution,
        highRiskUsers,
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
