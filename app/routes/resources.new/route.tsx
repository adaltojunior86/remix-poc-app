import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { IModule, IResource, IResourceLanguage, Language } from '~/api/domain/types';
import { languageService, moduleService, resourceService } from '~/api/services';
import ResourceForm, { ResourceFormData } from '../../components/forms/resource';

type LoaderData = {
  modules?: Awaited<IModule[]>;
  languages?: Awaited<Language[]>;
};

type ActionData = ResourceFormData;

function validateResource(resource: IResource): ActionData {
  const errors: ActionData['errors'] = {};
  if (!resource.key) {
    errors.key = true;
  }
  if (!resource.module.id) {
    errors.module = true;
  }
  if (!resource.translations) {
    errors.language = true;
  }

  return { errors };
}

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return {
    modules: await moduleService.getAllModules(),
    languages: await languageService.getAllLanguages(),
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const resource = {} as IResource;
  const iterator = formData.entries();
  let data = iterator.next();
  while (!data.done) {
    const { value } = data;
    const key = value[0] as keyof IResource;
    const dataValue = value[1] as string;

    if (key === 'key') {
      resource.key = dataValue;
    }
    if (key === 'module') {
      resource.module = {
        id: parseInt(dataValue, 10),
      };
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

  const result: ActionData = validateResource(resource) || {};

  if (!Object.keys(result.errors).length) {
    await resourceService.createOrUpdate(resource);
  }

  return json<ActionData>(result);
};

function New() {
  const actionData = useActionData() as ActionData;
  const { modules, languages } = useLoaderData<typeof loader>();
  return <ResourceForm languages={languages} modules={modules} errors={actionData?.errors} />;
}

export default New;
