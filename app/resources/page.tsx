"use client"

import { useState, useEffect } from "react"
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
    videoUrl: "https://www.youtube.com/embed/LiUnFJ8P4gM",
    publishedDate: "2024-01-15",
    subtitles: ["English", "Hindi"]
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
    language: "english",
    difficulty: "intermediate",
    author: "Dr. Michael Rodriguez",
    tags: ["sleep", "habits", "wellness"],
    videoUrl: "https://www.youtube.com/embed/fk-_SwHhLLc",
    publishedDate: "2024-02-01"
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
    videoUrl: "https://www.youtube.com/embed/Bk2-dKH2Ta4",
    publishedDate: "2024-02-15"
  },
  {
    id: "v4",
    title: "Mindfulness Meditation for Beginners",
    description: "Introduction to mindfulness practices that can be easily integrated into daily life.",
    type: "video",
    topic: "mindfulness",
    duration: "12:15",
    rating: 4.6,
    views: 12300,
    language: "english",
    difficulty: "beginner",
    author: "Mindfulness Center",
    tags: ["mindfulness", "meditation", "beginners"],
    videoUrl: "https://www.youtube.com/embed/ZToicYcHIOU",
    publishedDate: "2024-03-01"
  },
  {
    id: "v5",
    title: "Building Healthy Relationships",
    description: "Essential communication skills and boundary setting for maintaining healthy relationships.",
    type: "video",
    topic: "relationships",
    duration: "22:30",
    rating: 4.8,
    views: 19800,
    language: "english",
    difficulty: "intermediate",
    author: "Dr. Lisa Park",
    tags: ["relationships", "communication", "boundaries"],
    videoUrl: "https://www.youtube.com/embed/8CrOL-ydFMI",
    publishedDate: "2024-03-15"
  },
  {
    id: "v6",
    title: "Advanced Stress Management Techniques",
    description: "Evidence-based approaches to managing chronic stress and building resilience.",
    type: "video",
    topic: "general",
    duration: "28:45",
    rating: 4.9,
    views: 16500,
    language: "english",
    difficulty: "advanced",
    author: "Stress Research Institute",
    tags: ["stress", "resilience", "advanced"],
    videoUrl: "https://www.youtube.com/embed/RqcjBLMaWCg",
    publishedDate: "2024-04-01"
  },

  // Hindi Videos
  {
    id: "v7",
    title: "चिंता से राहत के लिए श्वास तकनीक",
    description: "चिंता और घबराहट के लिए प्रभावी सांस की तकनीकें सीखें। सिर्फ 10 मिनट में तुरंत राहत पाएं।",
    type: "video",
    topic: "anxiety",
    duration: "11:20",
    rating: 4.7,
    views: 8900,
    language: "hindi",
    difficulty: "beginner",
    author: "डॉ. अमित शर्मा",
    tags: ["सांस", "चिंता", "राहत"],
    videoUrl: "https://www.youtube.com/embed/YQq3StSwg4w",
    publishedDate: "2024-01-20"
  },
  {
    id: "v8",
    title: "बेहतर नींद के लिए योग और ध्यान",
    description: "अच्छी नींद के लिए योग आसन और ध्यान की तकनीकें। रात भर शांति से सोने के उपाय।",
    type: "video",
    topic: "sleep",
    duration: "16:30",
    rating: 4.8,
    views: 12400,
    language: "hindi",
    difficulty: "beginner",
    author: "योग गुरु प्रिया",
    tags: ["योग", "नींद", "ध्यान"],
    videoUrl: "https://www.youtube.com/embed/BiqlZZddZEo",
    publishedDate: "2024-02-05"
  },
  {
    id: "v9",
    title: "परीक्षा की तनाव से कैसे निपटें",
    description: "छात्रों के लिए परीक्षा के डर और तनाव को कम करने की व्यावहारिक रणनीतियां।",
    type: "video",
    topic: "study-stress",
    duration: "14:45",
    rating: 4.6,
    views: 9800,
    language: "hindi",
    difficulty: "beginner",
    author: "एजुकेशन एक्सपर्ट राहुल",
    tags: ["परीक्षा", "तनाव", "छात्र"],
    videoUrl: "https://www.youtube.com/embed/3Z8Z8Z8Z8Z8",
    publishedDate: "2024-02-20"
  },
  {
    id: "v10",
    title: "मानसिक शांति के लिए प्राणायाम",
    description: "मन की शांति और एकाग्रता के लिए विभिन्न प्राणायाम तकनीकों का अभ्यास।",
    type: "video",
    topic: "mindfulness",
    duration: "19:15",
    rating: 4.9,
    views: 15600,
    language: "hindi",
    difficulty: "intermediate",
    author: "स्वामी आनंद",
    tags: ["प्राणायाम", "शांति", "एकाग्रता"],
    videoUrl: "https://www.youtube.com/embed/4Z8Z8Z8Z8Z8",
    publishedDate: "2024-03-10"
  },
  {
    id: "v11",
    title: "रिश्तों में सुधार की कला",
    description: "पारिवारिक और व्यक्तिगत रिश्तों को बेहतर बनाने के लिए संवाद और समझ की तकनीकें।",
    type: "video",
    topic: "relationships",
    duration: "21:00",
    rating: 4.7,
    views: 11200,
    language: "hindi",
    difficulty: "intermediate",
    author: "रिलेशनशिप कोच सुनीता",
    tags: ["रिश्ते", "संवाद", "समझ"],
    videoUrl: "https://www.youtube.com/embed/5Z8Z8Z8Z8Z8",
    publishedDate: "2024-03-25"
  },
  {
    id: "v12",
    title: "जीवन में संतुलन बनाने की कला",
    description: "काम, परिवार और व्यक्तिगत जीवन में संतुलन बनाने के व्यावहारिक तरीके।",
    type: "video",
    topic: "general",
    duration: "24:30",
    rating: 4.8,
    views: 13800,
    language: "hindi",
    difficulty: "advanced",
    author: "लाइफ कोच विकास",
    tags: ["संतुलन", "जीवन", "तरीके"],
    videoUrl: "https://www.youtube.com/embed/6Z8Z8Z8Z8Z8",
    publishedDate: "2024-04-10"
  },

  // Kashmiri Videos
  {
    id: "v13",
    title: "چیٹھن کرنی طریقہ فکری تناؤ کے لیے",
    description: "ذہنی پریشانی اور گھبراہٹ کے لیے مؤثر سانس کی تکنیکیں سیکھیں۔",
    type: "video",
    topic: "anxiety",
    duration: "12:45",
    rating: 4.6,
    views: 4200,
    language: "kashmiri",
    difficulty: "beginner",
    author: "حکیم عبدالرحیم",
    tags: ["سانس", "پریشانی", "آرام"],
    videoUrl: "https://www.youtube.com/embed/7Z8Z8Z8Z8Z8",
    publishedDate: "2024-01-25"
  },
  {
    id: "v14",
    title: "نیند کے لیے کشمیری روایتی طریقے",
    description: "اچھی نیند کے لیے کشمیری روایتی علاج اور طریقے۔",
    type: "video",
    topic: "sleep",
    duration: "15:20",
    rating: 4.7,
    views: 5800,
    language: "kashmiri",
    difficulty: "beginner",
    author: "حکیم فاطمہ",
    tags: ["نیند", "روایتی", "علاج"],
    videoUrl: "https://www.youtube.com/embed/8Z8Z8Z8Z8Z8",
    publishedDate: "2024-02-10"
  },
  {
    id: "v15",
    title: "امتحان کے تناؤ سے نجات",
    description: "طلباء کے لیے امتحان کی فکر اور دباؤ کم کرنے کے طریقے۔",
    type: "video",
    topic: "study-stress",
    duration: "13:30",
    rating: 4.5,
    views: 3900,
    language: "kashmiri",
    difficulty: "beginner",
    author: "استاد احمد علی",
    tags: ["امتحان", "تناؤ", "طلباء"],
    videoUrl: "https://www.youtube.com/embed/9Z8Z8Z8Z8Z8",
    publishedDate: "2024-02-25"
  },
  {
    id: "v16",
    title: "کشمیری صوفی مراقبہ",
    description: "کشمیری صوفی روایت میں مراقبہ اور ذکر کی تکنیکیں۔",
    type: "video",
    topic: "mindfulness",
    duration: "18:00",
    rating: 4.9,
    views: 6700,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "صوفی شیخ نور",
    tags: ["صوفی", "مراقبہ", "ذکر"],
    videoUrl: "https://www.youtube.com/embed/AZ8Z8Z8Z8Z8",
    publishedDate: "2024-03-05"
  },
  {
    id: "v17",
    title: "خاندانی رشتوں کی بہتری",
    description: "خاندانی اور ذاتی رشتوں کو بہتر بنانے کے کشمیری طریقے۔",
    type: "video",
    topic: "relationships",
    duration: "20:15",
    rating: 4.6,
    views: 4500,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "سماجی ماہر زینب",
    tags: ["خاندان", "رشتے", "بہتری"],
    videoUrl: "https://www.youtube.com/embed/BZ8Z8Z8Z8Z8",
    publishedDate: "2024-03-20"
  },
  {
    id: "v18",
    title: "زندگی میں توازن اور سکون",
    description: "زندگی میں توازن لانے اور سکون حاصل کرنے کے روحانی طریقے۔",
    type: "video",
    topic: "general",
    duration: "25:45",
    rating: 4.8,
    views: 5200,
    language: "kashmiri",
    difficulty: "advanced",
    author: "روحانی رہنما یوسف",
    tags: ["توازن", "سکون", "روحانی"],
    videoUrl: "https://www.youtube.com/embed/CZ8Z8Z8Z8Z8",
    publishedDate: "2024-04-05"
  },

  // English Audio
  {
    id: "a1",
    title: "Guided Meditation for Better Sleep",
    description: "A soothing 20-minute guided meditation to help you relax and fall asleep naturally.",
    type: "audio",
    topic: "sleep",
    duration: "20:00",
    rating: 4.9,
    views: 31200,
    language: "english",
    difficulty: "beginner",
    author: "Mindfulness Center",
    tags: ["meditation", "sleep", "relaxation"],
    audioUrl: "/audio/sleep-meditation.mp3",
    publishedDate: "2024-01-10"
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
    language: "english",
    difficulty: "beginner",
    author: "Wellness Institute",
    tags: ["relaxation", "anxiety", "body-awareness"],
    audioUrl: "/audio/muscle-relaxation.mp3",
    publishedDate: "2024-01-18"
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
    language: "english",
    difficulty: "beginner",
    author: "Study Sounds",
    tags: ["focus", "concentration", "background"],
    audioUrl: "/audio/focus-sounds.mp3",
    publishedDate: "2024-02-03"
  },
  {
    id: "a4",
    title: "Mindful Breathing Exercises",
    description: "Various breathing techniques for stress relief and mindfulness practice.",
    type: "audio",
    topic: "mindfulness",
    duration: "15:30",
    rating: 4.7,
    views: 16800,
    language: "english",
    difficulty: "intermediate",
    author: "Breath Work Specialist",
    tags: ["breathing", "mindfulness", "stress-relief"],
    audioUrl: "/audio/breathing-exercises.mp3",
    publishedDate: "2024-02-12"
  },
  {
    id: "a5",
    title: "Relationship Communication Practice",
    description: "Audio exercises to improve communication skills and emotional intelligence.",
    type: "audio",
    topic: "relationships",
    duration: "18:45",
    rating: 4.5,
    views: 8900,
    language: "english",
    difficulty: "intermediate",
    author: "Communication Coach",
    tags: ["communication", "relationships", "emotional-intelligence"],
    audioUrl: "/audio/communication-practice.mp3",
    publishedDate: "2024-02-28"
  },
  {
    id: "a6",
    title: "Advanced Mindfulness Practice",
    description: "Deep mindfulness meditation for experienced practitioners seeking advanced techniques.",
    type: "audio",
    topic: "general",
    duration: "35:00",
    rating: 4.9,
    views: 7600,
    language: "english",
    difficulty: "advanced",
    author: "Advanced Meditation Teacher",
    tags: ["advanced", "mindfulness", "deep-practice"],
    audioUrl: "/audio/advanced-mindfulness.mp3",
    publishedDate: "2024-03-14"
  },

  // Hindi Audio
  {
    id: "a7",
    title: "गहरी नींद के लिए निर्देशित ध्यान",
    description: "20 मिनट का शांतिदायक निर्देशित ध्यान जो आपको प्राकृतिक रूप से सोने में मदद करता है।",
    type: "audio",
    topic: "sleep",
    duration: "20:30",
    rating: 4.8,
    views: 14500,
    language: "hindi",
    difficulty: "beginner",
    author: "ध्यान केंद्र",
    tags: ["ध्यान", "नींद", "शांति"],
    audioUrl: "/audio/hindi-sleep-meditation.mp3",
    publishedDate: "2024-01-12"
  },
  {
    id: "a8",
    title: "चिंता मुक्ति के लिए मंत्र जाप",
    description: "चिंता और तनाव से मुक्ति के लिए शक्तिशाली मंत्रों का जाप।",
    type: "audio",
    topic: "anxiety",
    duration: "22:15",
    rating: 4.7,
    views: 11200,
    language: "hindi",
    difficulty: "beginner",
    author: "मंत्र गुरु",
    tags: ["मंत्र", "चिंता", "जाप"],
    audioUrl: "/audio/hindi-mantra-chanting.mp3",
    publishedDate: "2024-01-22"
  },
  {
    id: "a9",
    title: "पढ़ाई के लिए एकाग्रता संगीत",
    description: "अध्ययन के दौरान मन को शांत और केंद्रित रखने के लिए विशेष संगीत।",
    type: "audio",
    topic: "study-stress",
    duration: "45:00",
    rating: 4.6,
    views: 9800,
    language: "hindi",
    difficulty: "beginner",
    author: "संगीत चिकित्सक",
    tags: ["एकाग्रता", "संगीत", "अध्ययन"],
    audioUrl: "/audio/hindi-study-music.mp3",
    publishedDate: "2024-02-05"
  },
  {
    id: "a10",
    title: "प्राणायाम और सांस की तकनीक",
    description: "विभिन्न प्राणायाम तकनीकों का व्यावहारिक अभ्यास।",
    type: "audio",
    topic: "mindfulness",
    duration: "30:00",
    rating: 4.9,
    views: 18600,
    language: "hindi",
    difficulty: "intermediate",
    author: "योग आचार्य",
    tags: ["प्राणायाम", "सांस", "योग"],
    audioUrl: "/audio/hindi-pranayama.mp3",
    publishedDate: "2024-02-18"
  },
  {
    id: "a11",
    title: "रिश्तों में प्रेम और समझ",
    description: "रिश्तों में प्रेम, करुणा और समझ बढ़ाने के लिए ध्यान अभ्यास।",
    type: "audio",
    topic: "relationships",
    duration: "25:30",
    rating: 4.5,
    views: 7400,
    language: "hindi",
    difficulty: "intermediate",
    author: "प्रेम गुरु",
    tags: ["प्रेम", "रिश्ते", "समझ"],
    audioUrl: "/audio/hindi-love-meditation.mp3",
    publishedDate: "2024-03-02"
  },
  {
    id: "a12",
    title: "आध्यात्मिक जागृति के लिए ध्यान",
    description: "उन्नत साधकों के लिए गहरी आध्यात्मिक जागृति का ध्यान।",
    type: "audio",
    topic: "general",
    duration: "40:00",
    rating: 4.8,
    views: 6200,
    language: "hindi",
    difficulty: "advanced",
    author: "आध्यात्मिक गुरु",
    tags: ["आध्यात्म", "जागृति", "गहरा"],
    audioUrl: "/audio/hindi-spiritual-meditation.mp3",
    publishedDate: "2024-03-16"
  },

  // Kashmiri Audio
  {
    id: "a13",
    title: "کشمیری لوک گیت سکون کے لیے",
    description: "روایتی کشمیری لوک گیت جو دل کو سکون اور امن فراہم کرتے ہیں۔",
    type: "audio",
    topic: "sleep",
    duration: "18:20",
    rating: 4.7,
    views: 3200,
    language: "kashmiri",
    difficulty: "beginner",
    author: "لوک موسیقار",
    tags: ["لوک گیت", "سکون", "نیند"],
    audioUrl: "/audio/kashmiri-folk-songs.mp3",
    publishedDate: "2024-01-14"
  },
  {
    id: "a14",
    title: "صوفی کلام اور ذکر",
    description: "کشمیری صوفی کلام اور ذکر جو دل کی پریشانی دور کرتے ہیں۔",
    type: "audio",
    topic: "anxiety",
    duration: "26:45",
    rating: 4.8,
    views: 4800,
    language: "kashmiri",
    difficulty: "beginner",
    author: "صوفی پیر",
    tags: ["صوفی", "کلام", "ذکر"],
    audioUrl: "/audio/kashmiri-sufi-kalam.mp3",
    publishedDate: "2024-01-26"
  },
  {
    id: "a15",
    title: "پڑھائی کے لیے قرآنی تلاوت",
    description: "خوبصورت قرآنی تلاوت جو ذہن کو پرسکون اور مرکوز رکھتی ہے۔",
    type: "audio",
    topic: "study-stress",
    duration: "35:00",
    rating: 4.9,
    views: 5600,
    language: "kashmiri",
    difficulty: "beginner",
    author: "قاری صاحب",
    tags: ["قرآن", "تلاوت", "پڑھائی"],
    audioUrl: "/audio/kashmiri-quran-recitation.mp3",
    publishedDate: "2024-02-08"
  },
  {
    id: "a16",
    title: "کشمیری صوفی مراقبہ",
    description: "روایتی کشمیری صوفی مراقبہ کی آواز اور رہنمائی۔",
    type: "audio",
    topic: "mindfulness",
    duration: "28:30",
    rating: 4.6,
    views: 4100,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "صوفی استاد",
    tags: ["صوفی", "مراقبہ", "روایتی"],
    audioUrl: "/audio/kashmiri-sufi-meditation.mp3",
    publishedDate: "2024-02-22"
  },
  {
    id: "a17",
    title: "خاندانی محبت کے گیت",
    description: "خاندانی رشتوں میں محبت اور یکجہتی بڑھانے والے گیت۔",
    type: "audio",
    topic: "relationships",
    duration: "22:00",
    rating: 4.4,
    views: 2900,
    language: "kashmiri",
    difficulty: "beginner",
    author: "خاندانی موسیقار",
    tags: ["خاندان", "محبت", "گیت"],
    audioUrl: "/audio/kashmiri-family-songs.mp3",
    publishedDate: "2024-03-06"
  },
  {
    id: "a18",
    title: "روحانی بیداری کا سفر",
    description: "گہری روحانی بیداری اور خود شناسی کے لیے رہنمائی۔",
    type: "audio",
    topic: "general",
    duration: "42:15",
    rating: 4.9,
    views: 3800,
    language: "kashmiri",
    difficulty: "advanced",
    author: "روحانی مرشد",
    tags: ["روحانی", "بیداری", "خود شناسی"],
    audioUrl: "/audio/kashmiri-spiritual-journey.mp3",
    publishedDate: "2024-03-18"
  },

  // English Guides
  {
    id: "g1",
    title: "Complete Guide to Managing Anxiety",
    description: "Comprehensive resource covering understanding, coping strategies, and when to seek professional help.",
    type: "guide",
    topic: "anxiety",
    duration: "15 min read",
    rating: 4.9,
    views: 45600,
    language: "english",
    difficulty: "beginner",
    author: "Mental Health Alliance",
    tags: ["anxiety", "coping", "comprehensive"],
    publishedDate: "2024-01-08"
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
    language: "english",
    difficulty: "beginner",
    author: "Sleep Research Center",
    tags: ["sleep", "students", "health"],
    publishedDate: "2024-01-16"
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
    language: "english",
    difficulty: "intermediate",
    author: "Academic Success Center",
    tags: ["study-techniques", "stress", "productivity"],
    publishedDate: "2024-01-24"
  },
  {
    id: "g4",
    title: "Mindfulness in Daily Life",
    description: "Practical ways to incorporate mindfulness into your everyday routine for better mental health.",
    type: "guide",
    topic: "mindfulness",
    duration: "18 min read",
    rating: 4.6,
    views: 21800,
    language: "english",
    difficulty: "beginner",
    author: "Mindfulness Institute",
    tags: ["mindfulness", "daily-life", "practical"],
    publishedDate: "2024-02-01"
  },
  {
    id: "g5",
    title: "Building Strong Relationships",
    description: "Essential guide to developing and maintaining healthy relationships in all areas of life.",
    type: "guide",
    topic: "relationships",
    duration: "25 min read",
    rating: 4.8,
    views: 19400,
    language: "english",
    difficulty: "intermediate",
    author: "Relationship Experts",
    tags: ["relationships", "communication", "healthy"],
    publishedDate: "2024-02-14"
  },
  {
    id: "g6",
    title: "Advanced Mental Wellness Strategies",
    description: "Comprehensive guide for those seeking advanced techniques in mental health and wellness.",
    type: "guide",
    topic: "general",
    duration: "30 min read",
    rating: 4.9,
    views: 15200,
    language: "english",
    difficulty: "advanced",
    author: "Wellness Research Team",
    tags: ["advanced", "wellness", "comprehensive"],
    publishedDate: "2024-02-28"
  },

  // Hindi Guides
  {
    id: "g7",
    title: "चिंता प्रबंधन की संपूर्ण गाइड",
    description: "चिंता को समझना, उससे निपटने की रणनीतियां और कब पेशेवर मदद लेनी चाहिए।",
    type: "guide",
    topic: "anxiety",
    duration: "16 मिनट पढ़ें",
    rating: 4.7,
    views: 18900,
    language: "hindi",
    difficulty: "beginner",
    author: "मानसिक स्वास्थ्य गठबंधन",
    tags: ["चिंता", "प्रबंधन", "संपूर्ण"],
    publishedDate: "2024-01-11"
  },
  {
    id: "g8",
    title: "छात्रों के लिए स्वस्थ नींद गाइड",
    description: "छात्रों के लिए नींद की गुणवत्ता और शैक्षणिक प्रदर्शन सुधारने की रणनीतियां।",
    type: "guide",
    topic: "sleep",
    duration: "14 मिनट पढ़ें",
    rating: 4.6,
    views: 12800,
    language: "hindi",
    difficulty: "beginner",
    author: "नींद अनुसंधान केंद्र",
    tags: ["नींद", "छात्र", "स्वास्थ्य"],
    publishedDate: "2024-01-19"
  },
  {
    id: "g9",
    title: "प्रभावी अध्ययन तकनीक और तनाव प्रबंधन",
    description: "मानसिक कल्याण बनाए रखते हुए अधिक कुशलता से अध्ययन करने के तरीके।",
    type: "guide",
    topic: "study-stress",
    duration: "22 मिनट पढ़ें",
    rating: 4.8,
    views: 16700,
    language: "hindi",
    difficulty: "intermediate",
    author: "शैक्षणिक सफलता केंद्र",
    tags: ["अध्ययन", "तनाव", "तकनीक"],
    publishedDate: "2024-01-27"
  },
  {
    id: "g10",
    title: "दैनिक जीवन में सचेतनता",
    description: "बेहतर मानसिक स्वास्थ्य के लिए रोजमर्रा की दिनचर्या में सचेतनता शामिल करने के तरीके।",
    type: "guide",
    topic: "mindfulness",
    duration: "19 मिनट पढ़ें",
    rating: 4.5,
    views: 11400,
    language: "hindi",
    difficulty: "beginner",
    author: "सचेतनता संस्थान",
    tags: ["सचेतनता", "दैनिक", "व्यावहारिक"],
    publishedDate: "2024-02-04"
  },
  {
    id: "g11",
    title: "मजबूत रिश्ते बनाना",
    description: "जीवन के सभी क्षेत्रों में स्वस्थ रिश्ते विकसित करने और बनाए रखने की गाइड।",
    type: "guide",
    topic: "relationships",
    duration: "24 मिनट पढ़ें",
    rating: 4.7,
    views: 9600,
    language: "hindi",
    difficulty: "intermediate",
    author: "रिश्ता विशेषज्ञ",
    tags: ["रिश्ते", "मजबूत", "स्वस्थ"],
    publishedDate: "2024-02-17"
  },
  {
    id: "g12",
    title: "उन्नत मानसिक कल्याण रणनीतियां",
    description: "मानसिक स्वास्थ्य और कल्याण में उन्नत तकनीकों की खोज करने वालों के लिए गाइड।",
    type: "guide",
    topic: "general",
    duration: "28 मिनट पढ़ें",
    rating: 4.9,
    views: 8200,
    language: "hindi",
    difficulty: "advanced",
    author: "कल्याण अनुसंधान टीम",
    tags: ["उन्नत", "कल्याण", "रणनीति"],
    publishedDate: "2024-03-03"
  },

  // Kashmiri Guides
  {
    id: "g13",
    title: "پریشانی سے نجات کی مکمل گائیڈ",
    description: "پریشانی کو سمجھنا، اس سے نمٹنے کی حکمت عملیاں اور کب پیشہ ورانہ مدد لینی چاہیے۔",
    type: "guide",
    topic: "anxiety",
    duration: "17 منٹ پڑھیں",
    rating: 4.6,
    views: 4200,
    language: "kashmiri",
    difficulty: "beginner",
    author: "ذہنی صحت اتحاد",
    tags: ["پریشانی", "نجات", "مکمل"],
    publishedDate: "2024-01-13"
  },
  {
    id: "g14",
    title: "طلباء کے لیے صحت مند نیند",
    description: "طلباء کے لیے نیند کا معیار اور تعلیمی کارکردگی بہتر بنانے کی حکمت عملیاں۔",
    type: "guide",
    topic: "sleep",
    duration: "15 منٹ پڑھیں",
    rating: 4.5,
    views: 3800,
    language: "kashmiri",
    difficulty: "beginner",
    author: "نیند تحقیقی مرکز",
    tags: ["نیند", "طلباء", "صحت"],
    publishedDate: "2024-01-21"
  },
  {
    id: "g15",
    title: "مؤثر مطالعہ کی تکنیکیں",
    description: "ذہنی بہبود برقرار رکھتے ہوئے زیادہ مؤثر طریقے سے مطالعہ کرنے کے طریقے۔",
    type: "guide",
    topic: "study-stress",
    duration: "23 منٹ پڑھیں",
    rating: 4.7,
    views: 5100,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "تعلیمی کامیابی مرکز",
    tags: ["مطالعہ", "تکنیک", "مؤثر"],
    publishedDate: "2024-01-29"
  },
  {
    id: "g16",
    title: "روزمرہ زندگی میں شعور",
    description: "بہتر ذہنی صحت کے لیے روزانہ کی روٹین میں شعور شامل کرنے کے طریقے۔",
    type: "guide",
    topic: "mindfulness",
    duration: "20 منٹ پڑھیں",
    rating: 4.4,
    views: 3600,
    language: "kashmiri",
    difficulty: "beginner",
    author: "شعور انسٹی ٹیوٹ",
    tags: ["شعور", "روزمرہ", "عملی"],
    publishedDate: "2024-02-06"
  },
  {
    id: "g17",
    title: "مضبوط رشتے بنانا",
    description: "زندگی کے تمام شعبوں میں صحت مند رشتے پیدا کرنے اور برقرار رکھنے کی گائیڈ۔",
    type: "guide",
    topic: "relationships",
    duration: "26 منٹ پڑھیں",
    rating: 4.6,
    views: 2900,
    language: "kashmiri",
    difficulty: "intermediate",
    author: "رشتہ ماہرین",
    tags: ["رشتے", "مضبوط", "صحت مند"],
    publishedDate: "2024-02-19"
  },
  {
    id: "g18",
    title: "اعلیٰ ذہنی بہبود کی حکمت عملیاں",
    description: "ذہنی صحت اور بہبود میں اعلیٰ تکنیکوں کی تلاش کرنے والوں کے لیے گائیڈ۔",
    type: "guide",
    topic: "general",
    duration: "31 منٹ پڑھیں",
    rating: 4.8,
    views: 4400,
    language: "kashmiri",
    difficulty: "advanced",
    author: "بہبود تحقیقی ٹیم",
    tags: ["اعلیٰ", "بہبود", "حکمت عملی"],
    publishedDate: "2024-03-05"
  }
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

