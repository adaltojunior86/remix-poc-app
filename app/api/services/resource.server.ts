import { json } from '@remix-run/node';
import { db } from '~/api/services/db.server';
import { IResource, IResourceLanguage } from '../domain/types';

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
  await db.resource.update({
    where: {
      id: resource.id,
    },
    data: {
      key: resource.key,
      moduleId: resource.moduleId,
      translations: {
        updateMany: resource.translations.map((translation: IResourceLanguage) => ({
          where: {
            languageId: translation.languageId,
          },
          data: {
            value: translation.value,
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
          id: resource.moduleId,
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
    return;
  }
  await createResource(resource);
}

export async function findById(id: number) {
  const resource = await db.resource.findFirst({
    where: { id },
    include: {
      module: true,
      translations: {
        select: {
          languageId: true,
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
  if (!resource) {
    throw new Error('Resource not found');
  }
  return resource;
}
