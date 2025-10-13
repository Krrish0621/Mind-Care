// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"
import BackgroundMusic from "@/components/background"
import { DarkModeProvider } from "@/contexts/DarkModeContext"

export const metadata: Metadata = {
  title: "MindCare - Mental Health Support Platform",
  description:
    "Your trusted digital mental health support platform with AI chat, counselor booking, and peer support.",
  generator: "Node.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <DarkModeProvider>
          <Suspense fallback={null}>
            <BackgroundMusic />
            {children}
            <Toaster />
          </Suspense>
        </DarkModeProvider>
      </body>
    </html>
  )
}
