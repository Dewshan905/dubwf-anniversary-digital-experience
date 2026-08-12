import { NextFunction, Request, Response } from 'express'
import { fail } from '../utils/http.js'
import { verifyAdminToken } from '../lib/jwt.js'

export type AuthenticatedRequest = Request & {
  admin?: { adminId: string; email: string }
}

export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(fail('Unauthorized'))
  }

  const token = authHeader.slice(7)
  try {
    req.admin = verifyAdminToken(token)
    return next()
  } catch {
    return res.status(401).json(fail('Invalid or expired token'))
  }
}
