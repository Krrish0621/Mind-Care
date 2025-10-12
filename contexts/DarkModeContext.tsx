import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import "@/app/globals.css"
import { DarkModeProvider } from "@/contexts/DarkModeContext"

// ✅ Server-safe metadata
export const metadata: Metadata = {
  title: "MindCare - Mental Health Support Platform",
  description:
    "Your trusted digital mental health support platform with AI chat, counselor booking, and peer support.",
  generator: "Node.js",
}

// ✅ Dynamic import for client-only background
const BackgroundMusic = dynamic(() => import("@/components/background"), {
  ssr: false,
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // ✅ Provider moved to <html> level to cover all routes (even SSR)
    <html lang="en" suppressHydrationWarning>
      <DarkModeProvider>
        <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
          <Suspense fallback={<div />}>
            <BackgroundMusic />
            {children}
            <Toaster />
          </Suspense>
        </body>
      </DarkModeProvider>
    </html>
  )
}
