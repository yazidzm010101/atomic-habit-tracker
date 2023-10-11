import React, { useEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { Box, Container, Heading, Spacer, Text } from "@chakra-ui/react";
import { getLocalizedString } from "@/hooks/useLocale";
import HabitKanban from "./components/HabitKanban";

function Habits() {
  return (
    <Container maxW={"full"} py={3} px={6}>
      <Box w={"full"}>
        <Heading fontSize={"xl"}>
          {getLocalizedString("desc_atomic_habit_1")}
        </Heading>
        <Text>{getLocalizedString("desc_atomic_habit_1_explanation")}</Text>
      </Box>
      <Spacer as={"hr"} my={8} />
      <HabitKanban />
    </Container>
  );
}
export default Habits;
