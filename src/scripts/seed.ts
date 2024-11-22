import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
  // 清空现有数据
  await prisma.user.deleteMany()

  // 创建 50 个测试用户
  const users = Array.from({ length: 50 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
  }))

  for (const user of users) {
    await prisma.user.create({
      data: user,
    })
  }

  console.log('测试数据已生成')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
