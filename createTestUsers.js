const { PrismaClient } = require('./pilotify-app/src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create Innovator User
    const innovatorPassword = await bcrypt.hash('innovator123', 10);
    const innovator = await prisma.user.upsert({
      where: { email: 'innovator@example.com' },
      update: {},
      create: {
        email: 'innovator@example.com',
        password: innovatorPassword,
        name: 'Innovator User',
        role: 'INNOVATOR',
      },
    });
    console.log('Innovator user created/updated:', innovator);

    // Create Corporate User
    const corporatePassword = await bcrypt.hash('corporate123', 10);
    const corporate = await prisma.user.upsert({
      where: { email: 'corporate@example.com' },
      update: {},
      create: {
        email: 'corporate@example.com',
        password: corporatePassword,
        name: 'Corporate User',
        role: 'CORPORATE',
      },
    });
    console.log('Corporate user created/updated:', corporate);

  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
