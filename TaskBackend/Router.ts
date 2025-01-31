import { initTRPC } from "@trpc/server";
import { z } from "zod";
import Task from "./models/taskschema";
import Counter from "./models/Counter";

const t = initTRPC.create();

export const taskRouter = t.router({
  createTask: t.procedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log(input);
      const { title, description, category } = input;

      const TaskCount = await Task.countDocuments();

      let counter;
      if (TaskCount === 0) {
        counter = await Counter.findOneAndUpdate(
          { name: "TaskID" },
          { value: 1 },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      } else {
        counter = await Counter.findOneAndUpdate(
          { name: "TaskID" },
          { $inc: { value: 1 } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }

      if (!counter) {
        throw new Error("Failed to generate Task ID");
      }

      const newTask = new Task({
        id: counter.value,
        title,
        description,
        category,
      });

      await newTask.save();
      return { message: "Task created successfully!", data: newTask };
    }),

  getAllTasks: t.procedure.query(async () => {
    return await Task.find();
  }),

  getTaskByID: t.procedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    console.log("Received input in getTaskByID:", input); 
    const { id } = input;

    const task = await Task.findOne({ id });
    if (!task) {
      throw new Error("Task Not Found");
    }
    return { data: task };
  }),

  updateTask: t.procedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updatedTaskData } = input;

      const updatedTask = await Task.findOneAndUpdate({ id }, updatedTaskData, {
        new: true,
      });

      if (!updatedTask) {
        throw new Error("Task Not Found");
      }

      return { data: updatedTask };
    }),

  deleteTask: t.procedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;

      const task = await Task.findOneAndDelete({ id });
      if (!task) {
        throw new Error("Task Not Found");
      }

      return { message: "Task Deleted Successfully" };
    }),

  deleteAllTasks: t.procedure.mutation(async () => {
    await Task.deleteMany();
    return { message: "All Tasks Deleted Successfully" };
  }),
});
