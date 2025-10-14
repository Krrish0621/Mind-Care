"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Video, MapPin, Star, Clock, CalendarIcon, User, GraduationCap, Heart, Brain, Users, Sparkles, CheckCircle, Award, Shield, MessageCircle, ChevronRight, Globe, ClipboardCheck, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface Counselor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  experience: string;
  image?: string;
  bio: string;
  availability: {
    date: string;
    times: string[];
  }[];
  modes: ("online" | "offline")[];
}

interface Appointment {
    id: string;
    student_token: string;
    counsellor_id: string;
    date: string;
    time: string;
    mode: 'online' | 'offline';
    status: 'confirmed' | 'cancelled';
    meetLink?: string | null;
    timestamp: string;
}

const counselors: Counselor[] = [
    {
    id: "1",
    name: "Dr. Anita Joshi",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Trauma"],
    rating: 4.9,
    experience: "8 years",
    image: "https://user-gen-media-assets.s3.amazonaws.com/gemini_images/cc533a40-aee2-4006-8c80-c5532d1d31e9.png",
    bio: "Dr. Joshi specializes in cognitive behavioral therapy and has extensive experience helping students manage anxiety and depression.",
    availability: [
      { date: "2025-10-13", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-14", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-15", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-16", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-17", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-18", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-19", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-20", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-21", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-22", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-23", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-24", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-25", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-26", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-27", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-28", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-29", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-30", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-31", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
    ],
    modes: ["online", "offline"],
  },
  {
    id: "2",
    name: "Dr. Mukesh Kumar",
    title: "Licensed Marriage & Family Therapist",
    specialties: ["Relationships", "Family Issues", "Stress Management"],
    rating: 4.8,
    experience: "12 years",
    image: "https://user-gen-media-assets.s3.amazonaws.com/gemini_images/24003866-9d59-41e0-88d2-6170e0252131.png",
    bio: "Dr. Kumar focuses on helping individuals navigate relationship challenges and develop healthy coping strategies.",
    availability: [
      { date: "2025-10-13", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-14", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-15", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-16", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-17", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-18", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-19", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-20", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-21", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-22", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-23", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-24", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-25", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-26", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-27", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-28", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-29", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-30", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-31", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
    ],
    modes: ["online", "offline"],
  },
  {
    id: "3",
    name: "Dr. Sanjana Tiwari",
    title: "Licensed Professional Counselor",
    specialties: ["Student Life", "Academic Stress", "Self-Esteem"],
    rating: 4.9,
    experience: "6 years",
    image: "https://user-gen-media-assets.s3.amazonaws.com/gemini_images/24c39bd2-26a2-44f0-b8c3-f3c88a308d1f.png",
    bio: "Dr. Tiwari specializes in working with college students and young adults, helping them navigate academic and personal challenges.",
    availability: [
      { date: "2025-10-13", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-14", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-15", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-16", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-17", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-18", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-19", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-20", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-21", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-22", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-23", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-24", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-25", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-26", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-27", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-28", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-29", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-30", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
      { date: "2025-10-31", times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"] },
    ],
    modes: ["online"],
  },
];

export default function BookPage() {
  const { isDarkMode } = useDarkMode();
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<"online" | "offline">("online");
  const [notes, setNotes] = useState("");
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [studentToken, setStudentToken] = useState<string>("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Generate or retrieve a unique token for the student to track their appointments
    let token = localStorage.getItem("studentToken");
    if (!token) {
      token = `student_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("studentToken", token);
    }
    setStudentToken(token);
  }, []);

  const fetchAppointments = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings?student_token=${token}`);
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data.bookings || []);
    } catch (error) {
      console.error("Fetch appointments error:", error);
      toast({
        title: "Error",
        description: "Could not fetch your appointments.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableTimes = () => {
    if (!selectedCounselor || !selectedDate) return [];
    const dateStr = selectedDate.toISOString().split("T")[0];
    const availability = selectedCounselor.availability.find((a) => a.date === dateStr);
    return availability?.times || [];
  };

  const handleBooking = async () => {
    if (!selectedCounselor || !selectedDate || !selectedTime || !contactInfo.name || !contactInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to complete your booking.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_token: studentToken,
          counsellor_id: selectedCounselor.id,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          mode: selectedMode,
        }),
      });

      if (!response.ok) throw new Error("Booking failed");

      const result = await response.json();
      
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your ${selectedMode} session with ${selectedCounselor.name} is confirmed for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
      });
      
      // Manually add the new appointment to the state to show it immediately
      setAppointments(prev => [result.booking, ...prev]);

      // Reset form state
      setSelectedCounselor(null);
      setSelectedDate(undefined);
      setSelectedTime("");
      setNotes("");
      setContactInfo({ name: "", email: "", phone: "" });
      setIsBookingOpen(false);

    } catch (error) {
       console.error("Booking submission error:", error);
       toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const specialtyColorsLight = {
    Anxiety: "bg-purple-100 text-purple-700 border-purple-200",
    Depression: "bg-blue-100 text-blue-700 border-blue-200",
    Trauma: "bg-red-100 text-red-700 border-red-200",
    Relationships: "bg-pink-100 text-pink-700 border-pink-200",
    "Family Issues": "bg-orange-100 text-orange-700 border-orange-200",
    "Stress Management": "bg-green-100 text-green-700 border-green-200",
    "Student Life": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Academic Stress": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Self-Esteem": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const specialtyColorsDark = {
    Anxiety: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    Depression: "bg-blue-900/40 text-blue-300 border-blue-700/50",
    Trauma: "bg-red-900/40 text-red-300 border-red-700/50",
    Relationships: "bg-pink-900/40 text-pink-300 border-pink-700/50",
    "Family Issues": "bg-orange-900/40 text-orange-300 border-orange-700/50",
    "Stress Management": "bg-green-900/40 text-green-300 border-green-700/50",
    "Student Life": "bg-indigo-900/40 text-indigo-300 border-indigo-700/50",
    "Academic Stress": "bg-yellow-900/40 text-yellow-300 border-yellow-700/50",
    "Self-Esteem": "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
  };
  
  const specialtyColors = isDarkMode ? specialtyColorsDark : specialtyColorsLight;

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-[#141627] via-[#20223a] to-[#2d2547] text-white"
          : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/60 text-gray-900"
      }`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${
            isDarkMode
              ? "bg-gradient-to-r from-purple-800/30 to-pink-800/25"
              : "bg-gradient-to-r from-purple-400/20 to-pink-400/20"
          }`}
        />
        <div
          className={`absolute bottom-32 left-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${
            isDarkMode
              ? "bg-gradient-to-r from-blue-900/25 to-cyan-800/15"
              : "bg-gradient-to-r from-blue-400/15 to-cyan-400/15"
          }`}
        />
      </div>

      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 px-4"
        >
          <div
            className={`inline-flex items-center justify-center p-3 rounded-full mb-6 ${
              isDarkMode
                ? "bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-white/20"
                : "bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
            }`}
          >
            <CalendarIcon className="w-6 h-6 text-blue-500 mr-2" />
            <Heart className="w-6 h-6 text-pink-500" />
          </div>

          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent py-2">
              Book Your Counseling Session
            </h1>
          </div>

          <p
            className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Connect with licensed mental health professionals who understand your journey and are here to support you
            every step of the way.
          </p>
        </motion.div>

        {/* My Appointments Section */}
        {appointments.length > 0 && (
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-16"
          >
              <Card className={`backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ${isDarkMode ? "bg-slate-900/80 border-slate-700/30 shadow-indigo-900/20" : "bg-white/80 shadow-indigo-500/10"}`}>
                  <CardHeader className={`border-b text-center ${isDarkMode ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-slate-700/50" : "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-white/20"}`}>
                      <CardTitle className={`text-2xl font-bold flex items-center justify-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                          <ClipboardCheck className="w-6 h-6 mr-3 text-blue-500" />
                          My Appointments
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                      {isLoading ? (
                          <div className="flex items-center justify-center h-40">
                              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {appointments.map(appointment => {
                                  const counselor = counselors.find(c => c.id === appointment.counsellor_id);
                                  if (!counselor) return null;
                                  return (
                                      <motion.div
                                          key={appointment.id}
                                          initial={{ opacity: 0, scale: 0.9 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.4 }}
                                          className={`p-6 rounded-2xl border-2 ${isDarkMode ? "bg-slate-800/70 border-slate-700" : "bg-white/70 border-slate-200"}`}
                                      >
                                          <div className="flex items-center space-x-4 mb-4">
                                              <Avatar className="w-14 h-14 border-2 border-white shadow-md">
                                                  <AvatarImage src={counselor.image} alt={counselor.name}/>
                                                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">{counselor.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                              </Avatar>
                                              <div>
                                                  <p className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>{counselor.name}</p>
                                                  <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>{counselor.title}</p>
                                              </div>
                                          </div>
                                          <div className="space-y-3 text-sm">
                                              <div className="flex justify-between items-center">
                                                  <span className={`font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Date:</span>
                                                  <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>{new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                  <span className={`font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Time:</span>
                                                  <span className={`font-semibold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>{appointment.time}</span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                  <span className={`font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Mode:</span>
                                                  <Badge variant="outline" className={`capitalize ${isDarkMode ? "border-slate-600" : "border-slate-300"}`}>{appointment.mode}</Badge>
                                              </div>
                                          </div>
                                          {appointment.mode === 'online' && appointment.meetLink && (
                                              <Button asChild className="w-full mt-5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold">
                                                  <Link href={appointment.meetLink} target="_blank">
                                                      <Video className="w-4 h-4 mr-2"/>
                                                      Join Google Meet
                                                      <ExternalLink className="w-4 h-4 ml-2"/>
                                                  </Link>
                                              </Button>
                                          )}
                                      </motion.div>
                                  )
                              })}
                          </div>
                      )}
                  </CardContent>
              </Card>
          </motion.div>
        )}

        {/* Enhanced Counselor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {counselors.map((counselor, index) => (
            <motion.div
              key={counselor.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            >
              <Card
                className={`group backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 h-full relative ${
                  isDarkMode
                    ? "bg-slate-900/80 border-slate-700/30 shadow-indigo-900/20"
                    : "bg-white/80 shadow-indigo-500/10"
                }`}
              >
                <div className="absolute top-4 right-4 z-30">
                  <Badge className="bg-emerald-500 text-white border-0 font-bold px-4 py-2 rounded-full shadow-lg">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Available
                  </Badge>
                </div>

                <CardHeader
                  className={`relative border-b pt-16 pb-6 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-slate-700/50"
                      : "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-white/20"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                      <Avatar className="relative w-24 h-24 border-4 border-white shadow-xl">
                        <AvatarImage
                          src={counselor.image}
                          alt={counselor.name}
                          className="object-cover w-full h-full rounded-full"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold w-full h-full">
                          {counselor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="w-full">
                      <CardTitle className={`text-xl mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                        {counselor.name}
                      </CardTitle>
                      <CardDescription
                        className={`font-medium mb-4 leading-relaxed ${
                          isDarkMode ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {counselor.title}
                      </CardDescription>

                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <div
                          className={`flex items-center space-x-1 px-3 py-2 rounded-full shadow-sm ${
                            isDarkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold">{counselor.rating}</span>
                        </div>
                        <div
                          className={`flex items-center space-x-1 px-3 py-2 rounded-full shadow-sm ${
                            isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <GraduationCap className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold">{counselor.experience}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Specialties */}
                  <div>
                    <h4
                      className={`font-bold mb-3 flex items-center ${
                        isDarkMode ? "text-slate-100" : "text-gray-800"
                      }`}
                    >
                      <Brain className="w-4 h-4 mr-2 text-purple-500" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {counselor.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          className={`${
                            specialtyColors[specialty as keyof typeof specialtyColors] ||
                            (isDarkMode
                              ? "bg-slate-700 text-slate-300 border-slate-600"
                              : "bg-gray-100 text-gray-700 border-gray-200")
                          } border font-medium px-3 py-1 rounded-full text-xs shadow-sm`}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Available Modes */}
                  <div>
                    <h4
                      className={`font-bold mb-3 flex items-center ${
                        isDarkMode ? "text-slate-100" : "text-gray-800"
                      }`}
                    >
                      <Globe className="w-4 h-4 mr-2 text-blue-500" />
                      Session Options
                    </h4>
                    <div className="flex justify-center space-x-3">
                      {counselor.modes.includes("online") && (
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl border shadow-sm ${
                            isDarkMode
                              ? "bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700/50"
                              : "bg-gradient-to-r from-green-100 to-emerald-100 border-green-200"
                          }`}
                        >
                          <Video className="w-4 h-4 text-green-500" />
                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-green-300" : "text-green-700"
                            }`}
                          >
                            Online
                          </span>
                        </div>
                      )}
                      {counselor.modes.includes("offline") && (
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-xl border shadow-sm ${
                            isDarkMode
                              ? "bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700/50"
                              : "bg-gradient-to-r from-orange-100 to-red-100 border-orange-200"
                          }`}
                        >
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span
                            className={`text-sm font-medium ${
                              isDarkMode ? "text-orange-300" : "text-orange-700"
                            }`}
                          >
                            In-Person
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <p
                    className={`text-sm leading-relaxed p-4 rounded-2xl border text-center ${
                      isDarkMode
                        ? "text-slate-300 bg-slate-800/60 border-slate-700/50"
                        : "text-slate-600 bg-gray-50/50 border-gray-200/50"
                    }`}
                  >
                    {counselor.bio}
                  </p>

                  {/* Book Button */}
                  <Dialog
                    open={isBookingOpen && selectedCounselor?.id === counselor.id}
                    onOpenChange={(isOpen) => {
                      setIsBookingOpen(isOpen);
                      if (!isOpen) {
                        setSelectedCounselor(null); 
                        setSelectedDate(undefined);
                        setSelectedTime("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group overflow-hidden"
                        onClick={() => {
                          setSelectedCounselor(counselor);
                          setIsBookingOpen(true);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Book Session with Dr. {counselor.name.split(" ")[1]}
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent
                      className={`max-w-4xl max-h-[95vh] overflow-y-auto border-0 shadow-2xl rounded-3xl ${
                        isDarkMode
                          ? "bg-slate-900/90 backdrop-blur-xl border border-slate-700"
                          : "bg-white/95 backdrop-blur-xl"
                      }`}
                    >
                      <DialogHeader
                        className={`text-center pb-6 border-b ${
                          isDarkMode ? "border-slate-700" : "border-gray-200/50"
                        }`}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-center space-x-3 mb-4">
                            <Avatar className="w-16 h-16 border-4 border-white shadow-xl">
                              <AvatarImage
                                src={counselor.image}
                                alt={counselor.name}
                                className="object-cover w-full h-full rounded-full"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold">
                                {counselor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <DialogTitle
                                className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                              >
                                Book Session with {counselor.name}
                              </DialogTitle>
                              <DialogDescription
                                className={`font-medium ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                              >
                                {counselor.title}
                              </DialogDescription>
                            </div>
                          </div>
                        </motion.div>
                      </DialogHeader>

                      <div className="space-y-8 py-6 px-2">
                        {/* Contact Information */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="space-y-4"
                        >
                          <h3
                            className={`font-bold text-lg flex items-center ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            <User className="w-5 h-5 mr-2 text-blue-500" />
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="name"
                                className={`text-sm font-semibold mb-2 block ${
                                  isDarkMode ? "text-slate-300" : "text-gray-700"
                                }`}
                              >
                                Full Name *
                              </Label>
                              <Input
                                id="name"
                                value={contactInfo.name}
                                onChange={(e) => setContactInfo((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your full name"
                                className={`h-12 px-4 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${
                                  isDarkMode
                                    ? "bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                    : "bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                }`}
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="email"
                                className={`text-sm font-semibold mb-2 block ${
                                  isDarkMode ? "text-slate-300" : "text-gray-700"
                                }`}
                              >
                                Email *
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="Enter your email"
                                className={`h-12 px-4 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${
                                  isDarkMode
                                    ? "bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                    : "bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                }`}
                              />
                            </div>
                          </div>
                          <div>
                            <Label
                              htmlFor="phone"
                              className={`text-sm font-semibold mb-2 block ${
                                isDarkMode ? "text-slate-300" : "text-gray-700"
                              }`}
                            >
                              Phone Number (Optional)
                            </Label>
                            <Input
                              id="phone"
                              value={contactInfo.phone}
                              onChange={(e) => setContactInfo((prev) => ({ ...prev, phone: e.target.value }))}
                              placeholder="Enter your phone number"
                              className={`h-12 px-4 backdrop-blur-sm rounded-xl shadow-inner transition-all duration-300 border ${
                                isDarkMode
                                  ? "bg-slate-800/80 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                                  : "bg-white/80 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                              }`}
                            />
                          </div>
                        </motion.div>

                        {/* Session Mode */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="space-y-4"
                        >
                          <h3
                            className={`font-bold text-lg flex items-center ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            <Video className="w-5 h-5 mr-2 text-purple-500" />
                            Session Mode
                          </h3>
                          <RadioGroup
                            value={selectedMode}
                            onValueChange={(value: "online" | "offline") => setSelectedMode(value)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            {counselor.modes.includes("online") && (
                              <div className="relative">
                                <RadioGroupItem value="online" id="online" className="sr-only" />
                                <Label
                                  htmlFor="online"
                                  className={`block cursor-pointer p-4 border-2 rounded-2xl transition-all duration-300 ${
                                    selectedMode === "online"
                                      ? isDarkMode
                                        ? "border-green-500 bg-gradient-to-r from-green-900/30 to-emerald-900/30 shadow-lg"
                                        : "border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg"
                                      : isDarkMode
                                      ? "border-slate-700 bg-slate-800/50 hover:border-green-700 hover:bg-green-900/20"
                                      : "border-gray-200 bg-white/50 hover:border-green-300 hover:bg-green-50/50"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                      <Video className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <div
                                        className={`font-semibold ${
                                          isDarkMode ? "text-slate-100" : "text-gray-800"
                                        }`}
                                      >
                                        Online Session
                                      </div>
                                      <div
                                        className={`text-sm ${
                                          isDarkMode ? "text-slate-400" : "text-gray-600"
                                        }`}
                                      >
                                        Secure video call from anywhere
                                      </div>
                                    </div>
                                  </div>
                                  {selectedMode === "online" && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </Label>
                              </div>
                            )}
                            {counselor.modes.includes("offline") && (
                              <div className="relative">
                                <RadioGroupItem value="offline" id="offline" className="sr-only" />
                                <Label
                                  htmlFor="offline"
                                  className={`block cursor-pointer p-4 border-2 rounded-2xl transition-all duration-300 ${
                                    selectedMode === "offline"
                                      ? isDarkMode
                                        ? "border-orange-500 bg-gradient-to-r from-orange-900/30 to-red-900/30 shadow-lg"
                                        : "border-orange-400 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg"
                                      : isDarkMode
                                      ? "border-slate-700 bg-slate-800/50 hover:border-orange-700 hover:bg-orange-900/20"
                                      : "border-gray-200 bg-white/50 hover:border-orange-300 hover:bg-orange-50/50"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                      <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <div
                                        className={`font-semibold ${
                                          isDarkMode ? "text-slate-100" : "text-gray-800"
                                        }`}
                                      >
                                        In-Person Session
                                      </div>
                                      <div
                                        className={`text-sm ${
                                          isDarkMode ? "text-slate-400" : "text-gray-600"
                                        }`}
                                      >
                                        Face-to-face at our clinic
                                      </div>
                                    </div>
                                  </div>
                                  {selectedMode === "offline" && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </Label>
                              </div>
                            )}
                          </RadioGroup>
                        </motion.div>

                        {/* Date and Time Selection */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Date Selection */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-4"
                          >
                            <h3
                              className={`font-bold text-lg flex items-center ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              <CalendarIcon className="w-5 h-5 mr-2 text-indigo-500" />
                              Select Date
                            </h3>
                            <div
                              className={`rounded-2xl p-4 border ${
                                isDarkMode
                                  ? "bg-slate-800/60 border-slate-700/30"
                                  : "bg-white/60 border-white/30"
                              }`}
                            >
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => {
                                  if (!counselor?.availability) return true;
                                  const dateStr = date.toISOString().split("T")[0];
                                  return !counselor.availability.some((a) => a.date === dateStr) || date < new Date();
                                }}
                                className="rounded-xl border-0"
                              />
                            </div>
                          </motion.div>

                          {/* Time Selection */}
                           <AnimatePresence>
                            {selectedDate && (
                              <motion.div
                                key="time-selector"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                                className="space-y-4"
                              >
                                <h3
                                  className={`font-bold text-lg flex items-center ${
                                    isDarkMode ? "text-white" : "text-gray-800"
                                  }`}
                                >
                                  <Clock className="w-5 h-5 mr-2 text-pink-500" />
                                  Available Times
                                </h3>
                                <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2">
                                  {getAvailableTimes().length > 0 ? getAvailableTimes().map((time, index) => (
                                    <motion.div
                                      key={time}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.05 * index, duration: 0.3 }}
                                    >
                                      <Button
                                        variant={selectedTime === time ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedTime(time)}
                                        className={`w-full h-12 rounded-xl font-medium transition-all duration-300 ${
                                          selectedTime === time
                                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg transform scale-105"
                                            : isDarkMode
                                            ? "bg-slate-800/60 border-slate-700 hover:bg-gradient-to-r hover:from-pink-900/20 hover:to-purple-900/20 hover:border-pink-700 text-slate-200"
                                            : "bg-white/60 border-gray-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:border-pink-300"
                                        }`}
                                      >
                                        {time}
                                      </Button>
                                    </motion.div>
                                  )) : (
                                    <p className={`col-span-3 text-center text-sm ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                      No available times for this date.
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Additional Notes */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6, duration: 0.5 }}
                          className="space-y-4"
                        >
                          <h3
                            className={`font-bold text-lg flex items-center ${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
                            Additional Notes (Optional)
                          </h3>
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Share anything you'd like your counselor to know before the session..."
                            rows={4}
                            className={`p-4 resize-none backdrop-blur-sm rounded-2xl transition-all duration-300 border ${
                              isDarkMode
                                ? "bg-slate-800/60 border-slate-600 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-green-500/50 focus:border-transparent"
                                : "bg-white/60 border-gray-200 text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                            }`}
                          />
                        </motion.div>

                        {/* Booking Summary */}
                        <AnimatePresence>
                          {selectedDate && selectedTime && (
                            <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -20, scale: 0.95 }}
                              transition={{ duration: 0.4 }}
                            >
                              <Card
                                className={`rounded-2xl shadow-xl border-2 ${
                                  isDarkMode
                                    ? "bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-indigo-700/50"
                                    : "bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200/50"
                                }`}
                              >
                                <CardHeader>
                                  <CardTitle
                                    className={`text-xl font-bold flex items-center ${
                                      isDarkMode ? "text-white" : "text-gray-800"
                                    }`}
                                  >
                                    <CheckCircle className="w-6 h-6 mr-2 text-indigo-500" />
                                    Booking Summary
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between">
                                      <span
                                        className={`font-medium ${
                                          isDarkMode ? "text-slate-400" : "text-gray-600"
                                        }`}
                                      >
                                        Counselor:
                                      </span>
                                      <span
                                        className={`font-bold ${
                                          isDarkMode ? "text-slate-100" : "text-gray-800"
                                        }`}
                                      >
                                        {counselor.name}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span
                                        className={`font-medium ${
                                          isDarkMode ? "text-slate-400" : "text-gray-600"
                                        }`}
                                      >
                                        Date:
                                      </span>
                                      <span
                                        className={`font-bold ${
                                          isDarkMode ? "text-slate-100" : "text-gray-800"
                                        }`}
                                      >
                                        {selectedDate.toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span
                                        className={`font-medium ${
                                          isDarkMode ? "text-slate-400" : "text-gray-600"
                                        }`}
                                      >
                                        Time:
                                      </span>
                                      <span
                                        className={`font-bold ${
                                          isDarkMode ? "text-slate-100" : "text-gray-800"
                                        }`}
                                      >
                                        {selectedTime}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span
                                        className={`font-medium ${
                                          isDarkMode ? "text-slate-400" : "text-gray-600"
                                        }`}
                                      >
                                        Mode:
                                      </span>
                                      <span
                                        className={`font-bold capitalize ${
                                          isDarkMode ? "text-slate-100" : "text-gray-800"
                                        }`}
                                      >
                                        {selectedMode}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                          className="flex space-x-4 pt-4"
                        >
                          <Button
                            variant="outline"
                            onClick={() => setIsBookingOpen(false)}
                            className={`flex-1 h-14 border-2 rounded-2xl font-semibold transition-all duration-300 ${
                              isDarkMode
                                ? "bg-slate-700/80 border-slate-600 hover:bg-slate-700 text-slate-200"
                                : "bg-white/60 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleBooking}
                            className="flex-1 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Confirm Booking
                          </Button>
                        </motion.div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card
            className={`backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden ${
              isDarkMode
                ? "bg-slate-900/80 border-slate-700/30 shadow-indigo-900/20"
                : "bg-white/80 shadow-indigo-500/10"
            }`}
          >
            <CardHeader
              className={`border-b text-center ${
                isDarkMode
                  ? "bg-gradient-to-r from-emerald-900/20 via-blue-900/20 to-purple-900/20 border-slate-700/50"
                  : "bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-white/20"
              }`}
            >
              <CardTitle
                className={`text-2xl font-bold flex items-center justify-center ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                <Heart className="w-6 h-6 mr-3 text-red-500" />
                What to Expect from Your Session
                <Sparkles className="w-6 h-6 ml-3 text-yellow-500" />
              </CardTitle>
              <CardDescription className={`text-lg mt-2 ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Your mental health journey is our priority
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Confidential & Safe",
                    text: "All sessions are completely confidential and conducted in a safe, judgment-free environment where you can express yourself freely.",
                    gradient: "from-blue-500 to-cyan-500",
                    glow: "from-blue-500/30 to-cyan-500/30",
                  },
                  {
                    icon: Award,
                    title: "Professional Support",
                    text: "Work with licensed professionals who specialize in student mental health and have years of experience helping people like you.",
                    gradient: "from-purple-500 to-pink-500",
                    glow: "from-purple-500/30 to-pink-500/30",
                  },
                  {
                    icon: Users,
                    title: "Flexible Options",
                    text: "Choose between online video sessions or in-person meetings based on your comfort level and preferences.",
                    gradient: "from-emerald-500 to-teal-500",
                    glow: "from-emerald-500/30 to-teal-500/30",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="text-center group"
                  >
                    <div className="relative mb-6">
                      <div
                        className={`absolute -inset-2 bg-gradient-to-r ${item.glow} rounded-full blur opacity-0 group-hover:opacity-100 transition duration-300`}
                      />
                      <div
                        className={`relative w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mx-auto shadow-xl transform group-hover:scale-110 transition-all duration-300`}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className={`font-bold text-xl mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {item.title}
                    </h3>
                    <p className={`leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

