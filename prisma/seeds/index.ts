import { PrismaClient } from '@prisma/client';
import {
  basicEmotionsData,
  firstDepthsEmotionsData,
  secondDepthsEmotionsData,
} from './emotions.seed';
import { genresData } from './genres.seed';
import { templateContentsData, templatesData } from './templates.seed';
import { topicsData } from './topics.seed';
import { usersData } from './users.seed';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // seed genres
  console.log(`Seeding genres...`);
  for (const genreData of genresData) {
    await prisma.genres.create({
      data: genreData,
    });
  }
  console.log(`Completed seeding genres...`);

  // seed emotions
  console.log(`Seeding emotions...`);
  for (let i = 0; i < basicEmotionsData.length; i++) {
    const basicEmotion = await prisma.emotions.create({
      data: basicEmotionsData[i],
    });
    console.log(`Created basic emotion : ${basicEmotion.name}`);
    for (let j = 0; j < firstDepthsEmotionsData[i].length; j++) {
      console.log(
        `Created first depth emotion : ${firstDepthsEmotionsData[i][j].name}`,
      );
      const firstDepthEmotion = await prisma.emotions.create({
        data: {
          ...firstDepthsEmotionsData[i][j],
          parent: {
            connect: {
              id: basicEmotion.id,
            },
          },
        },
      });
      for (const secondDepthEmotionData of secondDepthsEmotionsData[i][j]) {
        const _secondDepthsEmotion = await prisma.emotions.create({
          data: {
            ...secondDepthEmotionData,
            parent: {
              connect: {
                id: firstDepthEmotion.id,
              },
            },
          },
        });
      }
    }
    console.log(`Completed seeding emotions...`);
  }
  // seed users
  console.log(`Seeding users...`);
  for (const userData of usersData) {
    await prisma.users.create({ data: userData });
  }
  console.log(`Completed seeding users...`);

  // seed topics
  console.log(`Seeding topics...`);
  for (const topicData of topicsData) {
    await prisma.topics.create({
      data: topicData,
    });
  }
  console.log(`Completed seeding topics...`);

  // seed templates
  console.log(`Seeding templates...`);
  for (let i = 0; i < templatesData.length; i++) {
    const template = await prisma.templates.create({
      data: templatesData[i],
    });
    for (let j = 0; j < templateContentsData[i].length; j++) {
      await prisma.templateContents.create({
        data: {
          ...templateContentsData[i][j],
          templates: {
            connect: {
              id: template.id,
            },
          },
        },
      });
    }
    console.log(`Completed seeding templates...`);
  }

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
