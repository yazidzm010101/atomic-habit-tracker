import { Box, Container, Heading, Spacer, Text } from "@chakra-ui/react";

import GroupList from "./components/GroupList";
import { getLocalizedString } from "@/hooks/useLocale";

function JustDoIt() {
  return (
    <Container maxW={"full"} py={3} px={6}>
      <Box w={"full"}>
        <Heading fontSize={"xl"}>
          {getLocalizedString("desc_atomic_habit_2")}
        </Heading>
        <Text>{getLocalizedString("desc_atomic_habit_2_explanation")}</Text>
      </Box>
      <Spacer borderBottom={"3px dotted"} borderColor={"gray.400"} my={8} />
      <Spacer my={8} />
      <GroupList />
    </Container>
  );
}
export default JustDoIt;
