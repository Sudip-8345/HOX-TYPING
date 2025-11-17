import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, ArrowLeft, TrendUp, Target, Lightning, CheckCircle } from '@phosphor-icons/react'

export function AICoachPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft weight="bold" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <Brain className="h-8 w-8 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Coach</h1>
              <p className="text-muted-foreground">Personalized insights and recommendations</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-xl font-bold mb-4">Performance Analysis</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" weight="fill" />
                  <div>
                    <h3 className="font-semibold text-green-600 mb-1">Strength: Accuracy</h3>
                    <p className="text-sm text-muted-foreground">
                      Your accuracy has consistently been above 90%. This is excellent for exam preparation. 
                      Maintain this level while working on speed improvement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-yellow-600 mt-1" weight="fill" />
                  <div>
                    <h3 className="font-semibold text-yellow-600 mb-1">Area to Focus: Speed</h3>
                    <p className="text-sm text-muted-foreground">
                      Your current speed is good, but increasing it by 10-15 WPM would put you in the 
                      competitive range for government exams. Try speed drills without sacrificing accuracy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Lightning className="h-6 w-6 text-blue-600 mt-1" weight="fill" />
                  <div>
                    <h3 className="font-semibold text-blue-600 mb-1">Improvement Trend</h3>
                    <p className="text-sm text-muted-foreground">
                      You've improved by 15% in the last 2 weeks. This is outstanding progress! 
                      Keep up your daily practice routine.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Today's Recommendation</h2>
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold mb-1">🎯 Focus Drill</p>
                  <p className="text-xs text-muted-foreground">Accuracy Booster - 15 min</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold mb-1">⚡ Speed Training</p>
                  <p className="text-xs text-muted-foreground">Timed Test - 20 min</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-semibold mb-1">📚 Font Practice</p>
                  <p className="text-xs text-muted-foreground">Mangal Font - 10 min</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <h2 className="text-lg font-bold mb-2">AI Insight</h2>
              <Badge className="mb-3 bg-blue-500/20 text-blue-600 border-blue-500/30">
                Powered by AI
              </Badge>
              <p className="text-sm text-muted-foreground">
                Based on your practice patterns, the best time for you to practice is in the morning 
                between 9-11 AM when your accuracy peaks.
              </p>
            </Card>
          </div>
        </div>

        <Card className="p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Weekly Progress Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-accent/5 rounded-lg text-center">
              <TrendUp className="h-6 w-6 text-green-600 mx-auto mb-2" weight="bold" />
              <p className="text-2xl font-bold">+12%</p>
              <p className="text-sm text-muted-foreground">Speed Increase</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg text-center">
              <TrendUp className="h-6 w-6 text-green-600 mx-auto mb-2" weight="bold" />
              <p className="text-2xl font-bold">+8%</p>
              <p className="text-sm text-muted-foreground">Accuracy Increase</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg text-center">
              <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" weight="fill" />
              <p className="text-2xl font-bold">7/7</p>
              <p className="text-sm text-muted-foreground">Days Practiced</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg text-center">
              <Lightning className="h-6 w-6 text-purple-600 mx-auto mb-2" weight="fill" />
              <p className="text-2xl font-bold">3.5h</p>
              <p className="text-sm text-muted-foreground">Total Practice Time</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
