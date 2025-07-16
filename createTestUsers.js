const { PrismaClient } = require('./pilotify-app/src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create Innovator User
    const innovatorPassword = await bcrypt.hash('innovator123', 10);
    const innovator = await prisma.user.upsert({
      where: { email: 'innovator@example.com' },
      update: {
        name: 'Innovator User',
        companyName: 'InnovateCo',
        contactInfo: 'innovator@example.com',
        profilePictureUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        companyLogoUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=InnovateCo',
        role: 'INNOVATOR',
      },
      create: {
        email: 'innovator@example.com',
        password: innovatorPassword,
        name: 'Innovator User',
        companyName: 'InnovateCo',
        contactInfo: 'innovator@example.com',
        profilePictureUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
        companyLogoUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=InnovateCo',
        role: 'INNOVATOR',
      },
    });
    console.log('Innovator user created/updated:', innovator);

    // Create Corporate User
    const corporatePassword = await bcrypt.hash('corporate123', 10);
    const corporate = await prisma.user.upsert({
      where: { email: 'corporate@example.com' },
      update: {
        name: 'Corporate User',
        companyName: 'GlobalCorp',
        contactInfo: 'corporate@example.com',
        profilePictureUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        companyLogoUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=GlobalCorp',
        role: 'CORPORATE',
      },
      create: {
        email: 'corporate@example.com',
        password: corporatePassword,
        name: 'Corporate User',
        companyName: 'GlobalCorp',
        contactInfo: 'corporate@example.com',
        profilePictureUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
        companyLogoUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=GlobalCorp',
        role: 'CORPORATE',
      },
    });
    console.log('Corporate user created/updated:', corporate);

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        name: 'Admin User',
        companyName: 'Pilotify Admin',
        contactInfo: 'admin@example.com',
        profilePictureUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        companyLogoUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=PilotifyAdmin',
        role: 'ADMIN',
      },
      create: {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'Admin User',
        companyName: 'Pilotify Admin',
        contactInfo: 'admin@example.com',
        profilePictureUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
        companyLogoUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=PilotifyAdmin',
        role: 'ADMIN',
      },
    });
    console.log('Admin user created/updated:', admin);

  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();