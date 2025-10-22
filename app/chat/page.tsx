// app/chat/page.tsx
"use client";

import { useState, useEffect, useRef } from "react"; // Added useRef
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Send, Bot, User, Heart, Moon, Zap, ClipboardList, Loader2,
  Calendar, Brain, Activity, Sparkles, Shield, Play,
  Mic, MicOff // Added Mic icons
} from "lucide-react";
import Link from "next/link";
import { useDarkMode } from "@/contexts/DarkModeContext";

// Make sure 'SpeechRecognition' is available on the window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "text" | "buttons" | "breathing_exercise"; // Added new type
}

interface Assessment {
  id: string;
  name: string;
  questions: string[];
  currentQuestion: number;
  responses: number[];
  isActive: boolean;
}

// +++ NEW: Add a prop type for our component +++
interface BreathingExerciseProps {
  onStop: () => void; // Function prop to call when stopped
}

// +++ UPDATED Breathing Exercise Component with Stop Logic +++
function BreathingExercise({ onStop }: BreathingExerciseProps) {
  const [text, setText] = useState("Get Ready...");
  const [scale, setScale] = useState(1);
  const { isDarkMode } = useDarkMode();
  // Use a ref to store all active timeout IDs
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // The main cycle
    const cycle = () => {
      setText("Inhale");
      setScale(1.5);
      const t1 = setTimeout(() => {
        setText("Hold");
        const t2 = setTimeout(() => {
          setText("Exhale");
          setScale(1);
          const t3 = setTimeout(cycle, 5000); // Recursive call to continue the loop
          timeoutsRef.current.push(t3);
        }, 2000); // Hold duration
        timeoutsRef.current.push(t2);
      }, 4000); // Inhale duration
      timeoutsRef.current.push(t1);
    };

    // Start the first cycle after a brief delay
    const startTimeout = setTimeout(cycle, 1500);
    timeoutsRef.current.push(startTimeout);

    // The cleanup function: This runs when the component is unmounted OR before the effect runs again
    // Crucially, it clears all scheduled timeouts, stopping the loop.
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = []; // Clear the array
    };
  }, []); // Empty dependency array means this effect runs only once on mount and cleans up on unmount

  // This function is called by our new button
  const handleStop = () => {
    // 1. Manually clear all scheduled timeouts immediately
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    // 2. Call the onStop prop passed from ChatPage to remove the component from the chat
    onStop();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div
        className={`w-40 h-40 rounded-full flex items-center justify-center transition-transform duration-[4000ms] ease-in-out ${isDarkMode ? "bg-indigo-500" : "bg-indigo-300"
          }`}
        style={{ transform: `scale(${scale})` }}
      >
        <p className="text-xl font-semibold text-white">{text}</p>
      </div>
      <p className={`text-sm ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
        Follow the guide. Breathe...
      </p>
      {/* +++ NEW: The Stop Button +++ */}
      <Button
        onClick={handleStop}
        variant="ghost"
        className={`mt-4 text-xs rounded-full px-4 py-2 ${ // Added margin-top
          isDarkMode
            ? "text-slate-400 hover:bg-slate-700 hover:text-slate-300"
            : "text-slate-500 hover:bg-slate-200"
          }`}
      >
        Stop Exercise
      </Button>
    </div>
  );
}


export default function ChatPage() {
  const { isDarkMode } = useDarkMode();
  // YOUR ORIGINAL messages state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm here to support you today. How are you feeling right now? You can share what's on your mind or use one of the quick options below.\n\nWe also offer two quick and confidential mental health self-assessments:\n\n• **PHQ-9** – helps evaluate symptoms of depression.\n• **GAD-7** – helps assess anxiety levels.\n\nThese tools are designed to give you a better understanding of your emotional well-being. You can take either of them anytime by clicking the buttons below.",
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  // YOUR ORIGINAL states
  const [inputValue, setInputValue] = useState("");
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [userToken, setUserToken] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // +++ FEATURE 3: Voice Input State +++
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null); // To hold the SpeechRecognition instance

  // YOUR ORIGINAL useEffect for token/session
  useEffect(() => {
    const token = localStorage.getItem("userToken") || `anon_${Math.random().toString(36).substr(2, 9)}`;
    const session = localStorage.getItem("sessionId") || `session_${Date.now()}`;

    localStorage.setItem("userToken", token);
    localStorage.setItem("sessionId", session);

    setUserToken(token);
    setSessionId(session);

    // +++ FEATURE 3: Voice Input Setup +++
    // This runs once on page load
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (window.SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new window.SpeechRecognition();
      recognition.continuous = false; // We only want one phrase at a time
      recognition.interimResults = true; // Show results as user speaks
      recognition.lang = 'en-US';

      // When the mic starts listening
      recognition.onstart = () => {
        setIsListening(true);
        toast({ title: "Listening...", description: "Start speaking." });
      };

      // When speech is recognized
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        // Update the input box in real-time
        setInputValue(transcript);
      };

      // If there's an error
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        toast({ title: "Speech Error", description: "Couldn't recognize speech.", variant: "destructive" });
        setIsListening(false);
      };

      // When the mic stops listening
      recognition.onend = () => {
        setIsListening(false);
      };

      // Save the recognition instance to our ref
      recognitionRef.current = recognition;
    } else {
      setIsSpeechSupported(false);
      console.log("Speech recognition not supported in this browser.");
    }
  }, [toast]); // Added toast as a dependency

  // +++ NEW: Helper function to remove a message by ID +++
  const removeMessage = (id: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== id));
  };

  // YOUR ORIGINAL quickActions
  const quickActions = [
    { text: "I feel anxious", icon: Zap, gradient: "from-orange-400 to-pink-500", shadow: "shadow-orange-500/25" },
    { text: "I can't sleep", icon: Moon, gradient: "from-indigo-500 to-purple-600", shadow: "shadow-indigo-500/25" },
    { text: "I'm overwhelmed", icon: Heart, gradient: "from-pink-500 to-rose-600", shadow: "shadow-pink-500/25" },
  ];

  // YOUR ORIGINAL assessments data
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
  };

  // +++ MODIFIED sendMessage function +++
  // It now includes 'isProgrammatic' for Feature 2
  // and checks for the breathing command for Feature 1
  const sendMessage = async (content: string, isProgrammatic: boolean = false) => {

    // Stop listening if user sends message
    if (isListening) {
      recognitionRef.current?.stop();
    }

    let updatedMessages = [...messages];

    // Only add a new "user" message to the UI if it's not programmatic
    if (!isProgrammatic) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
        type: "text",
      };
      updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages); // Update UI
      setInputValue(""); // Clear input
    }

    setIsLoading(true);

    try {
      // Prepare messages for the API
      const apiMessages = updatedMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }));

      // If it IS programmatic (from the assessment),
      // add the new context message only for the API call.
      // It won't be shown in the UI.
      if (isProgrammatic) {
        apiMessages.push({ role: "user", content: content });
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          messages: apiMessages, // Send the correct message history
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // +++ FEATURE 1: Check for Breathing Exercise command +++
      if (data.response.includes("[START_BREATHING_EXERCISE]")) {
        // Split response in case AI said something first
        const parts = data.response.split("[START_BREATHING_EXERCISE]");
        const introText = parts[0].trim();

        // If AI said "OK, let's start" first, show that message
        if (introText) {
          const introMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: introText,
            sender: "bot",
            timestamp: new Date(data.timestamp),
            type: "text",
          };
          setMessages((prev) => [...prev, introMessage]);
        }

        // Then, add the special breathing component message
        const breathingMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: "", // Content is irrelevant, type handles rendering
          sender: "bot",
          timestamp: new Date(data.timestamp),
          type: "breathing_exercise",
        };
        setMessages((prev) => [...prev, breathingMessage]);
      } else {
        // Standard text response (the original logic)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: "bot",
          timestamp: new Date(data.timestamp),
          type: "text",
        };
        setMessages((prev) => [...prev, botMessage]);
      }

    } catch (error) {
      console.error("Chat API error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the chat service. Please try again.",
        variant: "destructive",
      });

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }

    if (!isProgrammatic) {
      setInputValue("");
    }
  };

  // YOUR ORIGINAL handleQuickAction
  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  // YOUR ORIGINAL startAssessment
  const startAssessment = (type: "phq9" | "gad7") => {
    const assessmentData = assessments[type];
    setAssessment({
      id: type,
      name: assessmentData.name,
      questions: assessmentData.questions,
      currentQuestion: 0,
      responses: [],
      isActive: true,
    });

    const botMessage: Message = {
      id: Date.now().toString(),
      content: `I'll guide you through the ${assessmentData.name}. Please answer each question honestly - there are no right or wrong answers.`,
      sender: "bot",
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  // +++ MODIFIED handleAssessmentResponse +++
  // This now includes Feature 2
  const handleAssessmentResponse = async (score: number) => {
    if (!assessment) return;
    const newResponses = [...assessment.responses, score];
    const nextQuestion = assessment.currentQuestion + 1;

    if (nextQuestion < assessment.questions.length) {
      setAssessment({ ...assessment, currentQuestion: nextQuestion, responses: newResponses });
    } else {
      // Assessment is finished
      setIsLoading(true);
      try {
        // Your original logic to save to /api/assessments
        const response = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userToken,
            tool: assessment.id === "phq9" ? "PHQ-9" : "GAD-7",
            responses: newResponses,
          }),
        });
        if (!response.ok) throw new Error("Failed to save assessment");
        const data = await response.json();

        // Your original logic to show the score message
        const botMessage: Message = {
          id: Date.now().toString(),
          content: `${data.message}${data.recommendations?.length > 0 ? "\n\nRecommendations:\n• " + data.recommendations.join("\n• ") : ""
            }\n\nRemember, this is just a screening tool and not a diagnosis.`,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, botMessage]);

        // +++ FEATURE 2: Send Context to AI +++
        const totalScore = newResponses.reduce((a, b) => a + b, 0);
        // This is the "hidden" message we send to the AI
        const contextualPrompt = `I just finished the ${assessment.name}. My score was ${totalScore}. Can you give me some supportive feedback and explain what this score means in a gentle, conversational way?`;

        // Send this context to the AI programmatically (it won't show as a user message)
        await sendMessage(contextualPrompt, true);
        // The AI will now respond with a message aware of the score.

        // Your original logic to show buttons
        const totalScoreForButtons = newResponses.reduce((a, b) => a + b, 0);
        const shouldShowButtons =
          (assessment.id === "phq9" && totalScoreForButtons > 4) || (assessment.id === "gad7" && totalScoreForButtons > 3);

        if (shouldShowButtons) {
          const buttonMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "",
            sender: "bot",
            timestamp: new Date(),
            type: "buttons",
          };
          setMessages((prev) => [...prev, buttonMessage]);
        }

        toast({
          title: "Assessment Complete",
          description: `Your ${assessment.name} has been completed and saved securely.`,
        });
      } catch (error) {
        console.error("[Assessment API error]:", error);
        toast({
          title: "Save Error",
          description: "Assessment completed but couldn't be saved. Your responses are still valid.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }

      setAssessment(null); // Finish assessment
    }
  };

  // +++ FEATURE 3: Voice Input Handler +++
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
    }
  };


  // YOUR ORIGINAL JSX return starts here
  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-500 ${isDarkMode
      ? "bg-gradient-to-br from-[#141627] via-[#20223a] to-[#2d2547] text-white"
      : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/60 text-gray-900"
      }`}>
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${isDarkMode
          ? "bg-gradient-to-r from-purple-800/30 to-pink-800/25"
          : "bg-gradient-to-r from-purple-400/20 to-pink-400/20"
          }`} />
        <div className={`absolute bottom-32 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse ${isDarkMode
          ? "bg-gradient-to-r from-blue-900/25 to-cyan-800/15"
          : "bg-gradient-to-r from-blue-400/15 to-cyan-400/15"
          }`} />
      </div>

      <Navigation />
      {/* MODIFIED padding for more space */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 md:p-8 gap-8 relative z-10">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center p-2 rounded-full mb-4 ${isDarkMode
            ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-white/20"
            : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
            }`}>
            <Bot className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3">
            AI Mental Health Support
          </h1>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}>
            Your compassionate AI companion for mental wellness guidance and professional assessments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
          {/* Enhanced Assessment Sidebar (YOUR ORIGINAL CODE) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Header Card */}
            <Card className={`backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ${isDarkMode
              ? "bg-slate-900/80 border-slate-700/30 shadow-indigo-900/20"
              : "bg-white/80 shadow-indigo-500/10"
              }`}>
              <CardHeader className={`border-b-0 ${isDarkMode
                ? "bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
                }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                    Quick Assessments
                  </CardTitle>
                </div>
                <Badge className={`w-fit border-0 font-medium ${isDarkMode
                  ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 text-emerald-300"
                  : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
                  }`}>
                  <Shield className="w-3 h-3 mr-1" />
                  Completely Private
                </Badge>
              </CardHeader>
              <CardContent className="p-6">
                <p className={`text-sm mb-6 leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                  Get instant insights with our clinically-validated screening tools
                </p>

                {/* PHQ-9 Assessment Card */}
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse"></div>
                  <Card className={`relative border-0 shadow-xl rounded-3xl overflow-hidden backdrop-blur-xl ${isDarkMode
                    ? "bg-gradient-to-br from-slate-800/90 to-purple-900/30"
                    : "bg-gradient-to-br from-white to-purple-50/50"
                    }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                            <Activity className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>PHQ-9</h3>
                            <p className="text-sm text-purple-500 font-medium">Depression Screening</p>
                          </div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${isDarkMode
                          ? "bg-purple-900/30 text-purple-300"
                          : "bg-purple-100 text-purple-800"
                          }`}>
                          9 Questions
                        </div>
                      </div>

                      <p className={`text-sm mb-6 leading-relaxed p-4 rounded-2xl border ${isDarkMode
                        ? "text-slate-300 bg-slate-800/60 border-slate-700/50"
                        : "text-gray-600 bg-white/60 border-white/50"
                        }`}>
                        Assess your mood and depressive symptoms over the past two weeks
                      </p>

                      {/* MODIFIED Button (arrow removed) */}
                      <Button
                        onClick={() => startAssessment("phq9")}
                        disabled={assessment?.isActive}
                        className="w-full h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center" // Changed px-12 to px-8, added text-sm, changed rounded-2xl to rounded-xl
                      >
                        <Play className="w-5 h-5 mr-2" />
                        <span>Start PHQ-9 Assessment</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* GAD-7 Assessment Card */}
                <div className="relative mb-6 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500 animate-pulse"></div>
                  <Card className={`relative border-0 shadow-xl rounded-3xl overflow-hidden backdrop-blur-xl ${isDarkMode
                    ? "bg-gradient-to-br from-slate-800/90 to-blue-900/30"
                    : "bg-gradient-to-br from-white to-blue-50/50"
                    }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>GAD-7</h3>
                            <p className="text-sm text-blue-500 font-medium">Anxiety Screening</p>
                          </div>
                        </div>
                        <div className={`text-xs font-bold px-2 py-1 rounded-full ${isDarkMode
                          ? "bg-blue-900/30 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                          }`}>
                          7 Questions
                        </div>
                      </div>

                      <p className={`text-sm mb-6 leading-relaxed p-4 rounded-2xl border ${isDarkMode
                        ? "text-slate-300 bg-slate-800/60 border-slate-700/50"
                        : "text-gray-600 bg-white/60 border-white/50"
                        }`}>
                        Evaluate your anxiety levels and worry patterns
                      </p>

                      {/* MODIFIED Button (arrow removed) */}
                      <Button
                        onClick={() => startAssessment("gad7")}
                        disabled={assessment?.isActive}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start GAD-7 Assessment
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Box */}
                <div className={`rounded-2xl p-4 backdrop-blur-sm border ${isDarkMode
                  ? "bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-700/30"
                  : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/50"
                  }`}>
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold mb-1 ${isDarkMode ? "text-amber-300" : "text-amber-800"
                        }`}>Professional-Grade Tools</p>
                      <p className={`text-xs leading-relaxed ${isDarkMode ? "text-amber-200" : "text-amber-700"
                        }`}>
                        These assessments are used by healthcare professionals worldwide for accurate mental health screening.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Chat Area (YOUR ORIGINAL CODE) */}
          <div className="lg:col-span-3">
            <Card className={`flex flex-col backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden h-full ${isDarkMode
              ? "bg-slate-900/80 border-slate-700/30 shadow-indigo-900/20"
              : "bg-white/80 shadow-indigo-500/10"
              }`}>
              <CardHeader className={`border-b-0 ${isDarkMode
                ? "bg-gradient-to-r from-indigo-900/20 to-purple-900/20"
                : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"
                }`}>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 ring-4 ring-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <Bot className="w-7 h-7" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                      MindCare AI
                    </CardTitle>
                    <Badge className={`text-sm border-0 font-medium mt-1 ${isDarkMode
                      ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 text-emerald-300"
                      : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700"
                      }`}>
                      {isLoading ? "Analyzing..." : "Ready to Help"} • Secure & Private
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className={`flex-1 flex flex-col p-0 min-h-0 ${isDarkMode
                ? "bg-gradient-to-b from-slate-900/50 to-slate-800/30"
                : "bg-gradient-to-b from-white/50 to-slate-50/30"
                }`}>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {/* MODIFIED message map to render new components and pass onStop */}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-4 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                        >
                          <Avatar className="w-11 h-11 shadow-lg">
                            <AvatarFallback
                              className={
                                message.sender === "user"
                                  ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                                  : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                              }
                            >
                              {message.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                            </AvatarFallback>
                          </Avatar>

                          <div
                            className={`rounded-3xl p-5 shadow-xl backdrop-blur-sm ${message.sender === "user"
                              ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                              : isDarkMode
                                ? "bg-slate-800/90 border border-slate-700/50 text-slate-200"
                                : "bg-white/90 border border-white/50 text-gray-800"
                              }`}
                          >
                            {/* Render text */}
                            {message.type === "text" && (
                              <p className="text-sm leading-relaxed whitespace-pre-line font-medium">
                                {message.content}
                              </p>
                            )}

                            {/* Render buttons */}
                            {message.type === "buttons" && (
                              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                {/* MODIFIED Button (arrow removed) */}
                                <Button
                                  asChild
                                  className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                  <Link href="/book">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Book Professional Help
                                  </Link>
                                </Button>
                                {/* MODIFIED Button (arrow removed) */}
                                <Button
                                  asChild
                                  className="h-12 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                  <Link href="/resources">
                                    <ClipboardList className="w-4 h-4 mr-2" />
                                    Explore Resources
                                  </Link>
                                </Button>
                              </div>
                            )}

                            {/* +++ UPDATED: Pass onStop prop +++ */}
                            {message.type === "breathing_exercise" && (
                              <BreathingExercise onStop={() => removeMessage(message.id)} />
                            )}
                            {/* +++ END OF UPDATE +++ */}

                            <p
                              className={`text-xs mt-3 ${message.sender === "user" ? "text-white/70" : isDarkMode ? "text-slate-400" : "text-gray-500"
                                }`}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* YOUR ORIGINAL loading indicator */}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-4 max-w-[85%]">
                          <Avatar className="w-11 h-11 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                              <Bot className="w-5 h-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className={`rounded-3xl p-5 backdrop-blur-sm shadow-xl border ${isDarkMode
                            ? "bg-slate-800/90 border-slate-700/50"
                            : "bg-white/90 border-white/50"
                            }`}>
                            <div className="flex items-center space-x-3">
                              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                              <p className={`text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"
                                }`}>AI is thinking...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* YOUR ORIGINAL Assessment UI */}
                    {assessment && assessment.isActive && (
                      <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl border ${isDarkMode
                        ? "bg-gradient-to-br from-slate-800/90 to-indigo-900/30 border-slate-700/50"
                        : "bg-gradient-to-br from-white/90 to-indigo-50/80 border-white/50"
                        }`}>
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                              {assessment.name}
                            </h3>
                            <span className={`text-sm font-bold px-4 py-2 rounded-full ${isDarkMode
                              ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 text-indigo-300"
                              : "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700"
                              }`}>
                              Question {assessment.currentQuestion + 1} of {assessment.questions.length}
                            </span>
                          </div>
                          <Progress
                            value={(assessment.currentQuestion / assessment.questions.length) * 100}
                            className={`h-3 rounded-full overflow-hidden ${isDarkMode
                              ? "bg-gradient-to-r from-slate-700 to-slate-600"
                              : "bg-gradient-to-r from-gray-200 to-gray-300"
                              }`}
                          />
                        </div>

                        <p className={`mb-8 leading-relaxed text-base font-medium p-4 rounded-2xl border ${isDarkMode
                          ? "text-slate-200 bg-slate-700/60 border-slate-600/50"
                          : "text-gray-700 bg-white/60 border-white/50"
                          }`}>
                          {assessment.questions[assessment.currentQuestion]}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {["Not at all (0)", "Several days (1)", "More than half (2)", "Nearly every day (3)"].map(
                            (option, index) => (
                              <Button
                                key={index}
                                onClick={() => handleAssessmentResponse(index)}
                                disabled={isLoading}
                                className={`h-16 p-4 font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border ${isDarkMode
                                  ? "bg-slate-700/80 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-slate-200 hover:text-white border-slate-600/50 hover:border-transparent"
                                  : "bg-white/80 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 text-gray-700 hover:text-white border-white/50 hover:border-transparent"
                                  }`}
                              >
                                {option}
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Enhanced Input Area */}
                {!assessment?.isActive && (
                  <div className={`p-6 backdrop-blur-xl border-t ${isDarkMode
                    ? "bg-gradient-to-r from-slate-800/80 to-slate-700/60 border-slate-700/50"
                    : "bg-gradient-to-r from-white/80 to-slate-50/60 border-white/50"
                    }`}>
                    <div className="mb-6">
                      <p className={`text-sm mb-4 font-medium ${isDarkMode ? "text-slate-300" : "text-gray-600"
                        }`}>Quick conversation starters:</p>
                      <div className="flex flex-wrap gap-3">
                        {quickActions.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <Button
                              key={index}
                              onClick={() => handleQuickAction(action.text)}
                              disabled={isLoading}
                              className={`h-12 px-6 bg-gradient-to-r ${action.gradient} hover:shadow-xl ${action.shadow} text-white font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                            >
                              <Icon className="w-4 h-4 mr-2" />
                              {action.text}
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* MODIFIED input area with Mic button */}
                    <div className="flex items-center space-x-4">
                      <Input
                        type="text"
                        placeholder={isListening ? "Listening..." : "Share what's on your mind..."}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && inputValue.trim()) {
                            sendMessage(inputValue.trim());
                          }
                        }}
                        disabled={isLoading}
                        className={`flex-1 h-14 px-6 backdrop-blur-sm rounded-2xl shadow-lg transition-all duration-300 border ${isDarkMode
                          ? "bg-slate-700/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                          : "bg-white/80 border-white/50 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                          }`}
                      />

                      {/* +++ FEATURE 3: Voice Input Button +++ */}
                      <Button
                        onClick={handleListen}
                        disabled={!isSpeechSupported || isLoading}
                        title={isSpeechSupported ? (isListening ? "Stop listening" : "Start listening") : "Speech not supported"}
                        className={`h-14 w-14 text-white rounded-2xl shadow-lg transition-all duration-300 shrink-0 ${isListening
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : "bg-gradient-to-r from-blue-600 to-cyan-600"
                          } ${!isSpeechSupported ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
                        ${isListening ? "animate-pulse" : ""}`}
                        aria-label={isListening ? "Stop listening" : "Start listening"}
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </Button>

                      <Button
                        onClick={() => sendMessage(inputValue.trim())}
                        disabled={isLoading || !inputValue.trim()}
                        className="h-14 w-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}