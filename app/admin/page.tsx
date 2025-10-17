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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { getDashboardAnalytics, getCounselors, addCounselor, deleteCounselor, getPosts } from "@/lib/firestore"
import { Users, MessageCircle, Calendar, TrendingUp, Activity, Shield, AlertTriangle, CheckCircle, Clock, Eye, Flag, UserCheck, BarChart3, PieChartIcon, Loader2, RefreshCw, Download, Trash2, PlusCircle, UserPlus, X } from "lucide-react"

// Simplified interfaces for our real data
interface Post { id: string; title: string; authorName: string; createdAt: { toDate: () => Date }; }
interface Counselor { id: string; name: string; title: string; specialties: string[]; }

export default function AdminPage() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewCounselorOpen, setIsNewCounselorOpen] = useState(false);
  const [newCounselor, setNewCounselor] = useState({ name: "", title: "", specialties: "", bio: "", image: "", experience: "", rating: "4.5", modes: "online,offline" });
  const { toast } = useToast();

  useEffect(() => {
    // Master listener for all analytics data
    const analyticsUnsubscribe = getDashboardAnalytics((data) => {
      setAnalyticsData((prevData: any) => ({ ...prevData, ...data }));
      setIsLoading(false);
    });

    // Listener for counselor list
    const counselorsUnsubscribe = getCounselors((fetchedCounselors) => {
      setCounselors(fetchedCounselors as Counselor[]);
    });

    // Listener for recent posts (for moderation tab)
    const postsUnsubscribe = getPosts((fetchedPosts) => {
      setRecentPosts(fetchedPosts.slice(0, 10) as Post[]);
    });

    // Cleanup function to stop listening when the component unmounts
    return () => {
      analyticsUnsubscribe();
      counselorsUnsubscribe();
      postsUnsubscribe();
    };
  }, []);

  const handleAddCounselor = async () => {
    if (!newCounselor.name || !newCounselor.title || !newCounselor.specialties) {
      toast({ title: "Missing Fields", description: "Name, title, and specialties are required.", variant: "destructive" });
      return;
    }
    const counselorData = {
      ...newCounselor,
      specialties: newCounselor.specialties.split(',').map(s => s.trim()),
      modes: newCounselor.modes.split(',').map(s => s.trim()),
      rating: parseFloat(newCounselor.rating),
      // Use a default ID for sorting if needed, Firestore will generate the document ID
      id: (counselors.length + 5).toString(),
    };
    const result = await addCounselor(counselorData);
    if (result.success) {
      toast({ title: "Success", description: "New counselor has been added." });
      setIsNewCounselorOpen(false);
      setNewCounselor({ name: "", title: "", specialties: "", bio: "", image: "", experience: "", rating: "4.5", modes: "online,offline" });
    } else {
      toast({ title: "Error", description: "Failed to add counselor.", variant: "destructive" });
    }
  };

  const handleDeleteCounselor = async (counselorId: string) => {
    if (window.confirm("Are you sure you want to delete this counselor? This action cannot be undone.")) {
      const result = await deleteCounselor(counselorId);
      if (result.success) {
        toast({ title: "Success", description: "Counselor has been deleted." });
      } else {
        toast({ title: "Error", description: "Failed to delete counselor.", variant: "destructive" });
      }
    }
  };

  const chartData = (data: any) => data ? [
    { name: "Minimal", value: data.minimal, color: "#a78bfa" },
    { name: "Mild", value: data.mild, color: "#c084fc" },
    { name: "Moderate", value: data.moderate, color: "#f472b6" },
    { name: "Severe", value: data.severe, color: "#ef4444" },
  ] : [];

  const phq9ChartData = chartData(analyticsData?.assessmentMetrics?.phq9Results);
  const gad7ChartData = chartData(analyticsData?.assessmentMetrics?.gad7Results);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /><p className="ml-3">Loading Live Dashboard...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8"><h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1><p className="text-muted-foreground">Live platform metrics, user data, and content management</p></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData?.totalUsers?.toLocaleString() || "0"}</div><p className="text-xs text-muted-foreground">Unique registered users</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Bookings</CardTitle><Calendar className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData?.totalBookings?.toLocaleString() || "0"}</div><p className="text-xs text-muted-foreground">All-time appointments scheduled</p></CardContent></Card>
          <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Forum Posts</CardTitle><MessageCircle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{analyticsData?.totalPosts?.toLocaleString() || "0"}</div><p className="text-xs text-muted-foreground">Total community posts</p></CardContent></Card>
          <Card className="border-red-500/50 bg-red-500/10"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-red-600">High-Risk Users</CardTitle><AlertTriangle className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{analyticsData?.assessmentMetrics?.highRiskUsers || "0"}</div><p className="text-xs text-red-500">Users with severe assessment scores</p></CardContent></Card>
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="analytics">Analytics</TabsTrigger><TabsTrigger value="counselors">Counselors</TabsTrigger><TabsTrigger value="moderation">Moderation</TabsTrigger><TabsTrigger value="system">System Health</TabsTrigger></TabsList>

          <TabsContent value="analytics" className="space-y-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card><CardHeader><CardTitle className="flex items-center space-x-2"><PieChartIcon className="w-5 h-5" /><span>PHQ-9 Depression Results</span></CardTitle><CardDescription>Aggregated from all user assessments</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={phq9ChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} >{phq9ChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center space-x-2"><PieChartIcon className="w-5 h-5" /><span>GAD-7 Anxiety Results</span></CardTitle><CardDescription>Aggregated from all user assessments</CardDescription></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={gad7ChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} >{gad7ChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card></div></TabsContent>

          <TabsContent value="counselors" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>Manage Counselors</CardTitle><CardDescription>Add, view, or remove counselors from the platform.</CardDescription></div>
                <Dialog open={isNewCounselorOpen} onOpenChange={setIsNewCounselorOpen}><DialogTrigger asChild><Button><UserPlus className="w-4 h-4 mr-2" />Add New Counselor</Button></DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]"><DialogHeader><DialogTitle>Add New Counselor</DialogTitle><DialogDescription>Fill in the details for the new professional.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" value={newCounselor.name} onChange={(e) => setNewCounselor(p => ({ ...p, name: e.target.value }))} className="col-span-3" /></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" value={newCounselor.title} onChange={(e) => setNewCounselor(p => ({ ...p, title: e.target.value }))} className="col-span-3" /></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="specialties" className="text-right">Specialties</Label><Input id="specialties" value={newCounselor.specialties} onChange={(e) => setNewCounselor(p => ({ ...p, specialties: e.target.value }))} placeholder="Anxiety, Trauma (comma-separated)" className="col-span-3" /></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="bio" className="text-right">Bio</Label><Textarea id="bio" value={newCounselor.bio} onChange={(e) => setNewCounselor(p => ({ ...p, bio: e.target.value }))} className="col-span-3" /></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="experience" className="text-right">Experience</Label><Input id="experience" value={newCounselor.experience} onChange={(e) => setNewCounselor(p => ({ ...p, experience: e.target.value }))} placeholder="e.g., 8 years" className="col-span-3" /></div>
                      <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="image" className="text-right">Image URL</Label><Input id="image" value={newCounselor.image} onChange={(e) => setNewCounselor(p => ({ ...p, image: e.target.value }))} placeholder="https://..." className="col-span-3" /></div>
                    </div>
                    <div className="flex justify-end"><Button onClick={handleAddCounselor}>Save Counselor</Button></div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Title</TableHead><TableHead>Specialties</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {counselors.map((c) => (<TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{c.title}</TableCell><TableCell>{c.specialties.join(', ')}</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteCounselor(c.id)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button></TableCell></TableRow>))}
                </TableBody>
              </Table></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Recent Forum Posts</CardTitle><CardDescription>A live feed of the latest posts for monitoring purposes.</CardDescription></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Author</TableHead><TableHead>Time</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {recentPosts.map((post) => (<TableRow key={post.id}><TableCell className="font-medium max-w-sm truncate">{post.title}</TableCell><TableCell>{post.authorName}</TableCell><TableCell>{post.createdAt?.toDate().toLocaleTimeString()}</TableCell><TableCell><Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" />View Post</Button></TableCell></TableRow>))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card><CardHeader><CardTitle className="flex items-center justify-between"><span>Server Uptime</span><span className="text-sm text-purple-600">EXCELLENT</span></CardTitle></CardHeader><CardContent><div className="text-3xl font-bold mb-2">99.9%</div><Progress value={99.9} className="h-2" /></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center justify-between"><span>Response Time</span><span className="text-sm text-purple-600">GOOD</span></CardTitle></CardHeader><CardContent><div className="text-3xl font-bold mb-2">120<span className="text-lg text-muted-foreground ml-1">ms</span></div></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center justify-between"><span>Error Rate</span><span className="text-sm text-purple-600">EXCELLENT</span></CardTitle></CardHeader><CardContent><div className="text-3xl font-bold mb-2">0.1<span className="text-lg text-muted-foreground ml-1">%</span></div></CardContent></Card>
              <Card><CardHeader><CardTitle className="flex items-center justify-between"><span>Database Health</span><span className="text-sm text-purple-600">EXCELLENT</span></CardTitle></CardHeader><CardContent><div className="text-3xl font-bold mb-2">100%</div><Progress value={100} className="h-2" /></CardContent></Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}