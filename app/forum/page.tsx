"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Plus, ThumbsUp, MessageCircle, Flag, MoreHorizontal, Clock, Users, Shield, Heart, Search, Eye, Send, Sparkles, CornerDownRight, Loader2 } from "lucide-react";
import { createPost, createComment, getPosts, getCommentsForPost, upvoteItem, incrementPostView } from "@/lib/firestore";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface Post {
  id: string;
  title: string;
  content: string;
  authorName: string;
  timestamp: Date;
  upvoteCount: number;
  commentCount: number;
  category: string;
  tags: string[];
  views: number;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  authorName: string;
  timestamp: Date;
  upvoteCount: number;
}

const categories = [ { value: "all", label: "All Categories" }, { value: "anxiety", label: "Anxiety Support" }, { value: "depression", label: "Depression Support" }, { value: "stress", label: "Stress & Overwhelm" }, { value: "sleep", label: "Sleep Issues" }, { value: "relationships", label: "Relationships" }, { value: "academic", label: "Academic Pressure" }, { value: "general", label: "General Support" },];
const sortOptions = [ { value: "recent", label: "Most Recent" }, { value: "popular", label: "Most Popular" }, { value: "trending", label: "Trending" },];

export default function ForumPage() {
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "general", tags: "" });
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upvotedItems, setUpvotedItems] = useState(new Set<string>());
  const { toast } = useToast();

  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    const postsUnsubscribe = getPosts((fetchedPosts) => {
      setPosts(fetchedPosts as Post[]);
      setIsLoading(false);
    });
    return () => {
      authUnsubscribe();
      postsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (selectedPost) {
      const commentsUnsubscribe = getCommentsForPost(selectedPost.id, (fetchedComments) => {
        setComments(fetchedComments as Comment[]);
      });
      return () => commentsUnsubscribe();
    }
  }, [selectedPost]);

  const filteredPosts = posts
    .filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      const matchesSearch = searchQuery === "" || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.content.toLowerCase().includes(searchQuery.toLowerCase()) || post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular": return b.upvoteCount - a.upvoteCount;
        case "trending": return (b.upvoteCount + b.commentCount) - (a.upvoteCount + a.commentCount);
        default: return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

  const handleUpvote = (itemId: string, type: 'post' | 'comment') => {
    if (upvotedItems.has(itemId)) {
      toast({ title: "Already Upvoted", description: "You can only upvote once." });
      return;
    }
    upvoteItem(itemId, type);
    setUpvotedItems(prev => new Set(prev).add(itemId));
  };

  const handleNewPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({ title: "Missing Information", description: "Please fill in both title and content.", variant: "destructive" });
      return;
    }
    if (!currentUser) {
      toast({ title: "Not Logged In", description: "You must be logged in to post.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    const postData = {
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    const result = await createPost(postData);
    setIsSubmitting(false);

    if (result.success) {
      setNewPost({ title: "", content: "", category: "general", tags: "" });
      setIsNewPostOpen(false);
      toast({ title: "Post Created Successfully!", description: "Your anonymous post has been shared." });
    } else {
      toast({ title: "Error", description: "Failed to create post. Please try again.", variant: "destructive" });
    }
  };

  const handleNewComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    if (!currentUser) {
      toast({ title: "Not Logged In", description: "You must be logged in to comment.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const result = await createComment(selectedPost.id, newComment);
    setIsSubmitting(false);

    if (result.success) {
      setNewComment("");
      toast({ title: "Comment Added!", description: "Your comment has been posted." });
    } else {
      toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
    }
  };

  const handlePostClick = (post: Post) => {
    incrementPostView(post.id);
    setSelectedPost(post);
  };
  
  const handleReport = (type: 'post' | 'comment', id: string) => {
    toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} Reported`, description: "Thank you for helping keep our community safe." });
  };
  
  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryColors = (category: string) => {
    const colors = isDarkMode ? { anxiety: "bg-yellow-900/40 text-yellow-300 border-yellow-700/50", depression: "bg-purple-900/40 text-purple-300 border-purple-700/50", stress: "bg-red-900/40 text-red-300 border-red-700/50", sleep: "bg-blue-900/40 text-blue-300 border-blue-700/50", relationships: "bg-pink-900/40 text-pink-300 border-pink-700/50", academic: "bg-emerald-900/40 text-emerald-300 border-emerald-700/50", general: "bg-slate-700 text-slate-300 border-slate-600" } : { anxiety: "bg-yellow-100 text-yellow-800 border-yellow-200", depression: "bg-purple-100 text-purple-800 border-purple-200", stress: "bg-red-100 text-red-800 border-red-200", sleep: "bg-blue-100 text-blue-800 border-blue-200", relationships: "bg-pink-100 text-pink-800 border-pink-200", academic: "bg-emerald-100 text-emerald-800 border-emerald-200", general: "bg-gray-100 text-gray-800 border-gray-200" };
    return colors[category as keyof typeof colors] || colors.general;
  };
  
  const CommentComponent = ({ comment }: { comment: Comment }) => (
    <div className="flex items-start space-x-4">
      <Avatar className="w-9 h-9 border-2 border-white shadow-md">
        <AvatarFallback className={`text-xs font-bold ${isDarkMode ? 'bg-slate-600 text-slate-200' : 'bg-gray-200 text-gray-700'}`}>
          {comment.authorName.split("#")[1]?.slice(-2) || "??"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className={`p-4 rounded-2xl rounded-tl-none ${isDarkMode ? 'bg-slate-700/70' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{comment.authorName}</span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{getTimeAgo(comment.timestamp)}</span>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{comment.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <Button variant="ghost" size="sm" onClick={() => handleUpvote(comment.id, 'comment')} className={`flex items-center space-x-1 h-8 px-2 rounded-full transition-colors ${upvotedItems.has(comment.id) ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-800')} ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
            <ThumbsUp className={`w-4 h-4 ${upvotedItems.has(comment.id) ? 'fill-current' : ''}`} />
            <span className="text-xs font-semibold">{comment.upvoteCount}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${isDarkMode ? "bg-gradient-to-br from-[#141627] via-[#20223a] to-[#2d2547] text-white" : "bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-100/60"}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${isDarkMode ? "bg-gradient-to-r from-purple-800/30 to-pink-800/25" : "bg-gradient-to-r from-purple-400/20 to-pink-400/20"}`}></div>
        <div className={`absolute bottom-32 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${isDarkMode ? "bg-gradient-to-r from-blue-900/25 to-cyan-800/15" : "bg-gradient-to-r from-blue-400/15 to-cyan-400/15"}`}></div>
      </div>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12 text-center">
          <div className={`inline-flex items-center justify-center p-3 rounded-full mb-6 backdrop-blur-sm border ${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-white/10' : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-white/20'}`}>
            <Users className="w-6 h-6 text-purple-500 mr-2" />
            <MessageCircle className="w-6 h-6 text-pink-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent pb-2">
            Peer Support Forum
          </h1>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            Connect with others in a safe, anonymous community where you can share experiences and support each other
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="lg:col-span-1">
            <Card className={`sticky top-24 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ${isDarkMode ? 'bg-slate-900/80 border-slate-700/30 shadow-indigo-900/20' : 'bg-white/80'}`}>
              <CardHeader className={`border-b ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-slate-700/50' : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-white/20'}`}>
                <CardTitle className="flex items-center space-x-2 text-xl"><Plus className="w-5 h-5 text-purple-500" /><span>Forum Actions</span></CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                  <DialogTrigger asChild><Button className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"><Plus className="w-5 h-5 mr-2" />New Post</Button></DialogTrigger>
                  <DialogContent className={`max-w-2xl rounded-3xl border-0 shadow-2xl ${isDarkMode ? 'bg-slate-900/90 backdrop-blur-xl border border-slate-700 text-white' : 'bg-white/95 backdrop-blur-xl'}`}>
                    <DialogHeader><DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create New Post</DialogTitle><DialogDescription className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Your post will be anonymous.</DialogDescription></DialogHeader>
                    <div className="space-y-6 p-2">
                      <div><label className={`text-sm font-bold mb-3 block ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Title</label><Input value={newPost.title} onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))} placeholder="What's on your mind?" maxLength={100} className={`h-12 px-4 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${isDarkMode ? 'bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent' : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent'}`}/></div>
                      <div><label className={`text-sm font-bold mb-3 block ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Category</label><Select value={newPost.category} onValueChange={(value) => setNewPost((prev) => ({ ...prev, category: value }))}><SelectTrigger className={`h-12 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${isDarkMode ? 'bg-slate-800/80 border-slate-600/50 text-slate-200' : 'bg-white/80 border-gray-200'}`}><SelectValue /></SelectTrigger><SelectContent>{categories.slice(1).map((category) => (<SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>))}</SelectContent></Select></div>
                      <div><label className={`text-sm font-bold mb-3 block ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Content</label><Textarea value={newPost.content} onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))} placeholder="Share your thoughts..." rows={6} maxLength={1000} className={`p-4 resize-none backdrop-blur-sm rounded-2xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-800/60 border-slate-600 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent' : 'bg-white/60 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent'}`}/><p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{newPost.content.length}/1000</p></div>
                      <div><label className={`text-sm font-bold mb-3 block ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Tags</label><Input value={newPost.tags} onChange={(e) => setNewPost((prev) => ({ ...prev, tags: e.target.value }))} placeholder="anxiety, stress (comma separated)" className={`h-12 px-4 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${isDarkMode ? 'bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent' : 'bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent'}`}/></div>
                      <div className="flex space-x-4 pt-4"><Button variant="outline" onClick={() => setIsNewPostOpen(false)} className={`flex-1 rounded-2xl ${isDarkMode ? 'bg-slate-700/80 border-slate-600 hover:bg-slate-700' : 'hover:bg-gray-50'}`}>Cancel</Button><Button onClick={handleNewPost} disabled={isSubmitting} className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-2xl shadow-lg">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Post Anonymously'}</Button></div>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="space-y-3"><label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Category</label><Select value={selectedCategory} onValueChange={setSelectedCategory}><SelectTrigger className={`h-12 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${isDarkMode ? 'bg-slate-800/80 border-slate-600/50 text-slate-200' : 'bg-white/80 border-gray-200'}`}><SelectValue /></SelectTrigger><SelectContent>{categories.map((category) => (<SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-3"><label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Sort By</label><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className={`h-12 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${isDarkMode ? 'bg-slate-800/80 border-slate-600/50 text-slate-200' : 'bg-white/80 border-gray-200'}`}><SelectValue /></SelectTrigger><SelectContent>{sortOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}</SelectContent></Select></div>
              </CardContent>
            </Card>
          </motion.div>
          <div className="lg:col-span-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="mb-8"><div className="relative"><Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} /><Input placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`pl-12 h-14 backdrop-blur-xl border-0 shadow-xl rounded-2xl focus:ring-2 focus:ring-purple-400 focus:shadow-2xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800/70 text-white placeholder-slate-400' : 'bg-white/80'}`}/></div></motion.div>
            <div className="space-y-8">
              {isLoading ? <div className="flex justify-center py-16"><Loader2 className="w-12 h-12 animate-spin text-purple-500"/></div> : filteredPosts.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index, duration: 0.4 }}>
                  <Card className={`hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer backdrop-blur-xl border-0 shadow-xl rounded-3xl overflow-hidden group ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'}`} onClick={() => handlePostClick(post)}>
                    <CardHeader className={`border-b ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-50/50 border-white/30'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1"><div className="flex items-center space-x-3 mb-3"><Badge className={`${getCategoryColors(post.category)} border font-medium px-3 py-1 rounded-full shadow-sm`} variant="secondary">{categories.find((c) => c.value === post.category)?.label || post.category}</Badge></div><CardTitle className={`text-xl font-bold mb-3 group-hover:text-purple-500 transition-colors leading-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{post.title}</CardTitle><div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}><div className="flex items-center space-x-2"><Avatar className="w-6 h-6 border-2 border-white shadow-md"><AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold">{post.authorName.split("#")[1]?.slice(-2) || "??"}</AvatarFallback></Avatar><span className="font-medium">{post.authorName}</span></div><div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{getTimeAgo(post.timestamp)}</span></div><div className="flex items-center space-x-1"><Eye className="w-4 h-4" /><span>{post.views}</span></div></div></div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className={`mb-6 line-clamp-3 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{post.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant={upvotedItems.has(post.id) ? "default" : "outline"} size="sm" onClick={(e) => { e.stopPropagation(); handleUpvote(post.id, 'post'); }} className={`flex items-center space-x-2 rounded-2xl px-4 py-2 transition-all duration-300 ${upvotedItems.has(post.id) ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : (isDarkMode ? 'bg-slate-700/80 border-slate-600/50 hover:bg-slate-700' : 'bg-white/60 border-gray-200/80 hover:bg-blue-50')}`}><ThumbsUp className="w-4 h-4" /><span>{post.upvoteCount}</span></Button>
                        <div className={`flex items-center space-x-2 rounded-2xl px-4 py-2 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}><MessageCircle className="w-4 h-4" /><span>{post.commentCount}</span></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className={`max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-0 border-0 shadow-2xl rounded-3xl ${isDarkMode ? 'bg-slate-900/90 backdrop-blur-xl border border-slate-700 text-white' : 'bg-white/95 backdrop-blur-xl'}`}>
            {selectedPost && (<>
              <div className={`flex-shrink-0 p-6 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-gray-200/80'}`}>
                <div className="flex items-center space-x-3 mb-4"><Badge className={`${getCategoryColors(selectedPost.category)} border font-medium px-3 py-1 rounded-full shadow-sm`} variant="secondary">{categories.find((c) => c.value === selectedPost.category)?.label || selectedPost.category}</Badge></div>
                <h2 className="text-2xl font-bold leading-tight mb-4">{selectedPost.title}</h2>
                <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-2"><Avatar className="w-6 h-6"><AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs font-bold">{selectedPost.authorName.split("#")[1]?.slice(-2) || "??"}</AvatarFallback></Avatar><span className="font-medium">{selectedPost.authorName}</span></div>
                  <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{getTimeAgo(selectedPost.timestamp)}</span></div>
                  <div className="flex items-center space-x-1"><Eye className="w-4 h-4" /><span>{selectedPost.views}</span></div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8"><div><p className={`text-base leading-relaxed mb-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{selectedPost.content}</p><div className="flex items-center space-x-4"><Button variant={upvotedItems.has(selectedPost.id) ? "default" : "outline"} size="sm" onClick={() => handleUpvote(selectedPost.id, 'post')} className={`flex items-center space-x-2 rounded-2xl px-4 py-2 transition-all duration-300 ${upvotedItems.has(selectedPost.id) ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' : (isDarkMode ? 'bg-slate-700/80 border-slate-600/50 hover:bg-slate-700' : 'bg-white/60 border-gray-200/80 hover:bg-blue-50')}`}><ThumbsUp className="w-4 h-4" /><span>{selectedPost.upvoteCount}</span></Button><div className={`flex items-center space-x-2 text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}><MessageCircle className="w-4 h-4" /><span>{comments.length} comments</span></div></div></div>
                  <div className={`h-[1px] bg-gradient-to-r from-transparent via-${isDarkMode ? 'slate-700' : 'gray-200'} to-transparent`} />
                  <div><h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3><div className={`mb-8 p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/60 border-slate-700/50' : 'bg-gray-50/80 border-gray-200/50'}`}><Textarea placeholder="Share your thoughts or support..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} className={`mb-4 p-3 text-sm rounded-2xl transition-all duration-300 border ${isDarkMode ? 'bg-slate-700 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent' : 'bg-white border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 focus:border-transparent'}`}/><div className="flex justify-end"><Button onClick={handleNewComment} disabled={!newComment.trim() || isSubmitting} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-lg px-4">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4 mr-2" />} Post Comment</Button></div></div>
                    <div className="space-y-6">{comments.length > 0 ? (comments.map((comment) => <CommentComponent key={comment.id} comment={comment}/>)) : (<div className={`text-center py-12 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50/80'}`}><MessageCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`} /><p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>No comments yet. Be the first to share your thoughts!</p></div>)}</div>
                  </div>
                </div>
              </div>
            </>)}
          </DialogContent>
        </Dialog>
      </main>
      <Footer/>
    </div>
  )
}