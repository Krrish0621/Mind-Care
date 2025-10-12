"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useDarkMode } from "@/contexts/DarkModeContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  BookOpen,
  Headphones,
  Clock,
  Star,
  Search,
  Filter,
  Globe,
  Download,
  Eye,
  Heart,
  Brain,
  Zap,
  Moon,
  Bookmark,
  Share2,
  History,
  TrendingUp,
  Volume2,
  Pause,
  SkipBack,
  SkipForward,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Target,
  Sparkles,
  Headset,
  PlayCircle,
  BookMarked,
  ArrowRight,
  Lightbulb,
  VolumeX,
  MoreVertical,
  Plus,
  Minus,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "video" | "audio" | "guide"
  topic: "sleep" | "anxiety" | "study-stress" | "general" | "mindfulness" | "relationships"
  duration: string
  rating: number
  views: number
  language: "english" | "hindi" | "kashmiri"
  difficulty: "beginner" | "intermediate" | "advanced"
  thumbnail?: string
  videoUrl?: string
  audioUrl?: string
  author: string
  tags: string[]
  isFavorite?: boolean
  progress?: number
  publishedDate: string
  subtitles?: string[]
}

const resources: Resource[] = [
  // English Videos
  {
    id: "v1",
    title: "Deep Breathing for Anxiety Relief",
    description: "Learn effective breathing techniques to manage anxiety and panic attacks in just 10 minutes.",
    type: "video",
    topic: "anxiety",
    duration: "10:30",
    rating: 4.8,
    views: 15420,
    language: "english",
    difficulty: "beginner",
    author: "Dr. Sarah Chen",
    tags: ["breathing", "anxiety", "quick-relief"],
    videoUrl: "https://www.youtube.com/embed/LiUnFJ8g",
    publishedDate: "2024-01-15",
    subtitles: ["English", "Hindi"],
  },
  {
    id: "v2",
    title: "Sleep Hygiene: Building Better Habits",
    description: "Comprehensive guide to improving sleep quality through proven sleep hygiene practices.",
    type: "video",
    topic: "sleep",
    duration: "18:45",
    rating: 4.9,
    views: 23100,
    language: "english",
    difficulty: "intermediate",
    author: "Dr. Michael Rodriguez",
    tags: ["sleep", "habits", "wellness"],
    videoUrl: "https://www.youtube.com/embed/fk-_SwHhLLc",
    publishedDate: "2024-02-01",
  },
  {
    id: "v3",
    title: "Managing Study Stress and Exam Anxiety",
    description: "Practical strategies for students to cope with academic pressure and perform better under stress.",
    type: "video",
    topic: "study-stress",
    duration: "15:20",
    rating: 4.7,
    views: 18750,
    language: "english",
    difficulty: "beginner",
    author: "Dr. Emily Johnson",
    tags: ["study", "exams", "students"],
    videoUrl: "https://www.youtube.com/embed/Bk2-dKH4Ta",
    publishedDate: "2024-02-15",
  },
  {
    id: "v4",
    title: "Mindfulness Meditation for Beginners",
    description: "Introduction to mindfulness practices that can be integrated into daily life.",
    type: "video",
    topic: "mindfulness",
    duration: "12:15",
    rating: 4.6,
    views: 12300,
    language: "english",
    difficulty: "beginner",
    author: "Mindfulness Center",
    tags: ["mindfulness", "meditation", "beginners"],
    videoUrl: "https://www.youtube.com/embed/ZToicYIOU",
    publishedDate: "2024-03-01",
  },

  // Additional English Videos
  {
    id: "v20",
    title: "Cognitive Behavioral Therapy Explained",
    description: "Understanding CBT techniques to manage thoughts and improve mental health.",
    type: "video",
    topic: "anxiety",
    duration: "22:00",
    rating: 4.9,
    views: 11200,
    language: "english",
    difficulty: "advanced",
    author: "Dr. Jessica Lee",
    tags: ["CBT", "therapy", "mental health"],
    videoUrl: "https://www.youtube.com/embed/KT6XZ_QFXt",
    publishedDate: "2024-04-05",
  },

  // Hindi Videos
  {
    id: "v7",
    title: "चिंता के लिए सांस लेने की तकनीक",
    description: "चिंता और घबराहट को कम करने के लिए प्रभावी सांस की तकनीक।",
    type: "video",
    topic: "anxiety",
    duration: "11:20",
    rating: 4.7,
    views: 8900,
    language: "hindi",
    difficulty: "beginner",
    author: "डॉ. अमित शर्मा",
    tags: ["सांस", "चिंता", "राहत"],
    videoUrl: "https://www.youtube.com/embed/YQq3StWg",
    publishedDate: "2024-01-20",
  },
  
  // Additional Hindi Videos
  {
    id: "v25",
    title: "मन की शांति के लिए ध्यान",
    description: "दिनचर्या में मानसिक शांति के लिए ध्यान का अभ्यास।",
    type: "video",
    topic: "mindfulness",
    duration: "15:00",
    rating: 4.8,
    views: 9800,
    language: "hindi",
    difficulty: "beginner",
    author: "योग गुरु प्रिया",
    tags: ["ध्यान", "शांति", "मनोविज्ञान"],
    videoUrl: "https://www.youtube.com/embed/PD_yaos",
    publishedDate: "2024-04-10",
  },

  // Kashmiri Videos
  {
    id: "v13",
    title: "چیٹھن کرنی طریقہ فکری تناؤ کے لیے",
    description: "ذہنی دباؤ کو کم کرنے کے لئے موثر سانس کی تکنیکیں سیکھیں۔",
    type: "video",
    topic: "anxiety",
    duration: "12:45",
    rating: 4.6,
    views: 4200,
    language: "kashmiri",
    difficulty: "beginner",
    author: "حکیم عبدالرحیم",
    tags: ["سانس", "دباؤ", "آرام"],
    videoUrl: "https://www.youtube.com/embed/7Z8_Z8",
    publishedDate: "2024-01-25",
  },

  // Additional Kashmiri audio/video
  {
    id: "a25",
    title: "کشمیر میں مراقبہ کے لیے رہنمائی",
    description: "کشمیر میں صوفی مراقبہ کی رہنمائی کے ساتھ ذہنی سکون حاصل کریں۔",
    type: "audio",
    topic: "mindfulness",
    duration: "30:00",
    rating: 4.7,
    views: 3500,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "رہنما نور",
    tags: ["مراقبہ", "صوفی", "ذہنی سکون"],
    audioUrl: "/audio/kashmiri_meditation.mp3",
    publishedDate: "2024-05-10",
  },

  // English audios
  {
    id: "a1",
    title: "Guided Meditation for Better Sleep",
    description: "Soothing meditation to improve sleep quality.",
    type: "audio",
    topic: "sleep",
    duration: "20:00",
    rating: 4.9,
    views: 31200,
    language: "english",
    difficulty: "beginner",
    author: "Mindfulness Center",
    tags: ["meditation", "sleep", "relaxation"],
    audioUrl: "/audio/sleep_meditation.mp3",
    publishedDate: "2024-01-10",
  },
  {
    id: "a20",
    title: "Calming Sounds for Anxiety",
    description: "Audio with calming sounds to reduce anxiety.",
    type: "audio",
    topic: "anxiety",
    duration: "25:00",
    rating: 4.8,
    views: 16200,
    language: "english",
    difficulty: "beginner",
    author: "Relaxation Lab",
    tags: ["calming", "anxiety", "sounds"],
    audioUrl: "/audio/calming_sounds.mp3",
    publishedDate: "2024-05-12",
  },

  // Hindi audios
  {
    id: "a7",
    title: "ध्यान के लिए निर्देशित ऑडियो",
    description: "ध्यान के लिए सरल निर्देशित ऑडियो सत्र।",
    type: "audio",
    topic: "mindfulness",
    duration: "15:00",
    rating: 4.7,
    views: 12400,
    language: "hindi",
    difficulty: "beginner",
    author: "योग गुरु प्रिया",
    tags: ["ध्यान", "ऑडियो", "शांति"],
    audioUrl: "/audio/hindi_meditation.mp3",
    publishedDate: "2024-03-03",
  },

  // Guides English
  {
    id: "g1",
    title: "Complete Guide to Managing Anxiety",
    description: "Everything you need to know about anxiety management.",
    type: "guide",
    topic: "anxiety",
    duration: "15 min read",
    rating: 4.9,
    views: 45600,
    language: "english",
    difficulty: "beginner",
    author: "Mental Health Alliance",
    tags: ["anxiety", "coping", "management"],
    publishedDate: "2024-01-08",
  },
  {
    id: "g25",
    title: "Advanced Mindfulness Techniques",
    description: "A comprehensive guide to advanced mindfulness practices.",
    type: "guide",
    topic: "mindfulness",
    duration: "20 min read",
    rating: 4.8,
    views: 15200,
    language: "english",
    difficulty: "advanced",
    author: "Mindfulness Center",
    tags: ["mindfulness", "advanced", "practices"],
    publishedDate: "2024-05-01",
  },

  // Hindi guides
  {
    id: "g7",
    title: "चिंता प्रबंधन की पूरी गाइड",
    description: "चिंता प्रबंधन के लिए पूर्ण मार्गदर्शिका।",
    type: "guide",
    topic: "anxiety",
    duration: "16 मिनट पढ़ें",
    rating: 4.7,
    views: 18900,
    language: "hindi",
    difficulty: "beginner",
    author: "मानसिक स्वास्थ्य विशेषज्ञ",
    tags: ["चिंता", "प्रबंधन", "गाइड"],
    publishedDate: "2024-01-11",
  },
  {
    id: "g27",
    title: "फोकस बढ़ाने के लिए मार्गदर्शिका",
    description: "अध्ययन के लिए फोकस बढ़ाने के लिए प्रभावी तकनीकें।",
    type: "guide",
    topic: "study-stress",
    duration: "15 मिनट पढ़ें",
    rating: 4.6,
    views: 10500,
    language: "hindi",
    difficulty: "intermediate",
    author: "शिक्षा केंद्र",
    tags: ["फोकस", "अध्ययन", "तकनीक"],
    publishedDate: "2024-06-10",
  },
  
  // Kashmiri guides
  {
    id: "g30",
    title: "ذہنی دباؤ سے نجات کا مکمل راستہ",
    description: "ذہنی دباؤ کو سمجھنے اور قابو پانے کے طریقے۔",
    type: "guide",
    topic: "anxiety",
    duration: "18 minutes read",
    rating: 4.7,
    views: 4800,
    language: "kashmiri",
    difficulty: "beginner",
    author: "ذہنی صحت اتحاد",
    tags: ["دباؤ", "مفید", "راستہ"],
    publishedDate: "2024-07-05",
  },
  {
    id: "g31",
    title: "کشمیر میں ذہنی صحت کی رہنمائی",
    description: "کشمیر میں ذہنی صحت بہتر بنانے کی مکمل رہنمائی۔",
    type: "guide",
    topic: "mental health",
    duration: "20 minutes read",
    rating: 4.8,
    views: 4200,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "ذہنی صحت مرکز",
    tags: ["رہنمائی", "صحت", "کشمیر"],
    publishedDate: "2024-08-01",
  },
]


