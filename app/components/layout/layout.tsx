import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex width="100%" height="100%" bg="gray.200" direction="column">
      <Flex as="section" h="100%">
        <Sidebar />
        <Flex
          as="main"
          grow={2}
          border="1px solid"
          borderColor="gray.300"
          bgColor="gray.200"
          direction="column"
        >
          <Flex
            as="header"
            width="100%"
            height="100px"
            align="center"
            justify="center"
            borderBottom="1px solid"
            borderColor="gray.300"
          >
            <h1>One Translation</h1>
          </Flex>
          <Flex as="div" m={6} borderRadius={8} bgColor="white" p={8} direction="column">
            {children}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
