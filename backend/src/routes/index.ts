import { Router } from 'express'
import authRoutes from '../modules/auth/auth.routes.js'
import rsvpRoutes from '../modules/rsvp/rsvp.routes.js'
import passRoutes from '../modules/pass/pass.routes.js'
import verifyRoutes from '../modules/verify/verify.routes.js'
import adminRoutes from '../modules/admin/admin.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/rsvp', rsvpRoutes)
router.use('/pass', passRoutes)
router.use('/verify', verifyRoutes)
router.use('/admin', adminRoutes)

export default router
