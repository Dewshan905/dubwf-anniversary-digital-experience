import { NextFunction, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { fail } from '../utils/http.js'

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json(fail('Validation failed', error.flatten()))
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(409).json(fail('A record with this value already exists.'))
    }
    if (error.code === 'P2025') {
      return res.status(404).json(fail('Record not found.'))
    }
  }

  console.error(error)
  return res.status(500).json(fail('Internal server error'))
}
