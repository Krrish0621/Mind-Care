import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatRequest {
  message: string
  sessionId: string
}

interface SessionState {
  sessionId: string
  context: string | null
  testType: "PHQ-9" | "GAD-7" | null
  testAnswers: number[]
  questionIndex: number
  lastBotMessage: string
}

// In-memory chat storage
const chatMessages: Array<{
  sessionId: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}> = []

const sessionStates: SessionState[] = []

const PHQ9_QUESTIONS = [
  "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
  "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
  "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
  "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
  "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
  "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure or have let yourself or your family down?",
  "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
  "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
  "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?",
]

const GAD7_QUESTIONS = [
  "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
  "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
  "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
  "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
  "Over the last 2 weeks, how often have you been bothered by being so restless that it is hard to sit still?",
  "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
  "Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?",
]

function scorePHQ9(answers: number[]) {
  const total = answers.reduce((sum, answer) => sum + answer, 0)
  let severity = ""
  let recommendation = ""

  if (total <= 4) {
    severity = "Minimal depression"
    recommendation = "You seem okay, but check in with yourself regularly."
  } else if (total <= 9) {
    severity = "Mild depression"
    recommendation = "Mild signs. Try self-care or speak with a peer."
  } else if (total <= 14) {
    severity = "Moderate depression"
    recommendation = "Consider talking to a counselor."
  } else if (total <= 19) {
    severity = "Moderately severe depression"
    recommendation = "Professional support is strongly advised."
  } else {
    severity = "Severe depression"
    recommendation = "Please seek immediate help from a mental health professional."
  }

  return { test: "PHQ-9", score: total, severity, recommendation }
}

function scoreGAD7(answers: number[]) {
  const total = answers.reduce((sum, answer) => sum + answer, 0)
  let severity = ""
  let recommendation = ""

  if (total <= 4) {
    severity = "Minimal anxiety"
    recommendation = "All good! But don't hesitate to talk when needed."
  } else if (total <= 9) {
    severity = "Mild anxiety"
    recommendation = "Try deep breathing, mindfulness, or journaling."
  } else if (total <= 14) {
    severity = "Moderate anxiety"
    recommendation = "Consider counseling if symptoms persist."
  } else {
    severity = "Severe anxiety"
    recommendation = "Please consult a mental health professional."
  }

  return { test: "GAD-7", score: total, severity, recommendation }
}

