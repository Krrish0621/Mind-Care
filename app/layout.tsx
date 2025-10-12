"use client"

import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"
import dynamic from "next/dynamic"
import { DarkModeProvider } from "@/contexts/DarkModeContext"

// ✅ Lazy-load BackgroundMusic so it doesn’t break SSR
const BackgroundMusic = dynamic(() => import("@/components/background"), {
  ssr: false,
})

export const metadata: Metadata = {
  title: "MindCare - Mental Health Support Platform",
  description:
    "Your trusted digital mental health support platform with AI chat, counselor booking, and peer support.",
  generator: "Node.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <DarkModeProvider>
          <Suspense fallback={<div />}>
            {/* ✅ Music only loads client-side */}
            <BackgroundMusic />
            {/* ✅ All pages load normally */}
            {children}
            <Toaster />
          </Suspense>
        </DarkModeProvider>
      </body>
    </html>
  )
}
