import { PrismaClient } from '@prisma/client';
import {
  basicEmotionsData,
  firstDepthsEmotionsData,
  secondDepthsEmotionsData,
} from './emotions.seed';
import { genresData } from './genres.seed';
import { templateContentsData, templatesData } from './templates.seed';
import { topicsData } from './topics.seed';
import { adminUserData, userData } from './users.seed';
import { withdrawalData } from './withdrawal.seed';
import { contactTypesData } from './contact.seed';
import { parseArgs } from 'node:util';
import { demo } from './demo.seed';
import { sponsor } from './sponsor.seed';

const prisma = new PrismaClient();

const options = {
  environment: { type: 'string' as const, default: 'seed' },
};
const {
  values: { environment },
} = parseArgs({ options });

async function main() {
  console.log(`Start seeding ...`);

  // seed genres
  console.info(`Seeding genres...`);
  for (const genreData of genresData) {
    await prisma.genres.create({
      data: genreData,
    });
  }
  console.info(`Completed seeding genres...`);

  // seed emotions
  console.info(`Seeding emotions...`);
  for (let i = 0; i < basicEmotionsData.length; i++) {
    const basicEmotion = await prisma.emotions.create({
      data: basicEmotionsData[i],
    });
    console.info(`Created basic emotion : ${basicEmotion.name}`);
    for (let j = 0; j < firstDepthsEmotionsData[i].length; j++) {
      console.info(
        `Created first depth emotion : ${firstDepthsEmotionsData[i][j].name}`,
      );
      const firstDepthEmotion = await prisma.emotions.create({
        data: {
          ...firstDepthsEmotionsData[i][j],
          rootId: basicEmotion.id,
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
            rootId: basicEmotion.id,
            parent: {
              connect: {
                id: firstDepthEmotion.id,
              },
            },
          },
        });
      }
    }
    console.info(`Completed seeding emotions...`);
  }
  // seed topics
  console.info(`Seeding topics...`);
  for (const topicData of topicsData) {
    await prisma.topics.create({
      data: topicData,
    });
  }
  console.info(`Completed seeding topics...`);

  // seed templates
  console.info(`Seeding templates...`);
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
    console.info(`Completed seeding templates...`);
  }

  // seed users
  console.info(`Seeding users...`);
  const createdUsers = await prisma.users.createManyAndReturn({
    data: [userData, adminUserData],
  });
  const user = createdUsers[0];
  const dance = await prisma.genres.findFirst({
    where: { name: 'dance' },
  });
  const indie = await prisma.genres.findFirst({
    where: { name: 'indie' },
  });
  const selectedGenres = [dance, indie];
  await prisma.users.update({
    where: { id: user.id },
    data: { genre: { connect: selectedGenres } },
  });
  console.info(`Completed seeding users...`);

  console.info(`Seeding Withdrawal Reasons...`);
  await prisma.withdrawalReasons.createMany({
    data: withdrawalData.map((reason) => ({
      ...reason,
    })),
  });
  console.info(`Completed seeding withdrawal reasons...`);

  console.info(`Seeding Contact Types...`);
  await prisma.contactTypes.createMany({
    data: contactTypesData.map((contactType) => ({
      ...contactType,
    })),
  });
  console.info(`Completed seeding contact types...`);

  console.log(`Seeding finished.`);
}

switch (environment) {
  case 'seed':
    main()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
    break;
  case 'demo':
    demo()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
    break;
  case 'sponsor':
    sponsor()
      .then(async () => {
        await prisma.$disconnect();
      })
      .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
      });
    break;
  default:
    break;
}
