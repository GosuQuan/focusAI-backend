const { PrismaClient, Role } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
    },
  });

  // Create 10 test users
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: await bcrypt.hash('password123', 10),
        role: Role.USER,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
