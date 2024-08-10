import { DiariesStatus, PrismaClient } from '@prisma/client';
import { tgUserData, ssUserData } from './users.seed';

const prisma = new PrismaClient();

export async function demo() {
  // seed users
  const tgUser = await prisma.users.create({ data: tgUserData });
  const ssUser = await prisma.users.create({ data: ssUserData });
  const genres = await prisma.genres.findMany({
    where: { OR: [{ name: 'pop' }, { name: 'fork' }] },
  });

  // link user with genres
  await prisma.users.update({
    where: { id: tgUser.id },
    data: { genre: { connect: genres.map((genre) => ({ id: genre.id })) } },
  });
  await prisma.users.update({
    where: { id: ssUser.id },
    data: { genre: { connect: genres.map((genre) => ({ id: genre.id })) } },
  });

  // const positiveEmotions = await prisma.emotions.findMany({
  //   where: { OR: [{ name: 'glad' }, { name: 'excited' }] },
  // });
  // const topic = await prisma.topics.findFirst({
  //   where: { OR: [{ name: 'family' }] },
  // });

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
  const selectedMusics = await prisma.musics.findMany();

  const positiveDiary = await prisma.diaries.create({
    data: {
      title: '오늘의 일기1',
      userId: tgUser.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
              userId: tgUser.id,
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
              userId: tgUser.id,
              createdAt: new Date('2024-06-30'),
            })),
          ],
        },
      },
      createdAt: new Date('2024-06-30'),
    },
  });
  await prisma.musics.update({
    data: {
      userId: tgUser.id,
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
      userId: tgUser.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
              userId: tgUser.id,
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
              userId: tgUser.id,
              createdAt: new Date('2024-07-01'),
            })),
          ],
        },
      },
      createdAt: new Date('2024-07-01'),
    },
  });
  await prisma.musics.update({
    data: {
      userId: tgUser.id,
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
      userId: tgUser.id,
      status: DiariesStatus.DONE,
      content: '내용',
      topics: {
        createMany: {
          data: [
            ...selectedTopics.map((topic) => ({
              topicId: topic.id,
              userId: tgUser.id,
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
              userId: tgUser.id,
              createdAt: new Date('2024-07-15'),
            })),
          ],
        },
      },
      createdAt: new Date('2024-07-15'),
    },
  });
  await prisma.musics.update({
    data: {
      userId: tgUser.id,
      diaryId: normalDiary.id,
      createdAt: new Date('2024-07-15'),
    },
    where: {
      id: selectedMusics[2].id,
    },
  });
}
