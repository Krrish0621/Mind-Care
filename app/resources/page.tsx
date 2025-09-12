"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
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
} from "lucide-react"

interface Resource {
  id: string
  title: string
  description: string
  type: "video" | "audio" | "guide"
  topic: "sleep" | "anxiety" | "study-stress" | "general"
  duration: string
  rating: number
  views: number
  language: string
  thumbnail?: string
  videoUrl?: string
  author: string
  tags: string[]
}

const resources: Resource[] = [
  // Videos
  {
    id: "v1",
    title: "Deep Breathing for Anxiety Relief and Stress",
    description: "Learn effective breathing techniques to manage anxiety and panic attacks in just 10 minutes.",
    type: "video",
    topic: "anxiety",
    duration: "10:30",
    rating: 4.8,
    views: 15420,
    language: "English",
    author: "Dr. Sarah Chen",
    tags: ["breathing", "anxiety", "quick-relief"],
    thumbnail: "/thumbnails/anxiety.jpg",
    videoUrl: "https://www.youtube.com/embed/LiUnFJ8P4gM?si=_OH7tVtImNUltq9_",
  },
  {
    id: "v2",
    title: "Sleep Hygiene: Building Better Sleep Habits",
    description: "Comprehensive guide to improving your sleep quality through proven sleep hygiene practices.",
    type: "video",
    topic: "sleep",
    duration: "18:45",
    rating: 4.9,
    views: 23100,
    language: "English",
    author: "Dr. Michael Rodriguez",
    tags: ["sleep", "habits", "wellness"],
    thumbnail: "/thumbnails/sleep.jpg",
    videoUrl: "https://www.youtube.com/embed/fk-_SwHhLLc?si=y9DxbP3wY5Rtd8x7",
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
    language: "English",
    author: "Dr. Emily Johnson",
    tags: ["study", "exams", "students"],
    thumbnail: "/thumbnails/study-stress.jpg",
    videoUrl: "https://www.youtube.com/embed/Bk2-dKH2Ta4?si=v5Ijpoog5OUHKZb8",
  },
  // Audio
  {
    id: "a1",
    title: "Guided Meditation for Better Sleep",
    description: "A soothing 20-minute guided meditation to help you relax and fall asleep naturally.",
    type: "audio",
    topic: "sleep",
    duration: "20:00",
    rating: 4.9,
    views: 31200,
    language: "English",
    author: "Mindfulness Center",
    tags: ["meditation", "sleep", "relaxation"],
    thumbnail: "/thumbnails/meditation-audio.jpg",
  },
  {
    id: "a2",
    title: "Progressive Muscle Relaxation",
    description: "Learn to release physical tension and anxiety through systematic muscle relaxation techniques.",
    type: "audio",
    topic: "anxiety",
    duration: "25:15",
    rating: 4.8,
    views: 19800,
    language: "English",
    author: "Wellness Institute",
    tags: ["relaxation", "anxiety", "body-awareness"],
    thumbnail: "/thumbnails/muscle-relaxation.jpg",
  },
  {
    id: "a3",
    title: "Focus and Concentration Sounds",
    description: "Background sounds designed to enhance focus and reduce distractions during study sessions.",
    type: "audio",
    topic: "study-stress",
    duration: "60:00",
    rating: 4.6,
    views: 12400,
    language: "English",
    author: "Study Sounds",
    tags: ["focus", "concentration", "background"],
    thumbnail: "/thumbnails/focus-sounds.jpg",
  },
  // Guides
  {
    id: "g1",
    title: "Complete Guide to Managing Anxiety",
    description:
      "Comprehensive resource covering understanding, coping strategies, and when to seek professional help.",
    type: "guide",
    topic: "anxiety",
    duration: "15 min read",
    rating: 4.9,
    views: 45600,
    language: "English",
    author: "Mental Health Alliance",
    tags: ["anxiety", "coping", "comprehensive"],
  },
  {
    id: "g2",
    title: "Student's Guide to Healthy Sleep",
    description: "Evidence-based strategies for students to improve sleep quality and academic performance.",
    type: "guide",
    topic: "sleep",
    duration: "12 min read",
    rating: 4.8,
    views: 28900,
    language: "English",
    author: "Sleep Research Center",
    tags: ["sleep", "students", "health"],
  },
  {
    id: "g3",
    title: "Effective Study Techniques and Stress Management",
    description: "Research-backed methods to study more efficiently while maintaining mental well-being.",
    type: "guide",
    topic: "study-stress",
    duration: "20 min read",
    rating: 4.7,
    views: 34200,
    language: "English",
    author: "Academic Success Center",
    tags: ["study-techniques", "stress", "productivity"],
  },
]

const topics = [
  { value: "all", label: "All Topics", icon: Brain },
  { value: "sleep", label: "Sleep", icon: Moon },
  { value: "anxiety", label: "Anxiety", icon: Zap },
  { value: "study-stress", label: "Study Stress", icon: BookOpen },
]

