"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MessageCircle, Calendar, BookOpen, Users, Heart, Shield, Clock, Star } from "lucide-react"
import { Typewriter } from "react-simple-typewriter"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 gradient-bg">
          <div className="mx-auto max-w-7xl text-center">
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#7F56D9",
                textAlign: "center",
                marginTop: "2rem",
                marginBottom: "1.5rem",
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty animate-fade-in-delayed">
              Access compassionate AI support, connect with licensed counselors, explore helpful resources, and join a
              supportive community—all in one safe, confidential platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 button-hover bg-primary hover:bg-primary/90 text-white rounded-xl"
              >
                <Link href="/chat">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Talk to AI Support
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 button-hover bg-white border-primary text-primary hover:bg-primary hover:text-white rounded-xl"
              >
                <Link href="/book">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Counselor
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Comprehensive Mental Health Support
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need for your mental wellness journey, available 24/7
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center card-hover glassmorphism rounded-xl border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary">AI Chat Support</CardTitle>
                  <CardDescription>
                    Get immediate support from our compassionate AI assistant, available 24/7
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-white/50 border-primary text-primary hover:bg-primary hover:text-white rounded-lg button-hover"
                  >
                    <Link href="/chat">Start Chatting</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center card-hover glassmorphism rounded-xl border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Book Counselor</CardTitle>
                  <CardDescription>Schedule sessions with licensed mental health professionals</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-white/50 border-primary text-primary hover:bg-primary hover:text-white rounded-lg button-hover"
                  >
                    <Link href="/book">Book Session</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center card-hover glassmorphism rounded-xl border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-accent">Resource Hub</CardTitle>
                  <CardDescription>
                    Access videos, guides, and tools for anxiety, sleep, and stress management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-white/50 border-accent text-accent hover:bg-accent hover:text-white rounded-lg button-hover"
                  >
                    <Link href="/resources">Browse Resources</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center card-hover glassmorphism rounded-xl border-0">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-primary">Peer Forum</CardTitle>
                  <CardDescription>Connect with others in a safe, anonymous community environment</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-white/50 border-primary text-primary hover:bg-primary hover:text-white rounded-lg button-hover"
                  >
                    <Link href="/forum">Join Community</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Your Safety & Privacy Matter</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're committed to providing a secure, confidential environment for your mental health journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Confidential & Secure</h3>
                <p className="text-muted-foreground">
                  All conversations and data are encrypted and protected by strict privacy policies
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Availability</h3>
                <p className="text-muted-foreground">Support is always available when you need it, day or night</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Compassionate Care</h3>
                <p className="text-muted-foreground">
                  Every interaction is designed with empathy and understanding at its core
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <blockquote className="text-2xl sm:text-3xl font-medium text-foreground mb-6 text-balance">
              "You are not alone in this journey. Every step forward, no matter how small, is progress worth
              celebrating."
            </blockquote>
            <p className="text-muted-foreground font-medium">— MindCare Community</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
