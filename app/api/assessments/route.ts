import { type NextRequest, NextResponse } from "next/server"

interface AssessmentResult {
  userToken: string
  tool: "PHQ-9" | "GAD-7"
  responses: number[]
  score: number
  severity: string
  timestamp: Date
}

// In-memory assessment storage
const assessmentResults: AssessmentResult[] = []

export async function POST(request: NextRequest) {
  try {
    const { userToken, tool, responses }: Omit<AssessmentResult, "score" | "severity" | "timestamp"> =
      await request.json()

    const score = responses.reduce((sum, response) => sum + response, 0)
    let severity = ""

    if (tool === "PHQ-9") {
      if (score <= 4) severity = "Minimal"
      else if (score <= 9) severity = "Mild"
      else if (score <= 14) severity = "Moderate"
      else if (score <= 19) severity = "Moderately Severe"
      else severity = "Severe"
    } else if (tool === "GAD-7") {
      if (score <= 4) severity = "Minimal"
      else if (score <= 9) severity = "Mild"
      else if (score <= 14) severity = "Moderate"
      else severity = "Severe"
    }

    const assessmentResult: AssessmentResult = {
      userToken,
      tool,
      responses,
      score,
      severity,
      timestamp: new Date(),
    }

    assessmentResults.push(assessmentResult)

    const recommendations = []
    if (tool === "PHQ-9" && score >= 10) {
      recommendations.push("Consider booking a session with one of our counselors")
      recommendations.push("Explore our depression resources and coping strategies")
    }
    if (tool === "GAD-7" && score >= 10) {
      recommendations.push("Try our guided breathing exercises")
      recommendations.push("Consider professional support for anxiety management")
    }

    return NextResponse.json({
      score,
      severity,
      recommendations,
      message: `Assessment completed. Your ${tool} score indicates ${severity.toLowerCase()} symptoms.`,
    })
  } catch (error) {
    console.error("Assessment API error:", error)
    return NextResponse.json({ error: "Failed to process assessment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userToken = searchParams.get("userToken")

    if (!userToken) {
      return NextResponse.json({ error: "User token required" }, { status: 400 })
    }

    const history = assessmentResults
      .filter((result) => result.userToken === userToken)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Assessment history API error:", error)
    return NextResponse.json({ error: "Failed to fetch assessment history" }, { status: 500 })
  }
}
