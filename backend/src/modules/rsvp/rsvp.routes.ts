import { AttendanceStatus } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { fail, ok } from '../../utils/http.js'
import { generatePassToken } from '../../utils/token.js'

const router = Router()

const rsvpSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phoneNumber: z.string().trim().min(7).max(20),
  email: z.string().email().optional().or(z.literal('')),
  attendanceStatus: z.nativeEnum(AttendanceStatus),
})

router.post('/', async (req, res) => {
  const payload = rsvpSchema.parse(req.body)

  const existingGuest = await prisma.guest.findUnique({
    where: { phoneNumber: payload.phoneNumber },
    include: { pass: true },
  })

  if (existingGuest) {
    return res.status(409).json(
      fail('A guest with this phone number has already submitted RSVP.', {
        hasPass: !!existingGuest.pass,
        token: existingGuest.pass?.token,
      }),
    )
  }

  const guest = await prisma.guest.create({
    data: {
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber,
      email: payload.email || null,
      attendanceStatus: payload.attendanceStatus,
      pass:
        payload.attendanceStatus === AttendanceStatus.CONFIRMED
          ? {
              create: {
                token: generatePassToken(),
              },
            }
          : undefined,
    },
    include: { pass: true },
  })

  return res.status(201).json(
    ok({
      guest: {
        id: guest.id,
        fullName: guest.fullName,
        phoneNumber: guest.phoneNumber,
        email: guest.email,
        attendanceStatus: guest.attendanceStatus,
      },
      pass: guest.pass
        ? {
            token: guest.pass.token,
            passUrl: `/pass/${guest.pass.token}`,
            verifyUrl: `/verify/${guest.pass.token}`,
          }
        : null,
    }),
  )
})

export default router
