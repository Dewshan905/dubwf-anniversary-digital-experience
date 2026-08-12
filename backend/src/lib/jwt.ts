import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

type AdminJwtPayload = {
  adminId: string
  email: string
}

export function signAdminToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '12h' })
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AdminJwtPayload
}
