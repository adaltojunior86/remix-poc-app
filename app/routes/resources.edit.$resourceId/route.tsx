import { type LoaderArgs, type LoaderFunction } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { languageService, moduleService, resourceService } from '~/api/services';
import { IModule, IResource, Language } from '~/api/domain/types';
import ResourceForm, { ResourceActionData } from '../../components/forms/resource';

type LoaderData = {
  resource?: Awaited<IResource>;
  modules?: Awaited<IModule[]>;
  languages?: Awaited<Language[]>;
};

export const loader: LoaderFunction = async ({
  params: { resourceId },
}: LoaderArgs): Promise<LoaderData> => {
  if (resourceId && !Number.isNaN(resourceId)) {
    return {
      resource: await resourceService.findById(parseInt(resourceId, 10)),
      modules: await moduleService.getAllModules(),
      languages: await languageService.getAllLanguages(),
    };
  }

  throw new Error('Error at get resource');
};

export { action } from '../../api/actionforms/resources';
export default function EditResource() {
  const actionData = useActionData() as ResourceActionData;
  const { resource, languages, modules } = useLoaderData<typeof loader>();
  return (
    <>
      <div>Editing resource</div>
      <ResourceForm
        resource={resource}
        languages={languages}
        modules={modules}
        errors={actionData?.errors}
      />
    </>
  );
}
