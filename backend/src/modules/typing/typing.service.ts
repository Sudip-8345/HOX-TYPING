import { prisma } from '@/config/db'
import type { CreateSessionInput } from './typing.schema'

export const createSession = async (userId: string, input: CreateSessionInput) => {
  return prisma.typingSession.create({
    data: {
      userId,
      ...input
    }
  })
}

export const getSummary = async (userId: string, days: number) => {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [sessions, aggregate] = await Promise.all([
    prisma.typingSession.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.typingSession.aggregate({
      where: { userId, createdAt: { gte: since } },
      _avg: { wpm: true, accuracy: true },
      _count: true,
      _max: { wpm: true },
      _sum: { durationSec: true }
    })
  ])

  return {
    recent: sessions,
    stats: {
      avgWpm: Math.round(aggregate._avg.wpm ?? 0),
      avgAccuracy: Math.round(aggregate._avg.accuracy ?? 0),
      totalSessions: aggregate._count,
      bestWpm: aggregate._max.wpm ?? 0,
      totalPracticeMinutes: Math.round((aggregate._sum.durationSec ?? 0) / 60)
    }
  }
}

export const getHeatmap = async (userId: string, days: number) => {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const rows = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
    SELECT date_trunc('day', "createdAt") AS date, COUNT(*)::bigint AS count
    FROM "TypingSession"
    WHERE "userId" = ${userId} AND "createdAt" >= ${since}
    GROUP BY 1
    ORDER BY 1
  `

  return rows.map((row) => ({
    date: row.date.toISOString().split('T')[0],
    count: Number(row.count)
  }))
}
