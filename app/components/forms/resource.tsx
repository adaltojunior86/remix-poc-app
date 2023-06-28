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
import { IModule, Language } from '~/api/domain/types';

export type ResourceFormData = {
  errors: {
    key?: boolean;
    module?: boolean;
    language?: true;
  };
};

type Props = {
  modules: IModule[];
  languages: Language[];
  errors: ResourceFormData['errors'];
};

const renderLanguageInput = (languages: Array<Language> = []) => (
  <Box as="div" margin={4} display="flex" flexDirection="column">
    {languages.map((language) => {
      return (
        <Flex as="div" margin={4} key={language.id}>
          <FormLabel>{language.description}</FormLabel>
          <Input type="text" name={`language.${language.id}`} placeholder="Key" />
        </Flex>
      );
    })}
  </Box>
);

export default function ResourceForm({ modules, languages, errors = {} }: Props) {
  return (
    <>
      <div>Add new resource</div>
      <Form method="POST">
        <Divider marginBottom="4" marginTop="4" />
        <Box as="div" margin={4}>
          <FormControl isInvalid={errors.key}>
            <FormLabel>Resource Key</FormLabel>
            <Input type="text" name="key" />
            {errors.key && <FormErrorMessage>Key is required.</FormErrorMessage>}
          </FormControl>
        </Box>
        <Box as="div" margin={4}>
          <FormControl isInvalid={errors.module}>
            <FormLabel>Module</FormLabel>
            <Select name="module" placeholder="Module">
              {modules.map((module) => {
                return (
                  <option key={module.id} value={module.id}>
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
          {errors.language && (
            <FormErrorMessage>At least one language is required</FormErrorMessage>
          )}
          {renderLanguageInput(languages)}
        </FormControl>
        <Button type="submit">Save</Button>
      </Form>
    </>
  );
}
