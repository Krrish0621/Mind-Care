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

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("videos")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Resources</h1>
          <p className="text-muted-foreground">
            Access videos, audio content, and guides to support your mental wellness journey
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                            <Icon className="w-4 h-4" />
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
                          <Globe className="w-4 h-4" />
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Videos</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center space-x-2">
              <Headphones className="w-4 h-4" />
              <span>Audio</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Guides</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = getResourceIcon(resource.type)
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <div className="flex items-start justify-between">
                        <Badge className={getTopicColor(resource.topic)} variant="secondary">
                          {resource.topic.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{resource.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">By {resource.author}</p>
                      <Button className="w-full">
                        <Icon className="w-4 h-4 mr-2" />
                        Watch Video
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = getResourceIcon(resource.type)
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-12 h-12 text-primary" />
                      </div>
                      <div className="flex items-start justify-between">
                        <Badge className={getTopicColor(resource.topic)} variant="secondary">
                          {resource.topic.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{resource.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">By {resource.author}</p>
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <Icon className="w-4 h-4 mr-2" />
                          Listen
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = getResourceIcon(resource.type)
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="aspect-video bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-12 h-12 text-accent" />
                      </div>
                      <div className="flex items-start justify-between">
                        <Badge className={getTopicColor(resource.topic)} variant="secondary">
                          {resource.topic.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{resource.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{resource.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">By {resource.author}</p>
                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <Icon className="w-4 h-4 mr-2" />
                          Read Guide
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
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
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms to find the resources you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTopic("all")
                  setSelectedLanguage("all")
                  setSearchQuery("")
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
