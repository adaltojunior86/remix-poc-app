import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
} from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import { resourceService } from '~/api/services/';

export async function loader() {
  return resourceService.getAllResources();
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div>Resources List</div>
      <Accordion defaultIndex={[0]} allowMultiple>
        {data.map((resource) => (
          <AccordionItem key={resource.id}>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {resource.key}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              <ul>
                {resource.translations?.map((translation) => (
                  <li key={translation.language.key}>
                    {translation.language.key}
                    {translation.value}
                  </li>
                ))}
              </ul>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
