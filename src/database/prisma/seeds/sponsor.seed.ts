import { encrypt } from '../../../common/util/crypto';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const FILE_NAME = ''; // NOTE: Please write file's absolute path
if (FILE_NAME.length < 1) throw new Error(`Please write file's path`);

export async function sponsor() {
  // seed sponsors
  console.info(`Seeding sponsors...`);

  const existed = await prisma.sponsors.findMany({});
  if (existed.length > 0) return;

  const sponsors = [];
  try {
    const data = await fs.promises.readFile(`./${FILE_NAME}`, 'utf-8');
    const contacts = data.split(',');

    for (const contact of contacts) {
      const phoneNumber = encrypt(contact);
      sponsors.push({ phoneNumber });
    }
    await prisma.sponsors.createMany({ data: sponsors });
    console.info(`Completed seeding sponsors...`);
  } catch (error) {
    console.error('Error reading or parsing data:', error);
  }
}
