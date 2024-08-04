import { PrismaClient, Prisma } from '@prisma/client';
import { setKoreaTime } from '../util/date-time-converter';

export const customPrismaClient = (prismaClient: PrismaClient) => {
  return prismaClient.$extends({
    model: {
      $allModels: {
        async softDelete<M, A>(
          this: M,
          where: Prisma.Args<M, 'update'>['where'],
        ): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).update({
            where,
            data: {
              deletedAt: setKoreaTime(),
            },
          });
        },
        async findManyAvailable<M, A>(
          this: M,
          args?: Prisma.Args<M, 'findMany'>,
        ): Promise<Prisma.Result<M, A, 'findMany'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).findMany({
            ...args,
            where: {
              ...args?.where,
              deletedAt: null,
            },
          });
        },

        async findUniqueAvailable<M, A>(
          this: M,
          args?: Prisma.Args<M, 'findUnique'>,
        ): Promise<Prisma.Result<M, A, 'findUnique'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).findUnique({
            ...args,
            where: {
              ...args?.where,
              deletedAt: null,
            },
          });
        },

        async findOneAvailable<M, A>(
          this: M,
          args?: Prisma.Args<M, 'findFirst'>,
        ): Promise<Prisma.Result<M, A, 'findFirst'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).findFirst({
            ...args,
            where: {
              ...args?.where,
              deletedAt: null,
            },
          });
        },

        async createAtKoreaTime<M, A>(
          this: M,
          where: Prisma.Args<M, 'create'>['where'],
        ): Promise<Prisma.Result<M, A, 'create'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).create({
            where,
            data: {
              createdAt: setKoreaTime(),
              updatedAt: setKoreaTime(),
            },
          });
        },

        async createManyAtKoreaTime<M, A>(
          this: M,
          where: Prisma.Args<M, 'createMany'>['where'],
        ): Promise<Prisma.Result<M, A, 'createMany'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).createMany({
            where,
            data: {
              createdAt: setKoreaTime(),
              updatedAt: setKoreaTime(),
            },
          });
        },

        async updateAtKoreaTime<M, A>(
          this: M,
          where: Prisma.Args<M, 'update'>['where'],
        ): Promise<Prisma.Result<M, A, 'update'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).update({
            where,
            data: {
              updatedAt: setKoreaTime(),
            },
          });
        },

        async updatedManyAtKoreaTime<M, A>(
          this: M,
          where: Prisma.Args<M, 'updateMany'>['where'],
        ): Promise<Prisma.Result<M, A, 'updateMany'>> {
          const context = Prisma.getExtensionContext(this);

          return (context as any).updateMany({
            where,
            data: {
              updatedAt: setKoreaTime(),
            },
          });
        },
      },
    },
  });
};

export type CustomPrismaClient = ReturnType<typeof customPrismaClient>;

export class PrismaClientExtended extends PrismaClient {
  customPrismaClient: CustomPrismaClient;

  get client() {
    if (!this.customPrismaClient)
      this.customPrismaClient = customPrismaClient(this);

    return this.customPrismaClient;
  }
}
