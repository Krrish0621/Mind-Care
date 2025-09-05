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
}

export default function AdminPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
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

  useEffect(() => {
    fetchAnalytics(selectedPeriod)
    fetchReports()
  }, [selectedPeriod])

  const phq9ChartData = analyticsData
    ? [
      { name: "Minimal", value: analyticsData.assessmentMetrics.phq9Results.minimal, color: "#3b82f6" },
      { name: "Mild", value: analyticsData.assessmentMetrics.phq9Results.mild, color: "#6C63FF" },
      { name: "Moderate", value: analyticsData.assessmentMetrics.phq9Results.moderate, color: "#FF6B6B" },
      { name: "Severe", value: analyticsData.assessmentMetrics.phq9Results.severe, color: "#FF4444" },
    ]
    : []

  const gad7ChartData = analyticsData
    ? [
      { name: "Minimal", value: analyticsData.assessmentMetrics.gad7Results.minimal, color: "#3b82f6" },
      { name: "Mild", value: analyticsData.assessmentMetrics.gad7Results.mild, color: "#6C63FF" },
      { name: "Moderate", value: analyticsData.assessmentMetrics.gad7Results.moderate, color: "#FF6B6B" },
      { name: "Severe", value: analyticsData.assessmentMetrics.gad7Results.severe, color: "#FF4444" },
    ]
    : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-blue-100 text-blue-800"
      case "under-review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMetricStatus = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-blue-600"
      case "good":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
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
                  className={`flex items-center ${(analyticsData?.userMetrics?.userGrowth ?? 0) >= 0 ? "text-blue-600" : "text-red-600"}`}
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
                {(analyticsData?.userMetrics.activeUsers ?? 100).toLocaleString()}
              </div>              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 flex items-center">
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
              <div className="text-2xl font-bold">{analyticsData?.bookingMetrics.totalBookings || "12"}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`flex items-center ${(analyticsData?.bookingMetrics?.bookingGrowth ?? 0) >= 0 ? "text-blue-600" : "text-red-600"
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
              <div className="text-2xl font-bold">{analyticsData?.forumMetrics.totalPosts.toLocaleString() || "80"}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`flex items-center ${analyticsData?.forumMetrics?.postGrowth ?? 0 >= 0 ? "text-blue-600" : "text-red-600"}`}
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
                        label={({ name, value }) => `${name}: ${value}%`}
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
                        label={({ name, value }) => `${name}: ${value}%`}
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
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
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
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">4</div>
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
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
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
                      <span className="text-sm text-blue-600">EXCELLENT</span>
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
                      <span className="text-sm text-blue-600">GOOD</span>
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
                      <span className="text-sm text-blue-600">EXCELLENT</span>
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
                      <span className="text-sm text-blue-600">EXCELLENT</span>
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
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">System Update Completed</p>
                      <p className="text-sm text-blue-600">Security patches applied successfully - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">High Traffic Detected</p>
                      <p className="text-sm text-blue-600">Increased user activity during peak hours - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Scheduled Maintenance</p>
                      <p className="text-sm text-blue-600">Database optimization scheduled for tonight at 2 AM</p>
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
                  <Button className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
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
                  <Button className="w-full">
                    <Users className="w-4 h-4 mr-2" />
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
                  <Button className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
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
                      <p className="font-medium">Monthly Usage Report - June 2024</p>
                      <p className="text-sm text-muted-foreground">Generated 2 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">User Activity Analysis - Q2 2024</p>
                      <p className="text-sm text-muted-foreground">Generated 1 week ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Content Moderation Summary - May 2024</p>
                      <p className="text-sm text-muted-foreground">Generated 2 weeks ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
