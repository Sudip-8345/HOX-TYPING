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
  Users
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
                <h1 className="text-2xl font-bold text-foreground">StenoMaster</h1>
                <p className="text-xs text-muted-foreground">Professional Stenography Training</p>
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
            <span className="text-sm font-semibold">Master Pitman Shorthand Online</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Perfect Your Stenography Skills with AI Guidance
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Practice Pitman shorthand with real-time feedback, audio dictation, and comprehensive performance tracking. Prepare for professional stenography certifications.
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
                <Keyboard size={28} weight="duotone" className="text-accent-foreground" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Interactive Canvas</h4>
              <p className="text-muted-foreground">
                Draw Pitman shorthand symbols naturally with our responsive digital canvas. Practice pen strokes, curves, and angles with precision.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain size={28} weight="duotone" className="text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered Feedback</h4>
              <p className="text-muted-foreground">
                Get intelligent, real-time suggestions on your stenography technique. Improve faster with personalized coaching.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <ChartLine size={28} weight="duotone" className="text-secondary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Performance Metrics</h4>
              <p className="text-muted-foreground">
                Track WPM, accuracy, and error rates in real-time. Monitor your progress with comprehensive analytics.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Clock size={28} weight="duotone" className="text-success" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Timed Practice Sessions</h4>
              <p className="text-muted-foreground">
                Simulate real exam conditions with customizable timers. Build speed and endurance for certification tests.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                <Target size={28} weight="duotone" className="text-warning" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Accuracy Tracking</h4>
              <p className="text-muted-foreground">
                Identify and correct mistakes instantly. Our system highlights errors to help you learn from every stroke.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Certificate size={28} weight="duotone" className="text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Audio Dictation</h4>
              <p className="text-muted-foreground">
                Practice with professional audio dictation. Enhance listening and transcription skills simultaneously.
              </p>
            </Card>
          </div>
        </section>

        <section className="mb-16 bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6">Why Choose StenoMaster?</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1500+</div>
                <div className="text-sm text-muted-foreground">Practice Exercises</div>
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
                    <p className="text-sm text-muted-foreground">Start practicing now</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  Begin your stenography practice session with full access to the interactive canvas, audio dictation, and real-time AI feedback.
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
                    <p className="text-sm text-muted-foreground">See top performers</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  View the global rankings, compare your scores with others, and track your progress toward becoming a stenography master.
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
              Start your journey to mastering Pitman shorthand today. No registration required, completely free.
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
          <p>© 2024 StenoMaster. Master Pitman Shorthand with AI-powered practice.</p>
        </div>
      </footer>
    </div>
  )
}
