import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft,
  ArrowCounterClockwise,
  Play,
  CheckCircle,
  Lightning,
  Target,
  Timer,
  ChartLine,
  Brain,
  Fire,
  Trophy,
  Calendar,
  TrendUp,
  BookOpen,
  DownloadSimple,
  Users,
  Certificate,
  Warning,
  CheckFat,
  X,
  Lightbulb,
  Info,
  Bank,
  GraduationCap,
  Buildings,
  Gavel,
  MapPin,
  Briefcase,
  MagnifyingGlass,
  FunnelSimple,
  Star
} from '@phosphor-icons/react'
import { toast } from 'sonner'
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
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface MockSession {
  id: string
  examType: string
  font: string
  wpm: number
  accuracy: number
  errors: number
  timestamp: number
  duration: number
  passed: boolean
}

interface DailyPlan {
  id: string
  title: string
  description: string
  completed: boolean
  type: 'drill' | 'mock' | 'lesson'
}

interface WeakArea {
  key: string
  errorRate: number
  category: string
}

interface GovernmentExam {
  id: string
  name: string
  category: 'ssc' | 'railway' | 'police' | 'court' | 'state' | 'central'
  posts: string[]
  languages: string[]
  fonts: string[]
  duration: number
  minWPM: number
  minAccuracy: number
  icon: any
  color: string
  recommended?: boolean
}

const governmentExams: GovernmentExam[] = [
  {
    id: 'ssc-cgl',
    name: 'SSC CGL',
    category: 'ssc',
    posts: ['Tax Assistant', 'ASO (CSS)', 'DEO'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'KrutiDev', 'Mangal'],
    duration: 10,
    minWPM: 30,
    minAccuracy: 95,
    icon: GraduationCap,
    color: '#3b82f6',
    recommended: true
  },
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL',
    category: 'ssc',
    posts: ['LDC', 'JSA', 'PA/SA', 'DEO'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'KrutiDev', 'Mangal'],
    duration: 10,
    minWPM: 30,
    minAccuracy: 95,
    icon: GraduationCap,
    color: '#3b82f6',
    recommended: true
  },
  {
    id: 'rrb-ntpc',
    name: 'RRB NTPC',
    category: 'railway',
    posts: ['Senior Clerk', 'JAA Typist', 'Time Keeper'],
    languages: ['English', 'Hindi'],
    fonts: ['KrutiDev', 'Mangal'],
    duration: 15,
    minWPM: 30,
    minAccuracy: 95,
    icon: Buildings,
    color: '#8b5cf6'
  },
  {
    id: 'delhi-police',
    name: 'Delhi Police Head Constable',
    category: 'police',
    posts: ['Head Constable (Ministerial)'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'Mangal'],
    duration: 10,
    minWPM: 25,
    minAccuracy: 90,
    icon: Certificate,
    color: '#ef4444'
  },
  {
    id: 'dsssb',
    name: 'DSSSB',
    category: 'state',
    posts: ['LDC', 'Junior Assistant'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'KrutiDev', 'Mangal'],
    duration: 10,
    minWPM: 30,
    minAccuracy: 95,
    icon: MapPin,
    color: '#14b8a6',
    recommended: true
  },
  {
    id: 'high-court',
    name: 'High Court / District Court',
    category: 'court',
    posts: ['Clerk', 'Junior Assistant', 'Stenographer'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'KrutiDev', 'Mangal'],
    duration: 15,
    minWPM: 35,
    minAccuracy: 96,
    icon: Gavel,
    color: '#f59e0b'
  },
  {
    id: 'upsssc',
    name: 'UPSSSC',
    category: 'state',
    posts: ['LDC', 'Junior Assistant'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'KrutiDev', 'Mangal'],
    duration: 10,
    minWPM: 30,
    minAccuracy: 95,
    icon: MapPin,
    color: '#14b8a6'
  },
  {
    id: 'csir-jsa',
    name: 'CSIR JSA',
    category: 'central',
    posts: ['Junior Secretariat Assistant'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'Mangal'],
    duration: 10,
    minWPM: 30,
    minAccuracy: 95,
    icon: Briefcase,
    color: '#6366f1'
  },
  {
    id: 'aiims-cre',
    name: 'AIIMS CRE',
    category: 'central',
    posts: ['LDC', 'Computer Receptionist'],
    languages: ['English', 'Hindi'],
    fonts: ['Default', 'Mangal'],
    duration: 10,
    minWPM: 30,
    minAccuracy: 95,
    icon: Briefcase,
    color: '#6366f1'
  },
]

const examTypes = [
  { id: 'ssc-cgl', name: 'SSC CGL', duration: 10, minWPM: 30, minAccuracy: 95 },
  { id: 'ssc-chsl', name: 'SSC CHSL', duration: 10, minWPM: 30, minAccuracy: 95 },
  { id: 'rrb', name: 'RRB', duration: 8, minWPM: 30, minAccuracy: 95 },
  { id: 'high-court', name: 'High Court', duration: 15, minWPM: 35, minAccuracy: 96 },
  { id: 'crpf', name: 'CRPF', duration: 10, minWPM: 30, minAccuracy: 95 },
]

