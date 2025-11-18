import { prisma } from '@/config/db'
import { hashPassword, verifyPassword } from '@/utils/password'
import { generateToken } from '@/utils/jwt'
import type { LoginInput, SignupInput } from './auth.schema'

export const signup = async (input: SignupInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new Error('Email already registered')
  }

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  })

  const token = generateToken({ sub: user.id, email: user.email })

  return { user, token }
}

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) {
    throw new Error('Invalid credentials')
  }

  const isValid = await verifyPassword(input.password, user.passwordHash)
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  const token = generateToken({ sub: user.id, email: user.email })

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt
  }

  return { user: safeUser, token }
}
