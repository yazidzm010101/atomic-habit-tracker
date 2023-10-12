import { habit_tracker } from "./useIDB";
import { useQuery } from "@tanstack/react-query";

export function useHabits() {
  const query = ["habits"];
  const queryStack = ["habits", "stacks"];

  const getHabits = useQuery({
    queryKey: query,
    queryFn: () =>
      new Promise((resolve, reject) => {
        habit_tracker
          .then((db) => {
            db.getAll("habit_list")
              .then((data) => resolve(data))
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      }),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const getStacks = useQuery({
    queryKey: queryStack,
    queryFn: () =>
      new Promise((resolve, reject) => {
        habit_tracker
          .then((db) => {
            db.getAll("habit_group")
              .then((data) =>
                resolve(data.sort((a, b) => (a.order > b.order ? 1 : -1))),
              )
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      }),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const getHabitById = (id) =>
    new Promise(async (resolve, reject) => {
      const db = await habit_tracker;
      db.get("habit_list", id)
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });

  const addHabit = (item) =>
    new Promise(async (resolve, reject) => {
      const db = await habit_tracker;
      const id = await db.add("habit_list", item);
      const group = await db.get("habit_group", item.category);
      await db.put("habit_group", {
        ...group,
        habits: [...group.habits, { id: id, name: item.name }],
      });

      getHabits.refetch();
      getStacks.refetch();
      resolve({ ...item, id });
    });

  const removeHabitById = (id) =>
    new Promise(async (resolve, reject) => {
      const db = await habit_tracker;
      const habit = await db.get("habit_list", id);
      const { habits: habitIDs, ...group } = await db.get(
        "habit_group",
        habit.category,
      );
      const index = (habitIDs || []).findIndex((x) => x.id == id);

      if (index > -1) {
        await db.put("habit_group", {
          ...group,
          habits: [
            ...habitIDs.slice(0, index),
            ...habitIDs.slice(index + 1, habitIDs.length),
          ],
        });
      }

      await db.delete("habit_list", id);

      getHabits.refetch();
      getStacks.refetch();
      resolve(habit);
    });

  const updateHabitById = (item, id) =>
    new Promise(async (resolve, reject) => {
      const db = await habit_tracker;
      const habit = await db.get("habit_list", id);
      const { habits: habitIDS, ...group } = await db.get(
        "habit_group",
        habit.category,
      );
      const index = (habitIDS || []).findIndex((x) => x.id == id);

      if (index > -1) {
        await db.put("habit_group", {
          ...group,
          habits: [
            ...habitIDS.slice(0, index),
            { id: id, name: item.name },
            ...habitIDS.slice(index + 1, habitIDS.length),
          ],
        });
      }

      await db.put("habit_list", habit);

      getHabits.refetch();
      getStacks.refetch();
      resolve(habit);
    });

  const moveHabit = (
    sourceCategory,
    sourceIndex,
    targetCategory,
    targetIndex,
  ) =>
    new Promise(async (resolve, reject) => {
      const db = await habit_tracker;

      const { habits: habits_source, ...group_source } = await db.get(
        "habit_group",
        sourceCategory,
      );

      const habit_group_source = habits_source[sourceIndex];
      if (!habit_group_source) {
        reject(new Error("habit not found!"));
      }

      const habit_source = await db.get("habit_list", habit_group_source.id);

      await db.put("habit_list", {
        ...habit_source,
        category: targetCategory,
      });
      await db.put("habit_group", {
        ...group_source,
        habits: [
          ...habits_source.slice(0, sourceIndex),
          ...habits_source.slice(sourceIndex + 1, habit_source.length),
        ],
      });

      const { habits: habits_target, ...group_target } = await db.get(
        "habit_group",
        targetCategory,
      );

      await db.put("habit_group", {
        ...group_target,
        habits: [
          ...habits_target.slice(0, targetIndex),
          { id: habit_source.id, name: habit_source.name },
          ...habits_target.slice(targetIndex, targetIndex.length),
        ],
      });

      getHabits.refetch();
      getStacks.refetch();
      resolve({
        ...habit_source,
        category: targetCategory,
      });
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
