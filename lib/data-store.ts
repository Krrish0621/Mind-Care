// In-memory data storage for prototype - data will be lost on server restart
export interface Appointment {
  id: string
  student_token: string
  counsellor_id: string
  date: string
  time: string
  mode: "online" | "offline"
  status: "confirmed" | "pending" | "cancelled"
  timestamp: Date
}

export interface ForumPost {
  post_id: string
  title: string
  message: string
  author: string
  timestamp: Date
  upvotes: number
  comments: number
  flags: number
  category: string
}

export interface ScreeningResult {
  id: string
  user_token: string
  tool: "PHQ-9" | "GAD-7"
  responses: number[]
  score: number
  severity: "Minimal" | "Mild" | "Moderate" | "Moderately Severe" | "Severe"
  timestamp: Date
}

export interface ChatMessage {
  id: string
  sessionId: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export interface Flag {
  id: string
  post_id: string
  reason: string
  timestamp: Date
  status: "pending" | "resolved" | "dismissed"
  resolvedBy?: string
  resolvedAt?: Date
}

// In-memory storage arrays
export const appointments: Appointment[] = []
export const forumPosts: ForumPost[] = []
export const screeningResults: ScreeningResult[] = []
export const chatMessages: ChatMessage[] = []
export const flags: Flag[] = []

// Helper functions for generating IDs
export const generateId = () => Date.now().toString()
export const generatePostId = () => `post_${Date.now()}`
export const generateUserId = () => `user_${Date.now()}`

// Utility functions for data manipulation
export const addAppointment = (appointment: Omit<Appointment, "id" | "timestamp">) => {
  const newAppointment: Appointment = {
    ...appointment,
    id: generateId(),
    timestamp: new Date(),
  }
  appointments.push(newAppointment)
  return newAppointment
}

export const addForumPost = (post: Omit<ForumPost, "post_id" | "timestamp" | "upvotes" | "comments" | "flags">) => {
  const newPost: ForumPost = {
    ...post,
    post_id: generatePostId(),
    timestamp: new Date(),
    upvotes: 0,
    comments: 0,
    flags: 0,
  }
  forumPosts.push(newPost)
  return newPost
}

export const addScreeningResult = (result: Omit<ScreeningResult, "id" | "timestamp">) => {
  const newResult: ScreeningResult = {
    ...result,
    id: generateId(),
    timestamp: new Date(),
  }
  screeningResults.push(newResult)
  return newResult
}
