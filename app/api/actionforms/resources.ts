import { ResourceActionData } from '~/components/forms/resource';
import { ActionFunction, json } from '@remix-run/node';
import { IResource, IResourceLanguage } from '../domain/types';
import { resourceService } from '../services';

function validateResource(resource: IResource): ResourceActionData {
  const errors: ResourceActionData['errors'] = {};
  if (!resource.key) {
    errors.key = true;
  }
  if (!resource.moduleId) {
    errors.module = true;
  }
  if (!resource.translations) {
    errors.language = true;
  }

  return { errors };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const resource = {} as IResource;
  const iterator = formData.entries();

  let data = iterator.next();
  while (!data.done) {
    const { value } = data;
    const key = value[0] as keyof IResource;
    const dataValue = value[1] as string;

    if (key === 'id') {
      resource.id = parseInt(dataValue, 10);
    }

    if (key === 'key') {
      resource.key = dataValue;
    }

    if (key === 'module') {
      resource.moduleId = parseInt(dataValue, 10);
    }

    if (key.startsWith('language')) {
      if (dataValue) {
        const languageId = parseInt(key.split('.')[1], 10);
        const translation: IResourceLanguage = {
          value: dataValue,
          languageId,
        };
        if (!resource.translations) {
          resource.translations = [];
        }
        resource.translations.push(translation);
      }
    }
    data = iterator.next();
  }

  const result: ResourceActionData = validateResource(resource);

  if (!Object.keys(result.errors).length) {
    await resourceService.createOrUpdate(resource);
  }

  return json<ResourceActionData>(result);
};
