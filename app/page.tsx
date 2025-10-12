"use client"
// comment
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageCircle, Calendar, BookOpen, Users, Heart, Shield, Clock, Star, Sparkles, Brain, Zap, Moon, ArrowRight, PlayCircle, CheckCircle } from "lucide-react"
import { Typewriter } from "react-simple-typewriter"
import { useDarkMode } from "@/contexts/DarkModeContext"

export default function HomePage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    if (!storedRole) {
      router.push("/login")
    } else {
      setRole(storedRole)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!role) return null

  const features = [
    {
      icon: MessageCircle,
      title: "AI Chat Support",
      description: "Get immediate support from our compassionate AI assistant available 24/7",
      link: "/chat",
      gradient: "from-purple-600 to-violet-600",
      iconBg: "bg-purple-600",
      textColor: "text-white",
      descColor: "text-purple-100",
      cardBg: "bg-gradient-to-br from-purple-600 via-purple-700 to-violet-700",
      buttonColor: "bg-white text-purple-700 hover:bg-purple-100",
      shadowColor: "shadow-purple-500/30",
      buttonText: "Start Chatting"
    },
    {
      icon: Calendar,
      title: "Book Counselor",
      description: "Schedule sessions with licensed mental health professionals",
      link: "/book",
      gradient: "from-blue-600 to-cyan-600",
      iconBg: "bg-blue-600",
      textColor: "text-white",
      descColor: "text-blue-100",
      cardBg: "bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700",
      buttonColor: "bg-white text-blue-700 hover:bg-blue-100",
      shadowColor: "shadow-blue-500/30",
      buttonText: "Book Session"
    },
    {
      icon: BookOpen,
      title: "Resource Hub",
      description: "Access videos, guides, and tools for anxiety, sleep, and wellness",
      link: "/resources",
      gradient: "from-emerald-600 to-teal-600",
      iconBg: "bg-emerald-600",
      textColor: "text-white",
      descColor: "text-emerald-100",
      cardBg: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700",
      buttonColor: "bg-white text-emerald-700 hover:bg-emerald-100",
      shadowColor: "shadow-emerald-500/30",
      buttonText: "Browse Resources"
    },
    {
      icon: Users,
      title: "Peer Forum",
      description: "Connect with others in a safe, anonymous community environment",
      link: "/forum",
      gradient: "from-orange-600 to-red-600",
      iconBg: "bg-orange-600",
      textColor: "text-white",
      descColor: "text-orange-100",
      cardBg: "bg-gradient-to-br from-orange-600 via-orange-700 to-red-700",
      buttonColor: "bg-white text-orange-700 hover:bg-orange-100",
      shadowColor: "shadow-orange-500/30",
      buttonText: "Join Community"
    },
  ]

  const trustFeatures = [
    {
      icon: Shield,
      title: "Confidential & Secure",
      description: "All conversations and data are encrypted and protected by strict privacy policies",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "24/7 Availability", 
      description: "Support is always available when you need it, day or night",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every interaction is designed with empathy and understanding at its core",
      gradient: "from-pink-500 to-rose-600"
    }
  ]

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900/80 to-indigo-900/60' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/60'
    } relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-72 h-72 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30' 
            : 'bg-gradient-to-r from-purple-400/20 to-pink-400/20'
        } rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-32 left-10 w-96 h-96 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-600/25 to-cyan-600/25' 
            : 'bg-gradient-to-r from-blue-400/15 to-cyan-400/15'
        } rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${
          isDarkMode 
            ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20' 
            : 'bg-gradient-to-r from-indigo-400/10 to-purple-400/10'
        } rounded-full blur-3xl animate-spin-slow`}></div>
      </div>

      {/* Mouse follower */}
      <div 
        className={`fixed pointer-events-none z-50 w-6 h-6 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-400/40 to-pink-400/40' 
            : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
        } rounded-full blur-sm transition-all duration-300 ease-out`}
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      />

      <Navigation />

      <main className="relative z-10">
        {/* Enhanced Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            {/* Floating Elements */}
            <div className="absolute top-20 left-20 animate-float hidden lg:block">
              <div className={`w-16 h-16 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 border-white/10' 
                  : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-white/20'
              } rounded-2xl backdrop-blur-sm border flex items-center justify-center transition-all duration-500`}>
                <Brain className={`w-8 h-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
            <div className="absolute top-32 right-24 animate-float-delayed hidden lg:block">
              <div className={`w-12 h-12 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-blue-600/40 to-cyan-600/40 border-white/10' 
                  : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-white/20'
              } rounded-xl backdrop-blur-sm border flex items-center justify-center transition-all duration-500`}>
                <Heart className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
            <div className="absolute top-40 left-1/3 animate-bounce-slow hidden lg:block">
              <div className={`w-8 h-8 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-600/50 to-teal-600/50' 
                  : 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30'
              } rounded-full transition-all duration-500`}></div>
            </div>

            {/* Main Heading */}
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center p-3 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-white/10' 
                  : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-white/20'
              } rounded-full mb-6 backdrop-blur-sm border transition-all duration-500`}>
                <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />
                <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-semibold text-sm`}>
                  Welcome to MindCare
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 min-h-[150px] md:min-h-[200px] flex items-center justify-center px-4">
                <span className={`${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' 
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
                } bg-clip-text text-transparent text-center leading-tight transition-all duration-500`}>
                  <Typewriter
                    words={[
                      "Your Mental Health Journey Starts Here",
                      "We're Here to Help You Heal",
                      "Book a Confidential Counseling Session",
                      "Access Instant AI Support",
                      "You Are Not Alone – We're With You",
                    ]}
                    loop={true}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
              </h1>
            </div>

            <p className={`text-lg md:text-xl ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            } mb-10 max-w-3xl mx-auto leading-relaxed px-4 transition-all duration-500`}>
              Access compassionate AI support, connect with licensed counselors, explore helpful resources, and join a
              supportive community—all in one safe, confidential platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 px-4">
              <Button
                asChild
                size="lg"
                className={`h-14 md:h-16 px-8 md:px-10 text-lg font-semibold ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                } text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0`}
              >
                <Link href="/chat">
                  <MessageCircle className="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3" />
                  Talk to AI Support
                  <ArrowRight className="w-4 md:w-5 h-4 md:h-5 ml-2 md:ml-3" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className={`h-14 md:h-16 px-8 md:px-10 text-lg font-semibold ${
                  isDarkMode 
                    ? 'bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500 hover:text-white' 
                    : 'bg-white/80 backdrop-blur-sm border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                } rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
              >
                <Link href="/book">
                  <Calendar className="w-5 md:w-6 h-5 md:h-6 mr-2 md:mr-3" />
                  Book a Counselor
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto px-4">
              <div className={`${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-700/50' 
                  : 'bg-white/60 border-white/20'
              } backdrop-blur-sm rounded-2xl p-4 md:p-6 border shadow-lg transition-all duration-500`}>
                <div className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                } mb-2 transition-all duration-500`}>24/7</div>
                <div className={`${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                } font-medium text-sm md:text-base transition-all duration-500`}>AI Support Available</div>
              </div>
              <div className={`${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-700/50' 
                  : 'bg-white/60 border-white/20'
              } backdrop-blur-sm rounded-2xl p-4 md:p-6 border shadow-lg transition-all duration-500`}>
                <div className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? 'text-purple-400' : 'text-purple-600'
                } mb-2 transition-all duration-500`}>100%</div>
                <div className={`${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                } font-medium text-sm md:text-base transition-all duration-500`}>Confidential & Secure</div>
              </div>
              <div className={`${
                isDarkMode 
                  ? 'bg-gray-800/60 border-gray-700/50' 
                  : 'bg-white/60 border-white/20'
              } backdrop-blur-sm rounded-2xl p-4 md:p-6 border shadow-lg transition-all duration-500`}>
                <div className={`text-2xl md:text-3xl font-bold ${
                  isDarkMode ? 'text-pink-400' : 'text-pink-600'
                } mb-2 transition-all duration-500`}>500+</div>
                <div className={`${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                } font-medium text-sm md:text-base transition-all duration-500`}>Lives Supported</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 md:mb-20">
              <div className={`inline-flex items-center justify-center p-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20' 
                  : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10'
              } rounded-full mb-6 transition-all duration-500`}>
                <PlayCircle className={`w-6 h-6 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600'
              } bg-clip-text text-transparent mb-6 transition-all duration-500`}>
                Comprehensive Mental Health Support
              </h2>
              <p className={`text-lg md:text-xl ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              } max-w-3xl mx-auto leading-relaxed transition-all duration-500`}>
                Everything you need for your mental wellness journey, designed with care and available whenever you need it
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="group relative">
                    <Card className={`relative ${feature.cardBg} border-0 shadow-2xl hover:shadow-3xl ${feature.shadowColor} rounded-3xl overflow-hidden backdrop-blur-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-full cursor-pointer`}>
                      <Link href={feature.link} className="block h-full">
                        <CardHeader className="text-center pb-4 p-6">
                          <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:rotate-6 transition-transform duration-300`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <CardTitle className={`text-xl font-bold ${feature.textColor} mb-3`}>
                            {feature.title}
                          </CardTitle>
                          <CardDescription className={`${feature.descColor} leading-relaxed text-base`}>
                            {feature.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 px-6 pb-6">
                          <Button
                            className={`w-full h-12 ${feature.buttonColor} font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 pointer-events-none`}
                          >
                            {feature.buttonText}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Trust & Safety Section */}
        <section className={`py-20 md:py-24 px-4 sm:px-6 lg:px-8 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/50 to-indigo-900/30' 
            : 'bg-gradient-to-br from-white/50 to-indigo-50/30'
        } backdrop-blur-sm relative transition-all duration-500`}>
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-indigo-600/10 to-purple-600/10' 
              : 'bg-gradient-to-r from-indigo-500/5 to-purple-500/5'
          } transition-all duration-500`}></div>
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16 md:mb-20">
              <div className={`inline-flex items-center justify-center p-2 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20' 
                  : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
              } rounded-full mb-6 transition-all duration-500`}>
                <Shield className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600'
              } bg-clip-text text-transparent mb-6 transition-all duration-500`}>
                Your Safety & Privacy Matter
              </h2>
              <p className={`text-lg md:text-xl ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              } max-w-3xl mx-auto leading-relaxed transition-all duration-500`}>
                We're committed to providing a secure, confidential environment for your mental health journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {trustFeatures.map((trust, index) => {
                const Icon = trust.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="relative mb-8">
                      <div className={`relative w-20 h-20 bg-gradient-to-r ${trust.gradient} rounded-full flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold ${
                      isDarkMode ? 'text-gray-100 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'
                    } mb-4 transition-colors duration-300`}>
                      {trust.title}
                    </h3>
                    <p className={`${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    } leading-relaxed max-w-sm mx-auto transition-all duration-500`}>
                      {trust.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Enhanced Quote Section */}
        <section className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-indigo-700/20 via-purple-700/20 to-pink-700/20' 
              : 'bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10'
          } transition-all duration-500`}></div>
          <div className="absolute inset-0">
            <div className={`absolute top-10 left-10 w-32 h-32 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20' 
                : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
            } rounded-full blur-xl animate-pulse transition-all duration-500`}></div>
            <div className={`absolute bottom-10 right-10 w-40 h-40 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20' 
                : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
            } rounded-full blur-xl animate-pulse delay-1000 transition-all duration-500`}></div>
          </div>
          
          <div className="mx-auto max-w-5xl text-center relative z-10">
            <div className="relative mb-10">
              <div className={`absolute -inset-4 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-yellow-500/30 to-orange-500/30' 
                  : 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
              } rounded-full blur-2xl animate-pulse transition-all duration-500`}></div>
              <div className={`relative w-16 md:w-20 h-16 md:h-20 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-500'
              } rounded-full flex items-center justify-center mx-auto shadow-2xl transition-all duration-500`}>
                <Star className="w-8 md:w-10 h-8 md:h-10 text-white" />
              </div>
            </div>
            
            <blockquote className={`text-2xl md:text-3xl lg:text-4xl font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            } mb-8 leading-relaxed px-4 transition-all duration-500`}>
              <span className={`${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400' 
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent transition-all duration-500`}>
                "You are not alone in this journey. Every step forward, no matter how small, is progress worth celebrating."
              </span>
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4 mb-12">
              <div className={`w-12 h-12 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              } rounded-full flex items-center justify-center transition-all duration-500`}>
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className={`text-lg ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              } font-semibold transition-all duration-500`}>— MindCare Community</p>
            </div>

            {/* CTA Section */}
            <div className={`${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700/20' 
                : 'bg-white/90 border-white/20'
            } backdrop-blur-xl rounded-3xl p-6 md:p-8 border shadow-2xl max-w-2xl mx-auto transition-all duration-500`}>
              <h3 className={`text-xl md:text-2xl font-bold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              } mb-4 transition-all duration-500`}>Ready to start your journey?</h3>
              <p className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-6 transition-all duration-500`}>Take the first step towards better mental health today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className={`h-12 md:h-14 px-6 md:px-8 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                  } text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0`}
                >
                  <Link href="/chat">
                    <MessageCircle className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    Start Free Chat
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={`h-12 md:h-14 px-6 md:px-8 ${
                    isDarkMode 
                      ? 'bg-gray-700/90 border-2 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500 hover:text-white' 
                      : 'bg-white/90 border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white'
                  } font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                >
                  <Link href="/resources">
                    <BookOpen className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                    Explore Resources
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-2deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}
