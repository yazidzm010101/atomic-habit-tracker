import { faker } from "@faker-js/faker";
import { useQueryClient, useQuery, isError } from "@tanstack/react-query";

let fake_habits = [];
let fake_stacks = [
  { data: [], name: "Positive", id: "positive" },
  { data: [], name: "Negative", id: "negative" },
];

fake_habits.push({
  id: faker.database.mongodbObjectId(),
  name: "🚶 Walk 1km",
  description: "❌📱 Turn off the screen, \n🏡 and enjoy the outdoor",
  category: "Positive",
  base_score: 1,
});
fake_stacks[0].data.push(fake_habits[fake_habits.length - 1]);

fake_habits.push({
  id: faker.database.mongodbObjectId(),
  name: "💪 Push up 10x",
  description: "❌🛋️ Leave the comfy sofa, \n💪 and build up your strength",
  category: "Positive",
  base_score: 1,
});
fake_stacks[0].data.push(fake_habits[fake_habits.length - 1]);

fake_habits.push({
  id: faker.database.mongodbObjectId(),
  name: "📘 Study for 30 minutes",
  description: "❌🎮 Stop the game, \n🧠 and feed your brain",
  category: "Positive",
  base_score: 1,
});
fake_stacks[0].data.push(fake_habits[fake_habits.length - 1]);

fake_habits.push({
  id: faker.database.mongodbObjectId(),
  name: "🥱 Sleep late",
  description: "🥱 Staying up till midnight",
  category: "Negative",
  base_score: 1,
});
fake_stacks[1].data.push(fake_habits[fake_habits.length - 1]);

fake_habits.push({
  id: faker.database.mongodbObjectId(),
  name: "🍕 Overeat",
  description: "🍕 Yummer, eating my own feeling",
  category: "Negative",
  base_score: 1,
});
fake_stacks[1].data.push(fake_habits[fake_habits.length - 1]);

fake_habits.push({
  id: faker.database.mongodbObjectId(),
  name: "🫣 Hey dopamine",
  description: "🫣 Hey, what's your doing?",
  category: "Negative",
  base_score: 1,
});
fake_stacks[1].data.push(fake_habits[fake_habits.length - 1]);

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
    new Promise((resolve, reject) => {
      let habits = [...getHabits.data];
      let indexH = habits.findIndex((x) => x.id == id);
      if (indexH > -1) {
        resolve(habits[indexH]);
      }
      reject(new Error("id not found!"));
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

  const removeHabitById = (id) =>
    new Promise((resolve, reject) => {
      let habits = [...getHabits.data];
      let stacks = [...getStacks.data];
      let indexH = habits.findIndex((x) => x.id == id);

      if (indexH == -1) {
        reject(new Error("id not found!"));
      }

      let item = habits[indexH];
      let indexC = stacks.findIndex((x) => x.name == item.category);

      if (indexC == -1) {
        reject(new Error("category not found!"));
      }

      let indexS = stacks[indexC]?.data?.findIndex((x) => x.id == id);

      if (indexS == -1) {
        reject(new Error("stack not found!"));
      }

      habits = [
        ...habits.slice(0, indexH),
        ...habits.slice(indexH + 1, habits.length),
      ];

      stacks = [
        ...stacks.slice(0, indexC),
        {
          ...stacks[indexC],
          data: [
            ...stacks[indexC].data.slice(0, indexS),
            ...stacks[indexC].data.slice(
              indexS + 1,
              stacks[indexC].data.length,
            ),
          ],
        },
        ...stacks.slice(indexC + 1, stacks.length),
      ];

      setHabits(habits);
      setStacks(stacks);
      resolve(id);
    });

  const updateHabitById = (item, id) =>
    new Promise((resolve, reject) => {
      let habits = [...getHabits.data];
      let stacks = [...getStacks.data];

      let indexH = habits.findIndex((x) => x.id == id);
      if (indexH == -1) {
        reject(new Error("id not found!"));
      }

      let indexC = stacks.findIndex((x) => x.name == item.category);
      if (indexC == -1) {
        reject(new Error("category not found!"));
      }

      let indexS = stacks[indexC]?.data?.findIndex((x) => x.id == id);
      if (indexS == -1) {
        reject(new Error("stack not found!"));
      }

      habits = [
        ...habits.slice(0, indexH),
        { ...habits[indexH], ...item },
        ...habits.slice(indexH + 1, habits.length),
      ];

      stacks = [
        ...stacks.slice(0, indexC),
        {
          ...stacks[indexC],
          data: [
            ...stacks[indexC].data.slice(0, indexS),
            { id: id, name: item.name },
            ...stacks[indexC].data.slice(
              indexS + 1,
              stacks[indexC].data.length,
            ),
          ],
        },
        ...stacks.slice(indexC + 1, stacks.length),
      ];

      setHabits(habits);
      setStacks(stacks);
      resolve(item);
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

      if (!item) {
        reject(new Error("index not found!"));
      }

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
    });

  return {
    getHabits,
    getHabitById,
    getStacks,
    addHabit,
    updateHabitById,
    removeHabitById,
    moveHabit,
  };
}
