import { PrismaClient } from '@prisma/client';
import {
  basicEmotionsData,
  positiveFirstDepthEmotionsData,
  positiveSecondDepthEmotionsData,
} from './emotions.seed';
import { genresData } from './genres.seed';
import { usersData } from './users.seed';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // seed genres
  console.log(`Seeding genres...`);
  for (const genreData of genresData) {
    const genre = await prisma.genres.create({
      data: genreData,
    });
    console.log(`Created genre : ${genre.name}`);
  }
  console.log(`Completed seeding genres...`);

  // seed emotions
  console.log(`Seeding emotions...`);
  for (const basicEmotionData of basicEmotionsData) {
    const basicEmotion = await prisma.emotions.create({
      data: basicEmotionData,
    });
    console.log(`Created basic emotion : ${basicEmotion.name}`);
    positiveFirstDepthEmotionsData.forEach(
      async (positiveFirstDepthEmotionData, index) => {
        const positiveFirstDepthEmotion = await prisma.emotions.create({
          data: {
            ...positiveFirstDepthEmotionData,
            parent: {
              connect: {
                id: basicEmotion.id,
              },
            },
          },
        });
        console.log(
          `Created first depth emotion : ${positiveFirstDepthEmotion.name}`,
        );
        for (const positiveSecondDepthEmotionData of positiveSecondDepthEmotionsData[
          index
        ]) {
          const positiveSecondDepthEmotion = await prisma.emotions.create({
            data: {
              ...positiveSecondDepthEmotionData,
              parent: {
                connect: {
                  id: positiveFirstDepthEmotion.id,
                },
              },
            },
          });
          console.log(
            `Created second depth emotion : ${positiveSecondDepthEmotion.name}`,
          );
        }
      },
    );
  }
  console.log(`Completed seeding emotions...`);

  // seed users
  console.log(`Seeding users...`);
  for (const userData of usersData) {
    const user = await prisma.users.create({ data: userData });
    console.log(`Created user : ${user.name}`);
  }
  console.log(`Completed seeding users...`);

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