const topics = [
  { value: "all", label: "All Topics", icon: Brain },
  { value: "sleep", label: "Sleep", icon: Moon },
  { value: "anxiety", label: "Anxiety", icon: Zap },
  { value: "study-stress", label: "Study Stress", icon: BookOpen },
  { value: "mindfulness", label: "Mindfulness", icon: Sparkles },
  { value: "relationships", label: "Relationships", icon: Users },
  { value: "general", label: "General", icon: Heart },
]

const languages = [
  { value: "all", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "hindi", label: "हिंदी" },
  { value: "kashmiri", label: "کٲشِر" },
]

const difficulties = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
]

// Enhanced VideoModal Component
function VideoModal({ open, onClose, videoUrl }: { open: boolean; onClose: () => void; videoUrl: string | null }) {
  const { isDarkMode } = useDarkMode()
  
  if (!open) return null
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-3xl shadow-2xl p-6 relative max-w-6xl w-full mx-4 border-2`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 rounded-full w-10 h-10 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 z-10"
            aria-label="Close video modal"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="aspect-video bg-black rounded-2xl overflow-hidden">
            {videoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-2xl"
                frameBorder="0"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No video available</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Enhanced AudioPlayer Component
function AudioPlayer({ resource, isPlaying, onTogglePlay }: { resource: Resource; isPlaying: boolean; onTogglePlay: () => void }) {
  const { isDarkMode } = useDarkMode()
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        isDarkMode 
          ? 'bg-gray-800/60 border-gray-700/30' 
          : 'bg-gray-50/80 border-gray-200/40'
      } backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePlay}
            className={`rounded-full w-12 h-12 p-0 ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-sm truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {resource.title}
            </p>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            } truncate`}>
              {resource.author}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-8 h-8 p-0 rounded-lg"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-8 h-8 p-0 rounded-lg"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <Progress 
          value={(currentTime / duration) * 100} 
          className="h-2 bg-gray-200 dark:bg-gray-700" 
        />
        <div className={`flex items-center justify-between text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>2:30</span>
          <span>{resource.duration}</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="w-8 h-8 p-0"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        <Slider
          value={isMuted ? [0] : volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
    </motion.div>
  )
}

