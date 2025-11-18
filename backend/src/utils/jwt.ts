import jwt from 'jsonwebtoken'
import { env } from '@/config/env'

interface JwtPayload {
  sub: string
  email: string
}

export const generateToken = (payload: JwtPayload, expiresIn = '7d') => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload & { iat: number; exp: number }
}
