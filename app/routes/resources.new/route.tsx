import type { LoaderFunction } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';
import { IModule, Language } from '~/api/domain/types';
import { languageService, moduleService } from '~/api/services';
import ResourceForm, { ResourceActionData } from '../../components/forms/resource';

type LoaderData = {
  modules?: Awaited<IModule[]>;
  languages?: Awaited<Language[]>;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  return {
    modules: await moduleService.getAllModules(),
    languages: await languageService.getAllLanguages(),
  };
};

export { action } from '../../api/actionforms/resources';

function New() {
  const actionData = useActionData() as ResourceActionData;
  const { modules, languages } = useLoaderData<typeof loader>();
  return (
    <>
      <div>Editing resource</div>
      <ResourceForm languages={languages} modules={modules} errors={actionData?.errors} />
    </>
  );
}

export default New;
