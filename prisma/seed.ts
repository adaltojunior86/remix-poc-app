import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const moduleData: Prisma.ModuleCreateInput[] = [
  {
    key: 'Module 1',
  },
  {
    key: 'Module 2',
  },
  {
    key: 'Module 3',
  },
  {
    key: 'Module 4',
  },
];

const languageData: Prisma.LanguageCreateInput[] = [
  {
    key: 'en',
    description: 'English',
  },
  {
    key: 'fr',
    description: 'French',
  },
  {
    key: 'es',
    description: 'Spanish',
  },
];

const resourceData: Prisma.ResourceCreateInput[] = [
  {
    key: 'hello.world',
    module: {
      connect: {
        id: 1,
      },
    },
    translations: {
      create: [
        {
          language: {
            connect: {
              key: 'en',
            },
          },
          value: 'Hello World',
        },
        {
          language: {
            connect: {
              key: 'fr',
            },
          },
          value: 'Bonjour le monde',
        },
        {
          language: {
            connect: {
              key: 'es',
            },
          },
          value: 'Hola Mundo',
        },
      ],
    },
  },
];

async function main() {
  await prisma.resource.deleteMany();
  await prisma.module.deleteMany();
  await prisma.language.deleteMany();

  for (const module of moduleData) {
    await prisma.module.create({
      data: module,
    });
  }

  for (const language of languageData) {
    await prisma.language.create({
      data: language,
    });
  }

  for (const resource of resourceData) {
    await prisma.resource.create({
      data: resource,
    });
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
