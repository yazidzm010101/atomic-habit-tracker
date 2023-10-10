import React, { useEffect, useMemo, useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import { HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { PiPlus } from "react-icons/pi";
import { Draggable } from "react-beautiful-dnd";
import DroppableStrict from "@/components/DroppableStrict";
import HabitItem from "./HabitItem";

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

function HabitList({ initialData, title, data, ...rest }) {
  const id = title.split(/\s+/g).join("-");

  return (
    <VStack px={3} spacing={3} w={"full"} {...rest} pos={"relative"}>
      <Heading fontSize={"xl"} alignSelf={"flex-start"} mb={3} as={"h5"}>
        {title}
      </Heading>
      <DroppableStrict droppableId={id}>
        {(droppableProvided) => (
          <VStack
            spacing={3}
            w={"full"}
            flexGrow={1}
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
            pb={12}
          >
            {data.map((item, i) => (
              <Draggable key={item.id} draggableId={item.id} index={i}>
                {(draggableProvided, draggableSnapshot) => (
                  <HabitItem
                    name={item.name}
                    category={item.category}
                    {...draggableProvided.dragHandleProps}
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                  />
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
            <HStack
              cursor={"pointer"}
              py={2}
              w={"full"}
              border={"1px dashed"}
              borderColor={"gray.300"}
              minW={"full"}
              px={4}
              justifyContent={"center"}
            >
              <Icon as={PiPlus} w={4} h={4} />
              <Text maxW={"max-content"}>Add new habit</Text>
            </HStack>
          </VStack>
        )}
      </DroppableStrict>
    </VStack>
  );
}

export default HabitList;
