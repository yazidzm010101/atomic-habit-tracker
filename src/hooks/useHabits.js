import { faker } from "@faker-js/faker";
import { useQueryClient, useQuery, isError } from "@tanstack/react-query";
import { useState, useEffect } from "react";

let fake_habits = [];
let fake_stacks = [
  { data: [], name: "Positive", id: "positive" },
  { data: [], name: "Negative", id: "negative" },
];
for (let i = 0; i < 10; i++) {
  const item = {
    id: faker.database.mongodbObjectId() + Date.now(),
    name: [faker.word.verb(), faker.word.noun()].join(" "),
    description: [
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
  fake_habits.push(item);
  fake_stacks[fake_stacks.findIndex((x) => x.name == item.category)].data.push({
    id: item.id,
    name: item.name,
  });
}

localStorage.setItem("habits", JSON.stringify(fake_habits));
localStorage.setItem("stacks", JSON.stringify(fake_stacks));

export function useHabits() {
  const query = ["habits"];
  const queryStack = ["habits", "stacks"];

  const client = useQueryClient();

  const getHabits = useQuery({
    queryKey: query,
    queryFn: () => JSON.parse(localStorage.getItem("habits") || "[]"),
    initialData: fake_habits,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const setHabits = (habits) => {
    localStorage.setItem("habits", JSON.stringify(habits));
    client.setQueryData(query, habits);
    getHabits.refetch();
  };

  const setStacks = (stacks) => {
    localStorage.setItem("stacks", JSON.stringify(stacks));
    client.setQueryData(queryStack, stacks);
    getStacks.refetch();
  };

  const getStacks = useQuery({
    queryKey: queryStack,
    queryFn: () => JSON.parse(localStorage.getItem("stacks") || "[]"),
    initialData: fake_stacks,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const getHabitById = (id) =>
    useQuery({
      queryKey: ["habits", "id", id],
      queryFn: () => {
        let habits = [...getHabits.data];
        let index = habits.findIndex((x) => x.id == id);
        return habits[index] || null;
      },
    });

  const addHabit = (item) =>
    new Promise((resolve, reject) => {
      let habits = [...getHabits.data];
      let stacks = [...getStacks.data];
      let id = faker.database.mongodbObjectId + Date.now();

      let indexC = stacks.findIndex((x) => x.name == item.category);
      if (indexC == -1) {
        reject("Invalid habit category!");
      }

      habits.push({ ...item, id });
      stacks[indexC].data.push({ ...item, id });

      setHabits(habits);
      setStacks(stacks);

      resolve(item);
    });

  const updateHabitByid = (item, id) =>
    new Promise((resolve, reject) => {
      let habits = [...getHabits.data];
      let stacks = [...getStacks.data];
      let indexC = stacks.findIndex((x) => x.name == item.category);
      if (indexC > -1) {
        let indexH = habits.findIndex((x) => x.id == habits.id);
        let indexS = stacks[indexC]?.data?.findIndex((x) => x.id == stacks.id);
        if (!!indexH && !!indexS) {
          habits = [
            ...habits.slice(0, indexH),
            item,
            ...habits.slice(indexH + 1, habits.length),
          ];
          stacks = [
            ...stacks.slice(0, indexC),
            {
              ...stacks[indexC],
              data: [
                ...stacks[indexC].data.slice(0, indexS),
                item,
                ...stacks[indexC].data.slice(
                  indexS + 1,
                  ...stacks[indexC].data.length,
                ),
              ],
            },
            ...stacks.slice(indexC + 1, stacks.length),
          ];

          setHabits(habits);
          setStacks(stacks);

          resolve(item);
        }
        reject(new Error("id not found!"));
      }
    });

  const moveHabit = (
    sourceCategory,
    sourceIndex,
    targetCategory,
    targetindex,
  ) =>
    new Promise((resolve, reject) => {
      let stacks = [...getStacks.data];
      let indexStackSource = stacks.findIndex((x) => x.name == sourceCategory);
      let indexStackTarget = stacks.findIndex((x) => x.name == targetCategory);
      let item = stacks[indexStackSource].data[sourceIndex];
      if (!!item) {
        // UPDATE SOURCE STACKS
        stacks = [
          ...stacks.slice(0, indexStackSource),
          {
            ...stacks[indexStackSource],
            data: [
              ...stacks[indexStackSource].data.slice(0, sourceIndex),
              ...stacks[indexStackSource].data.slice(
                sourceIndex + 1,
                stacks[indexStackSource].data.length,
              ),
            ],
          },
          ...stacks.slice(indexStackSource + 1, stacks.length),
        ];

        // UPDATE TARGET STACKS
        stacks = [
          ...stacks.slice(0, indexStackTarget),
          {
            ...stacks[indexStackTarget],
            data: [
              ...stacks[indexStackTarget].data.slice(0, targetindex),
              item,
              ...stacks[indexStackTarget].data.slice(
                targetindex,
                stacks[indexStackTarget].data.length,
              ),
            ],
          },
          ...stacks.slice(indexStackTarget + 1, stacks.length),
        ];

        setStacks(stacks);
        resolve(item);
      }
      reject(new Error("index not found"));
    });

  return {
    getHabits,
    getHabitById,
    getStacks,
    addHabit,
    updateHabitByid,
    moveHabit,
  };
}
