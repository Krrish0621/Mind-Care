"use client"

import { useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, Line, ComposedChart, Area, ReferenceLine, XAxis, YAxis } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, TrendingUp, BarChart3, Heart, Brain, Sparkles, CheckCircle, AlertCircle, Sun, CloudRain, CloudSnow } from "lucide-react"

type MoodEntry = {
    id: string
    date: string // YYYY-MM-DD
    mood: number // 1-5
    emoji: string
    note?: string
}

const LS_KEY_ENTRIES = "mhp.mood.entries"

const EMOJI_SCALE: { value: number; emoji: string; label: string; color: string; bgGradient: string }[] = [
    { value: 1, emoji: "😢", label: "Very Low", color: "text-red-600", bgGradient: "from-red-500/10 to-pink-500/10" },
    { value: 2, emoji: "😟", label: "Low", color: "text-orange-600", bgGradient: "from-orange-500/10 to-red-500/10" },
    { value: 3, emoji: "😐", label: "Neutral", color: "text-yellow-600", bgGradient: "from-yellow-500/10 to-orange-500/10" },
    { value: 4, emoji: "🙂", label: "Good", color: "text-green-600", bgGradient: "from-green-500/10 to-emerald-500/10" },
    { value: 5, emoji: "😊", label: "Great", color: "text-emerald-600", bgGradient: "from-emerald-500/10 to-teal-500/10" },
]

function formatDate(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

function getLastNDates(n: number) {
    const dates: string[] = []
    const today = new Date()
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        dates.push(formatDate(d))
    }
    return dates
}

function moodColor(m: number) {
    const colors = {
        1: "#ef4444", // red-500
        2: "#f97316", // orange-500  
        3: "#eab308", // yellow-500
        4: "#22c55e", // green-500
        5: "#10b981", // emerald-500
    }
    return colors[m as keyof typeof colors] || colors[3]
}

function moodGradient(m: number) {
    const gradients = {
        1: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
        2: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
        3: "linear-gradient(135deg, #eab308 0%, #fbbf24 100%)",
        4: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
        5: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    }
    return gradients[m as keyof typeof gradients] || gradients[3]
}

