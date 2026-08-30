const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.guestbookEntry.create({
    data: {
      name: 'Amira & Khalid',
      message: 'Welcome to our digital guestbook! We can\'t wait to read your messages.',
      isApproved: true
    }
  });
  console.log('Created test message!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
