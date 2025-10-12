import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"
import BackgroundMusic from "@/components/background"
import { DarkModeProvider } from "@/contexts/DarkModeContext" // <-- import the provider

export const metadata: Metadata = {
  title: "MindCare - Mental Health Support Platform",
  description: "Your trusted digital mental health support platform with AI chat, counselor booking, and peer support.",
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
        <Suspense fallback={null}>
          <DarkModeProvider>  {/* Wrap children within provider */}
            <BackgroundMusic />
            {children}
            <Toaster />
          </DarkModeProvider>
        </Suspense>
      </body>
    </html>
  )
}
