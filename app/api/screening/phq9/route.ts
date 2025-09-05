import { type NextRequest, NextResponse } from "next/server"
import { addScreeningResult } from "@/lib/data-store"

export async function POST(request: NextRequest) {
  try {
    const { user_token, responses } = await request.json()

    if (!responses || responses.length !== 9) {
      return NextResponse.json({ error: "PHQ-9 requires exactly 9 responses" }, { status: 400 })
    }

    const score = responses.reduce((sum: number, response: number) => sum + response, 0)

    let severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe"
    if (score <= 4) severity = "Minimal"
    else if (score <= 9) severity = "Mild"
    else if (score <= 14) severity = "Moderate"
    else if (score <= 19) severity = "Moderately Severe"
    else severity = "Severe"

    const result = addScreeningResult({
      user_token,
      tool: "PHQ-9",
      responses,
      score,
      severity,
    })

    let message = `Your PHQ-9 score is ${score}, indicating ${severity.toLowerCase()} depression symptoms.`
    const recommendations = []

    if (score >= 10) {
      message += " We recommend speaking with a mental health professional."
      recommendations.push("Consider booking a session with one of our counselors")
      recommendations.push("Explore our depression resources and coping strategies")
    }

    return NextResponse.json({
      score,
      severity,
      message,
      recommendations,
      result,
    })
  } catch (error) {
    console.error("PHQ-9 API error:", error)
    return NextResponse.json({ error: "Failed to process PHQ-9 assessment" }, { status: 500 })
  }
}
