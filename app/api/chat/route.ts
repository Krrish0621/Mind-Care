// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      )
    }

    // Ensure system prompt is always at the start
    const systemPrompt = {
      role: "system",
      content:
        "You are a compassionate mental health assistant for students. Provide relaxation techniques, breathing exercises, and coping strategies for stress, anxiety, depression, and sleeplessness,also use emojis in chat. When users express being anxious, overwhelmed, or unable to sleep, respond with empathetic, detailed, and supportive guidance.If the prompt is in english use english, if in hinglish use hinglish if in kashmiri use kashmiri, or other langauge give in that language only.\n\nIMPORTANT: If the user requests a breathing exercise or you suggest one and they agree, you MUST first respond with a brief confirmation (like 'Okay, let's begin.') and then, on a NEW LINE, respond with the special command: [START_BREATHING_EXERCISE]. This command will launch the interactive tool. Do not say anything else after the command.",
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "MindCare App",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [systemPrompt, ...messages],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("OpenRouter API error:", data)
      return NextResponse.json(
        { error: data?.error?.message || "OpenRouter API Error" },
        { status: response.status }
      )
    }

    const botReply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response."

    return NextResponse.json({
      response: botReply,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}