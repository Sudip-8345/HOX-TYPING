import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Lightning,
  ChartLine,
  Brain,
  Trophy,
  Clock,
  Target,
  Fire,
  CheckCircle,
  TrendUp,
  Calendar,
  Bell,
  Microphone,
  Keyboard,
  BookOpen,
  Certificate,
  Star,
  Medal,
  CaretRight,
  User,
  Crown,
  ChartBar,
  GraduationCap,
  Activity
} from '@phosphor-icons/react'

interface UserProfile {
  photoUrl: string
  fullName: string
  username: string
}

interface TypingSession {
  wpm: number
  accuracy: number
  duration: number
  mode: string
  timestamp: number
  language: string
}

interface DailyAttendance {
  date: string
  practiced: boolean
  sessions: number
}

export function GeneralDashboard() {
  const { user } = useAuth()
  const [profile] = useKV<UserProfile>('user-profile', {
    photoUrl: '',
    fullName: user?.name || '',
    username: user?.name || ''
  })

  // Dashboard Stats
  const [stats, setStats] = useState({
    avgWPM: 0,
    avgAccuracy: 0,
    totalPracticeTime: 0,
    currentStreak: 0,
    bestWPM: 0,
    totalTests: 0,
    examReadiness: 0
  })

  const [recentSessions = []] = useKV<TypingSession[]>('typing-sessions', [])
  const [attendance, setAttendance] = useState<DailyAttendance[]>([])
  const [notifications] = useState([
    { id: 1, type: 'achievement', message: 'New milestone: 100 practice sessions!', time: '2 hours ago', unread: true },
    { id: 2, type: 'tip', message: 'Daily practice tip: Focus on accuracy first', time: '1 day ago', unread: true },
    { id: 3, type: 'update', message: 'New dictation tests added for SSC preparation', time: '2 days ago', unread: false }
  ])

  // Generate attendance heatmap data for last 12 weeks
  useEffect(() => {
    const generateAttendance = () => {
      const data: DailyAttendance[] = []
      const today = new Date()
      
      for (let i = 83; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        
        // Random practice data (in real app, this would come from actual sessions)
        const practiced = Math.random() > 0.3
        const sessions = practiced ? Math.floor(Math.random() * 5) + 1 : 0
        
        data.push({ date: dateStr, practiced, sessions })
      }
      
      setAttendance(data)
    }
    
    generateAttendance()
  }, [])

  // Calculate stats from sessions
  useEffect(() => {
    if (recentSessions.length > 0) {
      const avgWPM = Math.round(recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length)
      const avgAccuracy = Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length)
      const totalPracticeTime = Math.round(recentSessions.reduce((sum, s) => sum + s.duration, 0) / 60)
      const bestWPM = Math.max(...recentSessions.map(s => s.wpm))
      
      // Calculate streak
      const sortedSessions = [...recentSessions].sort((a, b) => b.timestamp - a.timestamp)
      let streak = 0
      let currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      
      for (const session of sortedSessions) {
        const sessionDate = new Date(session.timestamp)
        sessionDate.setHours(0, 0, 0, 0)
        const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === streak) {
          streak++
        } else if (daysDiff > streak) {
          break
        }
      }
      
      // Calculate exam readiness (based on WPM and accuracy)
      const examReadiness = Math.min(100, Math.round(((avgWPM / 40) * 50) + ((avgAccuracy / 100) * 50)))
      
      setStats({
        avgWPM,
        avgAccuracy,
        totalPracticeTime,
        currentStreak: streak,
        bestWPM,
        totalTests: recentSessions.length,
        examReadiness
      })
    } else {
      // Default stats for new users
      setStats({
        avgWPM: 25,
        avgAccuracy: 92,
        totalPracticeTime: 45,
        currentStreak: 3,
        bestWPM: 32,
        totalTests: 12,
        examReadiness: 65
      })
    }
  }, [recentSessions])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const getAttendanceColor = (sessions: number) => {
    if (sessions === 0) return 'bg-muted'
    if (sessions === 1) return 'bg-green-200'
    if (sessions === 2) return 'bg-green-300'
    if (sessions === 3) return 'bg-green-400'
    if (sessions >= 4) return 'bg-green-500'
    return 'bg-muted'
  }

  const getExamReadinessColor = () => {
    if (stats.examReadiness >= 80) return 'text-green-600'
    if (stats.examReadiness >= 60) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getExamReadinessText = () => {
    if (stats.examReadiness >= 80) return 'Excellent - Ready for Exam'
    if (stats.examReadiness >= 60) return 'Good - Keep Practicing'
    return 'Needs Improvement'
  }

  const leaderboardData = [
    { rank: 1, name: 'Priya Sharma', wpm: 78, accuracy: 98, avatar: '', streak: 45 },
    { rank: 2, name: 'Rahul Kumar', wpm: 75, accuracy: 97, avatar: '', streak: 38 },
    { rank: 3, name: 'Amit Singh', wpm: 72, accuracy: 96, avatar: '', streak: 32 },
    { rank: 4, name: profile?.fullName || user?.name || 'You', wpm: stats.avgWPM, accuracy: stats.avgAccuracy, avatar: profile?.photoUrl || '', streak: stats.currentStreak, isCurrentUser: true },
    { rank: 5, name: 'Sneha Patel', wpm: 68, accuracy: 95, avatar: '', streak: 28 }
  ]

  const recommendedDrills = [
    { id: 1, title: 'Accuracy Booster', description: 'Focus on reducing errors', duration: '15 min', difficulty: 'Medium', icon: Target },
    { id: 2, title: 'Speed Training', description: 'Increase typing speed', duration: '20 min', difficulty: 'Hard', icon: Lightning },
    { id: 3, title: 'Hindi Mangal Practice', description: 'Master Mangal font', duration: '30 min', difficulty: 'Medium', icon: BookOpen },
    { id: 4, title: 'Common Words Drill', description: 'Practice frequently used words', duration: '10 min', difficulty: 'Easy', icon: Keyboard }
  ]

  const recentActivities = [
    { id: 1, activity: 'Completed Hindi Typing Test', wpm: 45, accuracy: 94, time: '2 hours ago', type: 'test' },
    { id: 2, activity: 'Practiced Mangal Font', wpm: 38, accuracy: 91, time: '1 day ago', type: 'practice' },
    { id: 3, activity: 'Dictation Test - General', wpm: 42, accuracy: 96, time: '2 days ago', type: 'dictation' },
    { id: 4, activity: 'Speed Drill Completed', wpm: 48, accuracy: 89, time: '3 days ago', type: 'drill' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                {profile?.photoUrl ? (
                  <AvatarImage src={profile.photoUrl} alt={profile.fullName} />
                ) : (
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    {getInitials(profile?.fullName || user?.name || 'User')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {profile?.fullName || user?.name || 'Typist'}! 👋
                </h1>
                <p className="text-muted-foreground">Ready to improve your typing skills today?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/analytics">
                <Button size="lg" className="gap-2">
                  <Lightning weight="bold" />
                  Start Practice
                </Button>
              </Link>
              <Link to="/profile">
                <Avatar className="h-12 w-12 border-2 border-primary cursor-pointer hover:shadow-lg transition-shadow">
                  {profile?.photoUrl ? (
                    <AvatarImage src={profile.photoUrl} alt={profile.fullName} />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {getInitials(profile?.fullName || user?.name || 'User')}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Lightning className="h-6 w-6 text-blue-600" weight="fill" />
              </div>
              <TrendUp className="h-5 w-5 text-green-600" weight="bold" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Average WPM</p>
            <p className="text-3xl font-bold text-foreground">{stats.avgWPM}</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% from last week</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Target className="h-6 w-6 text-green-600" weight="fill" />
              </div>
              <TrendUp className="h-5 w-5 text-green-600" weight="bold" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
            <p className="text-3xl font-bold text-foreground">{stats.avgAccuracy}%</p>
            <p className="text-xs text-green-600 mt-1">↑ 3% from last week</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Fire className="h-6 w-6 text-orange-600" weight="fill" />
              </div>
              <Medal className="h-5 w-5 text-orange-600" weight="fill" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-foreground">{stats.currentStreak} days</p>
            <p className="text-xs text-orange-600 mt-1">Keep it going! 🔥</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Clock className="h-6 w-6 text-purple-600" weight="fill" />
              </div>
              <Activity className="h-5 w-5 text-purple-600" weight="bold" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Practice Time</p>
            <p className="text-3xl font-bold text-foreground">{stats.totalPracticeTime}h</p>
            <p className="text-xs text-purple-600 mt-1">{stats.totalTests} sessions completed</p>
          </Card>
        </div>

        {/* Quick Start Section */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Lightning weight="fill" className="text-primary" />
            Quick Start
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/start-type" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-primary/10 hover:border-primary">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Keyboard className="h-5 w-5 text-primary" weight="bold" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Start Typing</p>
                  <p className="text-xs text-muted-foreground">Begin practice</p>
                </div>
              </Button>
            </Link>

            <Link to="/dictation" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-purple-500/10 hover:border-purple-500">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Microphone className="h-5 w-5 text-purple-600" weight="fill" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Dictation Test</p>
                  <p className="text-xs text-muted-foreground">Audio transcription</p>
                </div>
              </Button>
            </Link>

            <Link to="/exam-prep" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-green-500/10 hover:border-green-500">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <GraduationCap className="h-5 w-5 text-green-600" weight="bold" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Exam Prep</p>
                  <p className="text-xs text-muted-foreground">SSC, RRB, Courts</p>
                </div>
              </Button>
            </Link>

            <Link to="/ai-coach" className="block">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:bg-blue-500/10 hover:border-blue-500">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Brain className="h-5 w-5 text-blue-600" weight="fill" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">AI Coach</p>
                  <p className="text-xs text-muted-foreground">Get feedback</p>
                </div>
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Exam Readiness & Attendance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Readiness Analyzer */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Certificate weight="bold" className="text-primary" />
                  Exam Readiness Score
                </h2>
                <Badge className={`${getExamReadinessColor()} border-current`} variant="outline">
                  {getExamReadinessText()}
                </Badge>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl font-bold">{stats.examReadiness}%</span>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Target: SSC</p>
                    <p className="text-xs text-muted-foreground">Required: 30 WPM, 90% Acc</p>
                  </div>
                </div>
                <Progress value={stats.examReadiness} className="h-3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current WPM</p>
                  <p className="text-2xl font-bold">{stats.avgWPM}</p>
                  <p className="text-xs text-muted-foreground">Target: 30 WPM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Accuracy</p>
                  <p className="text-2xl font-bold">{stats.avgAccuracy}%</p>
                  <p className="text-xs text-muted-foreground">Target: 90%</p>
                </div>
              </div>
              {stats.examReadiness < 80 && (
                <div className="mt-4 p-3 bg-orange-500/10 rounded-lg">
                  <p className="text-sm font-semibold text-orange-600 mb-1">💡 Recommendation</p>
                  <p className="text-xs text-muted-foreground">
                    Focus on accuracy drills and practice 30 minutes daily to reach exam readiness.
                  </p>
                </div>
              )}
            </Card>

            {/* Daily Attendance Heatmap */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar weight="bold" className="text-primary" />
                Practice Calendar
                <Badge variant="outline" className="ml-auto">Last 12 Weeks</Badge>
              </h2>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-1">
                  {attendance.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-sm ${getAttendanceColor(day.sessions)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                      title={`${day.date}: ${day.sessions} session${day.sessions !== 1 ? 's' : ''}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>12 weeks ago</span>
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-sm bg-muted" />
                      <div className="w-3 h-3 rounded-sm bg-green-200" />
                      <div className="w-3 h-3 rounded-sm bg-green-300" />
                      <div className="w-3 h-3 rounded-sm bg-green-400" />
                      <div className="w-3 h-3 rounded-sm bg-green-500" />
                    </div>
                    <span>More</span>
                  </div>
                  <span>Today</span>
                </div>
              </div>
            </Card>

            {/* Recommended Drills */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Target weight="bold" className="text-primary" />
                  Recommended Drills
                </h2>
                <Link to="/practice">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <CaretRight weight="bold" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recommendedDrills.map((drill) => {
                  const IconComponent = drill.icon
                  return (
                    <Card key={drill.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <IconComponent className="h-5 w-5 text-primary" weight="bold" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{drill.title}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{drill.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{drill.duration}</Badge>
                            <Badge variant="outline" className="text-xs">{drill.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - AI Coach, Leaderboard, Notifications */}
          <div className="space-y-6">
            {/* AI Coach Widget */}
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                  <Brain className="h-6 w-6 text-white" weight="fill" />
                </div>
                <div>
                  <h3 className="font-bold">AI Coach Insight</h3>
                  <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-xs">
                    Personalized
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your accuracy has improved by <span className="font-bold text-green-600">8%</span> this week! 
                  Focus on increasing speed while maintaining this accuracy level.
                </p>
                <div className="p-3 bg-background/50 rounded-lg">
                  <p className="text-xs font-semibold mb-1">💡 Today's Tip</p>
                  <p className="text-xs text-muted-foreground">
                    Practice the home row keys (asdf jkl;) for 5 minutes before each session to improve muscle memory.
                  </p>
                </div>
                <Link to="/ai-coach">
                  <Button variant="outline" className="w-full gap-2 border-blue-500/30 hover:bg-blue-500/10">
                    <Brain weight="bold" />
                    Get Full Analysis
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Leaderboard Preview */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Trophy weight="fill" className="text-yellow-600" />
                  Leaderboard
                </h2>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Full Board
                    <CaretRight weight="bold" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {leaderboardData.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      player.isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8">
                      {player.rank <= 3 ? (
                        <Crown
                          weight="fill"
                          className={`h-5 w-5 ${
                            player.rank === 1 ? 'text-yellow-500' :
                            player.rank === 2 ? 'text-gray-400' :
                            'text-orange-600'
                          }`}
                        />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">#{player.rank}</span>
                      )}
                    </div>
                    <Avatar className="h-8 w-8">
                      {player.avatar ? (
                        <AvatarImage src={player.avatar} alt={player.name} />
                      ) : (
                        <AvatarFallback className="text-xs">
                          {getInitials(player.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${player.isCurrentUser ? 'text-primary' : ''}`}>
                        {player.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{player.wpm} WPM</span>
                        <span>•</span>
                        <span>{player.accuracy}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-orange-600">
                      <Fire weight="fill" className="h-4 w-4" />
                      <span className="text-xs font-bold">{player.streak}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Bell weight="bold" className="text-primary" />
                  Notifications
                  <Badge variant="destructive" className="text-xs">2 New</Badge>
                </h2>
              </div>
              <div className="space-y-2">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg transition-colors cursor-pointer ${
                      notif.unread ? 'bg-primary/5 border border-primary/20' : 'bg-accent/5'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {notif.unread && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity & Transcription Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity weight="bold" className="text-primary" />
                Recent Activity
              </h2>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <CaretRight weight="bold" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'test' ? 'bg-blue-500/10' :
                    activity.type === 'practice' ? 'bg-green-500/10' :
                    activity.type === 'dictation' ? 'bg-purple-500/10' :
                    'bg-orange-500/10'
                  }`}>
                    {activity.type === 'test' && <Certificate className="h-5 w-5 text-blue-600" weight="bold" />}
                    {activity.type === 'practice' && <Keyboard className="h-5 w-5 text-green-600" weight="bold" />}
                    {activity.type === 'dictation' && <Microphone className="h-5 w-5 text-purple-600" weight="fill" />}
                    {activity.type === 'drill' && <Target className="h-5 w-5 text-orange-600" weight="fill" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{activity.activity}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.wpm} WPM</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.accuracy}% Accuracy</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Dictation & Transcription Section */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Microphone className="h-6 w-6 text-white" weight="fill" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Dictation Practice</h2>
                <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                  Free Tests Available
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Master audio transcription with our comprehensive dictation tests. Perfect for SSC Stenographer, 
              High Court, and professional typing exams.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Audio Control</p>
                <div className="flex items-center gap-1">
                  <CheckCircle weight="fill" className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold">Play/Pause</span>
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Speed Control</p>
                <div className="flex items-center gap-1">
                  <CheckCircle weight="fill" className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold">0.75x - 1.5x</span>
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Analysis</p>
                <div className="flex items-center gap-1">
                  <CheckCircle weight="fill" className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold">WPM & Accuracy</span>
                </div>
              </div>
              <div className="p-3 bg-background/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Languages</p>
                <div className="flex items-center gap-1">
                  <CheckCircle weight="fill" className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-semibold">Hindi & English</span>
                </div>
              </div>
            </div>
            <Link to="/dictation">
              <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Microphone weight="fill" />
                Start Dictation Test
              </Button>
            </Link>
          </Card>
        </div>

        {/* Tips & Resources */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen weight="bold" className="text-primary" />
            Quick Tips for Exam Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle weight="fill" className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-sm">Consistency is Key</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Practice daily for at least 30 minutes to build muscle memory and improve speed naturally.
              </p>
            </div>
            <div className="p-4 bg-green-500/5 rounded-lg border border-green-500/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle weight="fill" className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-sm">Accuracy First</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Focus on reducing errors before increasing speed. High accuracy builds confidence for exams.
              </p>
            </div>
            <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle weight="fill" className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-sm">Practice All Fonts</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Master Mangal, KrutiDev, and Remington fonts as different exams require different fonts.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
