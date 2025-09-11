"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Video, MapPin, Star, Clock, CalendarIcon, User, GraduationCap, Heart, Brain, Users } from "lucide-react"

interface Counselor {
  id: string
  name: string
  title: string
  specialties: string[]
  rating: number
  experience: string
  image?: string
  bio: string
  availability: {
    date: string
    times: string[]
  }[]
  modes: ("online" | "offline")[]
}

const counselors: Counselor[] = [
  {
    id: "1",
    name: "Dr. Sarah Chen",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Trauma"],
    rating: 4.9,
    experience: "8 years",
    bio: "Dr. Chen specializes in cognitive behavioral therapy and has extensive experience helping students manage anxiety and depression.",
    availability: [
      { date: "2025-09-13", times: ["09:00", "11:00", "14:00","19:00"] },
      { date: "2025-09-14", times: ["10:00", "13:00", "15:00","20:00"] },
      { date: "2025-09-15", times: ["09:00", "11:00", "14:00","21:00"] },
      { date: "2025-09-16", times: ["09:00", "11:00", "14:00","19:00"] },
      { date: "2025-09-17", times: ["09:00", "11:00", "14:00","20:00"] },
      { date: "2025-09-18", times: ["09:00", "11:00", "14:00","18:00"] },
      { date: "2025-09-19", times: ["09:00", "11:00", "14:00","21:00"] },
      { date: "2025-09-20", times: ["09:00", "11:00", "14:00","19:00"] },
      { date: "2025-09-21", times: ["09:00", "11:00", "14:00","21:00"] },
      { date: "2025-09-22", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-23", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-24", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-25", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-26", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-27", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-28", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-29", times: ["09:00", "11:00", "14:00"] },
      { date: "2025-09-30", times: ["09:00", "11:00", "14:00"] }
    ],
    modes: ["online", "offline"],
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    title: "Licensed Marriage & Family Therapist",
    specialties: ["Relationships", "Family Issues", "Stress Management"],
    rating: 4.8,
    experience: "12 years",
    bio: "Dr. Rodriguez focuses on helping individuals navigate relationship challenges and develop healthy coping strategies.",
    availability: [
      { date: "2025-09-15", times: ["10:00", "12:00", "15:00"] },
      { date: "2025-09-16", times: ["09:00", "11:00", "14:00", "16:00"] },
      { date: "2025-09-20", times: ["10:00", "13:00", "19:00"] },
    ],
    modes: ["online", "offline"],
  },
  {
    id: "3",
    name: "Dr. Emily Johnson",
    title: "Licensed Professional Counselor",
    specialties: ["Student Life", "Academic Stress", "Self-Esteem"],
    rating: 4.9,
    experience: "6 years",
    bio: "Dr. Johnson specializes in working with college students and young adults, helping them navigate academic and personal challenges.",
    availability: [
      { date: "2025-09-15", times: ["13:00", "15:00"] },
      { date: "2025-09-17", times: ["10:00", "12:00", "14:00", "16:00"] },
      { date: "2025-09-18", times: ["09:00", "11:00", "15:00", "19:00"] },
    ],
    modes: ["online"],
  },
]

export default function BookPage() {
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedMode, setSelectedMode] = useState<"online" | "offline">("online")
  const [notes, setNotes] = useState("")
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" })
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const { toast } = useToast()

  const getAvailableTimes = () => {
    if (!selectedCounselor || !selectedDate) return []

    const dateStr = selectedDate.toISOString().split("T")[0]
    const availability = selectedCounselor.availability.find((a) => a.date === dateStr)
    return availability?.times || []
  }

  const handleBooking = () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !contactInfo.name || !contactInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to complete your booking.",
        variant: "destructive",
      })
      return
    }

    // Simulate booking process
    toast({
      title: "Appointment Booked Successfully!",
      description: `Your ${selectedMode} session with ${selectedCounselor.name} is confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTime}. You'll receive a confirmation email shortly.`,
    })

    // Reset form
    setSelectedCounselor(null)
    setSelectedDate(undefined)
    setSelectedTime("")
    setNotes("")
    setContactInfo({ name: "", email: "", phone: "" })
    setIsBookingOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book a Counseling Session</h1>
          <p className="text-muted-foreground">
            Connect with licensed mental health professionals who understand your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {counselors.map((counselor) => (
            <Card key={counselor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={counselor.image || "/placeholder.svg"} alt={counselor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {counselor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{counselor.name}</CardTitle>
                    <CardDescription className="text-sm mb-2">{counselor.title}</CardDescription>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{counselor.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <GraduationCap className="w-4 h-4" />
                        <span>{counselor.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-1">
                      {counselor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Available Modes</h4>
                    <div className="flex space-x-2">
                      {counselor.modes.includes("online") && (
                        <Badge variant="outline" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Online
                        </Badge>
                      )}
                      {counselor.modes.includes("offline") && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          In-Person
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{counselor.bio}</p>

                  <Dialog
                    open={isBookingOpen && selectedCounselor?.id === counselor.id}
                    onOpenChange={setIsBookingOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedCounselor(counselor)
                          setIsBookingOpen(true)
                        }}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Book Session with {counselor.name}</DialogTitle>
                        <DialogDescription>
                          Complete the form below to schedule your counseling session
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-foreground">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name *</Label>
                              <Input
                                id="name"
                                value={contactInfo.name}
                                onChange={(e) => setContactInfo((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter your email"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number (Optional)</Label>
                            <Input
                              id="phone"
                              value={contactInfo.phone}
                              onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>

                        {/* Session Mode */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-foreground">Session Mode</h3>
                          <RadioGroup
                            value={selectedMode}
                            onValueChange={(value: "online" | "offline") => setSelectedMode(value)}
                          >
                            {counselor.modes.includes("online") && (
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="online" id="online" />
                                <Label htmlFor="online" className="flex items-center space-x-2 cursor-pointer">
                                  <Video className="w-4 h-4" />
                                  <span>Online Session (Video Call)</span>
                                </Label>
                              </div>
                            )}
                            {counselor.modes.includes("offline") && (
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="offline" id="offline" />
                                <Label htmlFor="offline" className="flex items-center space-x-2 cursor-pointer">
                                  <MapPin className="w-4 h-4" />
                                  <span>In-Person Session</span>
                                </Label>
                              </div>
                            )}
                          </RadioGroup>
                        </div>

                        {/* Date Selection */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-foreground">Select Date</h3>
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              if (date) setSelectedDate(date)
                            }}
                            disabled={(date) => {
                              if (!counselor?.availability) return true

                              // Convert calendar date to local YYYY-MM-DD
                              const dateStr = date.toLocaleDateString("en-CA") // gives YYYY-MM-DD in local time

                              // Check if that date exists in availability
                              return !counselor.availability.some(
                                (a: { date: string }) => a.date === dateStr
                              )
                            }}
                            className="rounded-md border"
                          />
                        </div>


                        {/* Time Selection */}
                        {selectedDate && (
                          <div className="space-y-4">
                            <h3 className="font-medium text-foreground">Select Time</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {getAvailableTimes().map((time) => (
                                <Button
                                  key={time}
                                  variant={selectedTime === time ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setSelectedTime(time)}
                                  className="justify-center"
                                >
                                  <Clock className="w-3 h-3 mr-1" />
                                  {time}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Notes */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-foreground">Additional Notes (Optional)</h3>
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Share anything you'd like your counselor to know before the session..."
                            rows={3}
                          />
                        </div>

                        {/* Booking Summary */}
                        {selectedDate && selectedTime && (
                          <Card className="bg-muted/50">
                            <CardHeader>
                              <CardTitle className="text-lg">Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Counselor:</span>
                                <span className="font-medium">{counselor.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-medium">{selectedDate.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Time:</span>
                                <span className="font-medium">{selectedTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Mode:</span>
                                <span className="font-medium capitalize">{selectedMode}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <div className="flex space-x-3">
                          <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleBooking} className="flex-1">
                            Confirm Booking
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>What to Expect</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Confidential & Safe</h3>
                <p className="text-sm text-muted-foreground">
                  All sessions are completely confidential and conducted in a safe, judgment-free environment.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Professional Support</h3>
                <p className="text-sm text-muted-foreground">
                  Work with licensed professionals who specialize in student mental health and wellness.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-medium text-foreground mb-2">Flexible Options</h3>
                <p className="text-sm text-muted-foreground">
                  Choose between online video sessions or in-person meetings based on your comfort and needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
