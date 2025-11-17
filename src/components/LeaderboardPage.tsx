import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  ArrowLeft, 
  Medal,
  Crown,
  Lightning,
  Target,
  Fire,
  Clock
} from '@phosphor-icons/react'
import { SessionData } from '@/lib/typingUtils'

export function LeaderboardPage() {
  const [sessions] = useKV<SessionData[]>('typing-sessions', [])
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all')
  const navigate = useNavigate()

  const filteredSessions = (sessions || [])
    .filter(session => {
      if (filter === 'all') return true
      const sessionDate = new Date(session.timestamp)
      const now = new Date()
      
      if (filter === 'today') {
        return sessionDate.toDateString() === now.toDateString()
      }
      
      if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return sessionDate >= weekAgo
      }
      
      return true
    })
    .sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm
      return b.accuracy - a.accuracy
    })
    .slice(0, 50)

  const getRankBadge = (index: number) => {
    if (index === 0) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600">
          <Crown size={24} weight="fill" className="text-white" />
        </div>
      )
    }
    if (index === 1) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500">
          <Medal size={24} weight="fill" className="text-white" />
        </div>
      )
    }
    if (index === 2) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
          <Medal size={24} weight="fill" className="text-white" />
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-bold">
        {index + 1}
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} weight="bold" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Trophy size={28} weight="fill" className="text-accent" />
                  Leaderboard
                </h1>
                <p className="text-sm text-muted-foreground">लीडरबोर्ड - Top performing sessions</p>
              </div>
            </div>
            <Link to="/practice">
              <Button className="gap-2">
                <Lightning weight="bold" />
                Practice Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All Time
              </Button>
              <Button
                variant={filter === 'week' ? 'default' : 'outline'}
                onClick={() => setFilter('week')}
                size="sm"
              >
                This Week
              </Button>
              <Button
                variant={filter === 'today' ? 'default' : 'outline'}
                onClick={() => setFilter('today')}
                size="sm"
              >
                Today
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            <Card className="p-12 text-center">
              <Trophy size={64} weight="duotone" className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Sessions Yet</h3>
              <p className="text-muted-foreground mb-6">
                Complete practice sessions to see rankings here
              </p>
              <Link to="/practice">
                <Button className="gap-2">
                  <Lightning weight="bold" />
                  Start Your First Session
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredSessions.map((session, index) => (
                <Card
                  key={session.id}
                  className={`p-4 transition-all hover:shadow-md ${
                    index < 3 ? 'border-2 border-accent/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getRankBadge(index)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-foreground">
                          Session #{(sessions || []).length - (sessions || []).indexOf(session)}
                        </h4>
                        {session.language && (
                          <Badge variant="secondary" className="text-xs">
                            {session.language === 'hindi' ? 'हिंदी' : 'English'}
                          </Badge>
                        )}
                        {session.font && (
                          <Badge variant="outline" className="text-xs">
                            {session.font}
                          </Badge>
                        )}
                        {session.examMode && session.examMode !== 'practice' && (
                          <Badge variant="destructive" className="text-xs">
                            {session.examMode.toUpperCase()}
                          </Badge>
                        )}
                        {session.wpm >= 50 && (
                          <Badge variant="secondary" className="gap-1">
                            <Fire size={14} weight="fill" />
                            Hot
                          </Badge>
                        )}
                        {session.accuracy >= 98 && (
                          <Badge variant="outline" className="gap-1">
                            <Target size={14} weight="fill" />
                            Perfect
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                        <span>
                          {new Date(session.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDuration(session.duration)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 text-right">
                      <div>
                        <div className="text-xl md:text-2xl font-bold text-primary">
                          {session.wpm}
                        </div>
                        <div className="text-xs text-muted-foreground">Net WPM</div>
                      </div>
                      <div>
                        <div className="text-xl md:text-2xl font-bold text-success">
                          {session.accuracy.toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xl md:text-2xl font-bold text-destructive">
                          {session.errors}
                        </div>
                        <div className="text-xs text-muted-foreground">Errors</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredSessions.length > 0 && (
            <Card className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">
                    {Math.max(...filteredSessions.map(s => s.wpm), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Best WPM</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success mb-1">
                    {Math.max(...filteredSessions.map(s => s.accuracy), 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Best Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-1">
                    {(sessions || []).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Sessions</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
