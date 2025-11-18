import { Request, Response } from 'express'
import { loginSchema, signupSchema } from './auth.schema'
import * as authService from './auth.service'

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.parse(req.body)
    const result = await authService.signup(parsed)
    return res.status(201).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Unexpected error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body)
    const result = await authService.login(parsed)
    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      const status = error.message === 'Invalid credentials' ? 401 : 400
      return res.status(status).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Unexpected error' })
  }
}

export const me = (req: Request, res: Response) => {
  if (!req.currentUser) {
    return res.status(401).json({ message: 'Not authenticated' })
  }

  return res.json({ user: req.currentUser })
}
