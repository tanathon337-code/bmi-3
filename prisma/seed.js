const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'test@01.com'
  const password = '001002003'
  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
        password: hashedPassword // Update password to ensure it matches
    },
    create: {
      email,
      name: 'Demo User',
      password: hashedPassword,
    },
  })
  console.log('Test account setup complete:', user.email)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
