import app from '@/app'
import { env } from '@/config/env'
import { prisma } from '@/config/db'

const start = async () => {
  try {
    await prisma.$connect()
    app.listen(env.PORT, () => {
      console.log(`🚀 API ready on http://localhost:${env.PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

start()
