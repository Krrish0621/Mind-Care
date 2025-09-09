// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "MindCare App",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a compassionate mental health assistant for students. give breathing exercises, depression tips . give a little long tips when people are anxious overwhelmed or they can't sleep, give full tips" },
          { role: "user", content: message },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("OpenRouter API error:", data)
      return NextResponse.json({ error: "OpenRouter API Error" }, { status: 500 })
    }

    const botReply = data?.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response."

    return NextResponse.json({
      response: botReply,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
