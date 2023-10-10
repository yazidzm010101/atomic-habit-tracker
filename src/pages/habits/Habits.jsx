import React, { useEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { Box, Container, Heading, Spacer, Text } from "@chakra-ui/react";
import { getLocalizedString } from "@/hooks/useLocale";
import HabitKanban from "./components/HabitKanban";

let master_data = [];
let stacks = { Positive: [], Negative: [] };
for (let i = 0; i < 10; i++) {
  const item = {
    id: faker.database.mongodbObjectId() + Date.now(),
    name: [faker.word.verb(), faker.word.noun()].join(" "),
    reasoning: [
      faker.word.preposition(),
      faker.word.verb(),
      faker.word.noun(),
      faker.word.conjunction(),
      faker.word.adjective(),
    ].join(" "),
    category: ["Positive", "Negative"][faker.number.int({ min: 0, max: 1 })],
    baseScore: faker.number.int({ min: 1, max: 3 }),
    currentScores: 0,
  };
  master_data.push(item);
  if (!stacks[item.category]) {
    stacks[item.category] = [];
  }

  stacks[item.category].push(item);
}

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
      <HabitKanban data={stacks} />
    </Container>
  );
}
export default Habits;
