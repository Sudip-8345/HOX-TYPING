import { Router } from 'express'
import authRoutes from '@/modules/auth/auth.routes'
import typingRoutes from '@/modules/typing/typing.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/typing', typingRoutes)

export default router
