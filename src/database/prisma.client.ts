import { PrismaClient, Prisma } from '@prisma/client';

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
              deletedAt: new Date(),
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
