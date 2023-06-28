import { Flex, Text } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

const hoverOptions = {
  bg: 'blue.100',
  color: 'blue.600',
  borderRadius: 'md',
};

export function Sidebar() {
  return (
    <Flex
      as="aside"
      h="100%"
      direction="column"
      grow={1}
      maxW="64"
      pr="2"
      pl="2"
      border="1px solid"
      borderColor="gray.300"
      color="gray.600"
      fontWeight="semibold"
      bg="white"
    >
      <Text p={2} mt={1}>
        Menu
      </Text>
      <Link key="resource-menu" to="/">
        <Text p={2} mt={1} _hover={hoverOptions}>
          Dashboard
        </Text>
      </Link>
      <Link key="new-resource-menu" to="resources/new">
        <Text _hover={hoverOptions} p={2}>
          New Resource
        </Text>
      </Link>
    </Flex>
  );
}
