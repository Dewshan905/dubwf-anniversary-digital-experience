import { AttendanceStatus } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'
import { requireAdminAuth } from '../../middleware/auth.js'
import { prisma } from '../../lib/prisma.js'
import { ok } from '../../utils/http.js'
import { generatePassToken } from '../../utils/token.js'

const router = Router()

router.use(requireAdminAuth)

router.get('/stats', async (_req, res) => {
  const [total, confirmed, declined] = await Promise.all([
    prisma.guest.count(),
    prisma.guest.count({ where: { attendanceStatus: AttendanceStatus.CONFIRMED } }),
    prisma.guest.count({ where: { attendanceStatus: AttendanceStatus.DECLINED } }),
  ])

  return res.json(ok({ total, confirmed, declined }))
})

router.get('/guests', async (req, res) => {
  const querySchema = z.object({
    search: z.string().optional(),
    status: z.nativeEnum(AttendanceStatus).optional(),
  })

  const { search, status } = querySchema.parse(req.query)

  const guests = await prisma.guest.findMany({
    where: {
      attendanceStatus: status,
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { phoneNumber: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: { pass: true },
    orderBy: { createdAt: 'desc' },
  })

  return res.json(ok(guests))
})

router.patch('/guests/:id', async (req, res) => {
  const paramSchema = z.object({ id: z.string().uuid() })
  const bodySchema = z.object({
    fullName: z.string().trim().min(2).max(120).optional(),
    phoneNumber: z.string().trim().min(7).max(20).optional(),
    attendanceStatus: z.nativeEnum(AttendanceStatus).optional(),
  })

  const { id } = paramSchema.parse(req.params)
  const updates = bodySchema.parse(req.body)

  const guest = await prisma.$transaction(async (tx) => {
    const updated = await tx.guest.update({
      where: { id },
      data: updates,
      include: { pass: true },
    })

    if (updated.attendanceStatus === AttendanceStatus.CONFIRMED && !updated.pass) {
      await tx.pass.create({ data: { token: generatePassToken(), guestId: updated.id } })
    }

    if (updated.attendanceStatus === AttendanceStatus.DECLINED && updated.pass) {
      await tx.pass.delete({ where: { guestId: updated.id } })
    }

    return tx.guest.findUniqueOrThrow({ where: { id: updated.id }, include: { pass: true } })
  })

  return res.json(ok(guest))
})

router.delete('/guests/:id', async (req, res) => {
  const paramSchema = z.object({ id: z.string().uuid() })
  const { id } = paramSchema.parse(req.params)

  await prisma.guest.delete({ where: { id } })
  return res.json(ok({ deleted: true }))
})

export default router
