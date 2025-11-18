import { Router } from 'express'
import { requireAuth } from '@/middleware/requireAuth'
import * as typingController from './typing.controller'

const router = Router()

router.use(requireAuth)
router.post('/session', typingController.createSession)
router.get('/summary', typingController.getSummary)
router.get('/heatmap', typingController.getHeatmap)

export default router
