import { PrismaClient } from 'generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.users.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      name: 'Test User',
      password: '$2b$10$fLLBoaTaLiQhWmf1qMykk.qPCGd5jA3G0ywoyXBYHaCTr8TsIHOZK',
    },
  });

  const rental = await prisma.rentals.create({
    data: {
      name: 'Appartement Paris',
      surface: 50.0,
      price: 1200.0,
      picture: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
      description: 'Bel appartement au coeur de Paris',
      owner_id: user.id,
    },
  });

  console.log({ user, rental });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
