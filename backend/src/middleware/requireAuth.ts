import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '@/utils/jwt'
import { prisma } from '@/config/db'

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing' })
  }

  const token = header.replace('Bearer ', '').trim()

  try {
    const payload = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' })
    }

    req.currentUser = user
    next()
  } catch (error) {
    console.error('Auth middleware error', error)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
