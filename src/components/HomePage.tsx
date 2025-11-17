import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { TransliterationDemo } from '@/components/TransliterationDemo'
import { 
  Keyboard, 
  Lightning, 
  ChartLine, 
  Brain,
  Trophy,
  Clock,
  Target,
  Translate,
  ArrowRight,
  Certificate,
  Fire,
  Users,
  TextAa,
  SignOut,
  CheckCircle
} from '@phosphor-icons/react'

interface UserProfile {
  photoUrl: string
  fullName: string
  username: string
}

export function HomePage() {
  const { isAuthenticated, user, logout } = useAuth()
  const [profile] = useKV<UserProfile>('user-profile', {
    photoUrl: '',
    fullName: user?.name || '',
    username: user?.name || ''
  })

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  // Redirect to analytics if user is logged in
  if (isAuthenticated) {
    return <Navigate to="/analytics" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Keyboard size={24} weight="bold" className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">TypistPro India</h1>
                <p className="text-xs text-muted-foreground font-hindi">हिंदी टाइपिंग प्रैक्टिस</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground hidden md:inline">
                    Welcome, {user?.name}
                  </span>
                  <Link to="/analytics">
                    <Button variant="outline" className="gap-2">
                      <ChartLine weight="bold" />
                      Analytics
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="default">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full mb-6">
            <Fire weight="fill" size={20} />
            <span className="text-sm font-semibold">SSC, RRB, और सरकारी परीक्षाओं के लिए</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Type Faster Type Smarter
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Real-time AI feedback, multiple fonts (Mangal, KrutiDev, Remington), और exam mode simulation के साथ अपनी typing speed और accuracy बढ़ाएं। SSC, RRB, High Court जैसी सरकारी परीक्षाओं के लिए तैयार हों।
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/start-type">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                <Lightning weight="fill" />
                Start Free Practice
              </Button>
            </Link>
            <Link to="/exam-prep">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                <Certificate weight="bold" />
                Exam Prep Hub
              </Button>
            </Link>
            <Link to="/stenography">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 border-warning text-warning hover:bg-warning/10">
                <Brain weight="fill" />
                Try Stenography
              </Button>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10">Platform Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Translate size={28} weight="duotone" className="text-accent-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Multi-Language Support</h4>
              <p className="text-muted-foreground">
                Practice in Hindi, English, and 8+ Indian languages with authentic font rendering (Mangal, KrutiDev, Remington, Inscript).
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain size={28} weight="duotone" className="text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">AI Smart Coach</h4>
              <p className="text-muted-foreground">
                Real-time AI feedback detects weak keys, typing patterns, and provides personalized tips to improve faster.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <ChartLine size={28} weight="duotone" className="text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Real-Time Metrics</h4>
              <p className="text-muted-foreground">
                Track Gross WPM, Net WPM, accuracy, errors, CPM, and backspace count with live updating dashboards.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Certificate size={28} weight="duotone" className="text-success" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Exam Mode Simulation</h4>
              <p className="text-muted-foreground">
                Practice with SSC 10-min, RRB 8-min, High Court, and other exam patterns with backspace restrictions and scoring.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Target size={28} weight="duotone" className="text-warning" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Weak Key Detection</h4>
              <p className="text-muted-foreground">
                AI identifies difficult characters like 'क्ष', 'त्र', 'ज्ञ' and creates personalized practice drills.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TextAa size={28} weight="duotone" className="text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Auto Font Detection</h4>
              <p className="text-muted-foreground">
                Automatically detects typing style and switches fonts. Suggests optimal font for better accuracy and speed.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-16 bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Why Choose TypistPro India?</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">8+</div>
                <div className="text-sm text-muted-foreground">Languages Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent mb-2">AI</div>
                <div className="text-sm text-muted-foreground">Smart Coaching</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-success mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free to Use</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-6">Experience Real-Time Transliteration</h3>
          <p className="text-center text-muted-foreground mb-8">
            Type in English and watch it magically convert to Hindi. No special keyboard needed!
          </p>
          <TransliterationDemo />
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Supported Fonts & Keyboards</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Practice with authentic Hindi fonts and keyboard layouts used in government typing exams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {/* KrutiDev */}
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-4">
                <Keyboard size={32} weight="bold" className="text-blue-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">KrutiDev</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Most popular font for Hindi typing
              </p>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">
                Widely Used
              </Badge>
            </Card>

            {/* Mangal */}
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-green-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center mx-auto mb-4">
                <Keyboard size={32} weight="bold" className="text-green-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">Mangal</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Unicode standard for Hindi
              </p>
              <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                Unicode
              </Badge>
            </Card>

            {/* Remington */}
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-purple-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center mx-auto mb-4">
                <Keyboard size={32} weight="bold" className="text-purple-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">Remington</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Traditional typewriter layout
              </p>
              <Badge variant="secondary" className="bg-purple-500/10 text-purple-700">
                Classic
              </Badge>
            </Card>

            {/* Inscript */}
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-orange-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-600/10 flex items-center justify-center mx-auto mb-4">
                <Keyboard size={32} weight="bold" className="text-orange-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">Inscript</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Government standard layout
              </p>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-700">
                Govt Standard
              </Badge>
            </Card>

            {/* Phonetic (Google) */}
            <Card className="p-6 text-center hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-pink-500">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/10 to-pink-600/10 flex items-center justify-center mx-auto mb-4">
                <Keyboard size={32} weight="bold" className="text-pink-600" />
              </div>
              <h4 className="font-bold text-lg mb-2">Phonetic</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Google-style easy typing
              </p>
              <Badge variant="secondary" className="bg-pink-500/10 text-pink-700">
                Easy Learn
              </Badge>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-10 max-w-3xl mx-auto">
            <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={24} weight="bold" className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">All Fonts & Layouts Supported</h4>
                  <p className="text-sm text-muted-foreground">
                    Switch between fonts and keyboard layouts seamlessly during practice. Perfect for exam preparation as you can practice with the exact font and layout used in your target exam (SSC, RRB, High Court, etc.). Our platform supports both legacy fonts (KrutiDev, Remington) and modern Unicode standards (Mangal, Inscript).
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10">Quick Access</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Link to="/exam-prep" className="md:col-span-2">
              <Card className="p-8 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 border-accent/50 hover:border-accent bg-gradient-to-br from-accent/5 to-transparent">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center">
                    <Certificate size={32} weight="fill" className="text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Exam & Prep Hub</h4>
                    <p className="text-sm text-muted-foreground">परीक्षा तैयारी केंद्र - SSC, RRB & More</p>
                  </div>
                  <Badge className="ml-auto">New</Badge>
                </div>
                <p className="text-muted-foreground mb-4">
                  Complete exam preparation hub with AI-driven personalization, full SSC/RRB mock tests, interactive analytics with WPM trends and error heatmaps, adaptive daily plans with 1000+ past papers, and 95% accurate LSTM-based performance prediction. Your one-stop solution for exam success!
                </p>
                <div className="flex items-center gap-2 text-accent font-semibold">
                  Start Exam Preparation
                  <ArrowRight weight="bold" />
                </div>
              </Card>
            </Link>

            <Link to="/start-type">
              <Card className="p-8 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Lightning size={32} weight="fill" className="text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Start Typing</h4>
                    <p className="text-sm text-muted-foreground">Hindi & English Practice</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Begin your typing practice in Hindi or English with flexible options - choose time-based or word-length based practice modes with real-time feedback.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">Time-based Mode</span>
                  <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-xs font-medium">Word-length Mode</span>
                  <span className="px-2 py-1 rounded bg-accent/10 text-accent-foreground text-xs font-medium">Dual Language</span>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  Configure & Start Practice
                  <ArrowRight weight="bold" />
                </div>
              </Card>
            </Link>

            <Link to="/stenography">
              <Card className="p-8 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-warning">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Brain size={32} weight="fill" className="text-warning" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Stenography</h4>
                    <p className="text-sm text-muted-foreground">Shorthand Practice</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Master Pitman Shorthand with drawing canvas, real-time AI feedback, and audio dictation support. Perfect for stenographer exam preparation.
                </p>
                <div className="flex items-center gap-2 text-warning font-semibold">
                  Start Stenography
                  <ArrowRight weight="bold" />
                </div>
              </Card>
            </Link>

            <Link to="/leaderboard">
              <Card className="p-8 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-accent">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center">
                    <Trophy size={32} weight="fill" className="text-accent-foreground" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Leaderboard</h4>
                    <p className="text-sm text-muted-foreground">लीडरबोर्ड देखें</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  View top performers, compare your scores, track your progress, and see how you rank globally. Filter by exam type, language, and time period.
                </p>
                <div className="flex items-center gap-2 text-accent-foreground font-semibold">
                  View Rankings
                  <ArrowRight weight="bold" />
                </div>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Proof of Trust</h3>
            <p className="text-muted-foreground text-lg">
              Join thousands of successful candidates who achieved their typing goals with TypistPro India
            </p>
          </div>

          {/* Success Stories */}
          <div className="mb-12">
            <h4 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
              <Trophy size={28} weight="fill" className="text-yellow-500" />
              Govt Exam Success Stories
            </h4>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-green-500/5 to-transparent border-green-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={24} weight="fill" className="text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">SSC Stenographer Selected</h5>
                    <p className="text-sm text-muted-foreground">Priya Sharma, Delhi</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  "Increased my typing speed from 25 to 42 WPM in just 2 months. The AI feedback helped me identify and fix my weak keys. Got selected in SSC Stenographer 2024!"
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">SSC Cleared</Badge>
                  <span className="text-muted-foreground">42 WPM achieved</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent border-blue-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={24} weight="fill" className="text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">RRB Clerk Position</h5>
                    <p className="text-sm text-muted-foreground">Rahul Kumar, Mumbai</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  "The exam mode simulation was exactly like the real test. Hindi font practice with Mangal helped me ace the typing test. Highly recommend for RRB preparation!"
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700">RRB Cleared</Badge>
                  <span className="text-muted-foreground">38 WPM achieved</span>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-transparent border-purple-500/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={24} weight="fill" className="text-purple-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-lg">High Court Junior Clerk</h5>
                    <p className="text-sm text-muted-foreground">Anjali Verma, Lucknow</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  "Real-time metrics and progress tracking kept me motivated. The difficulty levels helped me gradually improve. Cleared High Court exam with 99% accuracy!"
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-700">High Court</Badge>
                  <span className="text-muted-foreground">99% accuracy</span>
                </div>
              </Card>
            </div>
          </div>

          {/* User Reviews & Testimonials */}
          <div>
            <h4 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center gap-2">
              <Fire size={28} weight="fill" className="text-orange-500" />
              User Reviews & Testimonials
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Best free typing platform for Hindi! The AI coach is incredibly helpful."
                </p>
                <p className="text-xs font-semibold">- Vikram Singh</p>
                <p className="text-xs text-muted-foreground">Student, Jaipur</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Font options are amazing! Practiced with KrutiDev and it made all the difference."
                </p>
                <p className="text-xs font-semibold">- Neha Patel</p>
                <p className="text-xs text-muted-foreground">Preparing for SSC</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Weak key detection feature saved me weeks of practice time. Highly effective!"
                </p>
                <p className="text-xs font-semibold">- Amit Gupta</p>
                <p className="text-xs text-muted-foreground">RRB Aspirant</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Clean interface, no ads, completely free. This is exactly what students need!"
                </p>
                <p className="text-xs font-semibold">- Pooja Desai</p>
                <p className="text-xs text-muted-foreground">College Student</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Stenography practice with audio dictation is top-notch. Worth every minute!"
                </p>
                <p className="text-xs font-semibold">- Rajesh Yadav</p>
                <p className="text-xs text-muted-foreground">Stenographer</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Leaderboard keeps me competitive. Reached top 10 in my first month!"
                </p>
                <p className="text-xs font-semibold">- Kavita Reddy</p>
                <p className="text-xs text-muted-foreground">Competitive Learner</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Progress charts show exactly where I'm improving. Very motivating!"
                </p>
                <p className="text-xs font-semibold">- Suresh Kumar</p>
                <p className="text-xs text-muted-foreground">Govt Job Aspirant</p>
              </Card>

              <Card className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {'⭐'.repeat(5)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 italic">
                  "Real-time feedback during practice is a game changer. Love this platform!"
                </p>
                <p className="text-xs font-semibold">- Meena Agarwal</p>
                <p className="text-xs text-muted-foreground">Office Worker</p>
              </Card>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-lg bg-accent/5">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="p-6 rounded-lg bg-accent/5">
              <div className="text-3xl font-bold text-green-600 mb-2">850+</div>
              <p className="text-sm text-muted-foreground">Exam Success Stories</p>
            </div>
            <div className="p-6 rounded-lg bg-accent/5">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9/5</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="p-6 rounded-lg bg-accent/5">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Free Forever</p>
            </div>
          </div>
        </section>

        <section className="text-center max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-primary-foreground">
            <Users size={48} weight="duotone" className="mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-4">Join Thousands of Learners</h3>
            <p className="text-lg mb-6 opacity-90">
              Start your journey to mastering Hindi typing today. Perfect for SSC, RRB, and all government typing exams. No registration required, completely free.
            </p>
            <Link to="/practice">
              <Button size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                Begin Your Practice
                <ArrowRight weight="bold" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-12 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Keyboard size={20} weight="bold" className="text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg">TypistPro India</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Master Hindi & English typing with AI-powered practice. Perfect for government exam preparation.
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="bg-success/10 text-success">100% Free</Badge>
                <Badge variant="secondary" className="bg-primary/10 text-primary">AI Powered</Badge>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/refund" className="text-muted-foreground hover:text-primary transition-colors">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/start-type" className="text-muted-foreground hover:text-primary transition-colors">
                    Start Practice
                  </Link>
                </li>
                <li>
                  <Link to="/exam-prep" className="text-muted-foreground hover:text-primary transition-colors">
                    Exam Preparation
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                    Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/stenography" className="text-muted-foreground hover:text-primary transition-colors">
                    Stenography
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2024 TypistPro India. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Fire size={16} weight="fill" className="text-orange-500" />
                  Made with passion for learners
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
