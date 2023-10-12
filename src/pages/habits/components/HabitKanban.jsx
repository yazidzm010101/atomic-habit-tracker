import React, { useEffect, useState } from "react";
import { HStack } from "@chakra-ui/react";
import { DragDropContext } from "react-beautiful-dnd";
import HabitList from "./HabitList";
import { useHabits } from "@/hooks/useHabits";

function HabitKanban() {
  const {
    getStacks: { data, refetch },
    moveHabit,
  } = useHabits();

  const [habits, setHabits] = useState(data);

  useEffect(() => {
    setHabits(data);
  }, [data]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (destination?.droppableId) {
      const indexSource = habits.findIndex((x) => x.name == source.droppableId);

      let currHabits = [...habits];
      let sourceHabits = { ...currHabits[indexSource] };

      //set ui source
      currHabits = [
        ...currHabits.slice(0, indexSource),
        {
          ...sourceHabits,
          habits: [
            ...sourceHabits.habits.slice(0, source.index),
            ...sourceHabits.habits.slice(
              source.index + 1,
              sourceHabits.habits.length,
            ),
          ],
        },
        ...currHabits.slice(indexSource + 1, currHabits.length),
      ];

      const indexTarget = habits.findIndex(
        (x) => x.name == destination.droppableId,
      );
      let targetHabits = { ...currHabits[indexTarget] };

      // set ui target
      currHabits = [
        ...currHabits.slice(0, indexTarget),
        {
          ...targetHabits,
          habits: [
            ...targetHabits.habits.slice(0, destination.index),
            { ...sourceHabits.habits[source.index], is_loading: true },
            ...targetHabits.habits.slice(
              destination.index,
              targetHabits.habits.length,
            ),
          ],
        },
        ...currHabits.slice(indexTarget + 1, currHabits.length),
      ];

      setHabits(() => currHabits);

      // store db
      moveHabit(
        source.droppableId,
        source.index,
        destination.droppableId,
        destination.index,
      ).then(() => refetch());
    }
  };

  return (
    <HStack spacing={0} w={"full"} alignItems={"stretch"}>
      <DragDropContext onDragEnd={onDragEnd}>
        {habits?.map((item) => (
          <HabitList
            key={item.name}
            data={item.habits}
            w={{ base: "full", md: "50%" }}
            title={item.name}
          />
        ))}
      </DragDropContext>
    </HStack>
  );
}

export default HabitKanban;
