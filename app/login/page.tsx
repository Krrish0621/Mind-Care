"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authenticateUser, registerUser } from "@/lib/auth"
import { User, Lock, Shield, Eye, EyeOff, Sparkles, Brain, Heart, ArrowRight, LogIn, CheckCircle, AlertCircle, PlusCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// TypeScript interfaces
interface RegisterDialogProps {
  open: boolean
  onClose: () => void
  onRegister: (data: { username: string }) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
}

interface RegisterResult {
  success: boolean
  error?: string
}

// Register Modal Component
function RegisterDialog({ open, onClose, onRegister }: RegisterDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000))

    const regResult: RegisterResult = await registerUser({ name, email, password })
    
    if (regResult.success) {
      onRegister({ username: email })
      setName("")
      setEmail("")
      setPassword("")
      setShowPassword(false)
      setError("")
      onClose()
    } else {
      setError(regResult.error || "Registration failed. Please try again.")
    }
    setIsLoading(false)
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white/10 border border-white/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors duration-200 flex items-center justify-center text-xl font-light"
            type="button"
          >
            ×
          </button>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-4 border border-purple-300/30">
              <PlusCircle className="w-6 h-6 text-purple-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-slate-300">Join MindCare today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pl-12 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                  placeholder="Create a password (min 6 chars)"
                  required
                  minLength={6}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 bg-red-500/20 border border-red-400/30 rounded-xl p-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="relative flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Main Login Page Component
export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "admin">("student")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showRegister, setShowRegister] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem("role")
    if (storedRole) {
      if (storedRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [router])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    const isValid = authenticateUser(role, username, password)

    if (isValid) {
      localStorage.setItem("role", role)

      const audio = document.querySelector("audio") as HTMLAudioElement | null
      if (audio) {
        audio.volume = 0.4
        audio
          .play()
          .then(() => console.log("🎵 Background music started"))
          .catch((err) => console.warn("Autoplay blocked:", err))
      }

      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }, 300)
    } else {
      setError("Invalid credentials. Please try again.")
    }
    
    setIsLoading(false)
  }

  const handleRegisterSuccess = (data: { username: string }) => {
    localStorage.setItem("role", "student")
    localStorage.setItem("username", data.username)
    setShowRegister(false)
    
    // Play audio if available
    const audio = document.querySelector("audio") as HTMLAudioElement | null
    if (audio) {
      audio.volume = 0.4
      audio.play().catch(() => {})
    }
    
    setTimeout(() => {
      router.push("/")
    }, 300)
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Mouse follower */}
      <div 
        className="fixed pointer-events-none z-10 w-6 h-6 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-sm transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
        }}
      />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-spin-slow"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 animate-float hidden xl:block">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-300" />
          </div>
        </div>
        <div className="absolute top-32 right-32 animate-float-delayed hidden xl:block">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-blue-300" />
          </div>
        </div>
        <div className="absolute bottom-32 left-32 animate-bounce-slow hidden xl:block">
          <div className="w-6 h-6 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-full"></div>
        </div>
        <div className="absolute bottom-20 right-80 animate-float hidden xl:block">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full"></div>
        </div>
      </div>

      {/* Left Side - Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-16 relative z-20"
      >
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur-lg"></div>
              <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                MindCare
              </h1>
              <p className="text-purple-200 font-medium">Your Mental Wellness Partner</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Welcome Back to Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Mental Health Journey</span>
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            Continue your path to wellness with our AI-powered support, professional counseling, and caring community.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-semibold">24/7 AI Support</p>
              <p className="text-slate-300 text-sm">Always here when you need us</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <p className="text-white font-semibold">100% Secure</p>
              <p className="text-slate-300 text-sm">Your privacy is protected</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10 relative">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-4 border border-purple-300/30">
                <Sparkles className="w-6 h-6 text-purple-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
              <p className="text-slate-300">Welcome back to MindCare</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "student")}
                  className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                >
                  <option value="student" className="text-gray-800">Student</option>
                  <option value="admin" className="text-gray-800">Admin</option>
                </select>
              </motion.div>

              {/* Username */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">Username</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 pl-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 pr-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center space-x-2 bg-red-500/20 border border-red-400/30 rounded-xl p-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-300 text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </motion.div>
            </form>

            {/* Register Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="inline-flex items-center space-x-2 text-purple-300 hover:text-purple-200 bg-white/5 hover:bg-white/10 border border-purple-300/30 hover:border-purple-300/50 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                <span>New user? Create Account</span>
              </button>
            </motion.div>

            {/* Credentials Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-200 font-semibold mb-2">Demo Credentials:</p>
                  <div className="space-y-1 text-slate-300">
                    <p><span className="font-medium text-white">Admin:</span> admin / admin123</p>
                    <p><span className="font-medium text-white">Student:</span> student / student123</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Logo */}
            <div className="lg:hidden mt-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <Brain className="w-6 h-6 text-purple-300" />
                <span className="text-white font-bold text-lg">MindCare</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Register Dialog */}
      <RegisterDialog 
        open={showRegister} 
        onClose={() => setShowRegister(false)} 
        onRegister={handleRegisterSuccess} 
      />

      {/* Styles */}
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
      `}</style>
    </div>
  )
}
