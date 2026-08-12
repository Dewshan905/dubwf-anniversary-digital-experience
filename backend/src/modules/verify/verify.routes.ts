import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { fail, ok } from '../../utils/http.js'
import { EVENT_DETAILS } from '../../utils/event.js'

const router = Router()

const tokenSchema = z.object({
  token: z.string().min(20).max(80),
})

router.get('/:token', async (req, res) => {
  const { token } = tokenSchema.parse(req.params)

  const pass = await prisma.pass.findUnique({
    where: { token },
    include: { guest: true },
  })

  if (!pass || pass.guest.attendanceStatus !== 'CONFIRMED') {
    return res.status(404).json(fail('This event pass could not be verified.'))
  }

  return res.json(
    ok({
      status: 'PASS_VERIFIED',
      guestName: pass.guest.fullName,
      eventDate: EVENT_DETAILS.dateLabel,
      venue: EVENT_DETAILS.venue,
    }),
  )
})

export default router
