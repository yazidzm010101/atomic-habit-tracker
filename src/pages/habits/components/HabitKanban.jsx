import React, { useState } from "react";
import { faker } from "@faker-js/faker";
import { HStack } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import HabitList from "./HabitList";

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

function HabitKanban({ data: initialData }) {
  const [data, setData] = useState(initialData);

  const removeItem = (droppableId, index) => {
    setData((prevData) => ({
      ...prevData,
      [droppableId]: [
        ...prevData[droppableId].slice(0, index),
        ...prevData[droppableId].slice(index + 1, prevData[droppableId].length),
      ],
    }));
  };

  const addItem = (droppableId, index, item) => {
    setData((prevData) => ({
      ...prevData,
      [droppableId]: [
        ...prevData[droppableId].slice(0, index),
        { ...item, category: droppableId },
        ...prevData[droppableId].slice(index, prevData[droppableId].length),
      ],
    }));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (destination?.droppableId) {
      // update source
      removeItem(source.droppableId, source.index);
      // update target
      addItem(
        destination.droppableId,
        destination.index,
        data[source.droppableId][source.index]
      );
    }
  };
  return (
    <HStack spacing={0} w={"full"} alignItems={"stretch"}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.keys(stacks).map((key) => (
          <HabitList
            key={key}
            data={data[key]}
            w={{ base: "full", md: "50%" }}
            title={key}
          />
        ))}
      </DragDropContext>
    </HStack>
  );
}

export default HabitKanban;