const languages = [
  { value: "all", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Español" },
  { value: "french", label: "Français" },
  { value: "mandarin", label: "中文" },
]

function VideoModal({ open, onClose, videoUrl }: { open: boolean; onClose: () => void; videoUrl: string | null }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-4 relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg text-gray-600 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Close video modal"
        >
          &times;
        </button>
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {videoUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              frameBorder="0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 select-none">
              No video available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null)

  const filteredResources = resources.filter((resource) => {
    const matchesTab =
      (activeTab === "videos" && resource.type === "video") ||
      (activeTab === "audio" && resource.type === "audio") ||
      (activeTab === "guides" && resource.type === "guide")

    const matchesTopic = selectedTopic === "all" || resource.topic === selectedTopic
    const matchesLanguage = selectedLanguage === "all" || resource.language.toLowerCase() === selectedLanguage
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesTab && matchesTopic && matchesLanguage && matchesSearch
  })

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play
      case "audio":
        return Headphones
      case "guide":
        return BookOpen
      default:
        return BookOpen
    }
  }

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case "sleep":
        return "bg-purple-100 text-purple-800"
      case "anxiety":
        return "bg-yellow-100 text-yellow-800"
      case "study-stress":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access videos, audio content, and guides to support your mental wellness journey
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
              <Filter className="w-5 h-5" />
              <span>Filter Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Topic</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => {
                      const Icon = topic.icon
                      return (
                        <SelectItem key={topic.value} value={topic.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5" />
                            <span>{topic.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((language) => (
                      <SelectItem key={language.value} value={language.value}>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-5 h-5" />
                          <span>{language.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTopic("all")
                    setSelectedLanguage("all")
                    setSearchQuery("")
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-10 text-lg font-semibold">
            <TabsTrigger value="videos" className="flex items-center space-x-2 justify-center">
              <Play className="w-5 h-5" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center space-x-2 justify-center">
              <Headphones className="w-5 h-5" />
              <span>Audio</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center space-x-2 justify-center">
              <BookOpen className="w-5 h-5" />
              <span>Guides</span>
            </TabsTrigger>
          </TabsList>

          {/* VIDEOS TAB */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => {
                if (resource.type !== "video") return null
                const Icon = getResourceIcon(resource.type)
                return (
                  <Card key={resource.id} className="hover:shadow-2xl transition-shadow rounded-xl">
                    <CardHeader>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <Icon className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${getTopicColor(resource.topic)} uppercase tracking-widest text-xs font-semibold`}>
                          {resource.topic.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold truncate">{resource.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-5 h-5" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-5 h-5" />
                          <span>{resource.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-lg font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 truncate">By {resource.author}</p>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setActiveVideoUrl(resource.videoUrl || null)
                          setModalOpen(true)
                        }}
                        variant="default"
                      >
                        <Icon className="w-5 h-5 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* AUDIO TAB */}
          <TabsContent value="audio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => {
                if (resource.type !== "audio") return null
                const Icon = getResourceIcon(resource.type)
                return (
                  <Card key={resource.id} className="hover:shadow-2xl transition-shadow rounded-xl">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <Icon className="w-12 h-12 text-primary" />
                        )}
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${getTopicColor(resource.topic)} uppercase tracking-widest text-xs font-semibold`}>
                          {resource.topic.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold truncate">{resource.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-5 h-5" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-5 h-5" />
                          <span>{resource.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-lg font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 truncate">By {resource.author}</p>
                      <div className="flex space-x-3">
                        <Button className="flex-1" variant="default">
                          <Icon className="w-5 h-5 mr-2" />
                          Listen
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* GUIDES TAB */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((resource) => {
                if (resource.type !== "guide") return null
                const Icon = getResourceIcon(resource.type)
                return (
                  <Card key={resource.id} className="hover:shadow-2xl transition-shadow rounded-xl">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-12 h-12 text-accent" />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${getTopicColor(resource.topic)} uppercase tracking-widest text-xs font-semibold`}>
                          {resource.topic.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold truncate">{resource.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-5">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-5 h-5" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-5 h-5" />
                          <span>{resource.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-5">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-1 rounded-lg font-medium">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-6 truncate">By {resource.author}</p>
                      <div className="flex space-x-3">
                        <Button className="flex-1" variant="default">
                          <Icon className="w-5 h-5 mr-2" />
                          Read Guide
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>

        {filteredResources.length === 0 && (
          <Card className="text-center py-14 max-w-lg mx-auto">
            <CardContent>
              <Heart className="w-14 h-14 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-foreground mb-3">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms to find the resources you're looking for.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectedTopic("all")
                  setSelectedLanguage("all")
                  setSearchQuery("")
                }}
                className="mx-auto px-10 py-3 rounded-full"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />

      <VideoModal open={modalOpen} onClose={() => setModalOpen(false)} videoUrl={activeVideoUrl} />
    </div>
  )
}
