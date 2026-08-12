import { prisma } from '../lib/prisma.js'

async function main() {
  await prisma.$connect()

  const [guestCount, adminCount, passCount] = await Promise.all([
    prisma.guest.count(),
    prisma.admin.count(),
    prisma.pass.count(),
  ])

  console.log(
    JSON.stringify(
      {
        success: true,
        counts: {
          guests: guestCount,
          admins: adminCount,
          passes: passCount,
        },
      },
      null,
      2,
    ),
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error('Database connectivity test failed.')
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