export default function ResourcesPage() {
  const { isDarkMode } = useDarkMode()
  const { toast } = useToast()
  
  // State management
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [currentAudio, setCurrentAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  
  // Mouse tracking for effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Filter and sort resources
  const filteredResources = resources.filter((resource) => {
    const matchesTab =
      (activeTab === "videos" && resource.type === "video") ||
      (activeTab === "audio" && resource.type === "audio") ||
      (activeTab === "guides" && resource.type === "guide")

    const matchesTopic = selectedTopic === "all" || resource.topic === selectedTopic
    const matchesLanguage = selectedLanguage === "all" || resource.language === selectedLanguage
    const matchesDifficulty = selectedDifficulty === "all" || resource.difficulty === selectedDifficulty
    const matchesFavorites = !showFavoritesOnly || favorites.includes(resource.id)
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesTopic && matchesLanguage && matchesDifficulty && matchesFavorites && matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views
      case "rating":
        return b.rating - a.rating
      case "duration-short":
        return parseInt(a.duration) - parseInt(b.duration)
      case "duration-long":
        return parseInt(b.duration) - parseInt(a.duration)
      case "recent":
      default:
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    }
  })

  // Helper functions
  const toggleFavorite = (resourceId: string) => {
    setFavorites(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
    toast({
      title: favorites.includes(resourceId) ? "Removed from favorites" : "Added to favorites",
      description: "Your favorites have been updated.",
    })
  }

  const addToRecentlyViewed = (resourceId: string) => {
    setRecentlyViewed(prev => {
      const updated = [resourceId, ...prev.filter(id => id !== resourceId)]
      return updated.slice(0, 10)
    })
  }

  const handleResourceClick = (resource: Resource) => {
    addToRecentlyViewed(resource.id)
    
    if (resource.type === "video") {
      setActiveVideoUrl(resource.videoUrl || null)
      setModalOpen(true)
    } else if (resource.type === "audio") {
      setCurrentAudio(resource.id)
      setIsPlaying(true)
    } else {
      window.open(`/guides/${resource.id}`, '_blank')
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return PlayCircle
      case "audio":
        return Headset
      case "guide":
        return BookMarked
      default:
        return BookOpen
    }
  }

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case "sleep":
        return isDarkMode 
          ? "bg-purple-900/50 text-purple-300 border-purple-700/50" 
          : "bg-purple-100 text-purple-800 border-purple-200"
      case "anxiety":
        return isDarkMode 
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700/50" 
          : "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "study-stress":
        return isDarkMode 
          ? "bg-red-900/50 text-red-300 border-red-700/50" 
          : "bg-red-100 text-red-800 border-red-200"
      case "mindfulness":
        return isDarkMode 
          ? "bg-green-900/50 text-green-300 border-green-700/50" 
          : "bg-green-100 text-green-800 border-green-200"
      case "relationships":
        return isDarkMode 
          ? "bg-pink-900/50 text-pink-300 border-pink-700/50" 
          : "bg-pink-100 text-pink-800 border-pink-200"
      default:
        return isDarkMode 
          ? "bg-gray-700/50 text-gray-300 border-gray-600/50" 
          : "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return isDarkMode 
          ? "bg-green-900/50 text-green-300 border-green-700/50" 
          : "bg-green-100 text-green-800 border-green-200"
      case "intermediate":
        return isDarkMode 
          ? "bg-yellow-900/50 text-yellow-300 border-yellow-700/50" 
          : "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "advanced":
        return isDarkMode 
          ? "bg-red-900/50 text-red-300 border-red-700/50" 
          : "bg-red-100 text-red-800 border-red-200"
      default:
        return isDarkMode 
          ? "bg-gray-700/50 text-gray-300 border-gray-600/50" 
          : "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const popularResources = resources
    .sort((a, b) => b.views - a.views)
    .slice(0, 6)

  const recentResources = recentlyViewed
    .map(id => resources.find(r => r.id === id))
    .filter(Boolean)
    .slice(0, 6)

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30'
    } relative overflow-hidden`}>
      
      {/* Enhanced Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className={`absolute top-20 right-20 w-96 h-96 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20' 
              : 'bg-gradient-to-r from-purple-400/15 to-pink-400/15'
          } rounded-full blur-3xl`}
        />
        
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 5 
          }}
          className={`absolute bottom-20 left-20 w-80 h-80 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20' 
              : 'bg-gradient-to-r from-blue-400/15 to-cyan-400/15'
          } rounded-full blur-3xl`}
        />
      </div>

      {/* Mouse follower effect */}
      <motion.div 
        className={`fixed pointer-events-none z-40 w-8 h-8 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-400/30 to-pink-400/30' 
            : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
        } rounded-full blur-md`}
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28
        }}
      />

      <Navigation />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section with Enhanced Styling */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className={`inline-flex items-center justify-center p-3 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-white/10' 
              : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-white/20'
          } rounded-full mb-6 backdrop-blur-xl border transition-all duration-500`}>
            <Brain className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} mr-2`} />
            <span className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} font-bold text-sm tracking-wide`}>
              MENTAL WELLNESS LIBRARY
            </span>
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-white via-purple-200 to-pink-200' 
              : 'bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900'
          } bg-clip-text text-transparent leading-tight`}>
            Mental Health Resources
          </h1>
          
          <p className={`text-lg md:text-xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } max-w-4xl mx-auto mb-8`}>
            Access videos, audio content, and guides in multiple languages to support your mental wellness journey
          </p>
          
          {/* Stats badges */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: Eye, label: `${resources.reduce((acc, r) => acc + r.views, 0).toLocaleString()} total views` },
              { icon: BookOpen, label: `${resources.length} resources` },
              { icon: Globe, label: "3 languages" }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={`flex items-center space-x-2 px-4 py-2 ${
                    isDarkMode 
                      ? 'bg-gray-800/40 border-gray-700/30 text-gray-300' 
                      : 'bg-white/60 border-gray-200/40 text-gray-700'
                  } backdrop-blur-xl font-medium transition-all duration-300 hover:scale-105`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{stat.label}</span>
                </Badge>
              )
            })}
          </div>
        </motion.div>

        {/* Popular & Recent Resources */}
        {!searchQuery && (
          <div className="mb-12 space-y-8">
            {/* Popular This Week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className={`${
                isDarkMode 
                  ? 'bg-gray-800/40 border-gray-700/30' 
                  : 'bg-white/60 border-white/40'
              } backdrop-blur-xl border transition-all duration-500 shadow-xl`}>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-3 text-xl ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <TrendingUp className="w-6 h-6 text-orange-500" />
                    <span>Popular This Week</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-6 pb-4">
                      {popularResources.map((resource, index) => {
                        const Icon = getResourceIcon(resource.type)
                        return (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <Card 
                              className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                                isDarkMode 
                                  ? 'bg-gray-800/60 hover:bg-gray-800/80 border-gray-700/40' 
                                  : 'bg-white/80 hover:bg-white border-gray-200/40'
                              } backdrop-blur-xl border shadow-lg hover:shadow-2xl`}
                              onClick={() => handleResourceClick(resource)}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                  <Icon className="w-6 h-6 text-purple-600" />
                                  <Badge className={`${getTopicColor(resource.topic)} border font-medium`}>
                                    {resource.topic.replace("-", " ")}
                                  </Badge>
                                </div>
                                <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {resource.title}
                                </h3>
                                <div className={`flex items-center justify-between text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  <span className="capitalize font-medium">{resource.language}</span>
                                  <span>{resource.views.toLocaleString()} views</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recently Viewed */}
            {recentResources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className={`${
                  isDarkMode 
                    ? 'bg-gray-800/40 border-gray-700/30' 
                    : 'bg-white/60 border-white/40'
                } backdrop-blur-xl border transition-all duration-500 shadow-xl`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-3 text-xl ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <History className="w-6 h-6 text-blue-500" />
                      <span>Recently Viewed</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="w-full whitespace-nowrap">
                      <div className="flex space-x-6 pb-4">
                        {recentResources.map((resource, index) => {
                          if (!resource) return null
                          const Icon = getResourceIcon(resource.type)
                          return (
                            <motion.div
                              key={resource.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                              <Card 
                                className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                                  isDarkMode 
                                    ? 'bg-gray-800/60 hover:bg-gray-800/80 border-gray-700/40' 
                                    : 'bg-white/80 hover:bg-white border-gray-200/40'
                                } backdrop-blur-xl border shadow-lg hover:shadow-2xl`}
                                onClick={() => handleResourceClick(resource)}
                              >
                                <CardContent className="p-6">
                                  <div className="flex items-center space-x-3 mb-4">
                                    <Icon className="w-6 h-6 text-purple-600" />
                                    <Badge className={`${getTopicColor(resource.topic)} border font-medium`}>
                                      {resource.topic.replace("-", " ")}
                                    </Badge>
                                  </div>
                                  <h3 className={`font-bold text-lg mb-2 line-clamp-2 ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {resource.title}
                                  </h3>
                                  <div className={`flex items-center justify-between text-sm ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    <span className="capitalize font-medium">{resource.language}</span>
                                    <span>{resource.duration}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}

        {/* Advanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className={`${
            isDarkMode 
              ? 'bg-gray-800/40 border-gray-700/30' 
              : 'bg-white/60 border-white/40'
          } backdrop-blur-xl border transition-all duration-500 shadow-xl`}>
            <CardHeader>
              <CardTitle className={`flex items-center justify-between ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className="flex items-center space-x-3">
                  <Filter className="w-6 h-6 text-indigo-600" />
                  <span className="text-xl">Filter Resources</span>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={showFavoritesOnly}
                      onCheckedChange={setShowFavoritesOnly}
                    />
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Favorites only</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`px-3 py-1 font-semibold ${
                      isDarkMode 
                        ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50' 
                        : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    }`}
                  >
                    {filteredResources.length} results
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div>
                  <label className={`text-sm font-semibold mb-3 block ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Search</label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`pl-11 h-12 rounded-xl border-2 ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400' 
                          : 'bg-white/80 border-gray-200/60 text-gray-900 placeholder:text-gray-500'
                      } backdrop-blur-xl transition-all duration-300 focus:scale-105`}
                    />
                  </div>
                </div>

                {[
                  { label: "Topic", value: selectedTopic, onChange: setSelectedTopic, options: topics, icon: Brain },
                  { label: "Language", value: selectedLanguage, onChange: setSelectedLanguage, options: languages, icon: Globe },
                  { label: "Difficulty", value: selectedDifficulty, onChange: setSelectedDifficulty, options: difficulties, icon: Target }
                ].map((filter, index) => (
                  <div key={filter.label}>
                    <label className={`text-sm font-semibold mb-3 block ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>{filter.label}</label>
                    <Select value={filter.value} onValueChange={filter.onChange}>
                      <SelectTrigger className={`h-12 rounded-xl border-2 ${
                        isDarkMode 
                          ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                          : 'bg-white/80 border-gray-200/60 text-gray-900'
                      } backdrop-blur-xl transition-all duration-300 hover:scale-105`}>
                        <SelectValue placeholder={`Select ${filter.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options.map((option: any) => {
                          const Icon = option.icon || filter.icon
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <Icon className="w-4 h-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ))}

                <div>
                  <label className={`text-sm font-semibold mb-3 block ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className={`h-12 rounded-xl border-2 ${
                      isDarkMode 
                        ? 'bg-gray-700/50 border-gray-600/50 text-white' 
                        : 'bg-white/80 border-gray-200/60 text-gray-900'
                    } backdrop-blur-xl transition-all duration-300 hover:scale-105`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="duration-short">Shortest First</SelectItem>
                      <SelectItem value="duration-long">Longest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTopic("all")
                      setSelectedLanguage("all")
                      setSelectedDifficulty("all")
                      setSearchQuery("")
                      setShowFavoritesOnly(false)
                      setSortBy("recent")
                    }}
                    className={`w-full h-12 rounded-xl border-2 font-semibold ${
                      isDarkMode 
                        ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-600/50 text-gray-300' 
                        : 'bg-white/80 hover:bg-gray-50 border-gray-200/60 text-gray-700'
                    } backdrop-blur-xl transition-all duration-300 hover:scale-105`}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resource Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid w-full grid-cols-3 mb-12 p-2 h-16 ${
              isDarkMode 
                ? 'bg-gray-800/60 border-gray-700/30' 
                : 'bg-white/80 border-gray-200/40'
            } backdrop-blur-xl border-2 rounded-2xl shadow-xl`}>
              {[
                { value: "videos", icon: PlayCircle, label: "Videos" },
                { value: "audio", icon: Headset, label: "Audio" },
                { value: "guides", icon: BookMarked, label: "Guides" }
              ].map((tab) => {
                const Icon = tab.icon
                const count = resources.filter(r => r.type === tab.value.slice(0, -1)).length
                return (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className={`flex items-center space-x-3 h-12 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
                      activeTab === tab.value
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : isDarkMode
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* VIDEOS TAB */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, index) => {
                  if (resource.type !== "video") return null
                  const Icon = getResourceIcon(resource.type)
                  const isFavorite = favorites.includes(resource.id)
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      onHoverStart={() => setHoveredCard(resource.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                    >
                      <Card 
                        className={`transition-all duration-500 cursor-pointer group h-full ${
                          isDarkMode 
                            ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/30' 
                            : 'bg-white/60 hover:bg-white/80 border-gray-200/40'
                        } backdrop-blur-xl border-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-2`}
                        onClick={() => handleResourceClick(resource)}
                      >
                        <CardHeader className="relative p-6">
                          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mb-6 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                              <Play className="w-16 h-16 text-white drop-shadow-2xl" />
                            </div>
                            {resource.thumbnail ? (
                              <img
                                src={resource.thumbnail}
                                alt={resource.title}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                              />
                            ) : (
                              <Icon className={`w-20 h-20 ${
                                isDarkMode ? 'text-gray-500' : 'text-gray-400'
                              }`} />
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-8 right-8 rounded-full w-10 h-10 p-0 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-xl shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(resource.id)
                            }}
                          >
                            <Heart className={`w-5 h-5 transition-colors duration-300 ${
                              isFavorite ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          </Button>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getTopicColor(resource.topic)} border font-medium px-3 py-1`}>
                                {resource.topic.replace("-", " ")}
                              </Badge>
                              <Badge className={`${getDifficultyColor(resource.difficulty)} border font-medium px-3 py-1`}>
                                {resource.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className={`text-sm font-semibold ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {resource.rating}
                              </span>
                            </div>
                          </div>
                          
                          <CardTitle className={`text-xl font-bold line-clamp-2 mb-3 ${
                            isDarkMode ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-600'
                          } transition-colors duration-300`}>
                            {resource.title}
                          </CardTitle>
                          
                          <CardDescription className={`line-clamp-3 leading-relaxed ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {resource.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-6">
                          <div className={`flex items-center justify-between text-sm mb-6 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{resource.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span className="font-medium">{resource.views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4" />
                                <span className="capitalize font-medium">{resource.language}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className={`text-xs font-medium ${
                                  isDarkMode 
                                    ? 'bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-600/50' 
                                    : 'bg-gray-100/80 text-gray-600 border-gray-200/60 hover:bg-gray-200/80'
                                } transition-all duration-200 cursor-pointer hover:scale-105`}
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 3 && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isDarkMode 
                                    ? 'bg-gray-700/50 text-gray-400 border-gray-600/50' 
                                    : 'bg-gray-100/80 text-gray-500 border-gray-200/60'
                                }`}
                              >
                                +{resource.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-6 font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            By {resource.author}
                          </p>
                          
                          <div className="flex space-x-3">
                            <Button 
                              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Icon className="w-5 h-5 mr-2" />
                              Watch Video
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`h-12 w-12 p-0 rounded-xl ${
                                isDarkMode 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                              } transition-all duration-300 hover:scale-105`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>

                        {/* Hover glow effect */}
                        <AnimatePresence>
                          {hoveredCard === resource.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl transition-all duration-500 pointer-events-none"
                            />
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>

            {/* AUDIO TAB */}
            <TabsContent value="audio">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, index) => {
                  if (resource.type !== "audio") return null
                  const Icon = getResourceIcon(resource.type)
                  const isFavorite = favorites.includes(resource.id)
                  const isCurrentlyPlaying = currentAudio === resource.id && isPlaying
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className={`transition-all duration-500 h-full ${
                        isDarkMode 
                          ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/30' 
                          : 'bg-white/60 hover:bg-white/80 border-gray-200/40'
                      } backdrop-blur-xl border-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-2`}>
                        <CardHeader className="relative p-6">
                          <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mb-6 overflow-hidden">
                            <Icon className="w-20 h-20 text-purple-600" />
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-8 right-8 rounded-full w-10 h-10 p-0 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-xl shadow-lg"
                            onClick={() => toggleFavorite(resource.id)}
                          >
                            <Heart className={`w-5 h-5 transition-colors duration-300 ${
                              isFavorite ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          </Button>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getTopicColor(resource.topic)} border font-medium px-3 py-1`}>
                                {resource.topic.replace("-", " ")}
                              </Badge>
                              <Badge className={`${getDifficultyColor(resource.difficulty)} border font-medium px-3 py-1`}>
                                {resource.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className={`text-sm font-semibold ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {resource.rating}
                              </span>
                            </div>
                          </div>
                          
                          <CardTitle className={`text-xl font-bold line-clamp-2 mb-3 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {resource.title}
                          </CardTitle>
                          
                          <CardDescription className={`line-clamp-3 leading-relaxed ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {resource.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-6 space-y-6">
                          <div className={`flex items-center justify-between text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{resource.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span className="font-medium">{resource.views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4" />
                                <span className="capitalize font-medium">{resource.language}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className={`text-xs font-medium ${
                                  isDarkMode 
                                    ? 'bg-gray-700/50 text-gray-300 border-gray-600/50' 
                                    : 'bg-gray-100/80 text-gray-600 border-gray-200/60'
                                }`}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <p className={`text-sm font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            By {resource.author}
                          </p>
                          
                          {isCurrentlyPlaying ? (
                            <AudioPlayer 
                              resource={resource} 
                              isPlaying={isPlaying} 
                              onTogglePlay={() => setIsPlaying(!isPlaying)} 
                            />
                          ) : (
                            <div className="flex space-x-3">
                              <Button 
                                className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                onClick={() => handleResourceClick(resource)}
                              >
                                <Icon className="w-5 h-5 mr-2" />
                                Listen
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`h-12 w-12 p-0 rounded-xl ${
                                  isDarkMode 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                } transition-all duration-300 hover:scale-105`}
                              >
                                <Download className="w-5 h-5" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className={`h-12 w-12 p-0 rounded-xl ${
                                  isDarkMode 
                                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                } transition-all duration-300 hover:scale-105`}
                              >
                                <Share2 className="w-5 h-5" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>

            {/* GUIDES TAB */}
            <TabsContent value="guides">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map((resource, index) => {
                  if (resource.type !== "guide") return null
                  const Icon = getResourceIcon(resource.type)
                  const isFavorite = favorites.includes(resource.id)
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`transition-all duration-500 cursor-pointer group h-full ${
                          isDarkMode 
                            ? 'bg-gray-800/40 hover:bg-gray-800/60 border-gray-700/30' 
                            : 'bg-white/60 hover:bg-white/80 border-gray-200/40'
                        } backdrop-blur-xl border-2 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-2`}
                        onClick={() => handleResourceClick(resource)}
                      >
                        <CardHeader className="relative p-6">
                          <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500">
                            <Icon className="w-20 h-20 text-emerald-600" />
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-8 right-8 rounded-full w-10 h-10 p-0 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 backdrop-blur-xl shadow-lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(resource.id)
                            }}
                          >
                            <Heart className={`w-5 h-5 transition-colors duration-300 ${
                              isFavorite ? 'fill-red-500 text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`} />
                          </Button>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${getTopicColor(resource.topic)} border font-medium px-3 py-1`}>
                                {resource.topic.replace("-", " ")}
                              </Badge>
                              <Badge className={`${getDifficultyColor(resource.difficulty)} border font-medium px-3 py-1`}>
                                {resource.difficulty}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className={`text-sm font-semibold ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {resource.rating}
                              </span>
                            </div>
                          </div>
                          
                          <CardTitle className={`text-xl font-bold line-clamp-2 mb-3 ${
                            isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-gray-900 group-hover:text-emerald-600'
                          } transition-colors duration-300`}>
                            {resource.title}
                          </CardTitle>
                          
                          <CardDescription className={`line-clamp-3 leading-relaxed ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {resource.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-6">
                          <div className={`flex items-center justify-between text-sm mb-6 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{resource.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span className="font-medium">{resource.views.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Globe className="w-4 h-4" />
                                <span className="capitalize font-medium">{resource.language}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-6">
                            {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className={`text-xs font-medium ${
                                  isDarkMode 
                                    ? 'bg-gray-700/50 text-gray-300 border-gray-600/50 hover:bg-gray-600/50' 
                                    : 'bg-gray-100/80 text-gray-600 border-gray-200/60 hover:bg-gray-200/80'
                                } transition-all duration-200 cursor-pointer hover:scale-105`}
                              >
                                #{tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 3 && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  isDarkMode 
                                    ? 'bg-gray-700/50 text-gray-400 border-gray-600/50' 
                                    : 'bg-gray-100/80 text-gray-500 border-gray-200/60'
                                }`}
                              >
                                +{resource.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-6 font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            By {resource.author}
                          </p>
                          
                          <div className="flex space-x-3">
                            <Button 
                              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Icon className="w-5 h-5 mr-2" />
                              Read Guide
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`h-12 w-12 p-0 rounded-xl ${
                                isDarkMode 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                              } transition-all duration-300 hover:scale-105`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="w-5 h-5" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className={`h-12 w-12 p-0 rounded-xl ${
                                isDarkMode 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                              } transition-all duration-300 hover:scale-105`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="w-5 h-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className={`text-center py-16 max-w-2xl mx-auto ${
              isDarkMode 
                ? 'bg-gray-800/40 border-gray-700/30' 
                : 'bg-white/60 border-gray-200/40'
            } backdrop-blur-xl border-2 shadow-2xl`}>
              <CardContent className="space-y-6">
                <div className={`w-24 h-24 ${
                  isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                } rounded-full flex items-center justify-center mx-auto`}>
                  <Search className="w-12 h-12" />
                </div>
                <h3 className={`text-3xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  No resources found
                </h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                } text-lg leading-relaxed max-w-lg mx-auto`}>
                  Try adjusting your filters or search terms to find the resources you're looking for.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setSelectedTopic("all")
                    setSelectedLanguage("all")
                    setSelectedDifficulty("all")
                    setSearchQuery("")
                    setShowFavoritesOnly(false)
                  }}
                  className={`px-10 py-4 rounded-2xl font-semibold text-base ${
                    isDarkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-700 border-gray-600/50 text-gray-300' 
                      : 'bg-white/80 hover:bg-gray-50 border-gray-200/60 text-gray-700'
                  } backdrop-blur-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      <Footer />

      <VideoModal open={modalOpen} onClose={() => setModalOpen(false)} videoUrl={activeVideoUrl} />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
