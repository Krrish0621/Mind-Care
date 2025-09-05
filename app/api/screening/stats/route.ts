import { type NextRequest, NextResponse } from "next/server"
import { screeningResults } from "@/lib/data-store"

export async function GET(request: NextRequest) {
  try {
    const totalScreenings = screeningResults.length

    const severityCounts = {
      Minimal: 0,
      Mild: 0,
      Moderate: 0,
      "Moderately Severe": 0,
      Severe: 0,
    }

    screeningResults.forEach((result) => {
      severityCounts[result.severity]++
    })

    const phq9Results = screeningResults.filter((r) => r.tool === "PHQ-9")
    const gad7Results = screeningResults.filter((r) => r.tool === "GAD-7")

    return NextResponse.json({
      totalScreenings,
      severityCounts,
      byTool: {
        "PHQ-9": phq9Results.length,
        "GAD-7": gad7Results.length,
      },
      recentScreenings: screeningResults
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10),
    })
  } catch (error) {
    console.error("Screening stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch screening statistics" }, { status: 500 })
  }
}
