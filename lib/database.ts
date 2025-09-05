// In-memory data storage for prototype
export interface User {
  token: string
  isAnonymous: boolean
  role: "student" | "admin" | "counsellor"
  email?: string
  firebaseUid?: string
  lastActive: Date
  createdAt: Date
}

export interface ChatSession {
  userToken: string
  sessionId: string
  messages: Array<{
    content: string
    sender: "user" | "bot"
    timestamp: Date
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Assessment {
  userToken: string
  tool: "PHQ-9" | "GAD-7"
  responses: number[]
  score: number
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe"
  recommendations: string[]
  isHighRisk: boolean
  timestamp: Date
}

// In-memory storage arrays
export const users: User[] = []
export const chatSessions: ChatSession[] = []
export const assessments: Assessment[] = []

// Utility functions
export const generateUserToken = (): string => {
  return `anon_${Math.random().toString(36).substr(2, 9)}`
}

export const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
}

// Assessment scoring functions
export const calculateAssessmentScore = (responses: number[]): number => {
  return responses.reduce((sum, score) => sum + score, 0)
}

export const interpretPHQ9Score = (score: number): { severity: string; isHighRisk: boolean } => {
  if (score <= 4) return { severity: "Minimal", isHighRisk: false }
  if (score <= 9) return { severity: "Mild", isHighRisk: false }
  if (score <= 14) return { severity: "Moderate", isHighRisk: false }
  if (score <= 19) return { severity: "Moderately Severe", isHighRisk: true }
  return { severity: "Severe", isHighRisk: true }
}

export const interpretGAD7Score = (score: number): { severity: string; isHighRisk: boolean } => {
  if (score <= 4) return { severity: "Minimal", isHighRisk: false }
  if (score <= 9) return { severity: "Mild", isHighRisk: false }
  if (score <= 14) return { severity: "Moderate", isHighRisk: false }
  return { severity: "Severe", isHighRisk: true }
}
