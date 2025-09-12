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

      // Attempt to play background music
      const audio = document.querySelector("audio") as HTMLAudioElement | null
      if (audio) {
        audio.volume = 0.4
        audio
          .play()
          .then(() => console.log("🎵 Background music started"))
          .catch((err) => console.warn("Autoplay blocked:", err))
      }

      // Navigate after short delay for smoother audio start
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }, 300)
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400">
      {/* Enhanced Animated Wave Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-48 animate-wave-slow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#7c3aed"
            fillOpacity="0.3"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,224C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="absolute bottom-0 w-full h-48 animate-wave-fast opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#c084fc"
            fillOpacity="0.25"
            d="M0,224L48,218.7C96,213,192,203,288,208C384,213,480,235,576,224C672,213,768,171,864,154.7C960,139,1056,149,1152,176C1248,203,1344,245,1392,266.7L1440,288L1440,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Login Card */}
      <motion.form
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        onSubmit={handleLogin}
        className="relative z-10 bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-sm border border-purple-300"
      >
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-extrabold text-purple-700 mb-8 text-center tracking-wide"
        >
          Mind-Care Login 💜
        </motion.h2>

        {/* Role Selection */}
        <label className="block mb-6">
          <span className="text-sm font-semibold text-purple-700">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "student")}
            className="w-full mt-2 p-3 border rounded-xl bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {/* Username */}
        <label className="block mb-6">
          <span className="text-sm font-semibold text-purple-700">Username</span>
          <div className="flex items-center mt-2 bg-white rounded-xl border border-purple-300 px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-400 transition">
            <User className="w-5 h-5 text-purple-400" />
            <input
              type="text"
              className="w-full ml-3 p-2 text-purple-700 placeholder-purple-300 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
        </label>

        {/* Password */}
        <label className="block mb-8">
          <span className="text-sm font-semibold text-purple-700">Password</span>
          <div className="flex items-center mt-2 bg-white rounded-xl border border-purple-300 px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-400 transition">
            <Lock className="w-5 h-5 text-purple-400" />
            <input
              type="password"
              className="w-full ml-3 p-2 text-purple-700 placeholder-purple-300 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
        </label>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.07, boxShadow: "0 0 15px rgba(124, 58, 237, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold shadow-lg drop-shadow-lg transition-all duration-300"
        >
          Login
        </motion.button>

        {/* Credentials info */}
        <p className="mt-8 text-center text-sm text-purple-600 select-none">
          <Shield className="inline w-5 h-5 mr-2 text-purple-500 align-middle" />
          Default credentials: <br />
          <span className="font-semibold">Admin:</span> admin / admin123 <br />
          <span className="font-semibold">Student:</span> student / student123
        </p>
      </motion.form>

      {/* Wave Animation Styles */}
      <style jsx>{`
        .animate-wave-slow {
          animation: wave 12s infinite linear;
        }
        .animate-wave-fast {
          animation: wave 8s infinite linear reverse;
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
