"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  ThumbsUp,
  MessageCircle,
  Flag,
  MoreHorizontal,
  Clock,
  Users,
  Shield,
  Heart,
  Search,
  Eye,
} from "lucide-react"

interface Post {
  id: string
  title: string
  content: string
  author: string
  timestamp: Date
  upvotes: number
  commentCount: number
  category: string
  tags: string[]
  isUpvoted: boolean
  views: number
}

interface Comment {
  id: string
  postId: string
  content: string
  author: string
  timestamp: Date
  upvotes: number
  isUpvoted: boolean
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "anxiety", label: "Anxiety Support" },
  { value: "depression", label: "Depression Support" },
  { value: "stress", label: "Stress & Overwhelm" },
  { value: "sleep", label: "Sleep Issues" },
  { value: "relationships", label: "Relationships" },
  { value: "academic", label: "Academic Pressure" },
  { value: "general", label: "General Support" },
]

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "trending", label: "Trending" },
]

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Feeling overwhelmed with finals coming up",
    content:
      "Hey everyone, I'm really struggling with the pressure of upcoming finals. I can't seem to focus and I'm constantly worried about failing. Has anyone else felt this way? How did you cope?",
    author: "Anonymous Student #247",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    upvotes: 23,
    commentCount: 8,
    category: "academic",
    tags: ["finals", "stress", "studying"],
    isUpvoted: false,
    views: 156,
  },
  {
    id: "2",
    title: "Small victory: I went to class today despite my anxiety",
    content:
      "I know it might not seem like much, but I've been struggling to leave my room for the past week due to anxiety. Today I managed to attend my morning lecture and I'm proud of myself for taking that step.",
    author: "Anonymous Warrior #89",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    upvotes: 47,
    commentCount: 12,
    category: "anxiety",
    tags: ["victory", "anxiety", "progress"],
    isUpvoted: true,
    views: 203,
  },
  {
    id: "3",
    title: "Tips for better sleep when your mind won't stop racing?",
    content:
      "I've been having trouble falling asleep because my thoughts just keep racing. I've tried meditation apps but my mind still wanders. What techniques have worked for you?",
    author: "Anonymous Dreamer #156",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    upvotes: 31,
    commentCount: 15,
    category: "sleep",
    tags: ["sleep", "racing-thoughts", "tips"],
    isUpvoted: false,
    views: 189,
  },
  {
    id: "4",
    title: "Feeling isolated and disconnected from friends",
    content:
      "Lately I've been feeling really disconnected from my friend group. I feel like I'm always the one reaching out and I'm starting to wonder if they actually want me around. Anyone else experience this?",
    author: "Anonymous Heart #312",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    upvotes: 19,
    commentCount: 6,
    category: "relationships",
    tags: ["friendship", "isolation", "loneliness"],
    isUpvoted: false,
    views: 134,
  },
]

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [isNewPostOpen, setIsNewPostOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    tags: "",
  })
  const { toast } = useToast()

  const filteredPosts = posts
    .filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.upvotes - a.upvotes
        case "trending":
          return b.upvotes + b.commentCount - (a.upvotes + a.commentCount)
        case "recent":
        default:
          return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })

  const handleUpvote = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              upvotes: post.isUpvoted ? post.upvotes - 1 : post.upvotes + 1,
              isUpvoted: !post.isUpvoted,
            }
          : post,
      ),
    )
  }

  const handleNewPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content for your post.",
        variant: "destructive",
      })
      return
    }

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: `Anonymous User #${Math.floor(Math.random() * 999) + 1}`,
      timestamp: new Date(),
      upvotes: 0,
      commentCount: 0,
      category: newPost.category,
      tags: newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      isUpvoted: false,
      views: 0,
    }

    setPosts((prevPosts) => [post, ...prevPosts])
    setNewPost({ title: "", content: "", category: "general", tags: "" })
    setIsNewPostOpen(false)

    toast({
      title: "Post Created Successfully!",
      description: "Your anonymous post has been shared with the community.",
    })
  }

  const handleReport = (postId: string) => {
    toast({
      title: "Post Reported",
      description: "Thank you for helping keep our community safe. Our moderators will review this post.",
    })
  }

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      anxiety: "bg-yellow-100 text-yellow-800",
      depression: "bg-purple-100 text-purple-800",
      stress: "bg-red-100 text-red-800",
      sleep: "bg-purple-100 text-purple-800",
      relationships: "bg-pink-100 text-pink-800",
      academic: "bg-purple-100 text-purple-800",
      general: "bg-gray-100 text-gray-800",
    }
    return colors[category] || colors.general
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Peer Support Forum</h1>
          <p className="text-muted-foreground">
            Connect with others in a safe, anonymous community where you can share experiences and support each other
          </p>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Shield className="w-5 h-5" />
              <span>Community Guidelines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <Heart className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Be Kind & Supportive</p>
                  <p className="text-muted-foreground">Treat others with empathy and respect</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Stay Anonymous</p>
                  <p className="text-muted-foreground">Don't share personal identifying information</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Flag className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Report Concerns</p>
                  <p className="text-muted-foreground">Help us maintain a safe space for everyone</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Forum Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      New Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                      <DialogDescription>
                        Share your thoughts or ask for support from the community. Your post will be anonymous.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
                        <Input
                          value={newPost.title}
                          onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="What's on your mind?"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                        <Select
                          value={newPost.category}
                          onValueChange={(value) => setNewPost((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.slice(1).map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Content</label>
                        <Textarea
                          value={newPost.content}
                          onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Share your thoughts, experiences, or ask for support..."
                          rows={6}
                          maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{newPost.content.length}/1000 characters</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Tags (Optional)</label>
                        <Input
                          value={newPost.tags}
                          onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))}
                          placeholder="anxiety, stress, support (comma separated)"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" onClick={() => setIsNewPostOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleNewPost} className="flex-1">
                          Post Anonymously
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getCategoryColor(post.category)} variant="secondary">
                            {categories.find((c) => c.value === post.category)?.label || post.category}
                          </Badge>
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {post.author.split("#")[1]?.slice(-2) || "??"}
                              </AvatarFallback>
                            </Avatar>
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{getTimeAgo(post.timestamp)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReport(post.id)}>
                            <Flag className="w-4 h-4 mr-2" />
                            Report Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground mb-4">{post.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={post.isUpvoted ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpvote(post.id)}
                        className="flex items-center space-x-1"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.upvotes}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 bg-transparent">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedCategory !== "all"
                        ? "Try adjusting your search or filters to find more posts."
                        : "Be the first to start a conversation in this community!"}
                    </p>
                    <Button onClick={() => setIsNewPostOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