const fonts = [
  { id: 'mangal', name: 'Mangal' },
  { id: 'kruti-dev', name: 'Kruti Dev 010' },
  { id: 'remington', name: 'Remington GAIL' },
  { id: 'inscript', name: 'Inscript' },
]

const sampleParagraphs = [
  'भारत सरकार के विभागों में हिंदी टाइपिंग अनिवार्य है। सभी सरकारी कर्मचारियों को हिंदी टंकण में निपुण होना आवश्यक है। परीक्षा में न्यूनतम गति और शुद्धता प्राप्त करना अनिवार्य है।',
  'राष्ट्रीय शिक्षा नीति के अंतर्गत प्रत्येक विद्यार्थी को मातृभाषा में शिक्षा प्राप्त करने का अधिकार है। हिंदी भाषा भारत की राजभाषा है और इसका प्रयोग सभी सरकारी कार्यों में किया जाता है।',
]

export function ExamPrepHub() {
  const navigate = useNavigate()
  const [selectedExam, setSelectedExam] = useState('ssc-cgl')
  const [selectedFont, setSelectedFont] = useState('mangal')
  const [activeTab, setActiveTab] = useState('mocks')
  
  const [mockSessions, setMockSessions] = useKV<MockSession[]>('mock-sessions', [])
  const [dailyPlans, setDailyPlans] = useKV<DailyPlan[]>('daily-plans', [
    { id: '1', title: 'Drill क्ष Combo', description: 'Practice weak combination', completed: false, type: 'drill' },
    { id: '2', title: '2 SSC Mocks', description: 'Complete two full mock tests', completed: false, type: 'mock' },
    { id: '3', title: 'Learn Conjuncts', description: 'Master common conjuncts', completed: false, type: 'lesson' },
  ])
  const [weeklyGoal, setWeeklyGoal] = useKV<number>('weekly-goal', 30)
  const [currentWPM, setCurrentWPM] = useKV<number>('current-wpm', 25)
  
  const [isMockActive, setIsMockActive] = useState(false)
  const [mockTime, setMockTime] = useState(0)
  const [promptText, setPromptText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [mockWPM, setMockWPM] = useState(0)
  const [mockAccuracy, setMockAccuracy] = useState(100)
  const [mockErrors, setMockErrors] = useState(0)
  
  // AI Coach enhancements
  const [streak, setStreak] = useState(5)
  const [aiDifficultyRecommendation, setAiDifficultyRecommendation] = useState('Medium')
  const [showPlanExplanation, setShowPlanExplanation] = useState(false)
  
  // Analytics enhancements
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'week' | 'month'>('week')
  const [selectedWeakKey, setSelectedWeakKey] = useState<string | null>(null)
  
  // Exam selection filters
  const [showExamSelection, setShowExamSelection] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ssc' | 'railway' | 'police' | 'court' | 'state' | 'central'>('all')
  const [languageFilter, setLanguageFilter] = useState<'all' | 'english' | 'hindi'>('all')
  const [fontFilter, setFontFilter] = useState<'all' | 'default' | 'krutidev' | 'mangal'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentExam = examTypes.find(e => e.id === selectedExam)
  const progressPercentage = ((currentWPM || 25) / (weeklyGoal || 30)) * 100
  const aiPassPrediction = Math.min(95, 60 + ((currentWPM || 25) / (weeklyGoal || 30)) * 35)

  const wpmTrendData = (mockSessions || []).slice(-10).map((session, idx) => ({
    session: idx + 1,
    wpm: session.wpm,
    accuracy: session.accuracy,
  }))

  const errorByCategoryData = [
    { category: 'Conjuncts', errors: 12, color: '#ef4444' },
    { category: 'Matras', errors: 8, color: '#f97316' },
    { category: 'Special Keys', errors: 5, color: '#eab308' },
    { category: 'Common', errors: 3, color: '#22c55e' },
  ]

  const weakKeysData: WeakArea[] = [
    { key: 'क्ष', errorRate: 45, category: 'conjunct' },
    { key: 'त्र', errorRate: 38, category: 'conjunct' },
    { key: 'ज्ञ', errorRate: 35, category: 'conjunct' },
    { key: 'श्र', errorRate: 28, category: 'conjunct' },
  ]

  const sessionBreakdownData = [
    { name: 'Mocks', value: 40, color: '#3b82f6' },
    { name: 'Drills', value: 30, color: '#8b5cf6' },
    { name: 'Lessons', value: 20, color: '#ec4899' },
    { name: 'Free Practice', value: 10, color: '#14b8a6' },
  ]

  // Enhanced analytics data
  const weeklyWPMData = [
    { day: 'Mon', wpm: 22, movingAvg: 23 },
    { day: 'Tue', wpm: 25, movingAvg: 24 },
    { day: 'Wed', wpm: 24, movingAvg: 24 },
    { day: 'Thu', wpm: 28, movingAvg: 25 },
    { day: 'Fri', wpm: 27, movingAvg: 26 },
    { day: 'Sat', wpm: 30, movingAvg: 27 },
    { day: 'Sun', wpm: 29, movingAvg: 27 },
  ]

  const monthlyWPMData = [
    { week: 'W1', wpm: 23, movingAvg: 23 },
    { week: 'W2', wpm: 26, movingAvg: 25 },
    { week: 'W3', wpm: 28, movingAvg: 26 },
    { week: 'W4', wpm: 30, movingAvg: 28 },
  ]

  const accuracyTrendData = [
    { session: 1, accuracy: 92, target: 95 },
    { session: 2, accuracy: 93, target: 95 },
    { session: 3, accuracy: 91, target: 95 },
    { session: 4, accuracy: 94, target: 95 },
    { session: 5, accuracy: 95, target: 95 },
    { session: 6, accuracy: 96, target: 95 },
    { session: 7, accuracy: 94, target: 95 },
    { session: 8, accuracy: 97, target: 95 },
  ]

  const errorCategoryDetails = [
    { category: 'Conjuncts', errors: 12, percentage: 42.9, color: '#ef4444' },
    { category: 'Space Errors', errors: 7, percentage: 25.0, color: '#f97316' },
    { category: 'Punctuation', errors: 5, percentage: 17.9, color: '#eab308' },
    { category: 'Missed Lines', errors: 4, percentage: 14.3, color: '#06b6d4' },
  ]

  const expandedWeakKeys: WeakArea[] = [
    { key: 'क्ष', errorRate: 45, category: 'conjunct' },
    { key: 'त्र', errorRate: 38, category: 'conjunct' },
    { key: 'ज्ञ', errorRate: 35, category: 'conjunct' },
    { key: 'श्र', errorRate: 28, category: 'conjunct' },
    { key: 'द्य', errorRate: 25, category: 'conjunct' },
    { key: 'ह्म', errorRate: 22, category: 'conjunct' },
  ]

  const sessionMetrics = [
    { id: '1', date: 'Nov 17', rawWPM: 32, netWPM: 28, errorsPerMin: 2.1, consistency: 87 },
    { id: '2', date: 'Nov 16', rawWPM: 30, netWPM: 26, errorsPerMin: 2.4, consistency: 82 },
    { id: '3', date: 'Nov 15', rawWPM: 28, netWPM: 25, errorsPerMin: 1.8, consistency: 90 },
    { id: '4', date: 'Nov 14', rawWPM: 29, netWPM: 27, errorsPerMin: 1.5, consistency: 92 },
    { id: '5', date: 'Nov 13', rawWPM: 26, netWPM: 23, errorsPerMin: 2.7, consistency: 78 },
  ]

  const wpmChartData = analyticsPeriod === 'week' ? weeklyWPMData : monthlyWPMData

  const handleWeakKeyClick = (key: string) => {
    setSelectedWeakKey(key)
    toast.success(`Starting drill for "${key}"`, {
      description: 'Focused practice on weak conjunct'
    })
    // Navigate to drill for this specific key
    setTimeout(() => setSelectedWeakKey(null), 2000)
  }

  // Filter exams based on selected filters
  const filteredExams = governmentExams.filter(exam => {
    // Category filter
    if (categoryFilter !== 'all' && exam.category !== categoryFilter) return false
    
    // Language filter
    if (languageFilter !== 'all') {
      const lang = languageFilter === 'english' ? 'English' : 'Hindi'
      if (!exam.languages.includes(lang)) return false
    }
    
    // Font filter
    if (fontFilter !== 'all') {
      const font = fontFilter.charAt(0).toUpperCase() + fontFilter.slice(1)
      if (!exam.fonts.some(f => f.toLowerCase() === fontFilter)) return false
    }
    
    // Search query
    if (searchQuery && !exam.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !exam.posts.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    
    return true
  })

  const recommendedExams = governmentExams.filter(exam => exam.recommended)

  const handleSelectExam = (examId: string) => {
    setSelectedExam(examId)
    setShowExamSelection(false)
    toast.success('Exam selected!', {
      description: governmentExams.find(e => e.id === examId)?.name
    })
  }

  const startMock = () => {
    setPromptText(sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)])
    setUserInput('')
    setMockWPM(0)
    setMockAccuracy(100)
    setMockErrors(0)
    setMockTime(0)
    setIsMockActive(true)
    
    if (currentExam) {
      timerRef.current = setInterval(() => {
        setMockTime(prev => {
          if (prev >= currentExam.duration * 60) {
            endMock()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
    
    setTimeout(() => inputRef.current?.focus(), 100)
    toast.success('Mock test started!')
  }

  const endMock = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsMockActive(false)
    
    const finalWPM = Math.round(mockWPM)
    const finalAccuracy = Math.round(mockAccuracy)
    const passed = finalWPM >= (currentExam?.minWPM || 30) && finalAccuracy >= (currentExam?.minAccuracy || 95)
    
    const newSession: MockSession = {
      id: Date.now().toString(),
      examType: selectedExam,
      font: selectedFont,
      wpm: finalWPM,
      accuracy: finalAccuracy,
      errors: mockErrors,
      timestamp: Date.now(),
      duration: mockTime,
      passed
    }
    
    setMockSessions(prev => [...(prev || []), newSession])
    toast.success(passed ? '🎉 Mock test passed!' : 'Mock test completed - Keep practicing!')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isMockActive) return
    
    const input = e.target.value
    setUserInput(input)
    
    let correct = 0
    let total = input.length
    let errors = 0
    
    for (let i = 0; i < total; i++) {
      if (input[i] === promptText[i]) {
        correct++
      } else {
        errors++
      }
    }
    
    const acc = total > 0 ? (correct / total) * 100 : 100
    const wpm = mockTime > 0 ? (input.length / 5) / (mockTime / 60) : 0
    
    setMockAccuracy(acc)
    setMockWPM(wpm)
    setMockErrors(errors)
    
    if (input.length >= promptText.length) {
      endMock()
    }
  }

  const togglePlanCompletion = (planId: string) => {
    setDailyPlans(prev =>
      (prev || []).map(plan =>
        plan.id === planId ? { ...plan, completed: !plan.completed } : plan
      )
    )
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft weight="bold" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Exam & Prep Hub</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Font: {fonts.find(f => f.id === selectedFont)?.name}</span>
                  <Separator orientation="vertical" className="h-3" />
                  <span>Layout: {selectedFont === 'inscript' ? 'Inscript' : 'Remington'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Daily Goal:</span>
                <span className="text-sm font-semibold">{weeklyGoal} WPM</span>
                <Progress value={progressPercentage} className="w-16 md:w-20" />
                <span className="text-xs text-success">{Math.round(progressPercentage)}%</span>
              </div>
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Brain weight="bold" size={14} />
                Switch to Mangal?
              </Button>
              <Button variant="default" size="sm" className="gap-1">
                Upgrade Premium
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TooltipProvider>
            <TabsList className="grid w-full grid-cols-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="mocks" className="relative">
                    Mocks
                    <Badge className="ml-2 h-5 px-1.5 text-xs bg-green-500 hover:bg-green-500">New</Badge>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full-length mock tests for SSC, RRB & High Court exams</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="drills" className="relative">
                    Drills
                    <Badge className="ml-2 h-5 px-1.5 text-xs bg-blue-500 hover:bg-blue-500">2 new</Badge>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Practice specific skills with targeted typing drills</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="analytics" className="relative">
                    Analytics
                    <Badge className="ml-2 h-5 px-1.5 text-xs bg-orange-500 hover:bg-orange-500">3 insights</Badge>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track your performance with detailed analytics & insights</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="plans" className="relative">
                    Plans
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI-generated personalized study plans & schedules</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger value="community" className="relative">
                    Community
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Connect with peers, share tips & compete on leaderboards</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </TooltipProvider>

          <TabsContent value="mocks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3 space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain weight="duotone" className="text-primary" />
                    AI Prep Coach
                  </h3>
                  <div className="space-y-3 text-sm">
                    {/* Streak Indicator */}
                    <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">Current Streak</span>
                        <div className="flex items-center gap-1">
                          <Fire size={20} weight="fill" className="text-orange-500" />
                          <span className="text-xl font-bold text-orange-600">{streak}</span>
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Keep going! You're on fire 🔥</p>
                    </div>

                    {/* AI Difficulty Recommendation */}
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-start gap-2">
                        <Lightbulb size={18} weight="fill" className="text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-700 mb-1">AI Recommendation</p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{aiDifficultyRecommendation} difficulty</span> for today based on your accuracy trends.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-muted-foreground">Daily Plan:</p>
                        <Badge variant="secondary" className="text-xs">
                          {dailyPlans?.filter(p => p.completed).length || 0}/{dailyPlans?.length || 0}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {(dailyPlans || []).map(plan => (
                          <div
                            key={plan.id}
                            className="flex items-start gap-2 p-2 rounded-md bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => togglePlanCompletion(plan.id)}
                          >
                            <div className={`mt-0.5 ${plan.completed ? 'text-success' : 'text-muted-foreground'}`}>
                              {plan.completed ? <CheckFat weight="fill" size={16} /> : <div className="w-4 h-4 rounded border-2 border-current" />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${plan.completed ? 'line-through text-muted-foreground' : ''}`}>{plan.title}</p>
                              <p className="text-xs text-muted-foreground">{plan.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explain My Plan Button */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2 text-xs"
                      onClick={() => setShowPlanExplanation(!showPlanExplanation)}
                    >
                      <Info size={14} weight="bold" />
                      {showPlanExplanation ? 'Hide' : 'Explain My Plan'}
                    </Button>

                    {/* Plan Explanation */}
                    {showPlanExplanation && (
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 space-y-2">
                        <p className="text-xs font-semibold">How AI Created Your Plan:</p>
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong>Weak Keys:</strong> Detected slow typing on 'क', 'ख', 'ग'</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong>Accuracy Drops:</strong> 12% error rate on conjuncts</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong>Consistency:</strong> Speed varies ±8 WPM</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-orange-500">•</span>
                            <span><strong>Slow Conjuncts:</strong> क्ष, त्र need practice</span>
                          </div>
                        </div>
                        <div className="pt-2 mt-2 border-t border-accent/20">
                          <p className="text-xs text-accent-foreground">
                            💡 <strong>Goal:</strong> Today's plan focuses on accuracy improvement and muscle memory for weak keys.
                          </p>
                        </div>
                      </div>
                    )}

                    <Separator />
                    <div className="space-y-2">
                      <p className="text-muted-foreground">AI Prediction:</p>
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium">SSC Pass Probability</span>
                          <span className="text-xl font-bold text-primary">{Math.round(aiPassPrediction)}%</span>
                        </div>
                        <Progress value={aiPassPrediction} className="h-2" />
                      </div>
                    </div>
                    <Button className="w-full gap-2" size="sm">
                      <Play weight="fill" />
                      Start Plan
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-6 space-y-4">
                {showExamSelection ? (
                  <div className="space-y-4">
                    {/* Exam Selection Interface */}
                    <Card className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Certificate size={24} weight="duotone" className="text-primary" />
                          Select Your Exam
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {filteredExams.length} exams
                        </Badge>
                      </div>

                      {/* Search Bar */}
                      <div className="mb-4">
                        <div className="relative">
                          <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search exams or posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                      </div>

                      {/* Filter Bar */}
                      <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <FunnelSimple size={14} weight="bold" />
                          <span>Filter by:</span>
                        </div>
                        
                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={categoryFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('all')}
                            className="text-xs"
                          >
                            All Exams
                          </Button>
                          <Button
                            variant={categoryFilter === 'ssc' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('ssc')}
                            className="text-xs gap-1"
                          >
                            <GraduationCap size={14} />
                            SSC
                          </Button>
                          <Button
                            variant={categoryFilter === 'railway' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('railway')}
                            className="text-xs gap-1"
                          >
                            <Buildings size={14} />
                            Railways
                          </Button>
                          <Button
                            variant={categoryFilter === 'police' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('police')}
                            className="text-xs gap-1"
                          >
                            <Certificate size={14} />
                            Police
                          </Button>
                          <Button
                            variant={categoryFilter === 'court' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('court')}
                            className="text-xs gap-1"
                          >
                            <Gavel size={14} />
                            Courts
                          </Button>
                          <Button
                            variant={categoryFilter === 'state' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('state')}
                            className="text-xs gap-1"
                          >
                            <MapPin size={14} />
                            State Govt
                          </Button>
                          <Button
                            variant={categoryFilter === 'central' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCategoryFilter('central')}
                            className="text-xs gap-1"
                          >
                            <Briefcase size={14} />
                            Central
                          </Button>
                        </div>

                        {/* Language & Font Filters */}
                        <div className="flex flex-wrap gap-2">
                          <Select value={languageFilter} onValueChange={(val: any) => setLanguageFilter(val)}>
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Languages</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="hindi">Hindi</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={fontFilter} onValueChange={(val: any) => setFontFilter(val)}>
                            <SelectTrigger className="w-[140px] h-8 text-xs">
                              <SelectValue placeholder="Font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Fonts</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="krutidev">KrutiDev</SelectItem>
                              <SelectItem value="mangal">Mangal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>

                    {/* Recommended Exams */}
                    {categoryFilter === 'all' && !searchQuery && recommendedExams.length > 0 && (
                      <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                          <Star size={18} weight="fill" className="text-warning" />
                          Recommended for You
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {recommendedExams.map(exam => {
                            const Icon = exam.icon
                            return (
                              <button
                                key={exam.id}
                                onClick={() => handleSelectExam(exam.id)}
                                className="group p-4 rounded-lg bg-card/80 backdrop-blur border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:scale-[1.02] text-left"
                              >
                                <div className="flex items-start gap-3">
                                  <div 
                                    className="p-2 rounded-lg"
                                    style={{ backgroundColor: `${exam.color}20` }}
                                  >
                                    <Icon size={24} weight="duotone" style={{ color: exam.color }} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                                      {exam.name}
                                    </h5>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                                      {exam.posts[0]}
                                    </p>
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                                        {exam.duration} min
                                      </Badge>
                                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                                        {exam.minWPM} WPM
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </Card>
                    )}

                    {/* All Exams Grid */}
                    <Card className="p-4 md:p-6">
                      <ScrollArea className="h-[600px] pr-4">
                        {filteredExams.length === 0 ? (
                          <div className="text-center py-12">
                            <MagnifyingGlass size={48} weight="duotone" className="mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm text-muted-foreground">No exams found matching your filters</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-4">
                            {filteredExams.map(exam => {
                              const Icon = exam.icon
                              return (
                                <button
                                  key={exam.id}
                                  onClick={() => handleSelectExam(exam.id)}
                                  className="group p-5 rounded-xl bg-card border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl hover:scale-[1.01] text-left relative overflow-hidden"
                                >
                                  {/* Glow effect */}
                                  <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                                    style={{ 
                                      background: `radial-gradient(circle at 50% 50%, ${exam.color}, transparent 70%)`
                                    }}
                                  />
                                  
                                  <div className="relative flex items-start gap-4">
                                    {/* Icon */}
                                    <div 
                                      className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                                      style={{ backgroundColor: `${exam.color}20` }}
                                    >
                                      <Icon size={32} weight="duotone" style={{ color: exam.color }} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <h5 className="font-bold text-lg group-hover:text-primary transition-colors">
                                          {exam.name}
                                        </h5>
                                        {exam.recommended && (
                                          <Badge className="bg-warning/20 text-warning hover:bg-warning/20">
                                            <Star size={12} weight="fill" className="mr-1" />
                                            Popular
                                          </Badge>
                                        )}
                                      </div>

                                      {/* Posts */}
                                      <div className="mb-3">
                                        <p className="text-xs text-muted-foreground mb-1.5 font-medium">Key Posts:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {exam.posts.map((post, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs font-normal">
                                              {post}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Languages & Fonts */}
                                      <div className="grid grid-cols-2 gap-3 mb-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1.5">Languages:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {exam.languages.map((lang, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs">
                                                {lang}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1.5">Fonts:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {exam.fonts.map((font, idx) => (
                                              <Badge 
                                                key={idx} 
                                                variant="outline" 
                                                className="text-xs"
                                                style={{ borderColor: `${exam.color}40`, color: exam.color }}
                                              >
                                                {font}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Requirements */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs">
                                          <div className="flex items-center gap-1">
                                            <Timer size={14} weight="bold" className="text-muted-foreground" />
                                            <span>{exam.duration} min</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Lightning size={14} weight="fill" className="text-warning" />
                                            <span>{exam.minWPM} WPM</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Target size={14} weight="fill" className="text-success" />
                                            <span>{exam.minAccuracy}%</span>
                                          </div>
                                        </div>
                                        <Button 
                                          size="sm" 
                                          className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          style={{ backgroundColor: exam.color }}
                                        >
                                          <Play size={14} weight="fill" />
                                          Start Test
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </ScrollArea>
                    </Card>
                  </div>
                ) : (
                  <Card className="p-4 md:p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowExamSelection(true)}
                        className="gap-1"
                      >
                        <ArrowLeft size={16} />
                        Change Exam
                      </Button>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Selected:</span>
                        <Badge variant="default" className="gap-1">
                          {governmentExams.find(e => e.id === selectedExam)?.name}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Font:</span>
                        <Select value={selectedFont} onValueChange={setSelectedFont} disabled={isMockActive}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fonts.map(font => (
                              <SelectItem key={font.id} value={font.id}>{font.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Badge variant="outline" className="gap-1">
                        <Timer weight="bold" />
                        Duration: {governmentExams.find(e => e.id === selectedExam)?.duration || currentExam?.duration} min
                      </Badge>
                    </div>

                    {!isMockActive ? (
                      <div className="text-center py-12 space-y-4">
                        <Certificate size={64} weight="duotone" className="mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Ready to Start Your Mock Test?</h3>
                          <p className="text-sm text-muted-foreground">
                            {governmentExams.find(e => e.id === selectedExam)?.name || currentExam?.name} • 
                            {governmentExams.find(e => e.id === selectedExam)?.duration || currentExam?.duration} minutes • 
                            Min {governmentExams.find(e => e.id === selectedExam)?.minWPM || currentExam?.minWPM} WPM • 
                            {governmentExams.find(e => e.id === selectedExam)?.minAccuracy || currentExam?.minAccuracy}% Accuracy
                          </p>
                        </div>
                        <Button size="lg" onClick={startMock} className="gap-2">
                          <Play weight="fill" />
                          Start Mock Test
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted/50 font-hindi text-lg leading-relaxed">
                          {promptText}
                        </div>
                        
                        <textarea
                          ref={inputRef}
                          value={userInput}
                          onChange={handleInputChange}
                          className="w-full min-h-[120px] p-4 rounded-lg border-2 border-input bg-background font-hindi text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Start typing..."
                        />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 rounded-lg bg-card border">
                            <div className="flex items-center gap-2 mb-1">
                              <Lightning weight="fill" className="text-warning" size={16} />
                              <span className="text-xs text-muted-foreground">WPM</span>
                            </div>
                            <p className="text-2xl font-bold">{Math.round(mockWPM)}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-card border">
                            <div className="flex items-center gap-2 mb-1">
                              <Target weight="fill" className="text-success" size={16} />
                              <span className="text-xs text-muted-foreground">Accuracy</span>
                            </div>
                            <p className="text-2xl font-bold">{Math.round(mockAccuracy)}%</p>
                          </div>
                          <div className="p-3 rounded-lg bg-card border">
                            <div className="flex items-center gap-2 mb-1">
                              <X weight="bold" className="text-destructive" size={16} />
                              <span className="text-xs text-muted-foreground">Errors</span>
                            </div>
                            <p className="text-2xl font-bold">{mockErrors}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-card border">
                            <div className="flex items-center gap-2 mb-1">
                              <Timer weight="fill" className="text-primary" size={16} />
                              <span className="text-xs text-muted-foreground">Time Left</span>
                            </div>
                            <p className="text-2xl font-bold">{formatTime((governmentExams.find(e => e.id === selectedExam)?.duration || currentExam?.duration || 10) * 60 - mockTime)}</p>
                          </div>
                        </div>
                        
                        <Progress value={(mockTime / ((currentExam?.duration || 10) * 60)) * 100} className="h-2" />
                        
                        <Button variant="destructive" onClick={endMock} className="w-full">
                          End Mock Test
                        </Button>
                      </div>
                    )}
                  </Card>
                )}
              </div>

              <div className="lg:col-span-3 space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <ChartLine weight="duotone" className="text-primary" />
                    Analytics
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">WPM Trend</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <LineChart data={wpmTrendData}>
                          <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} dot={false} />
                          <RechartsTooltip contentStyle={{ background: '#18181b', border: '1px solid #27272a' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Errors by Category</p>
                      <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={errorByCategoryData}>
                          <Bar dataKey="errors" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Weak Keys Heatmap</p>
                      <div className="grid grid-cols-2 gap-2">
                        {weakKeysData.map((weak, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded text-center font-hindi"
                            style={{
                              backgroundColor: `rgba(239, 68, 68, ${weak.errorRate / 100})`,
                              color: weak.errorRate > 30 ? '#fff' : '#000'
                            }}
                          >
                            <p className="font-bold">{weak.key}</p>
                            <p className="text-xs">{weak.errorRate}%</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2 text-center">Session Breakdown</p>
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie
                            data={sessionBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {sessionBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-xs font-medium mb-1 flex items-center gap-1">
                        <Brain weight="bold" size={14} className="text-accent" />
                        AI Insight
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Improve by 15% with Daily Drills on weak conjuncts
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="drills" className="space-y-4">
            <Card className="p-6 text-center">
              <Fire size={48} weight="duotone" className="mx-auto text-warning mb-3" />
              <h3 className="text-lg font-semibold mb-2">Focused Drills</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Practice specific weak areas with targeted drills
              </p>
              <Button className="gap-2">
                <Play weight="fill" />
                Start Drill Session
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {/* A. WPM Trend Graph */}
            <Card className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <ChartLine weight="duotone" className="text-primary" />
                  WPM Trend Analysis
                </h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={analyticsPeriod === 'week' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setAnalyticsPeriod('week')}
                  >
                    Weekly
                  </Button>
                  <Button 
                    variant={analyticsPeriod === 'month' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setAnalyticsPeriod('month')}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={wpmChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis 
                    dataKey={analyticsPeriod === 'week' ? 'day' : 'week'} 
                    stroke="#71717a"
                  />
                  <YAxis stroke="#71717a" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      background: '#18181b', 
                      border: '1px solid #27272a',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', r: 5 }}
                    name="WPM"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="movingAvg" 
                    stroke="#8b5cf6" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                    name="Moving Average"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Current WPM</p>
                  <p className="text-2xl font-bold text-blue-600">{wpmChartData[wpmChartData.length - 1]?.wpm}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Avg WPM</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(wpmChartData.reduce((acc, d) => acc + d.wpm, 0) / wpmChartData.length)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Growth</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    <TrendUp size={20} weight="bold" />
                    +{wpmChartData[wpmChartData.length - 1]?.wpm - wpmChartData[0]?.wpm}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* B. Accuracy Trend */}
              <Card className="p-4 md:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Target weight="duotone" className="text-success" />
                  Accuracy Trend
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={accuracyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="session" stroke="#71717a" />
                    <YAxis domain={[85, 100]} stroke="#71717a" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        background: '#18181b', 
                        border: '1px solid #27272a',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.4}
                      strokeWidth={2}
                      name="Accuracy %"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      fill="transparent" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Exam Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Accuracy</p>
                    <p className="text-xl font-bold text-success">
                      {accuracyTrendData[accuracyTrendData.length - 1]?.accuracy}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Exam Qualification</p>
                    <Badge variant={accuracyTrendData[accuracyTrendData.length - 1]?.accuracy >= 95 ? 'default' : 'destructive'}>
                      {accuracyTrendData[accuracyTrendData.length - 1]?.accuracy >= 95 ? 'Qualified ✓' : 'Below Target'}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* C. Error Categories */}
              <Card className="p-4 md:p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Warning weight="duotone" className="text-warning" />
                  Error Categories
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={errorCategoryDetails} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis type="number" stroke="#71717a" />
                    <YAxis dataKey="category" type="category" width={100} stroke="#71717a" />
                    <RechartsTooltip 
                      contentStyle={{ 
                        background: '#18181b', 
                        border: '1px solid #27272a',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="errors" radius={[0, 8, 8, 0]}>
                      {errorCategoryDetails.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-2">
                  {errorCategoryDetails.map((cat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                        <span>{cat.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{cat.errors} errors</span>
                        <Badge variant="secondary" className="text-xs">{cat.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* D. Weak Keys Heatmap */}
            <Card className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Fire weight="duotone" className="text-warning" />
                  Weak Keys Heatmap
                </h3>
                <Badge variant="outline" className="text-xs">
                  Click to practice
                </Badge>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {expandedWeakKeys.map((weak, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWeakKeyClick(weak.key)}
                    className="group relative p-4 rounded-lg text-center font-hindi transition-all hover:scale-105 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${weak.errorRate / 100})`,
                      color: weak.errorRate > 30 ? '#fff' : '#000',
                      border: selectedWeakKey === weak.key ? '2px solid #3b82f6' : '2px solid transparent'
                    }}
                  >
                    <p className="text-2xl font-bold mb-1">{weak.key}</p>
                    <p className="text-xs opacity-90">{weak.errorRate}% error</p>
                    <div className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                    <Lightning 
                      size={16} 
                      weight="fill" 
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </button>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Lightbulb size={14} weight="fill" className="text-accent" />
                  <span><strong>Pro Tip:</strong> Focus on keys with {'>'}30% error rate. Practice 10 min daily for best results.</span>
                </p>
              </div>
            </Card>

            {/* E. Session Breakdown */}
            <Card className="p-4 md:p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Timer weight="duotone" className="text-primary" />
                Session Breakdown
              </h3>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {sessionMetrics.map((session, idx) => (
                    <div key={session.id} className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">{session.date}</span>
                        <Badge variant="secondary">Session #{sessionMetrics.length - idx}</Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Raw WPM</p>
                          <p className="text-lg font-bold text-blue-600">{session.rawWPM}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Net WPM</p>
                          <p className="text-lg font-bold text-green-600">{session.netWPM}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Errors/min</p>
                          <p className="text-lg font-bold text-orange-600">{session.errorsPerMin}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Consistency</p>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-purple-600">{session.consistency}%</p>
                            <Progress value={session.consistency} className="h-1.5 flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Avg Raw WPM</p>
                  <p className="text-xl font-bold text-blue-600">
                    {Math.round(sessionMetrics.reduce((acc, s) => acc + s.rawWPM, 0) / sessionMetrics.length)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Avg Net WPM</p>
                  <p className="text-xl font-bold text-green-600">
                    {Math.round(sessionMetrics.reduce((acc, s) => acc + s.netWPM, 0) / sessionMetrics.length)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Avg Errors/min</p>
                  <p className="text-xl font-bold text-orange-600">
                    {(sessionMetrics.reduce((acc, s) => acc + s.errorsPerMin, 0) / sessionMetrics.length).toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-muted-foreground mb-1">Avg Consistency</p>
                  <p className="text-xl font-bold text-purple-600">
                    {Math.round(sessionMetrics.reduce((acc, s) => acc + s.consistency, 0) / sessionMetrics.length)}%
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <Card className="p-6 text-center">
              <Calendar size={48} weight="duotone" className="mx-auto text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Daily & Weekly Plans</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Adaptive plans based on your performance and goals
              </p>
              <Button className="gap-2">
                <BookOpen weight="bold" />
                View Study Plan
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="community" className="space-y-4">
            <Card className="p-6 text-center">
              <Users size={48} weight="duotone" className="mx-auto text-secondary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Community Leaderboard</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Compare your progress with other aspirants
              </p>
              <Link to="/leaderboard">
                <Button className="gap-2">
                  <Trophy weight="fill" />
                  View Leaderboard
                </Button>
              </Link>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowCounterClockwise weight="bold" />
              Restart Mock
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <DownloadSimple weight="bold" />
              Export PDF
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/leaderboard">
              <Button variant="outline" size="sm" className="gap-2">
                <Trophy weight="bold" />
                Leaderboard
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-2">
              <ChartLine weight="bold" />
              View Past Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
