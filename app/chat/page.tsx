"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Send, Bot, User, Heart, Moon, Zap, ClipboardList, Loader2 } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

interface Assessment {
  id: string
  name: string
  questions: string[]
  currentQuestion: number
  responses: number[]
  isActive: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm here to support you today. How are you feeling right now? You can share what's on your mind or use one of the quick options below.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [userToken, setUserToken] = useState<string>("")
  const [sessionId, setSessionId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("userToken") || `anon_${Math.random().toString(36).substr(2, 9)}`
    const session = localStorage.getItem("sessionId") || `session_${Date.now()}`

    localStorage.setItem("userToken", token)
    localStorage.setItem("sessionId", session)

    setUserToken(token)
    setSessionId(session)
  }, [])

  const quickActions = [
    { text: "I feel anxious", icon: Zap, color: "bg-primary/10 text-primary hover:bg-primary hover:text-white" },
    { text: "I can't sleep", icon: Moon, color: "bg-accent/10 text-accent hover:bg-accent hover:text-white" },
    {
      text: "I'm overwhelmed",
      icon: Heart,
      color: "bg-accent/10 text-accent hover:bg-accent hover:text-white",
    },
  ]

  const assessments = {
    phq9: {
      name: "PHQ-9 Depression Assessment",
      questions: [
        "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
        "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
        "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
        "Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure or have let yourself or your family down?",
        "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things, such as reading the newspaper or watching television?",
        "Over the last 2 weeks, how often have you been bothered by moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
        "Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead, or of hurting yourself?",
      ],
    },
    gad7: {
      name: "GAD-7 Anxiety Assessment",
      questions: [
        "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
        "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
        "Over the last 2 weeks, how often have you been bothered by worrying too much about different things?",
        "Over the last 2 weeks, how often have you been bothered by trouble relaxing?",
        "Over the last 2 weeks, how often have you been bothered by being so restless that it's hard to sit still?",
        "Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?",
        "Over the last 2 weeks, how often have you been bothered by feeling afraid, as if something awful might happen?",
      ],
    },
  }

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          sessionId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date(data.timestamp),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("[v0] Chat API error:", error)
      toast({
        title: "Connection Error",
        description: "Unable to connect to the chat service. Please try again.",
        variant: "destructive",
      })

      // Fallback to local response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }

    setInputValue("")
  }

  const handleQuickAction = (action: string) => {
    sendMessage(action)
  }

  const startAssessment = (type: "phq9" | "gad7") => {
    const assessmentData = assessments[type]
    setAssessment({
      id: type,
      name: assessmentData.name,
      questions: assessmentData.questions,
      currentQuestion: 0,
      responses: [],
      isActive: true,
    })

    const botMessage: Message = {
      id: Date.now().toString(),
      content: `I'll guide you through the ${assessmentData.name}. This will help us better understand how you've been feeling. Please answer each question honestly - there are no right or wrong answers.`,
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
  }

  const handleAssessmentResponse = async (score: number) => {
    if (!assessment) return

    const newResponses = [...assessment.responses, score]
    const nextQuestion = assessment.currentQuestion + 1

    if (nextQuestion < assessment.questions.length) {
      setAssessment({
        ...assessment,
        currentQuestion: nextQuestion,
        responses: newResponses,
      })
    } else {
      // Assessment complete - send to API
      setIsLoading(true)

      try {
        const response = await fetch("/api/assessments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userToken,
            tool: assessment.id === "phq9" ? "PHQ-9" : "GAD-7",
            responses: newResponses,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to save assessment")
        }

        const data = await response.json()

        const botMessage: Message = {
          id: Date.now().toString(),
          content: `${data.message} ${data.recommendations?.length > 0 ? "\n\nRecommendations:\n• " + data.recommendations.join("\n• ") : ""}\n\nRemember, this is just a screening tool and not a diagnosis. Would you like me to help you find resources or book an appointment with a counselor?`,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])

        toast({
          title: "Assessment Complete",
          description: `Your ${assessment.name} has been completed and saved securely.`,
        })
      } catch (error) {
        console.error("[v0] Assessment API error:", error)
        toast({
          title: "Save Error",
          description: "Assessment completed but couldn't be saved. Your responses are still valid.",
          variant: "destructive",
        })

        // Fallback to local scoring
        const totalScore = newResponses.reduce((sum, score) => sum + score, 0)
        let interpretation = ""

        if (assessment.id === "phq9") {
          if (totalScore <= 4) interpretation = "minimal depression symptoms"
          else if (totalScore <= 9) interpretation = "mild depression symptoms"
          else if (totalScore <= 14) interpretation = "moderate depression symptoms"
          else interpretation = "moderately severe to severe depression symptoms"
        } else {
          if (totalScore <= 4) interpretation = "minimal anxiety symptoms"
          else if (totalScore <= 9) interpretation = "mild anxiety symptoms"
          else if (totalScore <= 14) interpretation = "moderate anxiety symptoms"
          else interpretation = "severe anxiety symptoms"
        }

        const botMessage: Message = {
          id: Date.now().toString(),
          content: `Thank you for completing the assessment. Based on your responses, the results suggest ${interpretation}. Remember, this is just a screening tool and not a diagnosis. I recommend discussing these results with a mental health professional. Would you like me to help you find resources or book an appointment with a counselor?`,
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
      } finally {
        setIsLoading(false)
      }

      setAssessment(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex flex-col">
      <Navigation />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 animate-fade-in-up">AI Support Chat</h1>
          <p className="text-lg text-muted-foreground animate-fade-in-delayed">
            Chat with our compassionate AI assistant for immediate mental health support
          </p>
        </div>

        <Card className="flex-1 flex flex-col glassmorphism border-0 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-white/20 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                  <Bot className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-primary">MindCare AI Assistant</CardTitle>
                <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-0">
                  {isLoading ? "Thinking..." : "Online"} • Confidential & Secure
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 bg-white/30">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback
                          className={
                            message.sender === "user"
                              ? "bg-gradient-to-br from-secondary to-secondary/80 text-white"
                              : "bg-gradient-to-br from-primary to-primary/80 text-white"
                          }
                        >
                          {message.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`rounded-2xl p-4 shadow-lg ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-primary to-primary/90 text-white"
                            : "bg-white/80 backdrop-blur border border-white/20"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                          <Bot className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-2xl p-4 bg-white/80 backdrop-blur border border-white/20 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">Thinking...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {assessment && assessment.isActive && (
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6 border border-white/20 shadow-lg backdrop-blur">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground text-lg">{assessment.name}</h3>
                        <span className="text-sm text-muted-foreground bg-white/50 px-3 py-1 rounded-full">
                          {assessment.currentQuestion + 1} of {assessment.questions.length}
                        </span>
                      </div>
                      <Progress
                        value={(assessment.currentQuestion / assessment.questions.length) * 100}
                        className="h-3 bg-white/30"
                      />
                    </div>

                    <p className="text-foreground mb-6 leading-relaxed">
                      {assessment.questions[assessment.currentQuestion]}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["Not at all (0)", "Several days (1)", "More than half (2)", "Nearly every day (3)"].map(
                        (option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="lg"
                            onClick={() => handleAssessmentResponse(index)}
                            className="text-sm h-auto py-3 px-4 bg-white/50 border-white/30 hover:bg-primary hover:text-white hover:border-primary rounded-xl button-hover"
                            disabled={isLoading}
                          >
                            {option}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {!assessment?.isActive && (
              <div className="p-6 border-t border-white/20 bg-white/20 backdrop-blur">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Quick actions to get started:</p>
                  <div className="flex flex-wrap gap-3">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickAction(action.text)}
                          className={`text-sm rounded-xl button-hover bg-white/50 border-white/30 ${action.color}`}
                          disabled={isLoading}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {action.text}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startAssessment("phq9")}
                      className="text-sm rounded-xl button-hover bg-white/50 border-white/30 hover:bg-primary hover:text-white"
                      disabled={isLoading}
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      PHQ-9 Assessment
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startAssessment("gad7")}
                      className="text-sm rounded-xl button-hover bg-white/50 border-white/30 hover:bg-accent hover:text-white"
                      disabled={isLoading}
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      GAD-7 Assessment
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Share what's on your mind..."
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && inputValue.trim() && !isLoading) {
                        sendMessage(inputValue.trim())
                      }
                    }}
                    className="flex-1 rounded-xl border-white/30 bg-white/50 backdrop-blur focus:bg-white/70 focus:border-primary"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => inputValue.trim() && sendMessage(inputValue.trim())}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="rounded-xl button-hover bg-primary hover:bg-primary/90 px-4"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3 text-center leading-relaxed">
                  This AI assistant provides support but is not a replacement for professional mental health care. All
                  conversations are confidential and secure.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
