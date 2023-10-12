import { openDB } from "idb";

export const task_tracker = openDB("task_tracker", 1, {
  async upgrade(db, oldVersion, newVersion, transaction) {
    db.createObjectStore("task_group", {
      keyPath: "id",
      autoIncrement: true,
    });

    db.createObjectStore("task_list", {
      keyPath: "id",
      autoIncrement: true,
    });

    const first_group = {
      name: "My first task group",
      description: "All of this task has to be done in a short time",
      tasks: [],
    };

    const group_id = await transaction
      .objectStore("task_group")
      .add(first_group);

    const first_task = {
      name: "My first task",
      description: "This task is really cool",
      group_id: group_id,
      is_done: false,
    };

    const task_id = await transaction.objectStore("task_list").add(first_task);

    await transaction.objectStore("task_group").put({
      ...first_group,
      id: group_id,
      tasks: [
        { id: task_id, name: first_task.name, is_done: first_task.is_done },
      ],
    });
  },
});

export const habit_tracker = openDB("habit_tracker", 1, {
  async upgrade(db, oldVersion, newVersion, transaction) {
    await db.createObjectStore("habit_list", {
      keyPath: "id",
      autoIncrement: true,
    });
    await db.createObjectStore("habit_group", {
      keyPath: "name",
    });

    // initiate first data
    await transaction.objectStore("habit_group").add({
      name: "Positive",
      order: 1,
      habits: [],
    });
    await transaction.objectStore("habit_group").add({
      name: "Negative",
      order: 2,
      habits: [],
    });

    // initiate first positive habits data
    await transaction.objectStore("habit_list").add({
      name: "🚶 Walk 1km",
      description: "❌📱 Turn off the screen, \n🏡 and enjoy the outdoor",
      category: "Positive",
      base_score: 1,
    });

    await transaction.objectStore("habit_list").add({
      name: "💪 Push up 10x",
      description: "❌🛋️ Leave the comfy sofa, \n💪 and build up your strength",
      category: "Positive",
      base_score: 1,
    });

    await transaction.objectStore("habit_list").add({
      name: "📘 Study for 30 minutes",
      description: "❌🎮 Stop the game, \n🧠 and feed your brain",
      category: "Positive",
      base_score: 1,
    });

    await transaction
      .objectStore("habit_list")
      .getAll()
      .then(async (data) => {
        data = data
          .filter((item) => item.category == "Positive")
          .map((item) => ({ id: item.id, name: item.name }));

        const group = await transaction
          .objectStore("habit_group")
          .get("Positive");

        await transaction.objectStore("habit_group").put({
          ...group,
          habits: data,
        });
      });

    // initiate negative
    await transaction.objectStore("habit_list").add({
      name: "🥱 Sleep late",
      description: "🥱 Staying up till midnight",
      category: "Negative",
      base_score: 1,
    });

    await transaction.objectStore("habit_list").add({
      name: "🍕 Overeat",
      description: "🍕 Yummer, eating my own feeling",
      category: "Negative",
      base_score: 1,
    });

    await transaction.objectStore("habit_list").add({
      name: "🫣 Hey dopamine",
      description: "🫣 Hey, what's your doing?",
      category: "Negative",
      base_score: 1,
    });

    await transaction
      .objectStore("habit_list")
      .getAll()
      .then(async (data) => {
        data = data
          .filter((item) => item.category == "Negative")
          .map((item) => ({ id: item.id, name: item.name }));

        const group = await transaction
          .objectStore("habit_group")
          .get("Negative");

        await transaction.objectStore("habit_group").put({
          ...group,
          habits: data,
        });
      });
  },
});
