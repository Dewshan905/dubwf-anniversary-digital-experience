import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/error.js'
import { ok } from './utils/http.js'
import { prisma } from './lib/prisma.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.FRONTEND_URL.split(',').map((url) => url.trim()),
    credentials: true,
  }),
)
app.use(express.json())

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
})

app.get('/health', async (_req, res) => {
  let database = 'connected'
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    database = 'unavailable'
  }
  res.json(ok({ status: 'ok', database }))
})

app.use('/api/rsvp', publicLimiter)
app.use('/api', routes)
app.use(errorHandler)

export default app
