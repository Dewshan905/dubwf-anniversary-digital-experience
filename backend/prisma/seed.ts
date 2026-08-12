import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@dubwf.local').toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  })

  if (process.env.SEED_DEMO_GUEST === 'true') {
    await prisma.guest.upsert({
      where: { phoneNumber: '+94770000000' },
      update: {},
      create: {
        fullName: 'Demo Confirmed Guest',
        phoneNumber: '+94770000000',
        email: 'guest@example.com',
        attendanceStatus: 'CONFIRMED',
        pass: {
          create: {
            token: crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, ''),
          },
        },
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
