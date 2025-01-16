import { DiariesStatus, PrismaClient } from '@prisma/client';
import { userData } from './users.seed';
import { musicsData } from './musics.seed';

const prisma = new PrismaClient();

export async function demo() {
  // seed musics
  console.info(`Seeding musics...`);
  for (const musicData of musicsData) {
    await prisma.musics.create({
      data: musicData,
    });
  }
  console.info(`Completed seeding musics...`);
  // create diary
  console.info(`Seeding diary...`);
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
  const selectedMusics = await prisma.musics.findMany({
    where: {
      id: {
        in: [
          'bce6d4bd-a10a-44a8-9d0a-2eca8703c57e',
          'b63a1a98-eb43-44fc-9273-a43ed623492e',
          '69947b75-0fa9-4f3c-a849-e6fe9cc8308e',
        ],
      },
    },
  });

  const positiveDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기1',
      userId: userData.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
              userId: userData.id,
              createdAt: new Date('2024-06-30'),
              updatedAt: new Date('2024-06-30'),
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
              userId: userData.id,
              createdAt: new Date('2024-06-30'),
              updatedAt: new Date('2024-06-30'),
            })),
          ],
        },
      },
      createdAt: new Date('2024-06-30'),
      updatedAt: new Date('2024-06-30'),
    },
  });
  await prisma.musics.update({
    data: {
      selected: true,
      userId: userData.id,
      diaryId: positiveDiary.id,
      createdAt: new Date('2024-06-30'),
      updatedAt: new Date('2024-06-30'),
    },
    where: {
      id: selectedMusics[0].id,
    },
  });

  const negativeDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기2',
      userId: userData.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
              userId: userData.id,
              createdAt: new Date('2024-07-01'),
              updatedAt: new Date('2024-07-01'),
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
              userId: userData.id,
              createdAt: new Date('2024-07-01'),
              updatedAt: new Date('2024-07-01'),
            })),
          ],
        },
      },
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01'),
    },
  });
  await prisma.musics.update({
    data: {
      selected: true,
      userId: userData.id,
      diaryId: negativeDiary.id,
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01'),
    },
    where: {
      id: selectedMusics[1].id,
    },
  });

  const normalDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기3',
      userId: userData.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
              userId: userData.id,
              createdAt: new Date('2024-07-15'),
              updatedAt: new Date('2024-07-15'),
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
              userId: userData.id,
              createdAt: new Date('2024-07-15'),
              updatedAt: new Date('2024-07-15'),
            })),
          ],
        },
      },
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15'),
    },
  });
  await prisma.musics.update({
    data: {
      selected: true,
      userId: userData.id,
      diaryId: normalDiary.id,
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15'),
    },
    where: {
      id: selectedMusics[2].id,
    },
  });

  console.info(`Completed seeding diary...`);
}
