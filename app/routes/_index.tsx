import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  AccordionPanel,
  Text,
  Divider,
} from '@chakra-ui/react';
import { Link, useLoaderData } from '@remix-run/react';
import { resourceService } from '~/api/services/';

export async function loader() {
  return resourceService.getAllResources();
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div>Resources List</div>
      <Accordion allowMultiple>
        {data.map((resource) => (
          <AccordionItem key={resource.id}>
            <h2>
              <AccordionButton>
                <Link to={`/resources/edit/${resource.id}`}>
                  <Text as="span" flex="1" textAlign="left">
                    {resource.key}
                  </Text>
                </Link>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              {/* <ul>
                {resource.translations?.map((translation) => (
                  <li key={translation.language.key}>
                    <Text display="inline-flex">{translation.language.key}</Text>
                    <Divider display="inline-flex" height="4" orientation="vertical" />
                    <Text display="inline-flex">{translation.value}</Text>
                  </li>
                ))}
              </ul> */}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
