import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { signAdminToken } from '../../lib/jwt.js'
import { fail, ok } from '../../utils/http.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post('/login', async (req, res) => {
  const payload = loginSchema.parse(req.body)
  const admin = await prisma.admin.findUnique({ where: { email: payload.email.toLowerCase() } })

  if (!admin) {
    return res.status(401).json(fail('Invalid credentials'))
  }

  const isValid = await bcrypt.compare(payload.password, admin.passwordHash)
  if (!isValid) {
    return res.status(401).json(fail('Invalid credentials'))
  }

  const token = signAdminToken({ adminId: admin.id, email: admin.email })

  return res.json(
    ok({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    }),
  )
})

export default router
