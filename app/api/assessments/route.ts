import { type NextRequest, NextResponse } from "next/server"

interface AssessmentResult {
  userToken: string
  tool: "PHQ-9" | "GAD-7"
  responses: number[]
  score: number
  severity: string
  recommendations: string[]
  timestamp: Date
}

// In-memory assessment storage (replace with DB in production)
const assessmentResults: AssessmentResult[] = []

// Helper: calculate severity
function calculateSeverity(tool: "PHQ-9" | "GAD-7", score: number): string {
  if (tool === "PHQ-9") {
    if (score <= 4) return "Minimal"
    if (score <= 9) return "Mild"
    if (score <= 14) return "Moderate"
    if (score <= 19) return "Moderately Severe"
    return "Severe"
  } else {
    if (score <= 4) return "Minimal"
    if (score <= 9) return "Mild"
    if (score <= 14) return "Moderate"
    return "Severe"
  }
}

// Helper: recommendations
function getRecommendations(tool: "PHQ-9" | "GAD-7", score: number): string[] {
  const recs: string[] = []

  if (tool === "PHQ-9") {
    if (score >= 10) {
      recs.push("Consider booking a session with one of our counselors")
      recs.push("Explore our depression resources and coping strategies")
    } else {
      recs.push("Practice daily self-care and track your mood")
    }
  }

  if (tool === "GAD-7") {
    if (score >= 10) {
      recs.push("Try our guided breathing exercises")
      recs.push("Consider professional support for anxiety management")
    } else {
      recs.push("Use relaxation techniques such as mindfulness or meditation")
    }
  }

  return recs
}

export async function POST(request: NextRequest) {
  try {
    const {
      userToken,
      tool,
      responses,
    }: { userToken: string; tool: "PHQ-9" | "GAD-7"; responses: number[] } =
      await request.json()

    const score = responses.reduce((sum, r) => sum + r, 0)
    const severity = calculateSeverity(tool, score)
    const recommendations = getRecommendations(tool, score)

    const assessmentResult: AssessmentResult = {
      userToken,
      tool,
      responses,
      score,
      severity,
      recommendations,
      timestamp: new Date(),
    }

    assessmentResults.push(assessmentResult)

    return NextResponse.json({
      score,
      severity,
      recommendations,
      message: `Assessment completed. Your ${tool} score indicates ${severity} symptoms.`,
    })
  } catch (error) {
    console.error("Assessment API error:", error)
    return NextResponse.json(
      { error: "Failed to process assessment" },
      { status: 500 },
    )
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
    return NextResponse.json(
      { error: "Failed to fetch assessment history" },
      { status: 500 },
    )
  }
}
