import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

const email = process.env.SEED_EMAIL || 'admin@spinealign.local';
const password = process.env.SEED_PASSWORD || 'spinealign123';

const passwordHash = await bcrypt.hash(password, 10);
await prisma.user.upsert({
  where: { email },
  update: {},
  create: { email, passwordHash, name: 'Usuario demo' },
});
console.log(`Usuario creado: ${email}`);
await prisma.$disconnect();