function getOrCreateSessionState(sessionId: string): SessionState {
  let state = sessionStates.find((s) => s.sessionId === sessionId)
  if (!state) {
    state = {
      sessionId,
      context: null,
      testType: null,
      testAnswers: [],
      questionIndex: 0,
      lastBotMessage: "",
    }
    sessionStates.push(state)
  }
  return state
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId }: ChatRequest = await request.json()

    const sessionState = getOrCreateSessionState(sessionId)

    let botResponse = ""

    if (message.toLowerCase().trim() === "yes") {
      if (sessionState.lastBotMessage.includes("Would you like to talk to someone?")) {
        botResponse = "Great! Let's begin. Can you tell me how you're feeling right now?"
        sessionState.context = "conversation_started"
      } else if (
        sessionState.lastBotMessage.includes("take an anxiety assessment") ||
        sessionState.lastBotMessage.includes("GAD-7")
      ) {
        botResponse =
          "Let's begin the GAD-7 screening. I'll ask you 7 questions. Please answer on a scale from 0 to 3 (0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day).\n\n" +
          GAD7_QUESTIONS[0]
        sessionState.testType = "GAD-7"
        sessionState.testAnswers = []
        sessionState.questionIndex = 0
      } else if (
        sessionState.lastBotMessage.includes("mental health assessment") ||
        sessionState.lastBotMessage.includes("PHQ-9")
      ) {
        botResponse =
          "Let's begin the PHQ-9 screening. I'll ask you 9 questions. Please answer on a scale from 0 to 3 (0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day).\n\n" +
          PHQ9_QUESTIONS[0]
        sessionState.testType = "PHQ-9"
        sessionState.testAnswers = []
        sessionState.questionIndex = 0
      } else if (sessionState.lastBotMessage.includes("book a counselor")) {
        botResponse =
          "I'd be happy to help you book a session! Please visit our booking page at /book to schedule an appointment with one of our qualified counselors. Is there anything else I can help you with today?"
      } else {
        botResponse = "I'm here to support you. What would you like to talk about today?"
      }
    } else if (sessionState.testType && /^[0-3]$/.test(message.trim())) {
      const answer = Number.parseInt(message.trim())
      sessionState.testAnswers.push(answer)
      sessionState.questionIndex++

      if (sessionState.testType === "PHQ-9" && sessionState.questionIndex < PHQ9_QUESTIONS.length) {
        botResponse = `Thank you. Question ${sessionState.questionIndex + 1} of 9:\n\n${PHQ9_QUESTIONS[sessionState.questionIndex]}`
      } else if (sessionState.testType === "GAD-7" && sessionState.questionIndex < GAD7_QUESTIONS.length) {
        botResponse = `Thank you. Question ${sessionState.questionIndex + 1} of 7:\n\n${GAD7_QUESTIONS[sessionState.questionIndex]}`
      } else {
        // Test completed
        let result
        if (sessionState.testType === "PHQ-9") {
          result = scorePHQ9(sessionState.testAnswers)
        } else {
          result = scoreGAD7(sessionState.testAnswers)
        }

        botResponse = `Thank you for completing the ${result.test} assessment. Here are your results:\n\n`
        botResponse += `Score: ${result.score}\n`
        botResponse += `Severity: ${result.severity}\n`
        botResponse += `Recommendation: ${result.recommendation}\n\n`

        if (result.score >= 10) {
          botResponse += "Would you like me to help you book a counselor now? I'm here to support you through this."
        } else {
          botResponse += "Remember, I'm here to support you. You're not alone in this journey."
        }

        // Reset test state
        sessionState.testType = null
        sessionState.testAnswers = []
        sessionState.questionIndex = 0
      }
    } else {
      botResponse = "I understand how you're feeling. That takes courage to share. "

      if (message.toLowerCase().includes("anxious") || message.toLowerCase().includes("anxiety")) {
        botResponse +=
          "Anxiety can be really challenging. Let me guide you through some breathing exercises: Take a deep breath in for 4 counts, hold for 4, then exhale for 6. Repeat this 5 times. Would you like to take an anxiety assessment (GAD-7) to better understand your symptoms?"
      } else if (message.toLowerCase().includes("sleep") || message.toLowerCase().includes("tired")) {
        botResponse +=
          "Sleep difficulties can really impact how we feel. Here are some tips: Keep a consistent sleep schedule, avoid screens 1 hour before bed, and create a relaxing bedtime routine. You can also check our sleep resources at /resources. Would you like more personalized sleep guidance?"
      } else if (message.toLowerCase().includes("overwhelmed") || message.toLowerCase().includes("stress")) {
        botResponse +=
          "Feeling overwhelmed is more common than you might think. Try breaking tasks into smaller, manageable pieces. Practice the 5-4-3-2-1 grounding technique: Notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste."
      } else if (
        message.toLowerCase().includes("depressed") ||
        message.toLowerCase().includes("sad") ||
        message.toLowerCase().includes("down")
      ) {
        botResponse +=
          "I hear you, and I want you to know that you're not alone. Depression can feel overwhelming, but there is hope and help available. Would you like to take a depression screening (PHQ-9) to help us understand how you're feeling?"
      } else {
        botResponse +=
          "Thank you for sharing that with me. I'm here to listen and support you. Would you like to explore this further, take a mental health assessment, or would you prefer to book a session with one of our counselors?"
      }
    }

    sessionState.lastBotMessage = botResponse

    const userMessage = {
      sessionId,
      content: message,
      sender: "user" as const,
      timestamp: new Date(),
    }

    const botMessage = {
      sessionId,
      content: botResponse,
      sender: "bot" as const,
      timestamp: new Date(),
    }

    chatMessages.push(userMessage, botMessage)

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
      sessionId,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
