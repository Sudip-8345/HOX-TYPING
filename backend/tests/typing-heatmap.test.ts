process.env.NODE_ENV = process.env.NODE_ENV ?? 'test'

import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/db'
import { env } from '../src/config/env'
import { hashPassword } from '../src/utils/password'
import { generateToken } from '../src/utils/jwt'

const TEST_EMAIL = 'heatmap-test@typistpro.local'

const isoDate = (date: Date) => date.toISOString().split('T')[0]

const seedSessions = async (userId: string) => {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  await prisma.typingSession.createMany({
    data: [
      {
        userId,
        wpm: 72,
        accuracy: 95,
        language: 'en',
        font: 'Inter',
        durationSec: 180,
        mode: 'focus',
        createdAt: now
      },
      {
        userId,
        wpm: 80,
        accuracy: 92,
        language: 'en',
        font: 'Inter',
        durationSec: 150,
        mode: 'focus',
        createdAt: yesterday
      }
    ]
  })

  return { now, yesterday }
}

const cleanupExistingUser = async () => {
  const existingUser = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
    select: { id: true }
  })

  if (existingUser) {
    await prisma.typingSession.deleteMany({ where: { userId: existingUser.id } })
    await prisma.user.delete({ where: { id: existingUser.id } })
  }
}

const main = async () => {
  console.log(`🔎 Running heatmap smoke test against ${env.NODE_ENV} database...`)
  await cleanupExistingUser()

  const passwordHash = await hashPassword('HeatmapTester#1')
  const user = await prisma.user.create({
    data: {
      name: 'Heatmap Tester',
      email: TEST_EMAIL,
      passwordHash,
      role: 'STUDENT'
    }
  })

  const { now, yesterday } = await seedSessions(user.id)
  const token = generateToken({ sub: user.id, email: user.email })

  const response = await request(app)
    .get('/api/typing/heatmap?days=7')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

  const data = response.body?.data as Array<{ date: string; count: number }>

  if (!Array.isArray(data) || data.length < 2) {
    throw new Error(`Expected at least two heatmap rows, got: ${JSON.stringify(response.body)}`)
  }

  const counts = Object.fromEntries(data.map((row) => [row.date, row.count]))
  const todayKey = isoDate(now)
  const yesterdayKey = isoDate(yesterday)

  if (counts[todayKey] !== 1 || counts[yesterdayKey] !== 1) {
    throw new Error(`Unexpected heatmap counts ${JSON.stringify(counts)}`)
  }

  console.log('✅ Heatmap endpoint grouped daily sessions as expected:', data)

  await prisma.typingSession.deleteMany({ where: { userId: user.id } })
  await prisma.user.delete({ where: { id: user.id } })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error('❌ Heatmap test failed', error)
    await cleanupExistingUser()
    await prisma.$disconnect()
    process.exitCode = 1
  })
