import { json } from '@remix-run/node';
import { db } from '~/api/services/db.server';
import { IResource, IResourceLanguage } from '../domain/types';
import { getModuleById } from './module.server';

export async function getAllResources() {
  const resources = await db.resource.findMany({
    include: {
      module: true,
      translations: {
        select: {
          language: {
            select: {
              id: false,
              key: true,
            },
          },
          value: true,
        },
      },
    },
  });
  return json(resources);
}

async function updateResource(resource: IResource) {
  const module = await getModuleById(resource.module.id);
  await db.resource.update({
    where: {
      id: resource.id,
    },
    data: {
      key: resource.key,
      translations: {
        deleteMany: {},
        create: resource.translations.map((translation: IResourceLanguage) => ({
          languageId: translation.languageId,
          value: translation.value,
          resource: {
            connect: {
              id: resource.id,
              module: {
                connect: {
                  id: module.id,
                  key: module.key,
                },
              },
            },
          },
        })),
      },
    },
  });
}
async function createResource(resource: IResource) {
  await db.resource.create({
    data: {
      key: resource.key,
      module: {
        connect: {
          id: resource.module.id,
        },
      },
      translations: {
        create: resource.translations.map((translation: IResourceLanguage) => ({
          languageId: translation.languageId,
          value: translation.value,
        })),
      },
    },
  });
}

export async function createOrUpdate(resource: IResource) {
  if (resource.id) {
    await updateResource(resource);
  }
  await createResource(resource);
}
