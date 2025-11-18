import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Keyboard,
  ChartLine,
  Target,
  Lightning,
  TrendUp,
  Clock,
  Fire,
  Trophy,
  Brain,
  Warning,
  CheckCircle,
  Calendar,
  Users,
  Activity,
  Certificate
} from '@phosphor-icons/react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { getTypingSummary, getTypingHeatmap, TypingSummaryResponse, TypingHeatmapPoint } from '@/lib/apiClient'

interface UserProfile {
  photoUrl: string
  fullName: string
  username: string
}

const fallbackProgressTrendsData = [
  { month: 'Jan', wpm: 35, accuracy: 88, cpm: 175 },
  { month: 'Feb', wpm: 42, accuracy: 90, cpm: 210 },
  { month: 'Mar', wpm: 48, accuracy: 92, cpm: 240 },
  { month: 'Apr', wpm: 52, accuracy: 93, cpm: 260 },
  { month: 'May', wpm: 58, accuracy: 94, cpm: 290 },
  { month: 'Jun', wpm: 62, accuracy: 95, cpm: 310 }
]

const sessionBreakdownData = [
  { time: '9-11 AM', practice: 45, exam: 30, free: 15 },
  { time: '2-4 PM', practice: 55, exam: 25, free: 20 },
  { time: '6-8 PM', practice: 60, exam: 40, free: 25 },
  { time: '9-11 PM', practice: 50, exam: 35, free: 18 }
]

const accuracyTrendData = [
  { session: 1, accuracy: 85 },
  { session: 2, accuracy: 87 },
  { session: 3, accuracy: 89 },
  { session: 4, accuracy: 88 },
  { session: 5, accuracy: 91 },
  { session: 6, accuracy: 93 },
  { session: 7, accuracy: 94 },
  { session: 8, accuracy: 95 }
]

const languageDistributionData = [
  { name: 'Hindi', value: 65, color: '#6366f1' },
  { name: 'English', value: 25, color: '#22c55e' },
  { name: 'Marathi', value: 10, color: '#f59e0b' }
]

const examTypeData = [
  { name: 'SSC', value: 45, color: '#3b82f6' },
  { name: 'RRB', value: 30, color: '#8b5cf6' },
  { name: 'High Court', value: 15, color: '#ec4899' },
  { name: 'Practice', value: 10, color: '#14b8a6' }
]

const weakAreasData = [
  { key: 'क', errors: 15, color: 'bg-destructive' },
  { key: 'ज्ञ', errors: 12, color: 'bg-destructive' },
  { key: 'त्र', errors: 10, color: 'bg-warning' },
  { key: 'श्र', errors: 8, color: 'bg-warning' },
  { key: 'ृ', errors: 7, color: 'bg-warning' },
  { key: 'ष', errors: 5, color: 'bg-success/70' },
  { key: 'घ', errors: 4, color: 'bg-success/70' },
  { key: 'ध', errors: 3, color: 'bg-success/50' }
]

const fallbackHeatmapData = Array.from({ length: 13 }, (_, i) => ({
  label: String.fromCharCode(65 + i),
  value: Math.floor(Math.random() * 100)
}))