function VideoModal({ open, onClose, videoUrl }: { open: boolean; onClose: () => void; videoUrl: string | null }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-4 relative max-w-5xl w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg text-gray-600 hover:text-gray-900 transition focus:outline-none focus:ring-2 focus:ring-purple-400 z-10 bg-white p-1"
          aria-label="Close video modal"
        >
          <X className="w-5 h-5" />
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

function AudioPlayer({ resource, isPlaying, onTogglePlay }: { resource: Resource; isPlaying: boolean; onTogglePlay: () => void }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState([75])

  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePlay}
            className="rounded-full w-10 h-10 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div>
            <p className="font-medium text-sm">{resource.title}</p>
            <p className="text-xs text-muted-foreground">{resource.author}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress value={(currentTime / duration) * 100} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>2:30</span>
          <span>{resource.duration}</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Volume2 className="w-4 h-4" />
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  )
}

export default function ResourcesPage() {
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
  const { toast } = useToast()

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
      return updated.slice(0, 10) // Keep only last 10
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
      // Handle guide click - could open in new tab or modal
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
        return "bg-purple-100 text-purple-800"
      case "anxiety":
        return "bg-yellow-100 text-yellow-800"
      case "study-stress":
        return "bg-red-100 text-red-800"
      case "mindfulness":
        return "bg-green-100 text-green-800"
      case "relationships":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-foreground mb-3">Mental Health Resources</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access videos, audio content, and guides in multiple languages to support your mental wellness journey
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{resources.reduce((acc, r) => acc + r.views, 0).toLocaleString()} total views</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{resources.length} resources</span>
            </Badge>
            <Badge variant="outline" className="flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>3 languages</span>
            </Badge>
          </div>
        </div>

        {/* Popular & Recent Resources */}
        {!searchQuery && (
          <div className="mb-10 space-y-6">
            {/* Popular This Week */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Popular This Week</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-4 pb-4">
                    {popularResources.map((resource) => {
                      const Icon = getResourceIcon(resource.type)
                      return (
                        <Card key={resource.id} className="flex-shrink-0 w-72 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResourceClick(resource)}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-2">
                              <Icon className="w-5 h-5 text-primary" />
                              <Badge className={getTopicColor(resource.topic)} variant="secondary">
                                {resource.topic.replace("-", " ")}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{resource.title}</h3>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{resource.language}</span>
                              <span>{resource.views.toLocaleString()} views</span>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recently Viewed */}
            {recentResources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Recently Viewed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex space-x-4 pb-4">
                      {recentResources.map((resource) => {
                        if (!resource) return null
                        const Icon = getResourceIcon(resource.type)
                        return (
                          <Card key={resource.id} className="flex-shrink-0 w-72 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResourceClick(resource)}>
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-3 mb-2">
                                <Icon className="w-5 h-5 text-primary" />
                                <Badge className={getTopicColor(resource.topic)} variant="secondary">
                                  {resource.topic.replace("-", " ")}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{resource.title}</h3>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{resource.language}</span>
                                <span>{resource.duration}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Advanced Filters */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter Resources</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={showFavoritesOnly}
                    onCheckedChange={setShowFavoritesOnly}
                  />
                  <span className="text-sm">Favorites only</span>
                </div>
                <Badge variant="outline">{filteredResources.length} results</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>{difficulty.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
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
                  className="w-full"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-10">
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4" />
              <span>Videos ({resources.filter(r => r.type === "video").length})</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center space-x-2">
              <Headset className="w-4 h-4" />
              <span>Audio ({resources.filter(r => r.type === "audio").length})</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center space-x-2">
              <BookMarked className="w-4 h-4" />
              <span>Guides ({resources.filter(r => r.type === "guide").length})</span>
            </TabsTrigger>
          </TabsList>

          {/* VIDEOS TAB */}
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                if (resource.type !== "video") return null
                const Icon = getResourceIcon(resource.type)
                const isFavorite = favorites.includes(resource.id)
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleResourceClick(resource)}>
                    <CardHeader className="relative">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                        {resource.thumbnail ? (
                          <img
                            src={resource.thumbnail}
                            alt={resource.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = "none")}
                          />
                        ) : (
                          <Icon className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(resource.id)
                        }}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                      </Button>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTopicColor(resource.topic)} variant="secondary">
                            {resource.topic.replace("-", " ")}
                          </Badge>
                          <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                            {resource.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{resource.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{resource.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span className="capitalize">{resource.language}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">By {resource.author}</p>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1" variant="default">
                          <Icon className="w-4 h-4 mr-2" />
                          Watch Video
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* AUDIO TAB */}
          <TabsContent value="audio">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                if (resource.type !== "audio") return null
                const Icon = getResourceIcon(resource.type)
                const isFavorite = favorites.includes(resource.id)
                const isCurrentlyPlaying = currentAudio === resource.id && isPlaying
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        <Icon className="w-16 h-16 text-primary" />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(resource.id)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                      </Button>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTopicColor(resource.topic)} variant="secondary">
                            {resource.topic.replace("-", " ")}
                          </Badge>
                          <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                            {resource.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2">{resource.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{resource.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{resource.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span className="capitalize">{resource.language}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">By {resource.author}</p>
                      
                      {isCurrentlyPlaying ? (
                        <AudioPlayer 
                          resource={resource} 
                          isPlaying={isPlaying} 
                          onTogglePlay={() => setIsPlaying(!isPlaying)} 
                        />
                      ) : (
                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1" 
                            variant="default"
                            onClick={() => handleResourceClick(resource)}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            Listen
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* GUIDES TAB */}
          <TabsContent value="guides">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                if (resource.type !== "guide") return null
                const Icon = getResourceIcon(resource.type)
                const isFavorite = favorites.includes(resource.id)
                return (
                  <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => handleResourceClick(resource)}>
                    <CardHeader className="relative">
                      <div className="aspect-video bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-16 h-16 text-accent" />
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(resource.id)
                        }}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                      </Button>

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getTopicColor(resource.topic)} variant="secondary">
                            {resource.topic.replace("-", " ")}
                          </Badge>
                          <Badge className={getDifficultyColor(resource.difficulty)} variant="secondary">
                            {resource.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground line-clamp-3">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{resource.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{resource.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4" />
                            <span className="capitalize">{resource.language}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">By {resource.author}</p>
                      
                      <div className="flex space-x-2">
                        <Button className="flex-1" variant="default">
                          <Icon className="w-4 h-4 mr-2" />
                          Read Guide
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
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
          <Card className="text-center py-16 max-w-lg mx-auto">
            <CardContent>
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
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
                  setSelectedDifficulty("all")
                  setSearchQuery("")
                  setShowFavoritesOnly(false)
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