export default function MoodPage() {
    const [entries, setEntries] = useState<MoodEntry[]>([])
    const [selectedMood, setSelectedMood] = useState<number | null>(null)
    const [note, setNote] = useState("")
    const [tab, setTab] = useState<"checkin" | "summary">("checkin")
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    // Load existing entries
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY_ENTRIES)
            if (raw) setEntries(JSON.parse(raw))
        } catch {
            // ignore
        }
    }, [])

    // Persist entries
    useEffect(() => {
        localStorage.setItem(LS_KEY_ENTRIES, JSON.stringify(entries))
    }, [entries])

    const today = formatDate(new Date())
    const todayEntry = entries.find((e) => e.date === today)

    function onSaveCheckIn() {
        if (!selectedMood) return
        const newEntry: MoodEntry = {
            id: crypto.randomUUID(),
            date: today,
            mood: selectedMood,
            emoji: EMOJI_SCALE.find((s) => s.value === selectedMood)?.emoji ?? "🙂",
            note: note.trim() || undefined,
        }
        const withoutToday = entries.filter((e) => e.date !== today)
        setEntries([...withoutToday, newEntry].sort((a, b) => a.date.localeCompare(b.date)))
        setNote("")
        setSelectedMood(null)
    }

    // Weekly summary data
    const weekDates = getLastNDates(7)
    const weeklyData = useMemo(() => {
        const pseudoRandom = (seed: string) => {
            let x = 0
            for (let i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) % 97
            return 2 + (x % 3)
        }
        return weekDates.map((d) => {
            const e = entries.find((en) => en.date === d)
            const val = e?.mood ?? pseudoRandom(d)
            return { date: d.slice(5), full: d, mood: val }
        })
    }, [entries, weekDates])

    const avgMood = useMemo(() => {
        if (!weeklyData.length) return 0
        const sum = weeklyData.reduce((acc, cur) => acc + (cur.mood || 0), 0)
        return Math.round((sum / weeklyData.length) * 10) / 10
    }, [weeklyData])

    const getMoodInsight = (avg: number) => {
        if (avg >= 4.5) return { text: "You're doing amazing!", icon: Sun, color: "text-emerald-600" }
        if (avg >= 3.5) return { text: "Keep up the positive momentum!", icon: Sun, color: "text-green-600" }
        if (avg >= 2.5) return { text: "Some ups and downs lately", icon: CloudRain, color: "text-yellow-600" }
        return { text: "Consider reaching out for support", icon: CloudSnow, color: "text-orange-600" }
    }

    const insight = getMoodInsight(avgMood)
    const InsightIcon = insight.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-100/60 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-32 left-10 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Mouse follower */}
            <div 
                className="fixed pointer-events-none z-10 w-6 h-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-sm transition-all duration-300 ease-out"
                style={{
                    left: mousePosition.x - 12,
                    top: mousePosition.y - 12,
                }}
            />

            <Navigation />
            
            <main className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
                {/* Enhanced Header */}
                <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full mb-4 backdrop-blur-sm border border-white/20">
                        <Heart className="w-6 h-6 text-purple-600 mr-2" />
                        <Brain className="w-6 h-6 text-pink-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
                        Mood Tracker
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Track your emotional journey with beautiful insights. All data stays private on your device.
                    </p>
                </motion.header>

                <Tabs value={tab} onValueChange={(v) => setTab(v as "checkin" | "summary")} className="space-y-8">
                    {/* Enhanced Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex justify-center"
                    >
                        <TabsList className="bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl p-2">
                            <TabsTrigger 
                                value="checkin" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-xl font-semibold px-6 py-3 transition-all duration-300"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Daily Check-in
                            </TabsTrigger>
                            <TabsTrigger 
                                value="summary" 
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white rounded-xl font-semibold px-6 py-3 transition-all duration-300"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Weekly Summary
                            </TabsTrigger>
                        </TabsList>
                    </motion.div>

                    {/* Daily Check-in Tab */}
                    <TabsContent value="checkin" className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl text-gray-800">How are you feeling today?</CardTitle>
                                            <CardDescription className="text-gray-600">
                                                Choose an emoji that matches your current mood
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    {/* Enhanced Mood Selector */}
                                    <RadioGroup
                                        value={selectedMood?.toString() ?? ""}
                                        onValueChange={(v) => setSelectedMood(Number(v))}
                                        className="grid grid-cols-2 md:grid-cols-5 gap-4"
                                    >
                                        {EMOJI_SCALE.map((s, index) => (
                                            <motion.div
                                                key={s.value}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                                            >
                                                <Label
                                                    htmlFor={`mood-${s.value}`}
                                                    className={`group relative block cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                                        selectedMood === s.value ? "scale-110" : ""
                                                    }`}
                                                >
                                                    <div
                                                        className={`relative bg-gradient-to-br ${s.bgGradient} backdrop-blur-sm rounded-3xl p-6 text-center border-2 transition-all duration-300 ${
                                                            selectedMood === s.value 
                                                                ? "border-purple-400 shadow-2xl shadow-purple-500/25" 
                                                                : "border-white/30 hover:border-purple-200 hover:shadow-xl"
                                                        }`}
                                                    >
                                                        {selectedMood === s.value && (
                                                            <motion.div
                                                                layoutId="selectedMood"
                                                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl"
                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                            />
                                                        )}
                                                        <div className="relative">
                                                            <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                                                {s.emoji}
                                                            </div>
                                                            <div className={`text-sm font-semibold ${s.color} mb-1`}>
                                                                {s.label}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {s.value}/5
                                                            </div>
                                                        </div>
                                                        {selectedMood === s.value && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <RadioGroupItem id={`mood-${s.value}`} value={String(s.value)} className="sr-only" />
                                                </Label>
                                            </motion.div>
                                        ))}
                                    </RadioGroup>

                                    {/* Enhanced Note Section */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8, duration: 0.5 }}
                                        className="space-y-4"
                                    >
                                        <Label htmlFor="note" className="text-base font-semibold text-gray-700 flex items-center">
                                            <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                                            Optional note
                                        </Label>
                                        <Textarea
                                            id="note"
                                            placeholder="What's contributing to your mood today? Any thoughts, triggers, or positive moments you'd like to remember..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl p-4 min-h-[120px] resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                                        />
                                    </motion.div>

                                    {/* Enhanced Save Button */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1, duration: 0.5 }}
                                        className="flex items-center justify-between"
                                    >
                                        <Button 
                                            onClick={onSaveCheckIn} 
                                            disabled={!selectedMood}
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Save Today's Check-in
                                        </Button>
                                        
                                        <AnimatePresence>
                                            {todayEntry && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 rounded-full font-medium">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Saved for today
                                                    </Badge>
                                                    <div className="text-2xl">{todayEntry.emoji}</div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50">
                                        <div className="flex items-start space-x-3">
                                            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-blue-800 font-medium mb-1">Your Privacy Matters</p>
                                                <p className="text-xs text-blue-700 leading-relaxed">
                                                    Your mood data is stored only on this device. No login required, no data leaves your browser.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Enhanced Weekly Summary Tab */}
                    <TabsContent value="summary" className="space-y-8">
                        {/* Insight Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                                <InsightIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">Weekly Insight</p>
                                                <p className={`text-lg font-bold ${insight.color}`}>{insight.text}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-bold text-gray-800">{avgMood || "—"}</div>
                                            <div className="text-sm text-gray-600">Average Mood</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Enhanced Trend Chart */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/20">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <TrendingUp className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-gray-800">Past 7 Days Trend</CardTitle>
                                                <CardDescription className="text-gray-600">Your mood journey over time</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <ChartContainer
                                            config={{
                                                mood: { label: "Mood", color: "#8b5cf6" },
                                            }}
                                            className="!aspect-auto h-[280px]"
                                        >
                                            <ComposedChart data={weeklyData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                                                <defs>
                                                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#64748b" fontSize={12} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <ReferenceLine y={3} stroke="#94a3b8" strokeDasharray="4 4" label="Neutral" />
                                                <Area type="monotone" dataKey="mood" fill="url(#moodGradient)" stroke="none" />
                                                <Line
                                                    type="monotone"
                                                    dataKey="mood"
                                                    stroke="#8b5cf6"
                                                    strokeWidth={3}
                                                    dot={({ cx, cy, payload }: any) => (
                                                        <circle 
                                                            cx={cx} 
                                                            cy={cy} 
                                                            r={6} 
                                                            fill={moodColor(payload.mood)} 
                                                            stroke="white" 
                                                            strokeWidth={2}
                                                            className="drop-shadow-lg"
                                                        />
                                                    )}
                                                    activeDot={{ r: 8, stroke: "#8b5cf6", strokeWidth: 2, fill: "white" }}
                                                />
                                            </ComposedChart>
                                        </ChartContainer>

                                        <div className="mt-6">
                                            <div className="grid grid-cols-7 gap-2">
                                                {weeklyData.map((d, index) => (
                                                    <motion.div
                                                        key={`heat-${d.full}`}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: index * 0.1, duration: 0.3 }}
                                                        className="relative group"
                                                    >
                                                        <div
                                                            className="h-3 rounded-full shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer"
                                                            style={{ background: moodGradient(d.mood) }}
                                                            title={`${d.full}: ${d.mood}/5`}
                                                        />
                                                        <div className="text-xs text-center mt-1 text-gray-600 font-medium">
                                                            {d.date}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Enhanced Bar Chart */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
                                    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-white/20">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                                                <BarChart3 className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl text-gray-800">Daily Distribution</CardTitle>
                                                <CardDescription className="text-gray-600">Mood levels per day</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <ChartContainer
                                            config={{
                                                mood: { label: "Mood", color: "#8b5cf6" },
                                            }}
                                            className="!aspect-auto h-[280px]"
                                        >
                                            <BarChart data={weeklyData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#64748b" fontSize={12} />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                                <Bar dataKey="mood" radius={[8, 8, 0, 0]}>
                                                    {weeklyData.map((entry, index) => (
                                                        <Cell 
                                                            key={`cell-${index}`} 
                                                            fill={moodColor(entry.mood)}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ChartContainer>

                                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200/50">
                                            <div className="flex items-start space-x-3">
                                                <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm text-amber-800 font-medium mb-1">Demo Data Notice</p>
                                                    <p className="text-xs text-amber-700 leading-relaxed">
                                                        Charts show sample data for days you haven't checked in yet, so you can see how the visualizations work.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}
