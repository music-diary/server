import { PrismaClient } from '@prisma/client';
import {
  basicEmotionsData,
  firstDepthsEmotionsData,
  secondDepthsEmotionsData,
} from './emotions.seed';
import { usersData } from './users.seed';
import { topicsData } from './topics.seed';
import { templatesData } from './templates.seed';
import { genresData } from './genres.seed';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // seed genres
  console.log(`Seeding genres...`);
  for (const genreData of genresData) {
    const genre = await prisma.genres.create({
      data: genreData,
    });
    // console.log(`Created genre : ${genre.name}`);
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
        const secondDepthsEmotion = await prisma.emotions.create({
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

    // seed users
    console.log(`Seeding users...`);
    for (const userData of usersData) {
      const user = await prisma.users.create({ data: userData });
      // console.log(`Created user : ${user.name}`);
    }
    console.log(`Completed seeding users...`);

    // seed topics
    console.log(`Seeding topics...`);
    for (const topicData of topicsData) {
      const topic = await prisma.topics.create({
        data: topicData,
      });
      // console.log(`Created topics : ${topic.name}`);
    }
    console.log(`Completed seeding topics...`);

    // seed templates
    console.log(`Seeding templates...`);
    for (const templateData of templatesData) {
      const template = await prisma.templates.create({
        data: templateData,
      });
      // console.log(`Created topics : ${template.name}`);
    }
    console.log(`Completed seeding templates...`);

    console.log(`Seeding finished.`);
  }
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
