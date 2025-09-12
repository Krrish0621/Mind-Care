"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authenticateUser } from "@/lib/auth"
import { User, Lock, Shield } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"student" | "admin">("student")
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role) {
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = authenticateUser(role, username, password)

    if (isValid) {
      localStorage.setItem("role", role)

      // ✅ Attempt to play background music
      const audio = document.querySelector("audio") as HTMLAudioElement | null
      if (audio) {
        audio.volume = 0.4
        audio
          .play()
          .then(() => console.log("🎵 Background music started"))
          .catch((err) => console.warn("Autoplay blocked:", err))
      }

      // ✅ Navigate after short delay (optional for smoother audio start)
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }, 300) // 300ms delay helps audio start before navigation
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-purple-100">
      {/* 🌊 Animated Wave Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 w-full h-40 animate-wave-slow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#a78bfa"
            fillOpacity="0.4"
            d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,224C672,213,768,171,864,154.7C960,139,1056,149,1152,176C1248,203,1344,245,1392,266.7L1440,288L1440,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-full h-40 animate-wave-fast"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#c4b5fd"
            fillOpacity="0.6"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,224C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* 🔐 Login Card */}
      <motion.form
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onSubmit={handleLogin}
        className="relative z-10 backdrop-blur-xl bg-white/80 p-8 rounded-2xl shadow-xl w-full max-w-sm border border-white/40"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold text-center mb-6 text-purple-700"
        >
          Mind-Care Login 💜
        </motion.h2>

        {/* Role Selection */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "student")}
            className="w-full mt-1 p-3 border rounded-lg bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {/* Username */}
        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Username</span>
          <div className="flex items-center mt-1 bg-white rounded-lg border px-3">
            <User className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              className="w-full ml-2 p-2 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </label>

        {/* Password */}
        <label className="block mb-6">
          <span className="text-sm font-medium text-gray-700">Password</span>
          <div className="flex items-center mt-1 bg-white rounded-lg border px-3">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              className="w-full ml-2 p-2 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </label>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-300"
        >
          Login
        </motion.button>

        <p className="mt-6 text-xs text-center text-gray-600">
          <Shield className="inline w-4 h-4 mr-1 text-purple-500" />
          <strong>Admin:</strong> admin / admin123 <br />
          <strong>Student:</strong> student / student123
        </p>
      </motion.form>

      {/* 🌊 Wave Animation Styles */}
      <style jsx>{`
        .animate-wave-slow {
          animation: wave 10s infinite linear;
        }
        .animate-wave-fast {
          animation: wave 6s infinite linear reverse;
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  )
}
