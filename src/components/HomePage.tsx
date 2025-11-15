import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  TextAa
} from '@phosphor-icons/react'

export function HomePage() {
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
            <Link to="/practice">
              <Button size="lg" className="gap-2">
                Start Practice
                <ArrowRight weight="bold" />
              </Button>
            </Link>
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
            हिंदी टाइपिंग में माहिर बनें AI के साथ
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Real-time AI feedback, multiple fonts (Mangal, KrutiDev, Remington), और exam mode simulation के साथ अपनी typing speed और accuracy बढ़ाएं। SSC, RRB, High Court जैसी सरकारी परीक्षाओं के लिए तैयार हों।
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/practice">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                <Lightning weight="fill" />
                Start Free Practice
              </Button>
            </Link>
            <Link to="/leaderboard">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                <Trophy weight="fill" />
                View Leaderboard
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

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-10">Quick Access</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link to="/practice">
              <Card className="p-8 hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 border-transparent hover:border-primary">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center">
                    <Lightning size={32} weight="fill" className="text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold">Practice Mode</h4>
                    <p className="text-sm text-muted-foreground">अभ्यास शुरू करें</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Start Hindi/English typing practice with real-time AI feedback, multiple fonts, exam modes, and comprehensive performance tracking. Perfect for SSC, RRB, and government exams.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold">
                  Start Practice
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

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2024 TypistPro India. Master Hindi & English typing with AI-powered practice.</p>
        </div>
      </footer>
    </div>
  )
}
