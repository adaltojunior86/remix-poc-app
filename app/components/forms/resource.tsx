import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { IModule, IResource, Language } from '~/api/domain/types';

export type ResourceActionData = {
  errors: {
    key?: boolean;
    module?: boolean;
    language?: true;
  };
};

type Props = {
  resource?: IResource;
  modules: IModule[];
  languages: Language[];
  errors: ResourceActionData['errors'];
};

export default function ResourceForm({ modules, languages, errors = {}, resource }: Props) {
  const [data, setData] = useState({ ...resource });
  return (
    <Form method="POST">
      {data.id && <input type="hidden" name="id" value={data.id} />}
      <Divider marginBottom="4" marginTop="4" />
      <Box as="div" margin={4}>
        <FormControl isInvalid={errors.key}>
          <FormLabel>Resource Key</FormLabel>
          <Input
            type="text"
            name="key"
            value={data?.key}
            onChange={(event) => {
              setData({ ...data, key: event.target.value });
            }}
          />
          {errors.key && <FormErrorMessage>Key is required.</FormErrorMessage>}
        </FormControl>
      </Box>
      <Box as="div" margin={4}>
        <FormControl isInvalid={errors.module}>
          <FormLabel>Module</FormLabel>
          <Select
            name="module"
            placeholder="Module"
            onChange={(event) => setData({ ...data, moduleId: parseInt(event.target.value, 10) })}
          >
            {modules.map((module) => {
              return (
                <option
                  key={module.id}
                  value={module.id}
                  selected={resource && module.id === data.moduleId}
                >
                  {module.key}
                </option>
              );
            })}
          </Select>
          {errors.module && <FormErrorMessage>Module is required.</FormErrorMessage>}
        </FormControl>
      </Box>
      <Divider marginBottom="4" marginTop="4" />
      <FormControl isInvalid={errors.language}>
        <FormLabel>Below add the resources for language</FormLabel>
        {errors.language && <FormErrorMessage>At least one language is required</FormErrorMessage>}
        <Box as="div" margin={4} display="flex" flexDirection="column">
          {languages.map((language) => {
            const value = data?.translations?.find((l) => l.languageId === language.id)?.value;
            return (
              <Flex as="div" margin={4} key={language.id}>
                <FormLabel>{language.description}</FormLabel>
                <Input
                  type="text"
                  name={`language.${language.id}`}
                  value={value}
                  onChange={(event) =>
                    setData({
                      ...data,
                      translations: data?.translations?.map((item) => {
                        const languageIdStr = event.target.name.split('.')[1] || '0';
                        const languageId = parseInt(languageIdStr, 10);
                        if (languageId === item.languageId) {
                          return {
                            ...item,
                            value: event.target.value,
                          };
                        }
                        return item;
                      }),
                    })
                  }
                />
              </Flex>
            );
          })}
        </Box>{' '}
      </FormControl>
      <Button type="submit">Save</Button>
    </Form>
  );
}

ResourceForm.defaultProps = {
  resource: {},
};
