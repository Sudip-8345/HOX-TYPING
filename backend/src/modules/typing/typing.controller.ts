import { Request, Response } from 'express'
import { createSessionSchema, summaryQuerySchema } from './typing.schema'
import * as typingService from './typing.service'

export const createSession = async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const parsed = createSessionSchema.parse(req.body)
    const session = await typingService.createSession(req.currentUser.id, parsed)
    return res.status(201).json(session)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Unexpected error' })
  }
}

export const getSummary = async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { days } = summaryQuerySchema.parse(req.query)
    const summary = await typingService.getSummary(req.currentUser.id, days)
    return res.json(summary)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Unexpected error' })
  }
}

export const getHeatmap = async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { days } = summaryQuerySchema.parse(req.query)
    const heatmap = await typingService.getHeatmap(req.currentUser.id, days)
    return res.json({ data: heatmap })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Unexpected error' })
  }
}
