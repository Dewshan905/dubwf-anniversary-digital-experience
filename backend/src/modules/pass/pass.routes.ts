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
    return res.status(404).json(fail('Pass not found'))
  }

  return res.json(
    ok({
      token: pass.token,
      guestName: pass.guest.fullName,
      event: EVENT_DETAILS,
      verifyUrl: `/verify/${pass.token}`,
    }),
  )
})

export default router