const RANGE_TO_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '1y': 365
}

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('wpm')
  const { user, isAuthenticated } = useAuth()
  const [summary, setSummary] = useState<TypingSummaryResponse | null>(null)
  const [heatmap, setHeatmap] = useState<TypingHeatmapPoint[]>([])
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)
  const [metricsError, setMetricsError] = useState<string | null>(null)
  const [profile] = useKV<UserProfile>('user-profile', {
    photoUrl: '',
    fullName: user?.name || '',
    username: user?.name || ''
  })

  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true
    const loadAnalytics = async () => {
      setIsLoadingMetrics(true)
      setMetricsError(null)
      const days = RANGE_TO_DAYS[timeRange] ?? 30

      try {
        const [summaryResponse, heatmapResponse] = await Promise.all([
          getTypingSummary(days),
          getTypingHeatmap(days)
        ])

        if (!isMounted) return
        setSummary(summaryResponse)
        setHeatmap(heatmapResponse)
      } catch (error) {
        if (!isMounted) return
        console.error('Failed to load typing analytics', error)
        const message = error instanceof Error ? error.message : 'Unable to load analytics data'
        setMetricsError(message)
      } finally {
        if (isMounted) {
          setIsLoadingMetrics(false)
        }
      }
    }

    void loadAnalytics()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, timeRange])

  const stats = summary?.stats
  const rangeDays = RANGE_TO_DAYS[timeRange] ?? 30

  const formatDateLabel = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })
  }

  const trendData = useMemo(() => {
    if (!summary?.recent?.length) {
      return fallbackProgressTrendsData
    }

    return [...summary.recent]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((session) => ({
        month: formatDateLabel(session.createdAt),
        wpm: session.wpm,
        accuracy: Math.round(session.accuracy),
        cpm: Math.max(0, Math.round(session.wpm * 5))
      }))
  }, [summary])

  const heatmapChartData = useMemo(() => {
    if (heatmap.length) {
      return heatmap.map((row) => ({
        label: formatDateLabel(row.date),
        value: row.count
      }))
    }

    return fallbackHeatmapData.map((item) => ({
      label: item.label,
      value: item.value
    }))
  }, [heatmap])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Keyboard size={24} weight="bold" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">TypistPro India</h1>
                <p className="text-xs text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              <Link to="/start-type">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Lightning weight="bold" />
                  Start Type
                </Button>
              </Link>
              
              <Link to="/stenography">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Brain weight="bold" />
                  Stenography
                </Button>
              </Link>
              
              <Link to="/exam-prep">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Certificate weight="bold" />
                  Exam Hub
                </Button>
              </Link>
              
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Trophy weight="bold" />
                  Leaderboard
                </Button>
              </Link>
              
              <Link to="/analytics">
                <Button variant="default" size="sm" className="gap-2">
                  <ChartLine weight="bold" />
                  Analytics
                </Button>
              </Link>
              
              <Link to="/profile">
                <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  {profile?.photoUrl ? (
                    <AvatarImage src={profile.photoUrl} alt={profile.fullName || user?.name} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {getInitials(profile?.fullName || user?.name || 'User')}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Progress & Analytics</h2>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 3 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendUp weight="bold" size={24} />
                Progress Trends Over Time
              </CardTitle>
              <CardDescription>Track your typing speed, accuracy, and consistency</CardDescription>
            </CardHeader>
            <CardContent>
              {metricsError && (
                <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {metricsError}
                </div>
              )}
              {isLoadingMetrics && !metricsError && (
                <p className="mb-4 text-sm text-muted-foreground">Syncing the latest sessions…</p>
              )}
              <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="mb-4">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="wpm">WPM</TabsTrigger>
                  <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                  <TabsTrigger value="cpm">CPM</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.18 0.01 240)', 
                      border: '1px solid oklch(0.30 0.005 240)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {selectedMetric === 'wpm' && (
                    <Area type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={3} fill="url(#colorWpm)" />
                  )}
                  {selectedMetric === 'accuracy' && (
                    <Area type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={3} fill="url(#colorAccuracy)" />
                  )}
                  {selectedMetric === 'cpm' && (
                    <Area type="monotone" dataKey="cpm" stroke="#f59e0b" strokeWidth={3} fill="url(#colorCpm)" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">{stats?.totalSessions ?? 0}</div>
                <p className="text-sm text-muted-foreground">
                  Total practice sessions (last {rangeDays} days)
                </p>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-success">
                  <TrendUp weight="bold" size={16} />
                  <span className="text-sm font-semibold">
                    Avg WPM {stats ? `${stats.avgWpm}` : '—'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Practice Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary mb-2">{stats?.totalPracticeMinutes ?? 0}</div>
                <p className="text-sm text-muted-foreground">Minutes typed (last {rangeDays} days)</p>
                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-success">
                  <Fire weight="fill" size={16} />
                  <span className="text-sm font-semibold">Best WPM {stats?.bestWpm ?? 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Performance Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-accent mb-1">{stats?.avgAccuracy ?? 0}%</div>
                  <p className="text-sm text-muted-foreground">Average accuracy</p>
                </div>
                <ScrollArea className="h-24">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle weight="fill" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Real-time data synced from your sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle weight="fill" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>Track streaks and milestones automatically</span>
                    </li>
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity weight="bold" size={24} />
                Performance Heatmap
              </CardTitle>
              <CardDescription>Keystroke frequency analysis across practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMetrics && !metricsError && (
                <p className="mb-4 text-sm text-muted-foreground">Loading activity heatmap…</p>
              )}
              {metricsError && (
                <p className="mb-4 text-sm text-destructive">Heatmap unavailable: {metricsError}</p>
              )}
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={heatmapChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                  <XAxis dataKey="label" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'oklch(0.18 0.01 240)', 
                      border: '1px solid oklch(0.30 0.005 240)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target weight="bold" size={24} />
                  Accuracy Progress
                </CardTitle>
                <CardDescription>Session-by-session accuracy improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-5xl font-bold text-success mb-1">94.8%</div>
                  <p className="text-sm text-muted-foreground">Current Average Accuracy</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                    <XAxis dataKey="session" stroke="#888" />
                    <YAxis domain={[80, 100]} stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(0.18 0.01 240)', 
                        border: '1px solid oklch(0.30 0.005 240)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users weight="bold" size={24} />
                  Language Distribution
                </CardTitle>
                <CardDescription>Practice time by language preference</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={languageDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {languageDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock weight="bold" size={24} />
                  Session Breakdown
                </CardTitle>
                <CardDescription>Practice patterns by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionBreakdownData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'oklch(0.18 0.01 240)', 
                        border: '1px solid oklch(0.30 0.005 240)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="practice" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="exam" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="free" stackId="a" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy weight="bold" size={24} />
                  Exam Type Usage
                </CardTitle>
                <CardDescription>Preferred exam modes</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={examTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {examTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warning weight="bold" size={24} />
                Weak Areas Identification
              </CardTitle>
              <CardDescription>Characters requiring focused practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {weakAreasData.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card/50"
                  >
                    <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center`}>
                      <span className="text-2xl font-bold font-hindi text-white">{item.key}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.errors} errors
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex items-start gap-3 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <Brain weight="fill" size={32} className="text-accent flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm mb-2">AI Coach Recommendation</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    आप 'ज्ञ' और 'त्र' संयुक्त अक्षरों में अटकते हैं। इन पर ध्यान केंद्रित करने के लिए कस्टम अभ्यास सत्र की सिफारिश की जाती है।
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Focus on compound characters 'ज्ञ' and 'त्र'. Recommended: 10-minute targeted drill session.
                  </p>
                  <Button size="sm" className="mt-3 gap-2">
                    <Lightning weight="fill" />
                    Start Focused Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4 text-center py-8 border-t border-border">
            <div>
              <Calendar weight="bold" size={32} className="mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold mb-1">127</div>
              <p className="text-sm text-muted-foreground">Days Active</p>
            </div>
            <div>
              <Fire weight="fill" size={32} className="mx-auto mb-2 text-warning" />
              <div className="text-3xl font-bold mb-1">15</div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
            <div>
              <Trophy weight="fill" size={32} className="mx-auto mb-2 text-accent" />
              <div className="text-3xl font-bold mb-1">#8</div>
              <p className="text-sm text-muted-foreground">Global Rank</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 TypistPro India - Analytics Dashboard</p>
            <div className="flex items-center gap-2">
              <Keyboard size={16} />
              <span>Powered by AI Coach</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
