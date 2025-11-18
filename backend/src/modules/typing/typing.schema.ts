import { z } from 'zod'

export const createSessionSchema = z.object({
  wpm: z.number().int().min(0),
  accuracy: z.number().min(0).max(100),
  language: z.string().min(1),
  font: z.string().min(1),
  durationSec: z.number().int().min(1),
  mode: z.string().min(1)
})

export const summaryQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(30)
})

export type CreateSessionInput = z.infer<typeof createSessionSchema>
