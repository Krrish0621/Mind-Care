"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Users,
  MessageCircle,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Flag,
  UserCheck,
  BarChart3,
  PieChartIcon,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react"

interface AnalyticsData {
  userMetrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    userGrowth: number
  }
  bookingMetrics: {
    totalBookings: number
    pendingBookings: number
    completedBookings: number
    bookingGrowth: number
  }
  forumMetrics: {
    totalPosts: number
    activePosts: number
    flaggedPosts: number
    postGrowth: number
  }
  assessmentMetrics: {
    phq9Results: {
      minimal: number
      mild: number
      moderate: number
      severe: number
    }
    gad7Results: {
      minimal: number
      mild: number
      moderate: number
      severe: number
    }
    highRiskUsers: number
  }
  systemHealth: {
    uptime: number
    responseTime: number
    errorRate: number
    databaseHealth: number
  }
}

interface Report {
  id: string
  type: string
  content: string
  reporter: string
  timestamp: Date
  status: "pending" | "resolved" | "under-review"
  postId?: string
  userId?: string
  reason?: string
}

export default function AdminPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const { toast } = useToast()

  const fetchAnalytics = async (period = "7d") => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (!response.ok) throw new Error("Failed to fetch analytics")

      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error("[v0] Analytics fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports")
      if (!response.ok) throw new Error("Failed to fetch reports")

      const data = await response.json()
      setReports(
        data.reports.map((report: any) => ({
          ...report,
          timestamp: new Date(report.timestamp),
        })),
      )
    } catch (error) {
      console.error("[v0] Reports fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      })
    }
  }

  const handleReportAction = async (reportId: string, action: string) => {
    try {
      const response = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action, adminId: "admin_current" }),
      })

      if (!response.ok) throw new Error("Failed to process report")

      toast({
        title: "Success",
        description: `Report ${action} successfully`,
      })

      fetchReports() // Refresh reports
    } catch (error) {
      console.error("[v0] Report action error:", error)
      toast({
        title: "Error",
        description: "Failed to process report action",
        variant: "destructive",
      })
    }
  }

  const generateReport = async (reportType: string) => {
    try {
      setIsGeneratingReport(true)
      
      // Generate report data based on type
      let reportData: any = {}
      let filename = ""
      
      if (reportType === "usage") {
        reportData = {
          "Report Period": "October 2024",
          "Total Users": analyticsData?.userMetrics.totalUsers || 847,
          "Active Users": analyticsData?.userMetrics.activeUsers || 234,
          "New Registrations": analyticsData?.userMetrics.newUsers || 67,
          "Total Sessions": "1,234",
          "Average Session Duration": "12.5 minutes",
          "Total Bookings": analyticsData?.bookingMetrics.totalBookings || 156,
          "Completed Bookings": analyticsData?.bookingMetrics.completedBookings || 118,
          "Cancelled Bookings": "15",
          "Forum Posts": analyticsData?.forumMetrics.totalPosts || 342,
          "Forum Engagement Rate": "68%",
          "PHQ-9 Assessments": "100",
          "GAD-7 Assessments": "100",
          "High Risk Users Flagged": analyticsData?.assessmentMetrics.highRiskUsers || 13
        }
        filename = `usage-report-${new Date().toISOString().split('T')[0]}.csv`
      } else if (reportType === "user-activity") {
        reportData = {
          "Report Period": "October 2024",
          "Daily Active Users": analyticsData?.userMetrics.activeUsers || 234,
          "Weekly Active Users": "456",
          "Monthly Active Users": analyticsData?.userMetrics.totalUsers || 847,
          "User Retention Rate": "73%",
          "Chat Feature Usage": "89%",
          "Mood Tracker Usage": "67%",
          "Forum Participation": "45%",
          "Booking System Usage": "23%",
          "Resources Accessed": "56%"
        }
        filename = `user-activity-report-${new Date().toISOString().split('T')[0]}.csv`
      } else if (reportType === "moderation") {
        reportData = {
          "Report Period": "October 2024",
          "Total Reports Received": reports.length || 47,
          "Reports Resolved": reports.filter(r => r.status === "resolved").length || 38,
          "Reports Pending": reports.filter(r => r.status === "pending").length || 9,
          "Average Resolution Time": "2.3 hours",
          "Content Removed": "12",
          "Users Warned": "8",
          "Users Suspended": "2",
          "False Reports": "5"
        }
        filename = `moderation-report-${new Date().toISOString().split('T')[0]}.csv`
      }

      // Convert to CSV
      const csvContent = Object.entries(reportData)
        .map(([key, value]) => `"${key}","${value}"`)
        .join('\n')
      
      const csvHeader = "Metric,Value\n"
      const fullCsvContent = csvHeader + csvContent

      // Download CSV
      const blob = new Blob([fullCsvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded successfully`,
      })
    } catch (error) {
      console.error("Report generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(selectedPeriod)
    fetchReports()
  }, [selectedPeriod])

  const phq9ChartData = analyticsData
    ? [
        { name: "Minimal", value: analyticsData.assessmentMetrics.phq9Results.minimal, color: "#A855F7" },
        { name: "Mild", value: analyticsData.assessmentMetrics.phq9Results.mild, color: "#C084FC" },
        { name: "Moderate", value: analyticsData.assessmentMetrics.phq9Results.moderate, color: "#DDA0DD" },
        { name: "Severe", value: analyticsData.assessmentMetrics.phq9Results.severe, color: "#8B4A9C" },
      ]
    : []

  const gad7ChartData = analyticsData
    ? [
        { name: "Minimal", value: analyticsData.assessmentMetrics.gad7Results.minimal, color: "#A855F7" },
        { name: "Mild", value: analyticsData.assessmentMetrics.gad7Results.mild, color: "#C084FC" },
        { name: "Moderate", value: analyticsData.assessmentMetrics.gad7Results.moderate, color: "#DDA0DD" },
        { name: "Severe", value: analyticsData.assessmentMetrics.gad7Results.severe, color: "#8B4A9C" },
      ]
    : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "under-review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    return "Just now"
  }

  if (isLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor platform usage, user activity, and system health</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => fetchAnalytics(selectedPeriod)} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.userMetrics.totalUsers.toLocaleString() || "0"}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`flex items-center ${(analyticsData?.userMetrics?.userGrowth ?? 0) >= 0 ? "text-purple-600" : "text-red-600"}`}
                >
                  {(analyticsData?.userMetrics?.userGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {(analyticsData?.userMetrics?.userGrowth ?? 0) >= 0 ? "+" : ""}
                  {analyticsData?.userMetrics.userGrowth.toFixed(1)}%
                </span>
                from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(analyticsData?.userMetrics.activeUsers ?? 234).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2%
                </span>
                from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Counselor Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.bookingMetrics.totalBookings || "156"}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`flex items-center ${(analyticsData?.bookingMetrics?.bookingGrowth ?? 0) >= 0 ? "text-purple-600" : "text-red-600"
                    }`}
                >
                  {(analyticsData?.bookingMetrics?.bookingGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {(analyticsData?.bookingMetrics?.bookingGrowth ?? 0) >= 0 ? "+" : ""}
                  {(analyticsData?.bookingMetrics?.bookingGrowth ?? 0).toFixed(1)}%
                </span>
                this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData?.forumMetrics.totalPosts.toLocaleString() || "342"}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`flex items-center ${analyticsData?.forumMetrics?.postGrowth ?? 0 >= 0 ? "text-purple-600" : "text-red-600"}`}
                >
                  {(analyticsData?.forumMetrics?.postGrowth ?? 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {(analyticsData?.forumMetrics?.postGrowth ?? 0) >= 0 ? "+" : ""}
                  {analyticsData?.forumMetrics.postGrowth.toFixed(1)}%
                </span>
                from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PHQ-9 Results Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChartIcon className="w-5 h-5" />
                    <span>PHQ-9 Depression Assessment Results</span>
                  </CardTitle>
                  <CardDescription>Distribution of depression screening results</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={phq9ChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {phq9ChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* GAD-7 Results Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChartIcon className="w-5 h-5" />
                    <span>GAD-7 Anxiety Assessment Results</span>
                  </CardTitle>
                  <CardDescription>Distribution of anxiety screening results</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={gad7ChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {gad7ChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* High Risk Users Alert */}
            {analyticsData && analyticsData.assessmentMetrics.highRiskUsers > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="w-5 h-5" />
                    <span>High Risk Users Alert</span>
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    Users with severe assessment scores requiring immediate attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-800 mb-2">
                    {analyticsData.assessmentMetrics.highRiskUsers}
                  </div>
                  <p className="text-sm text-red-600 mb-4">
                    Users with PHQ-9 ≥ 15 or GAD-7 ≥ 15 scores in the last 7 days
                  </p>
                  <Button variant="destructive" size="sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Review High Risk Cases
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                  <Flag className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {reports.filter((r) => r.status === "pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      reports.filter(
                        (r) => r.status === "resolved" && r.timestamp.toDateString() === new Date().toDateString(),
                      ).length
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Successfully handled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Moderators</CardTitle>
                  <UserCheck className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">4</div>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest content moderation reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.type}</TableCell>
                        <TableCell className="max-w-xs truncate">{report.content}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{formatTimestamp(report.timestamp)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)} variant="secondary">
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" onClick={() => setSelectedReport(report)}>
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Report Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed view of the reported content
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedReport && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="font-medium text-sm">Report ID</p>
                                        <p className="text-sm text-muted-foreground">{selectedReport.id}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Type</p>
                                        <p className="text-sm text-muted-foreground">{selectedReport.type}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Reporter</p>
                                        <p className="text-sm text-muted-foreground">{selectedReport.reporter}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Status</p>
                                        <Badge className={getStatusColor(selectedReport.status)} variant="secondary">
                                          {selectedReport.status}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">Timestamp</p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedReport.timestamp.toLocaleString()}
                                        </p>
                                      </div>
                                      {selectedReport.reason && (
                                        <div>
                                          <p className="font-medium text-sm">Reason</p>
                                          <p className="text-sm text-muted-foreground">{selectedReport.reason}</p>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-sm mb-2">Reported Content</p>
                                      <div className="p-3 bg-gray-50 rounded-lg border">
                                        <p className="text-sm">{selectedReport.content}</p>
                                      </div>
                                    </div>
                                    {selectedReport.status === "pending" && (
                                      <div className="flex space-x-2 pt-4">
                                        <Button size="sm" onClick={() => handleReportAction(selectedReport.id, "resolved")}>
                                          <Shield className="w-3 h-3 mr-1" />
                                          Resolve
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleReportAction(selectedReport.id, "under-review")}>
                                          <Clock className="w-3 h-3 mr-1" />
                                          Under Review
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            {report.status === "pending" && (
                              <Button size="sm" onClick={() => handleReportAction(report.id, "resolved")}>
                                <Shield className="w-3 h-3 mr-1" />
                                Resolve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Server Uptime</span>
                      <span className="text-sm text-purple-600">EXCELLENT</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{analyticsData.systemHealth.uptime}%</div>
                    <Progress value={analyticsData.systemHealth.uptime} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Response Time</span>
                      <span className="text-sm text-purple-600">GOOD</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {analyticsData.systemHealth.responseTime}
                      <span className="text-lg text-muted-foreground ml-1">ms</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Error Rate</span>
                      <span className="text-sm text-purple-600">EXCELLENT</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {analyticsData.systemHealth.errorRate}
                      <span className="text-lg text-muted-foreground ml-1">%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Database Health</span>
                      <span className="text-sm text-purple-600">EXCELLENT</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">{analyticsData.systemHealth.databaseHealth}%</div>
                    <Progress value={analyticsData.systemHealth.databaseHealth} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>System Alerts</span>
                </CardTitle>
                <CardDescription>Recent system notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">System Update Completed</p>
                      <p className="text-sm text-purple-600">Security patches applied successfully - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">High Traffic Detected</p>
                      <p className="text-sm text-purple-600">Increased user activity during peak hours - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Scheduled Maintenance</p>
                      <p className="text-sm text-purple-600">Database optimization scheduled for tonight at 2 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Report</CardTitle>
                  <CardDescription>Generate detailed usage analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => generateReport("usage")}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4 mr-2" />
                    )}
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity Report</CardTitle>
                  <CardDescription>Export user engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => generateReport("user-activity")}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Users className="w-4 h-4 mr-2" />
                    )}
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation Report</CardTitle>
                  <CardDescription>Summary of moderation activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => generateReport("moderation")}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="w-4 h-4 mr-2" />
                    )}
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Report Downloads</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Monthly Usage Report - October 2024</p>
                      <p className="text-sm text-muted-foreground">Generated 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">User Activity Analysis - Q4 2024</p>
                      <p className="text-sm text-muted-foreground">Generated 1 week ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Content Moderation Summary - September 2024</p>
                      <p className="text-sm text-muted-foreground">Generated 2 weeks ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer/>
    </div>
  )
}
