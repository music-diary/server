import { DiariesStatus, PrismaClient } from '@prisma/client';
import {
  basicEmotionsData,
  firstDepthsEmotionsData,
  secondDepthsEmotionsData,
} from './emotions.seed';
import { genresData } from './genres.seed';
import { templateContentsData, templatesData } from './templates.seed';
import { topicsData } from './topics.seed';
import { userData } from './users.seed';
import { musicsData } from './musics.seed';

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
    console.log(`Completed seeding emotions...`);
  }
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

  // seed musics
  console.log(`Seeding musics...`);
  for (const musicData of musicsData) {
    await prisma.musics.create({
      data: musicData,
    });
  }
  console.log(`Completed seeding musics...`);

  // seed users
  console.log(`Seeding users...`);
  const user = await prisma.users.create({ data: userData });
  const dance = await prisma.genres.findFirst({
    where: { name: 'dance' },
  });
  const indie = await prisma.genres.findFirst({
    where: { name: 'indie' },
  });
  const selectedGenres = [dance, indie];
  await prisma.users.update({
    where: { id: user.id },
    data: {
      genre: {
        connect: selectedGenres,
      },
    },
  });
  console.log(`Completed seeding users...`);

  // create diary
  console.log(`Seeding diary...`);
  const selectedTopics = await prisma.topics.findMany({
    where: {
      OR: [{ name: 'relationship' }, { name: 'family' }],
    },
  });
  const selectedPositiveEmotions = await prisma.emotions.findMany({
    where: { OR: [{ name: 'happy' }, { name: 'glad' }] },
  });
  const selectedNormalEmotions = await prisma.emotions.findMany({
    where: { OR: [{ name: 'usual' }, { name: 'so-so' }] },
  });
  const selectedNegativeEmotions = await prisma.emotions.findMany({
    where: { OR: [{ name: 'tired' }, { name: 'uncomfortable' }] },
  });
  const selectedMusics = await prisma.musics.findMany();

  const positiveDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기1',
      userId: user.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
            })),
          ],
        },
      },
      emotions: {
        createMany: {
          data: [
            ...selectedPositiveEmotions.map((emotion) => ({
              emotionId: emotion.id,
              musicId: selectedMusics[0].id,
            })),
          ],
        },
      },
      createdAt: new Date('2024-06-30'),
    },
  });
  await prisma.musics.update({
    data: {
      userId: user.id,
      diaryId: positiveDiary.id,
      createdAt: new Date('2024-06-30'),
    },
    where: {
      id: selectedMusics[0].id,
    },
  });

  const negativeDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기2',
      userId: user.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
            })),
          ],
        },
      },
      emotions: {
        createMany: {
          data: [
            ...selectedNegativeEmotions.map((emotion) => ({
              emotionId: emotion.id,
              musicId: selectedMusics[1].id,
            })),
          ],
        },
      },
      createdAt: new Date('2024-07-01'),
    },
  });
  await prisma.musics.update({
    data: {
      userId: user.id,
      diaryId: negativeDiary.id,
      createdAt: new Date('2024-07-01'),
    },
    where: {
      id: selectedMusics[1].id,
    },
  });

  const normalDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기3',
      userId: user.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
            })),
          ],
        },
      },
      emotions: {
        createMany: {
          data: [
            ...selectedNormalEmotions.map((emotion) => ({
              emotionId: emotion.id,
              musicId: selectedMusics[2].id,
            })),
          ],
        },
      },
      createdAt: new Date('2024-07-15'),
    },
  });
  await prisma.musics.update({
    data: {
      userId: user.id,
      diaryId: normalDiary.id,
      createdAt: new Date('2024-07-15'),
    },
    where: {
      id: selectedMusics[2].id,
    },
  });

  console.log(`Completed seeding diary...`);

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
