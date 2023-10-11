import React, { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import HabitList from "./HabitList";
import { useHabits } from "@/hooks/useHabits";

function HabitKanban() {
  const {
    getStacks: { data, refetch },
    moveHabit,
  } = useHabits();

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (destination?.droppableId) {
      moveHabit(
        source.droppableId,
        source.index,
        destination.droppableId,
        destination.index,
      );
      refetch();
    }
  };

  return (
    <HStack spacing={0} w={"full"} alignItems={"stretch"}>
      <DragDropContext onDragEnd={onDragEnd}>
        {data.map((item) => (
          <HabitList
            key={item.id}
            data={item.data}
            w={{ base: "full", md: "50%" }}
            title={item.name}
          />
        ))}
      </DragDropContext>
    </HStack>
  );
}

export default HabitKanban;
