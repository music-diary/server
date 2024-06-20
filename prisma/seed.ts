import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UsersCreateInput[] = [
  // {
  //   name: 'Alice',
  //   email: 'alice@prisma.io',
  //   posts: {
  //     create: [
  //       {
  //         title: 'Join the Prisma Discord',
  //         content: 'https://pris.ly/discord',
  //         published: true,
  //       },
  //     ],
  //   },
  // },
  // {
  //   name: 'Nilu',
  //   email: 'nilu@prisma.io',
  //   posts: {
  //     create: [
  //       {
  //         title: 'Follow Prisma on Twitter',
  //         content: 'https://www.twitter.com/prisma',
  //         published: true,
  //       },
  //     ],
  //   },
  // },
  // {
  //   name: 'Mahmoud',
  //   email: 'mahmoud@prisma.io',
  //   posts: {
  //     create: [
  //       {
  //         title: 'Ask a question about Prisma on GitHub',
  //         content: 'https://www.github.com/prisma/prisma/discussions',
  //         published: true,
  //       },
  //       {
  //         title: 'Prisma on YouTube',
  //         content: 'https://pris.ly/youtube',
  //       },
  //     ],
  //   },
  // },
];

const genresData: Prisma.GenresCreateInput[] = [
  {
    name: 'ballade',
  },
  {
    name: 'dance',
  },
  {
    name: 'hip-hop',
  },
  {
    name: 'rnb',
  },
  {
    name: 'indie',
  },
  {
    name: 'rock',
  },
  {
    name: 'pop',
  },
  {
    name: 'new-age',
  },
  {
    name: 'fork',
  },
  {
    name: 'electronica',
  },
  {
    name: 'ost',
  },
  {
    name: 'jazz',
  },
  {
    name: 'j-pop',
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const genreData of genresData) {
    const genre = await prisma.genres.create({
      data: genreData,
    });
    console.log(`Created genre with id: ${genre.id}`);
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
