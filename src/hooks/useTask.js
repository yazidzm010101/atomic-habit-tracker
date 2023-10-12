import { task_tracker } from "./useIDB";
import { useQuery } from "@tanstack/react-query";

export function useTask() {
  const query_group = ["task_group"];

  const getGroups = useQuery({
    queryKey: query_group,
    queryFn: () =>
      new Promise((resolve, reject) => {
        task_tracker.then((db) => {
          db.getAll("task_group")
            .then((data) => resolve(data))
            .catch((err) => reject(err));
        });
      }),
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  const getTaskById = (id) =>
    new Promise((resolve, reject) => {
      if (!id) {
        resolve({});
      }
      task_tracker
        .then((db) =>
          db
            .get("task_list", id)
            .then((data) => resolve(data))
            .catch((err) => reject(err)),
        )
        .catch((err) => reject(err));
    });

  const addGroup = (item) =>
    new Promise(async (resolve, reject) => {
      const db = await task_tracker;
      db.add("task_group", item)
        .then((success) => resolve(success))
        .catch((err) => reject(err));
      getGroups.refetch();
    });

  const addTask = (item) =>
    new Promise(async (resolve, reject) => {
      console.log(item);
      const db = await task_tracker;
      const task_id = await db.add("task_list", item);
      const group = await db.get("task_group", item.group_id);
      db.put("task_group", {
        ...group,
        tasks: [...group.tasks, { id: task_id, name: item.name }],
      })
        .then((success) => {
          resolve(success);
          getGroups.refetch();
        })
        .catch((err) => {
          reject(err);
        });
    });

  const updateTaskById = (item, id) =>
    new Promise(async (resolve, reject) => {
      const db = await task_tracker;
      const task = await db.get("task_list", id);
      const group = await db.get("task_group", task.group_id);
      const indexG = group.tasks.findIndex((x) => x.id == task.id);
      const new_task = { ...task, ...item };
      await db.put("task_list", new_task);
      await db.put("task_group", {
        ...group,
        tasks: [
          ...group.tasks.slice(0, indexG),
          { id: id, name: new_task.name, is_done: new_task.is_done },
          ...group.tasks.slice(indexG + 1, group.tasks.length),
        ],
      });
      getGroups.refetch();
      resolve();
    });

  const toggleDone = (id) =>
    new Promise(async (resolve, reject) => {
      const db = await task_tracker;
      const task = await db.get("task_list", id);
      const group = await db.get("task_group", task.group_id);
      const indexG = group.tasks.findIndex((x) => x.id == task.id);
      await db.put("task_list", { ...task, is_done: !task.is_done });
      await db.put("task_group", {
        ...group,
        tasks: [
          ...group.tasks.slice(0, indexG),
          { id: task.id, name: task.name, is_done: !task.is_done },
          ...group.tasks.slice(indexG + 1, group.tasks.length),
        ],
      });
      getGroups.refetch();
      resolve();
    });

  return {
    getGroups,
    getTaskById,
    addGroup,
    addTask,
    toggleDone,
    updateTaskById,
  };
}
